<template>
  <div id="show">
    <div class="grid-content bg-purple-light el-row">
      <el-col :span="3" class="date-marigin">
        <el-date-picker v-model="addDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="4" class="input2-margin">
        <el-cascader placeholder="员工编号" :options="options" :show-all-levels="false" v-model="addEmployeeId">
        </el-cascader>
      </el-col>
      <el-col>
        <el-input placeholder="缺勤原因" suffix-icon="el-icon-date" v-model="addReason" clearable>
        </el-input>
      </el-col>
      <el-button type="primary" round class="b-margin" @click="addAbsence">添加</el-button>
    </div>
    <el-table height="400" style="width: 100%" :data="absences">
      <el-table-column prop="fulDate" label="日期" width="150">
      </el-table-column>
      <el-table-column prop="absence.employeeId" label="员工编号" width="200">
      </el-table-column>
      <el-table-column prop="absence.reason" label="加班原因" width="600">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import qs from 'qs'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export default {
  name: 'absenceTable',
  data() {
    return {
      addDate: '',
      addReason: '',
      addEmployeeId: [],
      pickerOptions: { // 时间选择器
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }],
      },
    }
  },
  computed: {
    absences: function() {
      let a = []
      this.$store.state.absences.forEach(absence => {
        a.push({
          "absence": absence,
          "fulDate": absence.year + '-' + absence.month + '-' + absence.day
        })
      })
      return a
    },
    options() {
      let options1 = []
      let children1 = []
      this.$store.state.departments.forEach(department => {
        // 异步请求各部门的员工
        this.$http.post('/api/department/employees', qs.stringify({
            "departmentId": department.id
          }))
          .then(res => {
            res.data.employees.forEach(employee => {
              children1.push({
                "label": employee.name,
                "value": employee.id,
              })
            })
          })
          .catch(err => {
            console.log(err)
          })
        // 添加选项
        options1.push({
          "label": department.name,
          "value": department.id,
          "children": children1
        })
      })
      let options2 = []
      let children2 = []
      this.$store.state.positions.forEach(position => {
        this.$http.post('/api/position/employees', qs.stringify({
            "positionId": position.id
          }))
          .then(res => {
            res.data.employees.forEach(employee => {
              children2.push({
                "label": employee.name,
                "value": employee.id,
              })
            })
          })
          .catch(err => {
            console.log(err)
          })
        options2.push({
          "label": position.name,
          "value": position.id,
          "children": children2
        })
      })
      let options = []
      options.push({
        "label": "部门",
        "value": "department",
        "children": options1
      })
      options.push({
        "label": "工种",
        "value": 'position',
        "children": options2
      })
      return options
    },
  },
  methods: {
    addAbsence() {
      if (this.addDate !== '' && this.addEmployeeId[2] != null && this.addReason !== '') {
        this.$http.post('/api/create', qs.stringify({
            "model": "Absence",
            "data": {
              "day": Number(this.addDate.getDate()),
              "month": Number(Number(this.addDate.getMonth()) + 1),
              "year": Number(this.addDate.getFullYear()),
              "reason": this.addReason,
              "employeeId": this.addEmployeeId[2]
            }
          }))
          .then(res => {
            this.$message({
              showClose: true,
              message: '缺勤信息添加成功',
              type: 'success'
            })
            this.$http.get('/api/absences')
              .then(res => {
                this.$store.state.absences = res.data["absences"]
              })
              .catch(err => {
                console.log(err)
              })
            this.addDate = ''
            this.addReason = ''
            this.addEmployeeId = []
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
    handleDelete(index) {
      this.$http.post('/api/infs', qs.stringify({
          "action": "delete",
          "model": "Absence",
          "id": this.$store.state.absences[index].id
        }))
        .then(res => {
          this.$store.state.absences.splice(index, 1)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
}

</script>
<style scoped>
.date-marigin {
  margin: 20px;
}

.input-margin {
  margin-top: 20px;
  margin-left: 100px;
}

.input2-margin {
  margin-top: 20px;
  margin-left: 200px;
}

.b-margin {
  margin-left: 60px;
  margin-top: 20px;
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

</style>