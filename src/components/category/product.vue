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
  import {getAllProduct} from '../../api'
  import {deleteMessage} from '../../util/PublicFunction'

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
      async getAllProduct(page) {
        const result = await getAllProduct({page, rows: 8}, 'get')
        this.AllProduct = result.data
        this.page = page
        this.total = result.total
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getAllProduct(this.page) //点击第几页
      },


      async DeleteProduct(item) {
        const result = await deleteMessage(item.id,'product')
        if(result.code === 0){
          this.getAllProduct(this.page)
        }
      },

      UpdateProduct(item) {
        this.$router.push({path: '/product/update', query: {product: item}})
      }

    },

    mounted() {
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
