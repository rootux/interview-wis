import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

router.get('/', function(req: Request, res: Response) {
  res.send('Community');
});

export default router;
