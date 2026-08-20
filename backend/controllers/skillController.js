const Skill = require('../models/Skill');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Skill, 'Skill');
