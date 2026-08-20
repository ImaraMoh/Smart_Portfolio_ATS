const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobTitle: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    rawText: { type: String, required: true, trim: true, maxlength: 20000 },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
