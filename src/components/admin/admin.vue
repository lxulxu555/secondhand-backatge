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

  </div>
</template>

<script>
  export default {
    name: "admin",
    data(){
      return{
        AllAdmin: [],
        page:1,
        total:0,
      }
    },
    methods:{
      getAdmin(page){
        this.http.get('user/findAll', {page, rows: 8,admin:'admin'}).then(res => {
          this.AllAdmin = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage){
        this.page = currentPage;
        this.getAdmin(this.page) //点击第几页
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
