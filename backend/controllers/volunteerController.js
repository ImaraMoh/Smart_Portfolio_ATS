const Volunteer = require('../models/Volunteer');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Volunteer, 'Volunteer record');
