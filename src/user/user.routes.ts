import express from 'express'
import {body, query} from 'express-validator'
import countries from './user.countries.enum'
import validator from "../routes/validator.middleware"
import UserController from "./user.controller"

const router = express.Router()

const BASE_URL = '/users'

router.get(`${BASE_URL}/`, UserController.find)
router.post(`${BASE_URL}/`,
  body('name').isLength({min: 2}),
  body('email').isEmail().normalizeEmail(),
  body('image').isURL(),
  body('country').isIn(countries),
  validator,
  UserController.create
)

router.get(`${BASE_URL}/feed`,
  [query('limit').isInt({min:0, max:1000}),
  query('page').isInt({min:0, max:100000}),
  validator],
  UserController.getFeed
  )

export default router
