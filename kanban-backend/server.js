require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importing routes
const sectionRoutes = require('./routes/sectionRoutes');
const taskRoutes = require('./routes/taskRoutes');
const Section = require('./models/Section'); // 👈 Import Section model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// all incoming requests
app.use((req, res, next) => {
  console.log(`📣 ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/sections', sectionRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Auto-create default sections if none exist
async function createDefaultSections() {
  const count = await Section.countDocuments();
  if (count === 0) {
    console.log('🛠 No sections found. Seeding default sections...');
    await Section.insertMany([
      { title: 'To do' },
      { title: 'In Progress' },
      { title: 'Done' }
    ]);
    console.log('✅ Default sections created.');
  }
}

// Start server after DB connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('✅ MongoDB connected');
    await createDefaultSections(); // 👈 Ensure sections exist
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
