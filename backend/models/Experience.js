const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, trim: true, default: '' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
      default: 'full-time'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null = currently working here
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true, default: '', maxlength: 1500 },
    technologies: [{ type: String, trim: true }],
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
