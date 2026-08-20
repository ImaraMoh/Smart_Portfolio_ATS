const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/skillController');

const router = express.Router();
router.use(protect);

const rules = [
  body('skillName').trim().notEmpty().withMessage('Skill name is required'),
  body('category').optional().isIn(['technical', 'soft', 'tool', 'language']),
  body('proficiencyLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert'])
];

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', rules, validate, ctrl.create);
router.put('/:id', rules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
