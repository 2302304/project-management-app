import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Tyhjennä vanhat testidatat
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Luo testikäyttäjä
  const hashedPassword = await bcrypt.hash('salasana123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'testi@example.com',
      passwordHash: hashedPassword,
      firstName: 'Testi',
      lastName: 'Käyttäjä',
      timezone: 'Europe/Helsinki',
    },
  });

  console.log('✅ Created user:', user.email);

  // Luo toinen käyttäjä
  const user2 = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      passwordHash: await bcrypt.hash('demo123', 10),
      firstName: 'Demo',
      lastName: 'User',
      timezone: 'Europe/Helsinki',
    },
  });

  console.log('✅ Created user:', user2.email);

  // Luo esimerkkiprojekti
  const project1 = await prisma.project.create({
    data: {
      name: 'Projekti Management App',
      description: 'Full-stack projektin hallintasovellus',
      ownerId: user.id,
      status: 'active',
      color: '#3B82F6',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      members: {
        create: [
          {
            userId: user.id,
            role: 'owner',
          },
          {
            userId: user2.id,
            role: 'member',
          },
        ],
      },
    },
  });

  console.log('✅ Created project:', project1.name);

  // Luo toinen projekti
  const project2 = await prisma.project.create({
    data: {
      name: 'Verkkosivuston uudistus',
      description: 'Yrityksen nettisivujen modernisointiproject',
      ownerId: user.id,
      status: 'planning',
      color: '#10B981',
      members: {
        create: [
          {
            userId: user.id,
            role: 'owner',
          },
        ],
      },
    },
  });

  console.log('✅ Created project:', project2.name);

  // Luo tehtäviä ensimmäiseen projektiin
  const tasks = await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Suunnittele tietokantamalli',
        description: 'Luo Prisma schema ja määrittele taulut',
        status: 'done',
        priority: 'high',
        createdById: user.id,
        assignedToId: user.id,
        position: 0,
        estimatedHours: 4,
        completedAt: new Date('2024-01-15'),
      },
      {
        projectId: project1.id,
        title: 'Toteuta autentikointi',
        description: 'JWT-pohjainen kirjautuminen ja rekisteröinti',
        status: 'done',
        priority: 'urgent',
        createdById: user.id,
        assignedToId: user.id,
        position: 1,
        estimatedHours: 8,
        completedAt: new Date('2024-01-20'),
      },
      {
        projectId: project1.id,
        title: 'Rakenna Kanban-board',
        description: 'Drag & drop toiminnallisuus tehtäville',
        status: 'in_progress',
        priority: 'high',
        createdById: user.id,
        assignedToId: user.id,
        position: 2,
        estimatedHours: 12,
        dueDate: new Date('2024-02-15'),
      },
      {
        projectId: project1.id,
        title: 'Lisää tiimityö-ominaisuudet',
        description: 'Kommentit, notifikaatiot ja real-time päivitykset',
        status: 'todo',
        priority: 'medium',
        createdById: user.id,
        assignedToId: user2.id,
        position: 3,
        estimatedHours: 16,
        dueDate: new Date('2024-03-01'),
      },
      {
        projectId: project1.id,
        title: 'Optimoi suorituskyky',
        description: 'Caching, lazy loading ja bundle optimization',
        status: 'todo',
        priority: 'low',
        createdById: user.id,
        position: 4,
        estimatedHours: 6,
      },
      {
        projectId: project1.id,
        title: 'Kirjoita dokumentaatio',
        description: 'README, API docs ja käyttöohjeet',
        status: 'review',
        priority: 'medium',
        createdById: user.id,
        assignedToId: user.id,
        position: 5,
        estimatedHours: 4,
      },
    ],
  });

  console.log(`✅ Created ${tasks.count} tasks`);

  // Luo muutama tehtävä toiseen projektiin
  await prisma.task.createMany({
    data: [
      {
        projectId: project2.id,
        title: 'Suunnittele UI/UX',
        description: 'Wireframes ja prototyypit Figmassa',
        status: 'todo',
        priority: 'high',
        createdById: user.id,
        position: 0,
        estimatedHours: 8,
      },
      {
        projectId: project2.id,
        title: 'Valitse teknologia-stack',
        description: 'React, Vue vai Angular? TypeScript pakollinen.',
        status: 'todo',
        priority: 'urgent',
        createdById: user.id,
        position: 1,
        estimatedHours: 2,
      },
    ],
  });

  console.log('✅ Created tasks for project 2');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📧 Test users:');
  console.log('   Email: testi@example.com');
  console.log('   Password: salasana123');
  console.log('');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
