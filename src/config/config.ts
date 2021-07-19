require('dotenv').config();
export default {
  ENV: process.env.NODE_ENV || 'development',
  BACKEND_URL: 'http://localhost:3000/',
  DB_URL: process.env.DB_URL,
  DB_TEST_URL: process.env.DB_TEST_URL,
  DEFAULT_FEED_ITEMS: 50,
  TRIGGER_TITLE: 'Post Trigger',
  TRIGGER_BODY: 'Post triggered a watchlist'
}
