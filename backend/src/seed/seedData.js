// Run with: npm run seed        (adds sample data)
//           npm run seed:destroy (wipes courses + users)
import 'dotenv/config';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

const courses = [
  {
    title: 'Game Development: Programming with Java Plus',
    description: 'Build 2D games from scratch while learning core Java programming concepts, object-oriented design, and simple physics.',
    category: 'Programming',
    level: 'Beginner',
    price: 49,
    duration: '6 weeks',
    instructor: { name: 'Dr. Adam Smith', title: 'Senior Instructor, Stanford University' },
    thumbnailColor: 'c1',
    rating: 4.9,
    numReviews: 120,
    studentsCount: 23450,
    curriculum: [
      { title: 'Getting Started with Java', lessons: [
        { title: 'Introduction & setup', duration: '12 min' },
        { title: 'Variables & data types', duration: '18 min' },
      ]},
      { title: 'Object-Oriented Design', lessons: [
        { title: 'Classes & objects', duration: '20 min' },
        { title: 'Inheritance', duration: '16 min' },
      ]},
      { title: 'Building Your First Game', lessons: [
        { title: 'Game loop fundamentals', duration: '25 min', locked: true },
      ]},
    ],
  },
  {
    title: 'Medical Basics 101: Anatomy of Human Body',
    description: 'A visual introduction to human anatomy for beginners, covering all major systems.',
    category: 'Health',
    level: 'Beginner',
    price: 39,
    instructor: { name: 'Prof. Elena Cruz', title: 'Duke University' },
    thumbnailColor: 'c2',
    rating: 4.8,
    studentsCount: 18220,
  },
  {
    title: 'Supervised Machine Learning: Regression & Classification',
    description: 'Hands-on ML fundamentals using real-world datasets — from linear regression to classification models.',
    category: 'Data & AI',
    level: 'Intermediate',
    price: 59,
    instructor: { name: 'Meta AI Team', title: 'Meta' },
    thumbnailColor: 'c3',
    rating: 4.9,
    studentsCount: 30900,
  },
  {
    title: 'Product Design & Analysis: Idea to Prototype',
    description: 'Learn design thinking, wireframing, and prototyping for real products.',
    category: 'Design',
    level: 'Beginner',
    price: 45,
    instructor: { name: 'IBM Design Team', title: 'IBM' },
    thumbnailColor: 'c4',
    rating: 4.7,
    studentsCount: 12340,
  },
  {
    title: 'Psychology & Consultation: Solving Anxiety Problems',
    description: 'Practical frameworks for everyday mental wellbeing and client consultation.',
    category: 'Health',
    level: 'Intermediate',
    price: 42,
    instructor: { name: 'Dr. Noah Bennett', title: 'UPenn' },
    thumbnailColor: 'c5',
    rating: 4.6,
    studentsCount: 9870,
  },
  {
    title: 'Business Communication: Dealing with Clients',
    description: 'Sharpen your client-facing communication skills for any industry.',
    category: 'Business',
    level: 'Beginner',
    price: 35,
    instructor: { name: 'Dr. Adam Smith', title: 'Stanford University' },
    thumbnailColor: 'c6',
    rating: 4.7,
    studentsCount: 15600,
  },
];

const importData = async () => {
  await connectDB();
  try {
    await Course.deleteMany();

    let admin = await User.findOne({ email: 'admin@skillnest.com' });
    if (!admin) {
      admin = await User.create({
        name: 'saharsh',
        email: 'admin@skillnest.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin created -> admin@skillnest.com / admin123');
    }

    const withOwner = courses.map((c) => ({ ...c, createdBy: admin._id }));
    await Course.insertMany(withOwner);

    console.log('Sample courses imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Course.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
