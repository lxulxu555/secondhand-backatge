<template>
  <div>
    <el-table :data="AllUser" style="width: 100%">
      <el-table-column label="帖子标题" prop="name"> </el-table-column>

      <el-table-column label="介绍" prop="intro"> </el-table-column>

      <el-table-column label="微信" prop="weixin"> </el-table-column>

      <el-table-column label="封面图片" prop="images">
        <template slot-scope="scope">
          <img :src="scope.row.images[0]" style="width:50px;height:50px" />
        </template>
      </el-table-column>

      <el-table-column label="用户昵称" width="180">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.user.nickname }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="approve(scope.row)">
            通过
          </el-button>
          <el-button size="mini" type="danger" @click="deny(scope.row)"
            >拒绝
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
import { getAllJob,UpdateJob } from "../../api";

export default {
  name: "user",
  data() {
    return {
      AllUser: [],
      page: 1,
      total: 0,
      formLabelWidth: "100px"
    };
  },
  methods: {
    async getAllUser(page) {
      const result = await getAllJob({ page, rows: 8, status: 1 }, "get");
      result.data.forEach(item => {
        item.images !== null
          ? (item.images = item.images.split(","))
          : (item.images = []);
      });
      this.AllUser = result.data;
      this.page = page;
      this.total = result.total;
    },

    CurrentChange(currentPage) {
      this.page = currentPage;
      this.getAllUser(this.page); //点击第几页
    },


    async approve(item) {
      await UpdateJob({id:item.id,status:0},'put')
       this.getAllUser(this.page); //点击第几页
    },

     async deny(item) {
       await UpdateJob({id:item.id,status:2},'put')
       this.getAllUser(this.page); //点击第几页
    },

  },

  mounted() {
    this.getAllUser(this.page);
  }
};
</script>

<style scoped>
.el-pagination {
  position: fixed;
  bottom: 30px;
  left: 50%;
}
</style>
