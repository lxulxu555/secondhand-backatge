<template>
  <div>

    <div class="back" v-if="isOne === false">
      <div class="el-icon-back" @click="back"/>
    </div>

    <el-table
      :data="AfterOneChangeData"
      :style="{'margin-top' : (isOne === true ? '' : '-50px')}"
    >
      <el-table-column
        :label="isOne === true ? '一级分类' : '二级分类'"
        prop="name"
      >
      </el-table-column>


      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button type="primary">添加分类</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            type="warning"
            size="mini"
            @click="GetTwoDetail(scope.row)"
            v-if="isOne === true"
          >
            查看详情
          </el-button>
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
      v-if="isOne === true"
      background
      layout="prev, pager, next"
      :total="Class.length"
      :current-page="currentPage"
      :page-size="pagesize"
      @current-change="CurrentChange"
    >
    </el-pagination>

    <el-pagination
      v-if="isOne === false"
      background
      layout="prev, pager, next"
      :total="TwoClass.length"
      :current-page="TwoPage"
      :page-size="pagesize"
      @current-change="CurrentTwoChange"
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

<script type="text/jsx">
  export default {
    name: "category",
    data() {
      return {
        Class: [],
        TwoClass:[],
        pagesize: 8,    //    每页的数据　　
        currentPage: 1, //初始页
        TwoPage:1,
        UpdateOneClass: false,
        form: {
          className: ''
        },
        formLabelWidth: '100px',
        OneClassId: '',
        isOne: true,
      }
    },
    computed: {
      AfterOneChangeData() {
        const page = this.isOne === true ? this.currentPage : this.TwoPage
        let start = (page - 1) * this.pagesize;
        let end = page * this.pagesize;
        return this.isOne === true ? this.Class.slice(start, end) : this.TwoClass.slice(start, end)
      }
    },

    methods: {
      getClass() {
        this.http.get('classify1/findClassify1').then(res => {
          this.Class = res.data
          this.isOne = true
        })
      },

      CurrentChange(currentPage) {
        this.currentPage = currentPage;
      },

      CurrentTwoChange(currentPage){
        this.TwoPage = currentPage
      },

      ClickUpdateClass(item) {
        this.UpdateOneClass = true
        this.OneClassId = item.id
        this.form.className = item.name
      },

      SendUpdateName() {
        this.UpdateOneClass = false
        const id = this.OneClassId
        const name = this.form.className
        this.http.put('classify1/update', {id, name}).then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },

      back() {
        this.isOne = true
        this.TwoClass = []
      },

      GetTwoDetail(item) {
        this.http.get('classify1/findChildById', {id: item.id}).then(res => {
          this.TwoClass = res.data
          this.isOne = false
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

  .back {
    position: relative;
    width: 50px;
    height: 50px;
    top: 15px;
    right: 25px;
    z-index: 1;
  }

  .el-icon-back {
    position: absolute;
    font-size: 30px;
    /*出现鼠标指针*/
    cursor: pointer;
  }

  .el-table {
    width: 100%;
  }
</style>
