require('dotenv').config();
export default {
  BACKEND_URL: 'http://localhost:3000/',
  DB_URL: process.env.DB_URL,
  DB_TEST_URL: process.env.DB_TEST_URL,
}
