const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ============================================================
    // BASIC PROFILE
    // ============================================================

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email',
      ],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },

    location: {
      type: String,
      trim: true,
      default: '',
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    website: {
      type: String,
      trim: true,
      default: '',
    },

    // ============================================================
    // SOCIAL LINKS
    // ============================================================

    socialLinks: {
      github: {
        type: String,
        default: '',
      },

      linkedin: {
        type: String,
        default: '',
      },

      twitter: {
        type: String,
        default: '',
      },
    },

    avatarUrl: {
      type: String,
      default: '',
    },

    // ============================================================
    // PORTFOLIO
    // ============================================================

    portfolioSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Portfolio Template
    |--------------------------------------------------------------------------
    |
    | Available:
    | minimalist
    | modern
    | creative
    | tech-dark
    | executive
    | neo-brutalist
    |
    */

    templatePreference: {
      type: String,

      enum: [
        'minimalist',
        'modern',
        'creative',
        'tech-dark',
        'executive',
        'neo-brutalist',
      ],

      default: 'modern',
    },

    /*
    |--------------------------------------------------------------------------
    | Portfolio Color Theme
    |--------------------------------------------------------------------------
    |
    | Available:
    | midnight
    | ocean
    | emerald
    | royal
    | rose
    | amber
    |
    */

    colorTheme: {
      type: String,

      enum: [
        'midnight',
        'ocean',
        'emerald',
        'royal',
        'rose',
        'amber',
      ],

      default: 'midnight',
    },

    // ============================================================
    // ACCOUNT
    // ============================================================

    lastLogin: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
