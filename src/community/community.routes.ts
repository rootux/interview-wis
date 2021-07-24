import CommunityController from "./community.controller"
import express from "express"
const router = express.Router()

const BASE_URL = '/communities'

router.get(`${BASE_URL}/`, CommunityController.list)
router.post(`${BASE_URL}/:communityId/join`, CommunityController.join)

export default router
