const Project = require('../models/Project');
const crudFactory = require('./crudFactory');

module.exports = crudFactory(Project, 'Project');
