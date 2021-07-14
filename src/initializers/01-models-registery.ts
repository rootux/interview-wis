import debug from "debug"
import path from "path"
import {Sequelize} from "sequelize";
const fs = require('fs')
const logger = debug('wisdo:api')

module.exports = (app:any) => {
  const models: any = {};
  const modelsDir = path.join(__dirname, '..','db','models')
  logger(`Loading models from ${modelsDir}`)
  fs.readdirSync(modelsDir)
    .filter((file:any) => {
      return file.includes('.model.')
    })
    .forEach((file: any) => {
      const model = require(path.join(modelsDir, file))(app.locals.db.sequelize, Sequelize)
      models[model.name] = model
    })

  logger(`Loaded ${Object.keys(models).length} models`)

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
    if (models[modelName].registerHooks) {
      models[modelName].registerHooks()
    }
  })

  app.locals.models = models;
  logger("DB Ready - Finished loading models")
}
