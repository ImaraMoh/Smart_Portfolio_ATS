const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '', maxlength: 1500 },
    technologies: [{ type: String, trim: true }],
    repoURL: { type: String, trim: true, default: '' },
    liveURL: { type: String, trim: true, default: '' },
    thumbnailURL: { type: String, trim: true, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
