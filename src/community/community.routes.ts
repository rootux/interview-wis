import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

const BASE_URL = '/community';

router.get(`${BASE_URL}/`, function(req: Request, res: Response) {
  res.send('Community');
});

export default router;
