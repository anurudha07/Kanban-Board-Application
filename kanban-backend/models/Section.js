const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true
    },
    taskIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: []
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Section', SectionSchema);
