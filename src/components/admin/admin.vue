<template>
  <div>
    <el-table
      :data="AllAdmin"
      style="width: 100%">
      <el-table-column
        label="用户名"
        prop="username">
      </el-table-column>

      <el-table-column
        label="邮箱"
        prop="email">
      </el-table-column>

      <el-table-column
        label="手机号"
        prop="phone">
      </el-table-column>

      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="ClickAddRole(scope.row)"
          >
            选择角色
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteRole(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="选择角色" :visible.sync="dialogAddRole" :before-close="closeExpertFormDialog">
      <!--这里面的v-model不用填这么多花里胡哨的东西，只用填个key值就好。。。。。。-->
      <el-transfer
        v-model="selectRole"
        :data="AllRole"
        :titles="['可添加角色','已添加角色']"
        @change="ChangeRole"
      />
    </el-dialog>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      @current-change="CurrentChange"
    >
    </el-pagination>

  </div>
</template>

<script>
  export default {
    name: "admin",
    data() {
      return {
        AllAdmin: [],
        page: 1,
        total: 0,
        dialogAddRole:false,
        selectRole:[],
        AllRole:[],
        userId:''
      }
    },
    methods: {

      getAdmin(page) {
        this.http.get('user/findAll', {page, rows: 8, admin: 'admin'}).then(res => {
          this.AllAdmin = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getAdmin(this.page) //点击第几页
      },

      ClickAddRole(item) {
        this.dialogAddRole = true
        this.userId = item.id
        const initAllRole = []
        const initSelectRole = []
        /*查找所有角色*/
        this.http.get('token/role/findByPage',).then(res => {
          res.data.data.map(item => {
            initAllRole.push({
              key: item.id,
              label: item.roleName
            })
          })
          this.AllRole = JSON.parse(JSON.stringify(initAllRole));
        })
        /*查找该角色已有的角色*/
        this.http.get('user/findRoleById', {id:item.id}).then(res => {
          res.data.roleList.map(item => {
            initSelectRole.push(item.id)
          })
          this.selectRole = initSelectRole
        })
      },

      ChangeRole(value, direction, movedKeys) {
        const userId = this.userId
        const roleIds = movedKeys.toString()
        if (direction === 'right') {
          this.http.post('user/addRoleToUser', {userId, roleIds}).then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          })
        } else {
          this.http.delete('user/deleteRoleToUser', {userId,roleIds}).then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      },

      DeleteRole(item){
        console.log(item)
        this.$confirm('此操作将删除管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = item.id
          this.http.delete('user/delete', {ids}).then(res => {
            if(res.data.code === 0){
              this.$message.success(res.data.msg);
              this.getAdmin(this.page)
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //关闭dialog前
      closeExpertFormDialog(done){
        this.dialogAddRole = false; //关闭对话框
        done();//done 用于关闭 Dialog
      },

    },
    mounted() {
      this.getAdmin(this.page)
    }
  }
</script>

<style scoped>
  .el-pagination {
    position: fixed;
    bottom: 30px;
    left: 50%;
  }
</style>
