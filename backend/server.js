require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const bcrypt = require('bcryptjs');

// --- AUTH ROUTES ---

// 1. Email Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email band qilingan' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        balanceUC: 100 // Welcome bonus
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Ro\'yxatdan o\'tishda xatolik' });
  }
});

// 2. Email Login
app.post('/api/auth/login-email', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(400).json({ error: 'Email yoki parol xato' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email yoki parol xato' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Kirishda xatolik' });
  }
});

// 3. Social Login (Google/Telegram)
app.post('/api/auth/login', async (req, res) => {
  const { provider, accountId, name, avatar } = req.body;
  
  try {
    let user = await prisma.user.findFirst({
      where: provider === 'telegram' ? { telegramId: accountId } : { googleId: accountId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: provider === 'telegram' ? accountId : null,
          googleId: provider === 'google' ? accountId : null,
          email: accountId.includes('@') ? accountId : null,
          name: name || 'Player',
          avatar: avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
          balanceUC: 1000,
          role: (name?.toLowerCase().includes('myyotube') || accountId.includes('myyotube')) ? 'admin' : 'user'
        }
      });
    } else {
      // Force admin role if name or email matches
      if (user.name?.toLowerCase().includes('myyotube') || user.email?.includes('myyotubemu')) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'admin' }
        });
      }
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Auth failed' });
  }
});

// --- MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- USER ROUTES ---
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { inventory: { include: { item: true } } }
  });
  res.json(user);
});

// --- CASE ROUTES ---
app.get('/api/cases', async (req, res) => {
  const cases = await prisma.case.findMany({
    include: { items: true }
  });
  res.json(cases);
});

app.post('/api/cases/open/:id', authMiddleware, async (req, res) => {
  const caseId = req.params.id;
  
  try {
    // 1. Get user and case
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const targetCase = await prisma.case.findUnique({ 
      where: { id: caseId },
      include: { items: true } 
    });

    if (!targetCase) return res.status(404).json({ error: 'Case not found' });
    if (user.balanceUC < targetCase.priceUC) return res.status(400).json({ error: 'Not enough UC' });

    // 2. Logic to pick random item based on chance (Simplified)
    const items = targetCase.items;
    if(items.length === 0) return res.status(400).json({ error: 'Case is empty' });
    
    // Simplest random choice (ignores weighted chance for now to keep it simple, will improve later)
    const wonItem = items[Math.floor(Math.random() * items.length)];

    // 3. Update Balance & Add to Inventory (Transaction)
    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: { balanceUC: { decrement: targetCase.priceUC } }
      }),
      prisma.inventory.create({
        data: {
          userId: req.userId,
          itemId: wonItem.id
        }
      })
    ]);

    const inventoryId = result[1].id;
    res.json({ wonItem, newBalance: result[0].balanceUC, inventoryId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- INVENTORY ROUTES ---
app.post('/api/inventory/sell/:id', authMiddleware, async (req, res) => {
  try {
    const invId = req.params.id;
    
    // Find inventory item
    const inventory = await prisma.inventory.findUnique({
      where: { id: invId },
      include: { item: true }
    });

    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    if (inventory.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    const sellPrice = inventory.item.sellPriceUC;

    // Transaction: delete inventory item and add UC to user balance
    const result = await prisma.$transaction([
      prisma.inventory.delete({ where: { id: invId } }),
      prisma.user.update({
        where: { id: req.userId },
        data: { balanceUC: { increment: sellPrice } }
      })
    ]);

    res.json({ success: true, newBalance: result[1].balanceUC, soldFor: sellPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during sell' });
  }
});

// --- ADMIN MIDDLEWARE ---
const adminMiddleware = async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Faqat adminlar uchun' });
  next();
};

// --- NEWS ROUTES ---
app.get('/api/news', async (req, res) => {
  const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(news);
});

app.post('/api/admin/news', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, content, image } = req.body;
  const news = await prisma.news.create({ data: { title, content, image } });
  res.json(news);
});

// --- PROMOCODE ROUTES ---
app.post('/api/promocode/activate', authMiddleware, async (req, res) => {
  const { code } = req.body;
  try {
    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (!promo) return res.status(400).json({ error: 'Promokod xato' });
    if (promo.usedCount >= promo.maxUses) return res.status(400).json({ error: 'Promokod muddati tugagan' });

    // Update user balance and promo used count
    await prisma.$transaction([
      prisma.user.update({ where: { id: req.userId }, data: { balanceUC: { increment: promo.rewardUC } } }),
      prisma.promoCode.update({ where: { id: promo.id }, data: { usedCount: { increment: 1 } } })
    ]);

    res.json({ success: true, reward: promo.rewardUC });
  } catch (error) {
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.get('/api/admin/promocodes', authMiddleware, adminMiddleware, async (req, res) => {
  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(promos);
});

app.post('/api/admin/promocode', authMiddleware, adminMiddleware, async (req, res) => {
  const { code, rewardUC, maxUses } = req.body;
  try {
    const promo = await prisma.promoCode.create({ 
      data: { 
        code, 
        rewardUC: parseInt(rewardUC), 
        maxUses: parseInt(maxUses) 
      } 
    });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ error: 'Bu kod allaqachon mavjud yoki xatolik' });
  }
});

// --- SETTINGS ROUTES ---
app.get('/api/settings', async (req, res) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.settings.create({
      data: { telegramLink: 'https://t.me/Dimer_pubg' }
    });
  }
  res.json(settings);
});

app.post('/api/admin/settings', authMiddleware, adminMiddleware, async (req, res) => {
  const { telegramLink } = req.body;
  const settings = await prisma.settings.upsert({
    where: { id: 'global' },
    update: { telegramLink },
    create: { id: 'global', telegramLink }
  });
  res.json(settings);
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
