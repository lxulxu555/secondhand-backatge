<template>
  <div>
    <el-table
      :data="AllJurisdiction"
      style="width: 100%">
      <el-table-column
        label="权限介绍"
        prop="name">
      </el-table-column>

      <el-table-column
        label="权限接口"
        prop="url">
      </el-table-column>

      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary" @click="dialogAdd = true">添加权限</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="DeleteRole(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加权限" :visible.sync="dialogAdd" :before-close="closeExpertFormDialog">

      <el-form :model="form" ref="addJurisdiction">
        <el-form-item label="权限介绍" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限接口" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择权限接口" @change="selectTrigger(form.region)">
            <el-option
              v-for="item in AllJurisdiction"
              :key="item.id"
              :label="item.url"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExpertFormDialog">取 消</el-button>
        <el-button type="primary" @click="AddJurisdiction" :disabled="form.name === ''">确 定</el-button>
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
  import {getPermission,AddPermision} from '../../api'
  import {deleteMessage} from '../../util/PublicFunction'

  export default {
    name: "jurisdiction",
    data() {
      return {
        AllJurisdiction: [],
        page: 1,
        total: 0,
        dialogAdd: false,
        form: {
          name: '',
          region: '',
        },
        formLabelWidth: '120px',
      }
    },
    methods: {
      async getJurisdiction(page) {
        const result = await getPermission({page, rows: 8}, 'get')
        this.AllJurisdiction = result.data
        this.page = page
        this.total = result.total
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getJurisdiction(this.page) //点击第几页
      },

      async DeleteRole(item) {
        const result = await deleteMessage(item.id,'permission')
        if(result.code === 0){
          this.getJurisdiction(this.page) //点击第几页
        }
      },

      selectTrigger(val) {
        this.form.name = val
        let obj = {};
        obj = this.options.find((item) => {//这里的userList就是上面遍历的数据源
          return item.value === val;//筛选出匹配数据
        });
        this.form.region = obj.label
      },

      async AddJurisdiction() {
        const result = await AddPermision({name: this.form.name, url: this.form.region}, 'post')
        if(result.code === 0){
          this.getJurisdiction(this.page)
          this.form.region = ''
          this.dialogAdd = false; //关闭对话框
        }
      },

      //关闭dialog前
      closeExpertFormDialog(done) {
        this.form.region = ''
        this.dialogAdd = false; //关闭对话框
        done();//done 用于关闭 Dialog
      },

    },
    mounted() {
      this.getJurisdiction(this.page)
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
