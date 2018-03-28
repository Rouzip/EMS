import Router from 'koa-router'

import {
  getDepartments,
  getDepartmentEmployees,
  getPositions,
  getPositionEmployees,
  getEmpExtraWorks,
  getEmpAbsences,
  getSalary,
  getExtraWorks,
  getAbsences,
  getMonthlySalary,
  deleOrModInfo,
  addInfo
} from '../controllers/api'


const router = Router()

router.get('/department', getDepartments)
router.post('/department/employees', getDepartmentEmployees)
router.get('/position', getPositions)
router.post('/position/employees', getPositionEmployees)
router.post('/extrawork', getEmpExtraWorks)
router.get('/allextraworks', getExtraWorks)
router.post('/absence', getEmpAbsences)
router.get('/absences', getAbsences)
router.post('/salary/year', getSalary)
router.post('/salary/month', getMonthlySalary)
router.post('/infs', deleOrModInfo)
router.post('/create', addInfo)

export default router