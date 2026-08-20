const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillName: { type: String, required: true, trim: true },
    category: { type: String, enum: ['technical', 'soft', 'tool', 'language'], default: 'technical' },
    proficiencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

skillSchema.index({ userId: 1, skillName: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
