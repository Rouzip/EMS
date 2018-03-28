import { uid } from './home'
import db from '../model'

/***
 * @param uid
 * @result bool
 * 检查是否具有正确的cookie
 */
export async function checkActive(ctx, next) {
  try {
    let userUid = ctx.cookies.get('uid')

    // 判断请求中是否带有uid
    if (userUid == null) {
      ctx.throw(406, 'no uid')
    }

    // 判断带有的uid是否正确
    if (userUid === uid) {
      await next()
    } else {
      ctx.throw(406, 'error uid')
    }
  } catch (err) {
    throw err
  }
}


/***
 * 获取全部的部门信息
 */
export async function getDepartments(ctx) {
  try {
    let Department = db.Department
    let departments = await Department.findAll()
    let response = {
      departments: departments
    }
    ctx.response.body = response
  } catch (err) {
    ctx.response.body = {}
    ctx.throw(404)
  }
}


/***
 * @param {departmentId: int}
 * 获取该部门下所有的成员
 * 若无该姓名返回{}，否则返回成员{json}
 */
export async function getDepartmentEmployees(ctx) {
  try {
    // 查询某部门下所有成员
    let departmentId = ctx.request.body.departmentId
    let Department = db.Department
    let department = await Department.findOne({
      where: {
        id: departmentId
      }
    })

    let employees = await department.getEmployees()
    let response = {
      employees,
      department
    }
    ctx.response.body = employees
  } catch (err) {
    console.log(err)
    ctx.response.body = {}
  }
}


/***
 * 获取全部工种
 */
export async function getPositions(ctx) {
  try {
    let Position = db.Position
    ctx.response.body = {
      "positions": await Position.findAll()
    }
  } catch (err) {
    ctx.throw(404)
  }
}


/***
 * @param {positionId: int}
 * 获取该工种下所有的成员
 * 若无该姓名返回{}，否则返回成员{json}
 */
export async function getPositionEmployees(ctx) {
  try {
    // 查询某部门下所有成员
    let positionId = ctx.request.body.positionId
    let Position = db.Position
    let position = await Position.findOne({
      where: {
        id: positionId
      }
    })
    let employees = await position.getEmployees()
    let response = {
      employees,
      position,
    }
    ctx.response.body = response
  } catch (err) {
    console.log(err)
    ctx.response.body = {}
  }
}


/***
 * @param {employeeId:uuid}
 * @result {json}
 * 查找该员工的加班信息
 */
export async function getExtraWorks(ctx) {
  try {
    let employeeId = ctx.request.body.employeeId
    let Employee = db.Employee
    let ExtraWork = db.ExtraWork
    let employee = await Employee.findOne({
      where: { id: employeeId }
    })
    let extraWorks = await employee.getExtraWorks()
    ctx.response.body = {
      extraWorks,
      employee,
    }
  } catch (err) {
    ctx.response.body = {}
  }
}


/***
 * @param {employeeId:uuid}
 * @result [json]
 * 查找该员工的出勤信息
 */
export async function getAbsences(ctx) {
  try {
    let employeeId = ctx.request.body.employeeId
    let Employee = db.Employee
    let employee = await Employee.findOne({
      where: { id: employeeId }
    })
    let absences = await employee.getAbsences()
    ctx.response.body = {
      employee,
      absences,
    }
  } catch (err) {
    ctx.response.body = {}
  }
}

/***
 * @param employeeId: uuid, month: int
 * @result {Salary: int, extraWork: [], absence: []}
 * 计算该月的所得工资
 */
async function getMonthSalary(uuid, year, month) {
  try {
    let Employee = db.Employee
    // 找到对应的员工
    let employee = await Employee.findOne({ where: { id: uuid } })
    // 该月对应工资
    let Salary = 0
    // 所有缺勤记录
    let absences = await employee.getAbsences({
      where: {
        year: year,
        month: month,
      }
    })
    // 计算缺勤工资
    // 每次缺勤扣去50工资
    absences.forEach(absence => Salary -= 50)
    // 所有加班记录
    let extraWorks = await employee.getExtraWorks({
      where: {
        year: year,
        month: month,
      }
    })
    console.log(extraWorks)
    // 计算加班工资
    extraWorks.forEach(extraWork => Salary += extraWork.salary)
    let position = await db.Position.findOne({
      where: {
        id: employee.positionId
      }
    })
    // 计算部门津贴
    let department = await db.Department.findOne({
      where: {
        id: employee.departmentId
      }
    })
    // 工资最后加入基本工资和部门津贴
    Salary = Salary + position.salary + department.salary

    let response = {
      "salary": Salary,
      "extraWorks": extraWorks,
      "absences": absences,
    }
    return response
  } catch (err) {
    console.log(err)
    ctx.response.body = {}
  }
}

/***
 * @param {employeeId: uuid, year: int, month: int}
 * @result {}
 * 获取该月的工资
 */
export async function getMonthlySalary(ctx) {
  try {
    let employeeId = ctx.request.body.employeeId
    let year = ctx.request.body.year
    let month = ctx.request.body.month
    ctx.response.body = await getMonthSalary(employeeId, year, month)
  } catch (err) {
    console.log(err)
    ctx.response.body = {}
  }
}

/***
 * @param {employeeId: uuid, year: int}
 * @result {json}
 * 获取全年薪资总结
 */
export async function getSalary(ctx) {
  try {
    let employeeId = ctx.request.body.employeeId
    let year = ctx.request.body.year
    let Employee = db.Employee
    // 找到对应的员工
    let employee = await Employee.findOne({
      where: {
        id: employeeId
      }
    })
    let response = {}
    for (let i = 1; i <= 12; i++) {
      response[i] = await getMonthSalary(employeeId, year, i)
    }
    ctx.response.body = response
  } catch (err) {
    console.log(err)
    ctx.response.body = {}
  }
}

/***
 * @param  
 * { action: ["modify" or "delete"], model: "", id: [uuid or int] } 
 * modify特有 { now: {} }
 * @result {}
 * 修改或者删除信息
 */
export async function deleOrModInfo(ctx) {
  try {
    let model = ctx.request.body.model
    let action = ctx.request.body.action
    let id = ctx.request.body.id
    if (action === "delete") {
      await deleInfo(ctx, model, id)
      ctx.response.body = {
        "message": "successful"
      }
    } else if (action === "modify") {
      let now = ctx.request.body.now
      console.log(now)
      await modifyInfo(ctx, model, id, now)
      ctx.response.body = {
        "message": "successful"
      }
    } else {
      ctx.throw(404, "error action")
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/***
 * @param  
 * { model: "", id: [uuid or int] } 
 * 删除信息
 */
async function deleInfo(ctx, model, id) {
  try {
    let Model = db[model]
    if (model === "Extrawork" || model === "Absence") {
      // extrawork和absence可以直接删除
      let record = await Model.findOne({
        where: {
          id: id,
        }
      })
      await record.destroy({ force: true })
    } else if (model === "Department" || model === "Position") {
      // department和position必须确定无成员才可以删除
      let res = await Model.findOne({
        where: {
          id: id,
        }
      })
      let employees = await res.getEmployees()
      console.log(employees.length)
      if (Object.keys(employees).length === 0) {
        res.destroy({ force: true })
      } else {
        ctx.throw(406, 'it has employees')
      }
    } else if (model === "Employee") {
      // employee删除的时候
      let employee = await Model.findOne({
        where: {
          id: id,
        }
      })
      let absences = await employee.getAbsences()
      let extraWorks = await employee.getExtraWorks()
      absences.forEach(async absence => {
        await absence.destroy({ force: true })
      })
      extraWorks.forEach(async extraWork => {
        await extraWork.destroy({ force: true })
      })
      await employee.destroy({ force: true })
    } else {
      // 模型时候抛出错误，只是形式并无处理
      throw new Error('err model')
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

/***
 * @param  
 * { model: "", id: [uuid or int], now: {} } 
 * 删除信息
 */
async function modifyInfo(ctx, model, id, now) {
  try {
    let Model = db[model]
    let record = await Model.findOne({
      where: {
        id: id,
      }
    })
    // 更新数据
    await Model.update(
      now, {
        where: {
          id: id,
        }
      }
    )
    ctx.response.body = {
      "message": "successful"
    }
  } catch (err) {
    console.log(err)
    ctx.throw(406, err)
  }
}

/***
 * @param { data: {}, model: "" }
 * @result {}
 * 添加新的信息
 */
export async function addInfo(ctx) {
  try {
    let model = ctx.request.body.model
    let data = ctx.request.body.data
    let Model = db[model] // 这里默认一定是正确的model
    await Model.create(data) // 这里默认传递进去的数据一定符合要求
    ctx.response.body = {
      "message": "successful"
    }
  } catch (err) {
    console.log(err)
    ctx.throw(404, 'err!!!')
  }
}