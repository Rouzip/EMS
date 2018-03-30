<template>
  <div id="show">
    <div class="grid-content bg-purple-light el-row">
      <el-col :span="3" class="input-margin">
        <el-input placeholder="员工名" suffix-icon="el-icon-date" v-model="addName" clearable>
        </el-input>
      </el-col>
      <el-col :span="3" class="input-margin">
        <el-select v-model="addSex" placeholder="员工性别">
          <el-option v-for="item in sexs" :value="item" :key="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="input-margin">
        <el-date-picker v-model="addBirth" align="right" type="date" placeholder="选择出生日期">
        </el-date-picker>
      </el-col>
      <el-col :span="3" class="put-margin">
        <el-select v-model="addDepartment" placeholder="请选择部门">
          <el-option v-for="item in this.departments" :value="item.id" :label="item.name" :key="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" class="input-margin">
        <el-select v-model="addPosition" placeholder="请选择工种">
          <el-option v-for="item in this.positions" :value="item.id" :label="item.name" :key="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-button type="primary" round class="b-margin" @click="addEmployee">添加</el-button>
    </div>
    <el-table height="200" border style="width: 100%" :data="employees" @row-click="chart">
      <el-table-column label="员工姓名" width="100" fixed>
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-input v-model="editName">
            </el-input>
          </template>
          <template v-else>
            <span>{{scope.row.name}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="员工生日" width="150">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-date-picker v-model="editBirth" align="right" type="date" placeholder="出生日期">
            </el-date-picker>
          </template>
          <template v-else>
            <span>{{scope.row.birth.substring(0,10)}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="员工性别" width="100">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-select v-model="editSex" placeholder="员工性别">
              <el-option v-for="item in sexs" :value="item" :key="item">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <span>{{scope.row.sex}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="员工部门" width="150">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-select v-model="editDepartment" placeholder="请选择部门">
              <el-option v-for="item in departments" :value="item.id" :label="item.name" :key="item.id">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <span>{{ employeeDep[scope.$index] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="员工工种" width="150">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-select v-model="editPosition" placeholder="请选择工种">
              <el-option v-for="item in positions" :value="item.id" :label="item.name" :key="item.id">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <span>{{ employeePos[scope.$index] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="员工ID" width="300">
        <template slot-scope="scope">
          <template>
            <span>{{ scope.row.id }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            <template v-if="!editAble[scope.$index]">
              编辑
            </template>
            <span v-else>
              完成
            </span>
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span id="salary-chart" class="chart">
    </span>
  </div>
</template>
<script>
import qs from 'qs'
import echarts from 'echarts'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


export default {
  data() {
    return {
      sexs: ['女', '男'],
      addName: '',
      addBirth: '',
      addSex: '',
      addDepartment: '',
      addPosition: '',
      editAble: [],
      editName: '',
      editBirth: '',
      editSex: '',
      editPosition: '',
      editDepartment: '',
      meanData: [0,0,0,0,0,0,0,0,0,0,0,0],
      option: {
            title: {
              text: '工资统计图'
            },
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: ['平均工资']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: {
              type: 'value'
            },
          }
    }
  },
  computed: {
    seriesData() {
      return this.$store.state.series.slice(0, this.$store.state.employees.length)
    },
    departments: function() {
      return this.$store.state.departments
    },
    positions: function() {
      return this.$store.state.positions
    },
    employees: function() {
      return this.$store.state.employees
    },
    employeeDep: function() {
      let a = []
      this.employees.forEach(employee => {
        this.departments.forEach(department => {
          if (employee.departmentId === department.id) {
            a.push(department.name)
          }
        })
      })
      return a
    },
    employeePos: function() {
      let a = []
      this.employees.forEach(employee => {
        this.positions.forEach(position => {
          if (employee.positionId === position.id) {
            a.push(position.name)
          }
        })
      })
      return a
    },
  },
  methods: {
    addEmployee: function() {
      if (this.addName !== '' && this.addAge !== '' && this.addSex !== '' &&
        this.addDepartment !== '' && this.addPosition !== '') {
        let month = this.addBirth.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        } else {
          month = month.toString()
        }
        let date = this.addBirth.getDate()
        if (date < 10) {
          date = '0' + date
        } else {
          date = date.toString()
        }
        let birth = this.addBirth.getFullYear() + '-' + month + '-' + date
        this.$http.post('/api/create', qs.stringify({
            "model": "Employee",
            "data": {
              "name": this.addName,
              "sex": this.addSex,
              "birth": birth,
              "departmentId": Number(this.addDepartment),
              "positionId": Number(this.addPosition),
              "id": guid()
            }
          }))
          .then(res => {
            if (this.store.state.employees.length === 0) {
              return
            }
            if (this.$store.state.depOrPos === "position") {
              this.$http.post('/api/position/employees', qs.stringify({
                  "positionId": this.$store.state.employee[0].positionId
                }))
                .then(res => {
                  this.$store.state.employees = res.data.employees
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (this.$store.state.depOrPos === "department") {
              this.$http.post('/api/department/employees', qs.stringify({
                  "departmentId": this.$store.state.employee[0].departmentId
                }))
                .then(res => {
                  this.$store.state.employees = res.data.employees
                })
                .catch(err => {
                  console.log(err)
                })
            }
            this.$message({
              showClose: true,
              message: '员工添加成功',
              type: 'success'
            })
            this.addBirth = ''
            this.addName = ''
            this.addSex = ''
            this.addDepartment = ''
            this.addPosition = ''
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$alert('不能为空', '警告', {
          type: 'error'
        })
      }
    },
    departmentName: function(id) {
      this.$store.state.departments.forEach(department => {
        if (department.id === id) {
          return department.name
        }
      })
    },
    handleDelete(index, employee) {
      this.$http.post('/api/infs', qs.stringify({
          "action": "delete",
          "model": "Employee",
          "id": employee.id
        }))
        .then(res => {
          this.$store.state.employees.splice(index, 1)
          // 修改editAble数组
          this.editAble.splice(index, 1)
        })
        .catch(err => {
          this.$alert('发生错误，无法删除', '警告', {
            type: 'error'
          })
          console.log(err)
        })
    },
    handleEdit(index, employee) {
      if (!this.editAble[index]) {
        // 开启编辑模式
        this.$set(this.editAble, index, !this.editAble[index])
      } else {
        if (this.editName === "" || this.editSalary === "") {
          this.$alert('不能为空', '警告', {
            type: 'error'
          })
          return
        }
        let month = this.editBirth.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        } else {
          month = month.toString()
        }
        let date = this.editBirth.getDate()
        if (date < 10) {
          date = '0' + date
        } else {
          date = date.toString()
        }
        let birth = this.editBirth.getFullYear() + '-' + month + '-' + date
        this.$http.post('/api/infs', qs.stringify({
            "action": "modify",
            "model": "Employee",
            "id": this.$store.state.employees[index].id,
            "now": {
              "id": this.$store.state.employees[index].id,
              "name": this.editName,
              "sex": this.editSex,
              "birth": birth,
              "departmentId": Number(this.editDepartment),
              "positionId": Number(this.editPosition),
            }
          }))
          .then(res => {
            if (this.$store.state.depOrPos === "position") {
              this.$http.post('/api/position/employees', qs.stringify({
                  "positionId": this.$store.state.employee[0].positionId
                }))
                .then(res => {
                  this.$store.state.employees = res.data.employees
                })
                .catch(err => {
                  console.log(err)
                })
            } else if (this.$store.state.depOrPos === "department") {
              this.$http.post('/api/department/employees', qs.stringify({
                  "departmentId": this.$store.state.employee[0].departmentId
                }))
                .then(res => {
                  this.$store.state.employees = res.data.employees
                })
                .catch(err => {
                  console.log(err)
                })
            }
          })
          .catch(err => {
            console.log(err)
          })
        this.editSex = ''
        this.editDepartment = ''
        this.editPosition = ''
        this.editName = ''
        this.editBirth = ''
        this.$set(this.editAble, index, !this.editAble[index])
      }
    },
    chart: function(row, event, column) {
      let i = 0
      this.$store.state.employees.forEach((employee, index)=>{
        if (employee.id === row.id){
          i = index
        }
      })
      
      if (this.option.legend.data.length === 1){
        this.option.legend.data.push(row.name)
      } else {
        this.option.legend.data[1] = row.name
      }
      let myChart = echarts.init(document.getElementById('salary-chart'), 'light')
      let series = []
      let op = this.$store.state.meanSalary
      op["data"] = this.meanData
      series.push(op)
      series.push(this.seriesData[i])
      let option = this.option
      option["series"] = series
      myChart.setOption(option)
    },
  },
  mounted() {
    let myChart = echarts.init(document.getElementById('salary-chart'), 'light')
    let series = []
    let op = this.$store.state.meanSalary
    op["data"] = this.meanData
    series.push(op)
    let option = this.option
    option["series"] = series
    myChart.setOption(option)
  },
  watch: {
    seriesData: function() {
      this.meanData = [0,0,0,0,0,0,0,0,0,0,0,0]
      this.seriesData.forEach(d=> {
        d.data.forEach((money,index)=> this.meanData[index]+=money)
      })
      this.meanData.forEach((a,b)=> this.meanData[b]/=this.$store.state.employees.length)
      let myChart = echarts.init(document.getElementById('salary-chart'), 'light')
      let series = []
      let op = this.$store.state.meanSalary
      op["data"] = this.meanData
      series.push(op)
      let option = this.option
      option["series"] = series
      myChart.setOption(option)
    }
  }
}

</script>
<style scoped>
.input-margin {
  margin: 15px;
}

.put-margin {
  margin-left: 100px;
  margin-top: 15px;
}

.b-margin {
  margin-left: 30px;
  margin-top: 15px;
}

.el-row {
  margin-bottom: 40px;
}

.grid-content {
  border-radius: 3px;
  min-height: 36px;
}

.bg-purple-light {
  background: #e5e2f2;
}

.chart {
  width: 1000px;
  height: 500px;
}

</style>
