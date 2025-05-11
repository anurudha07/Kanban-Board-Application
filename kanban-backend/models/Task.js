// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  dueDate:     { type: Date },
  assignee:    { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
