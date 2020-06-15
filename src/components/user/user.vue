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
            Edit
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      @current-change="CurrentChange"
    >
    </el-pagination>

    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
      <el-form :model="form">
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
          <el-select v-model="form.region" placeholder="请选择用户身份">
            <el-option label="管理员" value="administrators"></el-option>
            <el-option label="超级管理员" value="superadministrators"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
        page:1,
        total:0,
        dialogFormVisible: false,
        form: {
          username: '',
          email:'',
          phone:'',
          region: '',
        },
        formLabelWidth: '100px'
      }
    },
    methods: {

      getAllUser(page) {
        this.http.get('user/findAll', {page, rows: 8}).then(res => {
          this.AllUser = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage){
        this.page = currentPage;
        this.getAllUser(this.page) //点击第几页
      },

      ClickItem(item){
        this.dialogFormVisible = true
        this.form.username = item.username
        this.form.email = item.email
        this.form.phone = item.phone
      }
    },
    mounted() {
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
