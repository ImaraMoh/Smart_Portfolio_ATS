const Education = require('../models/Education');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Education, 'Education record');
