<template>
  <div id="show">
    <div class="grid-content bg-purple-light el-row">
      <el-col :span="8" class="input-margin">
        <el-input placeholder="新建工种名" suffix-icon="el-icon-date" v-model="depName" clearable>
        </el-input>
      </el-col>
      <el-col :span="8" class="input-margin">
        <el-input placeholder="工种基本工资" suffix-icon="el-icon-date" v-model="depSalary" clearable>
        </el-input>
      </el-col>
      <el-button type="primary" round class="b-margin" @click="addPosition">添加</el-button>
    </div>
    <el-table height="400" border style="width: 100%" :data="positions">
      <el-table-column label="工种名称" width="250">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-input v-model="newName">
            </el-input>
          </template>
          <template v-else>
            <span>{{scope.row.name}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="工种基本工资" width="250">
        <template slot-scope="scope">
          <template v-if="editAble[scope.$index]">
            <el-input v-model="newSalary">
            </el-input>
          </template>
          <template v-else>
            <span>{{scope.row.salary}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index)">
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
  </div>
</template>
<script>
import qs from 'qs'

export default {
  name: 'positionTable',
  data() {
    return {
      depName: '',
      depSalary: '',
      editAble: [],
      newName: '',
      newSalary: '',
    }
  },
  computed: {
    positions: function() {
      return this.$store.state.positions
    },
  },
  methods: {
    addPosition: async function() {
      if (this.depName === "" || this.depSalary === "") {
        this.$alert('不能为空', '警告', {
          type: 'error'
        })
        return;
      }
      this.$http.post('/api/create', qs.stringify({
          model: "Position",
          data: {
            "name": this.depName,
            "salary": Number(this.depSalary),
          },
        }))
        .then(res => {
          this.$message({
            showClose: true,
            message: '工种添加成功',
            type: 'success'
          })
          this.$http.get('/api/position')
            .then(res => {
              this.$store.state.positions = res.data["positions"]
            })
            .catch(err => {
              console.log(err)
            })
          this.$set(this.editAble, this.editAble.length + 1, false)
          this.depName = ''
          this.depSalary = ''
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: '发生错误！' + err,
            type: 'error'
          })
        })
    },
    handleDelete(index) {
      console.log(index)
      console.log(this.positions[index].id)
      // 表格中删除对应行的positions
      // vuex中删除数据
      // 向服务器发送请求
      this.$http.post('/api/infs', qs.stringify({
          "action": "delete",
          "model": "Position",
          "id": Number(this.positions[index].id)
        }))
        .then(res => {
          this.$store.state.positions.splice(index, 1)
          // 修改editAble数组
          this.editAble.splice(index, 1)
        })
        .catch(err => {
          this.$alert('该工种还有员工，无法删除', '警告', {
            type: 'error'
          })
          console.log(err)
        })
    },
    handleEdit(index, position) {
      if (!this.editAble[index]) {
        // 开启编辑模式
        this.$set(this.editAble, index, !this.editAble[index])
      } else {
        // 完成编辑向服务器提交修改
        if (this.newName === "" || this.newSalary === "") {
          this.$alert('不能为空', '警告', {
            type: 'error'
          })
          return
        }
        this.$http.post('/api/infs', qs.stringify({
            "action": "modify",
            "model": "Position",
            "id": this.$store.state.positions[index].id,
            "now": {
              "id": Number(this.$store.state.positions[index].id),
              "name": this.newName,
              "salary": Number(this.newSalary)
            }
          }))
          .then(res => {
            this.$message({
              showClose: true,
              message: '工种信息修改成功',
              type: 'success'
            })
            this.$http.get('/api/position')
              .then(res => {
                this.$store.state.positions = res.data["positions"]
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
        this.$set(this.editAble, index, !this.editAble[index])
      }
    },
  },
}

</script>
<style scoped>
.input-margin {
  margin: 15px;
}

.b-margin {
  margin-left: 60px;
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

</style>
