const db = require('./00-db')
const models = require('./01-models-registery')
const services = require('./02-services')
const middlewares = require('./03-middleware')
const validators = require('./04-validators')

// TODO: replace with node-require-directory
export default function(app:any) {
  db(app)
  models(app)
  services(app)
  middlewares(app)
  validators(app)
}
