const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../db.config')[env];
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log(`Loading models from ${__dirname}`);
fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file !== basename);
  })
  .forEach((file: any) => {
    console.log(`Loading model ${file}`);
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if(db[modelName].registerHooks) {
    db[modelName].registerHooks();
  }
});

console.log("DB Ready - Finished loading models");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
