<template>
  <div id="show">
    <div class="grid-content bg-purple-light el-row">
      <el-col :span="3" class="date-marigin">
        <el-date-picker v-model="addDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="4" class="input-margin">
        <el-select v-model="addTime" placeholder="请选择加班时长">
          <el-option
            v-for="item in hours"
            :value="item"
            :key="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="input2-margin">
        <el-input placeholder="加班工资" suffix-icon="el-icon-date" v-model="addSalary" clearable>
        </el-input>
      </el-col>
      <el-col :span="4" class="input2-margin">
        <el-cascader
          placeholder="员工编号"
          :options="options"
          :show-all-levels="false"
          v-model="addEmployeeId">
        </el-cascader>
      </el-col>
      <el-col>
        <el-input placeholder="加班原因" suffix-icon="el-icon-date" v-model="addReason" clearable>
        </el-input>
      </el-col>
      <el-button type="primary" round class="b-margin" @click="addExtraWork">添加</el-button>
    </div>
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
  name: 'departmentTable',
  data() {
    return {
      addDate: '',
      addTime: '',
      addSalary: '',
      addReason: '',
      addEmployeeId: [],
      editAble: [],
      newName: '',
      newSalary: '',
      pickerOptions: {  // 时间选择器
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
      hours: [1,2,3,4,5,6],
    }
  },
  computed: {
    extraWorks: function() {
      return this.$store.state.extraWorks
    },
    options() {
      let options1 = []
      let children1 = []
      this.$store.state.departments.forEach(department=> {
        // 异步请求各部门的员工
        this.$http.post('/api/department/employees', qs.stringify({
          "departmentId" : department.id
        }))
        .then(res=> {
          res.data.employees.forEach(employee=> {
            children1.push({
              "label": employee.name,
              "value": employee.id,
            })
          })
        })
        .catch(err=> {
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
      this.$store.state.positions.forEach(position=> {
        this.$http.post('/api/position/employees', qs.stringify({
          "positionId" : position.id
        }))
        .then(res=> {
          res.data.employees.forEach(employee=> {
            children2.push({
              "label": employee.name,
              "value": employee.id,
            })
          })
        })
        .catch(err=> {
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
    addExtraWork() {
      if (this.addDate !== '' && this.addTime!== '' && this.addSalary !== '' 
          && this.addReason !== '' && this.addEmployeeId[2] != null) {
        this.$http.post('/api/create', qs.stringify({
          "model": "ExtraWork",
          "data": {
            "id": guid(),
            "time": Number(addTime),
            "day": this.addDate.getDate(),
            "month": this.addDate.getMonth()+1,
            "year": this.addDate.getFullYear(),
            "salary": this.addSalary,
            "reason": this.addReason,
            "employeeId": this.addEmployeeId
          }
        }))
        .then(res=> {
          console.log(res)
        })
        .catch(err=> {
          console.log(err)
        })
      } else{
        console.log(this.addDate.getMonth(), this.addDate.getFullYear(), this.addDate.getDate())

        this.$alert('不能为空', '警告', {
          type: 'error'
        })
      }
    },
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
  margin-left: 20px;
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
