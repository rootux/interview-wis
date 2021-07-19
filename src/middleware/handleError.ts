import {NextFunction, Response} from "express";
import Config from '../config/config'
import debug from "debug";

const logger = debug('wisdo:api');
export default function handleErrorMiddleware (err:any, req: any, res: Response, next: NextFunction) {
  const status = err.status || 500;

  if (Config.ENV === 'production') {
    return res.status(status).json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if(status === 500) {
    logger({err})
  }
  res.status(status).json({
    errors: {
      message: err.message,
      error: err,
      stack: err.stack
    },
  });
};
