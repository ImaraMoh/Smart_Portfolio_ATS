const asyncHandler = require('express-async-handler');
const { syncUserOutputs } = require('../services/syncService');

/**
 * crudFactory
 * -----------
 * Generates standard, ownership-scoped CRUD handlers for the simple
 * per-user career data collections (Education, Experience, Skill, Project,
 * Volunteer). Every operation is scoped to req.user.id so a user can only
 * ever read/write their own records. Every mutation triggers syncUserOutputs
 * so the portfolio + resume stay in sync automatically.
 */
const crudFactory = (Model, resourceName) => ({
  list: asyncHandler(async (req, res) => {
    const items = await Model.find({ userId: req.user.id }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: items.length, data: items });
  }),

  getOne: asyncHandler(async (req, res) => {
    const item = await Model.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    res.json({ success: true, data: item });
  }),

  create: asyncHandler(async (req, res) => {
    const item = await Model.create({ ...req.body, userId: req.user.id });
    await syncUserOutputs(req.user.id);
    res.status(201).json({ success: true, message: `${resourceName} created`, data: item });
  }),

  update: asyncHandler(async (req, res) => {
    const item = await Model.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    await syncUserOutputs(req.user.id);
    res.json({ success: true, message: `${resourceName} updated`, data: item });
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await Model.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) {
      res.status(404);
      throw new Error(`${resourceName} not found`);
    }
    await syncUserOutputs(req.user.id);
    res.json({ success: true, message: `${resourceName} deleted` });
  })
});

module.exports = crudFactory;
