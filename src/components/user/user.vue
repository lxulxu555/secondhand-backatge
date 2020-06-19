<template>
  <div>
    <el-table
      :data="AllUser"
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
            @click="ClickItem(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteUser(scope.row)">删除
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

    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">

      <el-form :model="form" ref="updateUser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户身份" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择权限接口" @change="selectTrigger(form.region)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "user",
    data() {
      return {
        AllUser: [],
        page: 1,
        total: 0,
        dialogFormVisible: false,
        form: {
          id: '',
          username: '',
          email: '',
          phone: '',
          region: '',
        },
        options: [{
          label: '管理员',
          value: 'admin'
        }, {
          label: '普通用户',
          value: 'user'
        }],
        formLabelWidth: '100px'
      }
    },
    methods: {

      getAllUser(page) {
        this.http.get('user/findAll', {page, rows: 8}, 'get').then(res => {
          this.AllUser = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getAllUser(this.page) //点击第几页
      },

      ClickItem(item) {
        const isUserOrAdmin = item.sex === '管' ? 'admin' : 'user'
        this.dialogFormVisible = true
        this.form.id = item.id
        this.form.username = item.username
        this.form.email = item.email
        this.form.phone = item.phone
        this.form.region = isUserOrAdmin
      },

      selectTrigger(val) {
        this.form.region = val
      },

      DeleteUser(item) {
        this.$confirm(`此操作将删除${item.username}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = item.id
          this.http.delete('user/delete', {ids}, 'delete').then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.getAllUser(this.page)
            } else {
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

      updateUser() {
        const {id, username, email, phone, region} = this.form
        const sex = region === 'admin' ? '管' : '男'
        this.http.put('user/update', {id, username, phone, email, sex}, 'put').then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.getAllUser(this.page)
          } else {
            this.$message.error(res.data.msg);
          }
          this.$refs["updateUser"].resetFields();
          this.dialogFormVisible = false
        })
    }
  }
  ,
  mounted()
  {
    this.getAllUser(this.page)
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
