const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/educationController');

const router = express.Router();
router.use(protect);

const rules = [
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('startYear').isInt({ min: 1950, max: 2100 }).withMessage('Valid start year is required'),
  body('endYear').optional({ nullable: true }).isInt({ min: 1950, max: 2100 })
];

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', rules, validate, ctrl.create);
router.put('/:id', rules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
