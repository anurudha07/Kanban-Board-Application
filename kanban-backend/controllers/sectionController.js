const mongoose = require('mongoose');
const Section = require('../models/Section');
const Task    = require('../models/Task');    // ensure Task is registered

async function getSections(req, res) {
  try {
    const secs = await Section
      .find()
      .populate({ path: 'taskIds', select: '_id name description dueDate assignee' })
      .exec();
    return res.json(secs);
  } catch (err) {
    console.error('Error in getSections:', err.message);
    return res.status(500).json({ message: 'Failed to fetch sections', error: err.message });
  }
}

async function createSection(req, res) {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const sec = new Section({ title, taskIds: [] });
    const saved = await sec.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error in createSection:', err.message);
    return res.status(500).json({ message: 'Failed to create section', error: err.message });
  }
}

async function updateSection(req, res) {
  try {
    const { id } = req.params;
    const { title, taskIds } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    const sec = await Section.findById(id);
    if (!sec) return res.status(404).json({ message: 'Section not found' });
    if (title) sec.title = title;
    if (Array.isArray(taskIds)) sec.taskIds = taskIds;
    const updated = await sec.save();
    return res.json(updated);
  } catch (err) {
    console.error('Error in updateSection:', err.message);
    return res.status(500).json({ message: 'Failed to update section', error: err.message });
  }
}

async function deleteSection(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    const del = await Section.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'Section not found' });
    return res.json({ message: 'Section deleted' });
  } catch (err) {
    console.error('Error in deleteSection:', err.message);
    return res.status(500).json({ message: 'Failed to delete section', error: err.message });
  }
}

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection
};
