import Router from 'koa-router'

import {
  getDepartments,
  getDepartmentEmployees,
  getPositions,
  getPositionEmployees,
  getExtraWorks,
  getAbsences,
  getSalary,
  getMonthlySalary,
  deleOrModInfo,
  addInfo
} from '../controllers/api'


const router = Router()

router.get('/department', getDepartments)
router.post('/department/employees', getDepartmentEmployees)
router.get('/position', getPositions)
router.post('/position/employees', getPositionEmployees)
router.post('/extrawork', getExtraWorks)
router.post('/absence', getAbsences)
router.post('/salary/year', getSalary)
router.post('/salary/month', getMonthlySalary)
router.post('/infs', deleOrModInfo)
router.post('/create', addInfo)

export default router