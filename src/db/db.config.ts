import { config } from 'dotenv';
config({ path: './.env' });

module.exports = {
  development: {
    dbUrl: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: {
      //TODO: This is a quick workaround around SSL in development - in production this should be set to true
    },
    logging: console.log // Set this to false to prevent SQL logs when debugging
  },
  test: {
    dbUrl: process.env.DB_TEST_URL,
    dialect: 'postgres',
    dialectOptions: {},
    logging: false
  },
  production: {}
};
