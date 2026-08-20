const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/volunteerController');

const router = express.Router();
router.use(protect);

const rules = [
  body('organization').trim().notEmpty().withMessage('Organization is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
];

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', rules, validate, ctrl.create);
router.put('/:id', rules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
