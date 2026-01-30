import connectDB from '@/lib/db';
import '@/lib/models';
import { Board, Column, JobApplication } from '@/lib/models';

const USER_ID = '69793e7d993cc8b796a25eb1';

const SAMPLE_JOBS = [
  {
    company: 'TechFlow',
    position: 'Frontend Engineer',
    location: 'Austin, TX',
    tags: ['Vue', 'Sass', 'Remote'],
    description: 'Разработка интерфейсов для высоконагруженных CRM-систем на Vue 3.',
    jobUrl: 'https://example.com/jobs/1',
    salary: '$110k - $140k',
  },
  {
    company: 'DataViz Solutions',
    position: 'Data Scientist',
    location: 'New York, NY',
    tags: ['Python', 'SQL', 'ML'],
    description: 'Анализ больших данных и построение прогнозных моделей для ритейла.',
    jobUrl: 'https://example.com/jobs/2',
    salary: '$130k - $170k',
  },
  {
    company: 'CloudSphere',
    position: 'DevOps Specialist',
    location: 'Seattle, WA',
    tags: ['AWS', 'Docker', 'Kubernetes'],
    description: 'Оптимизация облачной инфраструктуры и настройка CI/CD процессов.',
    jobUrl: 'https://example.com/jobs/3',
    salary: '$140k - $180k',
  },
  {
    company: 'GreenEnergy',
    position: 'Fullstack Developer',
    location: 'Berlin, Germany',
    tags: ['Node.js', 'React', 'Green Tech'],
    description: 'Создание платформы для мониторинга возобновляемых источников энергии.',
    jobUrl: 'https://example.com/jobs/4',
    salary: '€70k - €90k',
  },
  {
    company: 'CreativeMind',
    position: 'UI/UX Designer',
    location: 'London, UK',
    tags: ['Figma', 'Prototyping', 'Design System'],
    description: 'Проектирование интуитивно понятных интерфейсов для мобильных приложений.',
    jobUrl: 'https://example.com/jobs/5',
    salary: '£60k - £85k',
  },
  {
    company: 'SecureNet',
    position: 'Cybersecurity Analyst',
    location: 'Washington, D.C.',
    tags: ['Network Security', 'Pentesting', 'SIEM'],
    description: 'Защита корпоративной сети и проведение аудитов безопасности.',
    jobUrl: 'https://example.com/jobs/6',
    salary: '$115k - $155k',
  },
  {
    company: 'MobileGo',
    position: 'iOS Developer',
    location: 'Remote',
    tags: ['Swift', 'SwiftUI', 'Firebase'],
    description: 'Разработка и поддержка мобильного приложения для фитнес-трекинга.',
    jobUrl: 'https://example.com/jobs/7',
    salary: '$100k - $135k',
  },
  {
    company: 'FinTech Pro',
    position: 'Backend Engineer',
    location: 'Chicago, IL',
    tags: ['Java', 'Spring Boot', 'Microservices'],
    description: 'Разработка отказоустойчивых микросервисов для банковских транзакций.',
    jobUrl: 'https://example.com/jobs/8',
    salary: '$125k - $165k',
  },
  {
    company: 'GameWorks',
    position: 'Game Developer',
    location: 'Tokyo, Japan',
    tags: ['C++', 'Unreal Engine', 'Gaming'],
    description: 'Участие в разработке амбициозного экшена от третьего лица.',
    jobUrl: 'https://example.com/jobs/9',
    salary: '¥8M - ¥12M',
  },
  {
    company: 'AI Research Lab',
    position: 'ML Engineer',
    location: 'Toronto, ON',
    tags: ['PyTorch', 'NLP', 'PhD Preferred'],
    description: 'Исследование и внедрение алгоритмов обработки естественного языка.',
    jobUrl: 'https://example.com/jobs/10',
    salary: '$150k - $200k',
  },
  {
    company: 'E-Comm Solutions',
    position: 'Shopify Expert',
    location: 'Remote',
    tags: ['Liquid', 'JavaScript', 'E-commerce'],
    description: 'Кастомизация магазинов на Shopify и создание плагинов.',
    jobUrl: 'https://example.com/jobs/11',
    salary: '$80k - $110k',
  },
  {
    company: 'HealthTech',
    position: 'QA Engineer',
    location: 'Boston, MA',
    tags: ['Selenium', 'Jest', 'Automation'],
    description: 'Автоматизированное тестирование платформы для телемедицины.',
    jobUrl: 'https://example.com/jobs/12',
    salary: '$95k - $125k',
  },
];

async function seed() {
  if (!USER_ID) {
    console.error('❌ Error: SEED_USER_ID environment variable is required');
    console.log('Usage: SEED_USER_ID=your-user-id npm run seed');
    process.exit(1);
  }

  try {
    console.log('🌱 Starting seed process...');
    console.log(`📋 Seeding data for user ID: ${USER_ID}`);

    await connectDB();
    console.log('✅ Connected to database');

    // Find the user's board
    let board = await Board.findOne({ userId: USER_ID, name: 'Job Hunt' });

    if (!board) {
      console.log('⚠️  Board not found. Creating board...');
      const { initializeUserBoard } = await import('../lib/init-user-board');
      board = await initializeUserBoard(USER_ID);
      console.log('✅ Board created');
    } else {
      console.log('✅ Board found');
    }

    // Get all columns
    const columns = await Column.find({ boardId: board._id }).sort({
      order: 1,
    });
    console.log(`✅ Found ${columns.length} columns`);

    if (columns.length === 0) {
      console.error('❌ No columns found. Please ensure the board has default columns.');
      process.exit(1);
    }

    // Map column names to column IDs
    const columnMap: Record<string, string> = {};
    columns.forEach((col) => {
      columnMap[col.name] = col._id.toString();
    });

    // Clear existing job applications for this user
    const existingJobs = await JobApplication.find({ userId: USER_ID });
    if (existingJobs.length > 0) {
      console.log(`🗑️  Deleting ${existingJobs.length} existing job applications...`);
      await JobApplication.deleteMany({ userId: USER_ID });

      // Clear job applications from columns
      for (const column of columns) {
        column.jobApplications = [];
        await column.save();
      }
    }

    // Distribute jobs across columns
    const jobsByColumn: Record<string, typeof SAMPLE_JOBS> = {
      'Wish List': SAMPLE_JOBS.slice(0, 3),
      Applied: SAMPLE_JOBS.slice(3, 7),
      Interviewing: SAMPLE_JOBS.slice(7, 10),
      Offer: SAMPLE_JOBS.slice(10, 12),
      Rejected: SAMPLE_JOBS.slice(12, 15),
    };

    let totalCreated = 0;

    for (const [columnName, jobs] of Object.entries(jobsByColumn)) {
      const columnId = columnMap[columnName];
      if (!columnId) {
        console.warn(`⚠️  Column "${columnName}" not found, skipping...`);
        continue;
      }

      const column = columns.find((c) => c.name === columnName);
      if (!column) continue;

      for (let i = 0; i < jobs.length; i++) {
        const jobData = jobs[i];
        const jobApplication = await JobApplication.create({
          company: jobData.company,
          position: jobData.position,
          location: jobData.location,
          tags: jobData.tags,
          description: jobData.description,
          jobUrl: jobData.jobUrl,
          salary: jobData.salary,
          columnId: columnId,
          boardId: board._id,
          userId: USER_ID,
          status: columnName.toLowerCase().replace(' ', '-'),
          order: i,
        });

        column.jobApplications.push(jobApplication._id);
        totalCreated++;
      }

      await column.save();
      console.log(`✅ Added ${jobs.length} jobs to "${columnName}" column`);
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`📊 Created ${totalCreated} job applications`);
    console.log(`📋 Board: ${board.name}`);
    console.log(`👤 User ID: ${USER_ID}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

// 3 58
