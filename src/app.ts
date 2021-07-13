import createError, {HttpError} from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRoute from './routes';
import userRoute from './user/user.routes';
import postRoute from './post/post.routes';
import communityRoute from './community/community.routes';
import authMiddleware from './user/auth/auth.middleware';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authMiddleware);

app.use('/', indexRoute);
app.use('/users', userRoute);
app.use('/community', communityRoute);
app.use('/community', postRoute); // Posts are mapped under communities


// catch 404 and forward to error handler
app.use(function( req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
