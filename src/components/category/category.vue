<template>
  <div>
    <el-table
      :data="AfterChangeData"
      style="width: 100%">
      <el-table-column
        label="一级分类"
        prop="name">
      </el-table-column>

      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary">添加分类</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="ClickUpdateClass(scope.row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="Class.length"
      :current-page="currentPage"
      :page-size="pagesize"
      @current-change="CurrentChange"
    >
    </el-pagination>

    <el-dialog title="修改分类" :visible.sync="UpdateOneClass">
      <el-form :model="form">
        <el-form-item label="一级分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.className" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SendUpdateName">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "category",
    data() {
      return {
        Class: [],
        pagesize: 8,    //    每页的数据　　
        currentPage: 1, //初始页
        UpdateOneClass:false,
        form:{
          className:''
        },
        formLabelWidth: '100px',
        OneClassId:''
      }
    },
    computed: {
      AfterChangeData() {
        let start = (this.currentPage - 1) * this.pagesize;
        let end = this.currentPage * this.pagesize;
        return this.Class.slice(start, end)
      }
    },
    methods: {
      getClass() {
        this.http.get('classify1/findClassify1').then(res => {
          this.Class = res.data
        })
      },

      CurrentChange(currentPage) {
        this.currentPage = currentPage;
      },

      ClickUpdateClass(item){
        this.UpdateOneClass = true
        this.OneClassId = item.id
        this.form.className = item.name
      },

      SendUpdateName(){
        this.UpdateOneClass = false
        const id = this.OneClassId
        const name = this.form.className
        this.http.put('classify1/update',{id,name}).then(res => {
          if(res.data.code === 0){
            this.$message.success(res.data.msg);
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }
    },

    mounted() {
      this.getClass()
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
