import Router from 'koa-router'

import { checkLogin, logout } from '../controllers/home'


const router = Router()

router.post('/login', checkLogin)
router.post('/logout', logout)


export default router