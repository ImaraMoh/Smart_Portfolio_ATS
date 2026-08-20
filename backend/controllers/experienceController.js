const Experience = require('../models/Experience');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Experience, 'Experience record');
