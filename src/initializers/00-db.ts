import path from "path";

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
import debug from 'debug';

module.exports = (app:any) => {
  const config = require(path.join(__dirname,'..','db','db.config'))[env];
  const logger = debug('wisdo:api');

  let sequelize: any;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.dbUrl, config);
  }

  logger('Initialized database')
  app.locals.db = {}
  app.locals.db.sequelize = sequelize;
  app.locals.db.Sequelize = Sequelize;
};
