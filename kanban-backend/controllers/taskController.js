const Task = require('../models/Task');
const Section = require('../models/Section');

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { name, description, dueDate, assignee, sectionId } = req.body;
    if (!name || !sectionId) {
      return res.status(400).json({ message: 'Name and sectionId are required' });
    }

    const task = new Task({ name, description, dueDate, assignee });
    const savedTask = await task.save();

    // add to section
    const section = await Section.findById(sectionId);
    if (section) {
      section.taskIds.push(savedTask._id);
      await section.save();
    }

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err });
  }
};

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updates = (({ name, description, dueDate, assignee }) => ({ name, description, dueDate, assignee }))(req.body);
    Object.assign(task, updates);
    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // remove from sections
    await Section.updateMany({ taskIds: task._id }, { $pull: { taskIds: task._id } });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err });
  }
};
