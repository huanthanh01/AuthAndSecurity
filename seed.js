require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Event = require('./models/eventModel');
const Registration = require('./models/registrationModel');
const database = require('./config/database');

const seedDB = async () => {
  await database();

  await User.deleteMany({});
  await Event.deleteMany({});
  await Registration.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  await User.create([
    { username: 'admin', password: adminPassword, role: 'admin' },
    { username: 'student1', password: studentPassword, role: 'student' },
    { username: 'student2', password: studentPassword, role: 'student' }
  ]);

  await Event.create([
    { name: 'FPT Code War 2026', capacity: 2 },
    { name: 'Tech Talk: AI in Future', capacity: 50 },
    { name: 'F-Camp 2026', capacity: 100 }
  ]);

  console.log('Database seeded successfully!');
  mongoose.connection.close();
};

seedDB().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
