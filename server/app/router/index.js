import Router from 'koa-router'

import home from './home'
import api from './api'
import { checkActive } from '../controllers/api'

const router = Router()

router.use('/home', home.routes(), home.allowedMethods())
// api需要添加路由保护
// router.use('/api', checkActive, api.routes(), api.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())


export default router
