<template>
  <el-container>
    <el-aside width="200px" height="100%"> 
      <el-menu>
        <el-menu-item index="1" @click="addShowDepartment">
          <i class="el-icon-location"></i>
          <span slot="title">部门</span>
        </el-menu-item>
        <el-menu-item index="2" @click="addShowPosition">
          <i class="el-icon-document"></i>
          <span slot="title">工种</span>
        </el-menu-item>
        <el-menu-item index="3" @click="addShowPosition">
          <i class="el-icon-star-on"></i>
          <span slot="title">缺勤记录</span>
        </el-menu-item>
        <el-menu-item index="4" @click="addShowPosition">
          <i class="el-icon-star-off"></i>
          <span slot="title">加班记录</span>
        </el-menu-item>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>员工</span>
          </template>
          <el-menu-item v-for="(department, i) in $store.state.departments" :key="i" :index="department.name">
            <span>{{ department.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import qs from 'qs'

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      positions: [],
      departments: [],
      employees: [],
      ttt: ['1', '2', '3']
    }
  },
  computed: {},
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
    addShowDepartment: function() {
      console.log('尝试添加组件')
      this.$router.push('/main/showDepartment')
    },
    addShowPosition: function() {
      console.log('添加position')
      this.$router.push('/main/showPosition')
    }
  },
  created: async function() {
    try {
      await this.getDepartments()
      await this.getPositions()
    } catch (err) {
      console.log(err)
    }
  }
}

</script>
<style scoped>


</style>
