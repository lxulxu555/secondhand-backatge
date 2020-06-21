<template>
  <div>
    <el-table
      :data="AllRole"
      style="width: 100%">
      <el-table-column
        label="角色名"
        prop="roleName">
      </el-table-column>

      <el-table-column
        label="角色描述"
        prop="roleIntro">
      </el-table-column>

      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="dialogFormVisible = true">添加角色</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="ClickAddJurisdiction(scope.row)"
          >
            赋予权限
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteRole(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="8"
      @current-change="CurrentChange"
    >
    </el-pagination>

    <el-dialog title="添加权限" :visible.sync="dialogAddJurisdiction">
      <!--这里面的v-model不用填这么多花里胡哨的东西，只用填个key值就好。。。。。。-->
      <el-transfer
        v-model="selectJurisdiction"
        :data="AllJurisdiction"
        :titles="['可添加权限','已添加权限']"
        @change="ChangeRole"
      />
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" :before-close="closeExpertFormDialog">
      <el-form :model="form" :rules="rules" ref="addRole">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="RoleName">
          <el-input v-model="form.RoleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色简介" :label-width="formLabelWidth" prop="RoleIntro">
          <el-input v-model="form.RoleIntro" autocomplete="off" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExpertFormDialog">取 消</el-button>
        <el-button type="primary" @click="AddRole" :disabled="form.RoleName === '' || form.RoleIntro === ''">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    getRole,
    getPermission,
    findPermissionById,
    addPermissionByRoleId,
    deletePermissionToRole,
    AddRole
  } from '../../api'

  import {deleteMessage} from '../../util/PublicFunction'

  export default {
    name: "role",
    data() {
      return {
        AllRole: [],
        page: 1,
        total: 0,
        dialogAddJurisdiction: false,
        dialogFormVisible: false,
        selectJurisdiction: [],
        AllJurisdiction: [],
        roleId: '',
        formLabelWidth: '120px',
        form: {
          RoleName: '',
          RoleIntro: ''
        },
        rules: {
          RoleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          RoleIntro: [
            {required: true, message: '请输入角色介绍', trigger: 'blur'},
            {min: 5, max: 30, message: '长度在 5 到 30个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      async getRole(page) {
        const result = await getRole({page, rows: 8}, 'get')
        this.AllRole = result.data
        this.page = page
        this.total = result.total
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getRole(this.page) //点击第几页
      },

      async ClickAddJurisdiction(item) {
        this.dialogAddJurisdiction = true
        this.roleId = item.id
        const initAllJurisdiction = []
        const initSelectJurisdiction = []
        const result = await getPermission('', 'get')
        result.data.map(item => {
          initAllJurisdiction.push({
            key: item.id,
            label: item.name
          })
        })
        this.AllJurisdiction = JSON.parse(JSON.stringify(initAllJurisdiction));
        const permission = await findPermissionById({id: item.id}, 'get')
        permission.permissionList.map(item => {
          initSelectJurisdiction.push(item.id)
        })
        this.selectJurisdiction = initSelectJurisdiction
      },

      ChangeRole(value, direction, movedKeys) {
        const roleId = this.roleId
        const permissionIds = movedKeys.toString()
        if (direction === 'right') {
          addPermissionByRoleId({roleId, permissionIds}, 'post')
        } else {
          deletePermissionToRole({roleId, permissionIds}, 'delete')
        }

      },

      async AddRole() {
        const {RoleName, RoleIntro} = this.form
        const result = await AddRole({roleName: RoleName, roleIntro: RoleIntro}, 'post')
        if (result.code === 0) {
          this.getRole(this.page)
        }
        this.$refs["addRole"].resetFields();
        this.dialogFormVisible = false; //关闭对话框
      },

      async DeleteRole(item) {
        const result = await deleteMessage(item.id,'role')
        if(result.code === 0){
          this.getRole(this.page)
        }
      },

      //关闭dialog前
      closeExpertFormDialog(done) {
        this.$refs["addRole"].resetFields();
        this.dialogFormVisible = false; //关闭对话框
        done();//done 用于关闭 Dialog
      },
    },


    mounted() {
      this.getRole(this.page)
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
