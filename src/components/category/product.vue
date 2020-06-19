<template>
  <div>
    <el-table
      :data="AllProduct"
      style="width: 100%">
      <el-table-column
        label="商品名"
        prop="name">
      </el-table-column>


      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="UpdateProduct(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="DeleteProduct(scope.row)">删除
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

  </div>
</template>

<script>
  export default {
    name: "product",
    data() {
      return {
        AllProduct: [],
        page: 1,
        total: 0,
      }
    },
    methods: {
      getAllProduct(page) {
        this.http.get('goods/findByPage', {page, rows: 8}, 'get').then(res => {
          this.AllProduct = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getAllProduct(this.page) //点击第几页
      },


      DeleteProduct(item) {
        this.$confirm(`此操作将删除商品${item.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = item.id
          this.http.get('goods/deleteGoods', {id}, 'get').then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.getAllProduct(this.page)
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      UpdateProduct(item){
        this.$router.push({ path: '/product/update', query: { product: item }})
      }

    },

    mounted()
    {
      this.getAllProduct(this.page)
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
