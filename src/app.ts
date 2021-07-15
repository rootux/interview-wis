import express from 'express';
require('express-async-errors');
import initializers from './initializers'

const app = express();
initializers(app)

export default app;
