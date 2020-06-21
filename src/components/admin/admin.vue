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
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="dialogAddAdmin = true">添加管理员</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="ClickAddAdminFromRole(scope.row)"
          >
            选择角色
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteAdmin(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="选择角色" :visible.sync="clickAddAdminFromRole" :before-close="closeExpertFormDialog">
      <!--这里面的v-model不用填这么多花里胡哨的东西，只用填个key值就好。。。。。。-->
      <el-transfer
        v-model="selectRole"
        :data="AllRole"
        :titles="['可添加角色','已添加角色']"
        @change="ChangeRole"
      />
    </el-dialog>

    <el-dialog title="添加管理员" :visible.sync="dialogAddAdmin" :before-close="closeExpertFormDialog">
      <el-form :model="form" ref="dialogAddAdmin">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddAdmin = false">取 消</el-button>
        <el-button type="primary" @click="ClickAddAdmin">确 定</el-button>
      </div>
    </el-dialog>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="8"
      @current-change="CurrentChange"
    >
    </el-pagination>

  </div>
</template>

<script>
  import {getAdmin, getRole,FindRoleById,AddRoleToUser,DeleteRoleToUser,AddAdmin} from '../../api'
  import {deleteMessage} from '../../util/PublicFunction'

  export default {
    name: "admin",
    data() {
      return {
        AllAdmin: [],
        page: 1,
        total: 0,
        clickAddAdminFromRole: false,
        selectRole: [],
        AllRole: [],
        userId: '',
        formLabelWidth: '120px',
        dialogAddAdmin: false,
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {

      async getAdmin(page) {
        const result = await getAdmin({page, rows: 8, admin: 'admin'}, 'get')
        this.AllAdmin = result.data
        this.page = page
        this.total = result.total
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getAdmin(this.page) //点击第几页
      },

      async ClickAddAdminFromRole(item) {
        this.clickAddAdminFromRole = true
        this.userId = item.id
        const initAllRole = []
        const initSelectRole = []
        /*查找所有角色*/
        const Allrole = await getRole('', 'get')
        Allrole.data.map(item => {
          initAllRole.push({
            key: item.id,
            label: item.roleName
          })
        })
        this.AllRole = JSON.parse(JSON.stringify(initAllRole));
        /*查找该角色已有的角色*/
        const findRoleById = await FindRoleById({id: item.id},'get')
        findRoleById.roleList.map(item => {
          initSelectRole.push(item.id)
        })
        this.selectRole = initSelectRole
      },

      ChangeRole(value, direction, movedKeys) {
        const userId = parseInt(this.userId)
        const roleIds = movedKeys.toString()
        if (direction === 'right') {
          AddRoleToUser({userId, roleIds},'post')
        } else {
          DeleteRoleToUser({userId, roleIds}, 'delete')
        }
      },

      async DeleteAdmin(item) {
       const result = await deleteMessage(item.id)
        if(result.code === 0){
          this.getAdmin(this.page)
        }
      },

      async ClickAddAdmin() {
        const {username, password} = this.form
        const result = await AddAdmin({username, password}, 'post')
        if(result.code === 0){
          this.getAdmin(this.page)
          this.dialogAddAdmin = false
        }
      },

      //关闭dialog前
      closeExpertFormDialog(done) {
        this.clickAddAdminFromRole = false; //关闭对话框
        this.dialogAddAdmin = false
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
