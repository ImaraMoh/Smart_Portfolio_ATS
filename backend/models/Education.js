const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true, default: '' },
    startYear: { type: Number, required: true },
    endYear: { type: Number }, // null/undefined = currently studying
    grade: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '', maxlength: 800 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
