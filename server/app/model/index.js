import Sequelize from 'sequelize'

import config from '../../config'
import departmentModel from './department'
import positionModel from './position'
import extraWorkModel from './extrawork'
import employeeModel from './employee'
import absenceModel from './absence'


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
    acquire: 20000,
  }
})


// 公司部门表
let Department = departmentModel(sequelize)

// 公司职位表
let Position = positionModel(sequelize)

// 额外加班记录表
let ExtraWork = extraWorkModel(sequelize)

// 员工基本信息表
let Employee = employeeModel(sequelize)

// 缺勤记录表
let Absence = absenceModel(sequelize)

// 每个部门拥有多个员工,每个员工只有一个部门
Department.hasMany(Employee)
Employee.belongsTo(Department)

// 每个员工拥有一个职位，一个职位里可以有很多员工
Position.hasMany(Employee)
Employee.belongsTo(Position)

// 每个员工有很多加班记录，一条加班记录对应一个员工
Employee.hasMany(ExtraWork)
ExtraWork.belongsTo(Employee)

// 每个员工有很多缺勤记录，每个缺勤记录对应一个员工
Employee.hasMany(Absence)
Absence.belongsTo(Employee)

var db = {}

// 定义数据库对象
db.Sequelize = Sequelize
db.sequelize = sequelize
// 定义模型
db.Department = Department
db.Position = Position
db.ExtraWork = ExtraWork
db.Employee = Employee
db.Absence = Absence

db.sequelize.sync()

export default db
