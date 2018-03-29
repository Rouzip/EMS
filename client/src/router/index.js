import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/login'
import departmentTable from '@/components/departmentTable'
import positionTable from '@/components/positionTable'
import absenceTable from '@/components/absenceTable'
import extraWorkTable from '@/components/extraWorkTable'
import employeeTable from '@/components/employeeTable'


Vue.use(Router)


export default new Router({
  routes: [{
      path: '/login',
      component: login,
    },
    {
      path: '/main',
      component: main,
      children: [{
          path: 'showDepartment',
          component: departmentTable
        },
        {
          path: 'showPosition',
          component: positionTable
        },
        {
          path: 'showExtraWork',
          component: extraWorkTable
        },
        {
          path: 'showAbsence',
          component: absenceTable
        },
        {
          path: 'showEmployee',
          component: employeeTable
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ],
  mode: 'history'
})
