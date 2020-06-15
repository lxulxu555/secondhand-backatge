<template>
  <div>
    <el-table
      :data="AllJurisdiction"
      style="width: 100%">
      <el-table-column
        label="权限内容"
        prop="name">
      </el-table-column>

      <el-table-column
        label="权限接口"
        prop="url">
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
  import {mapState} from 'vuex';

  export default {
    name: "jurisdiction",
    data() {
      return {
        AllJurisdiction: [],
        page: 1,
        total: 0,
      }
    },
    methods: {
      getJurisdiction(page) {
        this.http.get('token/permission/findByPage', {page, rows: 8}).then(res => {
          this.AllJurisdiction = res.data.data
          this.page = page
          this.total = res.data.total
        })
      },

      CurrentChange(currentPage) {
        this.page = currentPage;
        this.getJurisdiction(this.page) //点击第几页
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
