<template>
  <el-container>
    <el-aside width="200px" height="100%" style="overflow-x: hidden; height: -webkit-fill-available">
      <el-menu>
        <el-menu-item index="1" @click="addShowDepartment">
          <i class="el-icon-location"></i>
          <span slot="title">部门</span>
        </el-menu-item>
        <el-menu-item index="2" @click="addShowPosition">
          <i class="el-icon-document"></i>
          <span slot="title">工种</span>
        </el-menu-item>
        <el-menu-item index="3" @click="addShowAbsence">
          <i class="el-icon-star-on"></i>
          <span slot="title">缺勤记录</span>
        </el-menu-item>
        <el-menu-item index="4" @click="addShowExtraWork">
          <i class="el-icon-star-off"></i>
          <span slot="title">加班记录</span>
        </el-menu-item>
        <el-submenu index="5" @open="addShowEmployee">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>员工</span>
          </template>
          <el-menu-item-group>
            <template slot="title">部门</template>
            <el-menu-item v-for="(department, i) in $store.state.departments" :key="i" :index="department.name" @click="departmentEmp(department.id)">
              <span>{{ department.name }}</span>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group> 
            <template slot="title">工种</template>
            <el-menu-item v-for="(position, i) in $store.state.positions" :key="i" :index="position.name" @click="positionEmp(position.id)">
              <span>{{ position.name }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main style="overflow-x: hidden; height: -webkit-fill-available">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import qs from 'qs'

export default {

  name: 'app',
  data() {
    return {}
  },
  methods: {
    getDepartments: async function() {
      this.$http.get('/api/department')
        .then(res => {
          this.$store.state.departments = res.data["departments"]
        })
        .catch(err => {
          console.log(err)
          this.$store.state.departments = []
        })
    },
    getPositions: async function() {
      this.$http.get('/api/position')
        .then(res => {
          this.$store.state.positions = res.data["positions"]
        })
        .catch(err => {
          console.log(err)
          this.$store.state.positions = []
        })
    },
    getExtraWorks: async function() {
      this.$http.get('/api/allextraworks')
        .then(res => {
          this.$store.state.extraWorks = res.data["extraWorks"]
        })
        .catch(err => {
          console.log(err)
          this.$store.state.extraWorks = []
        })
    },
    getAbsences: async function() {
      this.$http.get('/api/absences')
        .then(res => {
          this.$store.state.absences = res.data["absences"]
        })
        .catch(err => {
          console.log(err)
          this.$store.state.absences = []
        })
    },
    addShowDepartment: function() {
      this.$router.push('/main/showDepartment')
    },
    addShowPosition: function() {
      this.$router.push('/main/showPosition')
    },
    addShowAbsence: function() {
      this.$router.push('/main/showAbsence')
    },
    addShowExtraWork: function() {
      this.$router.push('/main/showExtraWork')
    },
    addShowEmployee: function() {
      this.$router.push('/main/showEmployee')
    },
    departmentEmp: function(id) {
      this.$http.post('/api/department/employees', qs.stringify({
        "departmentId": id
      }))
        .then(res=> {
          this.$store.state.employees = res.data.employees
          this.$store.state.depOrPos = 'department'
          this.addShowEmployee()
          this.$store.state.employees.forEach((employee, index)=>{
            this.$http.post('/api/salary/year', qs.stringify({
              "year": 2018,
              "employeeId": employee.id
            }))
              .then(res=> {
                let response = res.data
                // 更新salarys
                this.$set(this.$store.state.salarys, employee.id, response)
                // 计算series数据提供给echarts
                this.$store.commit('updateSeries', {"name": employee.name, "id": employee.id, "index": index})  
              })
              .catch(err=> {
                console.log(err, 'err')
              })
          }) 
        })
        .catch(err=> {
          console.log(err)
        })
    },
    positionEmp: function(id) {
      this.$http.post('/api/position/employees', qs.stringify({
        "positionId": id
      }))
        .then(res=> {
          this.$store.state.employees = res.data.employees
          this.$store.state.depOrPos = 'position'
          this.addShowEmployee()
          this.$store.state.employees.forEach(employee=>{
            this.$http.post('/api/salary/year', qs.stringify({
              "year": 2018,
              "employeeId": employee.id
            }))
              .then(res=> {
                this.$store.state.salarys[employee.id] = res.data
              })
              .catch(err=> {
                console.log(err)
              })
          })
        })
        .catch(err=> {  
          console.log(err)
        })
    }
  },
  created: async function() {
    try {
      await this.getDepartments()
      await this.getPositions()
      await this.getExtraWorks()
      await this.getAbsences()
      let html = document.getElementsByTagName('html')[0]
      html.style.property = {
        "overflow": "hidden"
      }
    } catch (err) {
      console.log(err)
    }
  }
}

</script>
<style scoped>


</style>
