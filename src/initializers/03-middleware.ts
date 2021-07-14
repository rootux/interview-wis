import logger from "morgan"
import express from "express"
import cookieParser from "cookie-parser"
import path from "path"
import auth from "../middleware/auth.middleware"
import handle404 from "../middleware/handle404.middleware";
import handleError from "../middleware/handleError";
import indexRoutes from "../routes/index.routes"
import userRoutes from "../user/user.routes"
import communityRoutes from "../community/community.routes"
import postRoutes from "../post/post.routes"
const requireDirectory = require('require-directory')

module.exports = (app:any) => {
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(auth)

  app.use(indexRoutes)
  app.use(userRoutes)
  app.use(communityRoutes)
  app.use(postRoutes)

  app.use(handle404)
  app.use(handleError)
}
