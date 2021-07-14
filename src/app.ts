import express from 'express';
import initializers from './initializers'

const app = express();
initializers(app)

export default app;
