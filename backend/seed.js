const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.inventory.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.item.deleteMany();
  await prisma.case.deleteMany();

  console.log('Seeding database with professional grade cases...');

  // 1. Starter Case (Budget - 10 UC)
  await prisma.case.create({
    data: {
      name: 'Starter Case',
      priceUC: 10,
      image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=800&q=80',
      type: 'common',
      items: {
        create: [
          { name: 'Soldier Cap', image: 'https://images.unsplash.com/photo-1521316730702-829ad3888f54?w=200&q=80', type: 'common', chance: 75.0, sellPriceUC: 2 },
          { name: 'Canvas Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', type: 'rare', chance: 20.0, sellPriceUC: 8 },
          { name: 'Combat Gloves', image: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=200&q=80', type: 'epic', chance: 4.8, sellPriceUC: 45 },
          { name: 'Silver Pan', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80', type: 'legendary', chance: 0.2, sellPriceUC: 150 },
        ]
      }
    }
  });

  // 2. Classic Crate (Medium - 60 UC)
  await prisma.case.create({
    data: {
      name: 'Classic Crate',
      priceUC: 60,
      image: 'https://images.unsplash.com/photo-1589241062272-c0a1f43601ce?w=800&q=80',
      type: 'rare',
      items: {
        create: [
          { name: 'Camouflage Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80', type: 'rare', chance: 60.0, sellPriceUC: 15 },
          { name: 'Red Dot Sight Skin', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=200&q=80', type: 'epic', chance: 30.0, sellPriceUC: 80 },
          { name: 'Kar98k Wood Skin', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80', type: 'legendary', chance: 9.0, sellPriceUC: 250 },
          { name: 'Golden Mask', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=200&q=80', type: 'mythic', chance: 1.0, sellPriceUC: 1200 },
        ]
      }
    }
  });

  // 3. Tactical Gear (High - 180 UC)
  await prisma.case.create({
    data: {
      name: 'Tactical Gear',
      priceUC: 180,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      type: 'epic',
      items: {
        create: [
          { name: 'Level 3 Helmet Skin', image: 'https://images.unsplash.com/photo-1589241062272-c0a1f43601ce?w=200&q=80', type: 'epic', chance: 70.0, sellPriceUC: 50 },
          { name: 'Ghillie Suit (Forest)', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=200&q=80', type: 'legendary', chance: 25.0, sellPriceUC: 450 },
          { name: 'Dragon M416', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80', type: 'mythic', chance: 5.0, sellPriceUC: 3500 },
        ]
      }
    }
  });

  // 4. Mythic Forge (Premium - 540 UC)
  await prisma.case.create({
    data: {
      name: 'Mythic Forge',
      priceUC: 540,
      image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80',
      type: 'mythic',
      items: {
        create: [
          { name: 'Mythic Emote Pack', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&q=80', type: 'mythic', chance: 80.0, sellPriceUC: 200 },
          { name: 'Inferno X-Suit', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=200&q=80', type: 'mythic', chance: 15.0, sellPriceUC: 6000 },
          { name: 'Glacier M416 (Max)', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80', type: 'mythic', chance: 5.0, sellPriceUC: 15000 },
        ]
      }
    }
  });

  // 5. Elite Soldier (Extreme - 1080 UC)
  await prisma.case.create({
    data: {
      name: 'Elite Soldier',
      priceUC: 1080,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      type: 'mythic',
      items: {
        create: [
          { name: 'Gold Trim Armor', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=200&q=80', type: 'legendary', chance: 50.0, sellPriceUC: 400 },
          { name: 'Blood Raven X-Suit', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&q=80', type: 'mythic', chance: 45.0, sellPriceUC: 12000 },
          { name: 'Superstar Pan (Diamond)', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&q=80', type: 'mythic', chance: 5.0, sellPriceUC: 25000 },
        ]
      }
    }
  });

  console.log('Database seeded successfully with more variety!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
