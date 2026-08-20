const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/projectController');

const router = express.Router();
router.use(protect);

const rules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('repoURL').optional({ checkFalsy: true }).isURL().withMessage('Repo URL must be valid'),
  body('liveURL').optional({ checkFalsy: true }).isURL().withMessage('Live URL must be valid')
];

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', rules, validate, ctrl.create);
router.put('/:id', rules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
