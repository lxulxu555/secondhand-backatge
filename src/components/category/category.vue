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
          <el-button type="primary" @click="ClickUpdateClass('add')">添加分类</el-button>
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
            @click="DeleteClass(scope.row)"
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

    <el-dialog title="修改分类" :visible.sync="UpdateOneClass" :before-close="closeExpertFormDialog">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.className" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" :label-width="formLabelWidth" prop="image">
          <el-upload
            class="avatar-uploader"
            action="http://eurasia.plus:8800/api/upload/image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExpertFormDialog">取 消</el-button>
        <el-button type="primary" @click="SendUpdateName">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getOneClass, UpdateOneClass, AddOneClass, UpdateTwoClass, AddTwoClass, FindChildClassById} from '../../api'
  import {deleteMessage} from '../../util/PublicFunction'

  export default {
    name: "category",
    data() {
      return {
        Class: [],
        TwoClass: [],
        pagesize: 8,    //    每页的数据　　
        currentPage: 1, //初始页
        TwoPage: 1,
        UpdateOneClass: false,
        form: {
          className: '',
          imageUrl: ''
        },
        formLabelWidth: '100px',
        OneClassId: '',
        isOne: true,
        type: '',
        oneClassId: '',
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
      async getClass() {
        const result = await getOneClass('', 'get')
        this.Class = result
        this.isOne = true
      },

      CurrentChange(currentPage) {
        this.currentPage = currentPage;
      },

      CurrentTwoChange(currentPage) {
        this.TwoPage = currentPage
      },

      ClickUpdateClass(item) {
        this.UpdateOneClass = true
        this.type = item
        this.OneClassId = item.id
        this.form.className = item.name
        this.form.imageUrl = item.image
      },

      async SendUpdateName() {
        this.UpdateOneClass = false
        const {isOne, type} = this
        const id = this.OneClassId
        const name = this.form.className
        const image = this.form.imageUrl
        if (isOne === true) {
          if (type !== 'add') {
            const UpdateOne = await UpdateOneClass({id, name, image}, 'put')
            if (UpdateOne.code === 0) {
              this.getClass()
            }
          } else {
            const AddOne = await AddOneClass({name, image}, 'post')
            if (AddOne.code === 0) {
              this.getClass()
            }
          }
        } else {
          const classify1id = this.oneClassId
          if (type !== 'add') {
            const UpdateTwo = UpdateTwoClass({id, name, classify1id, image}, 'put')
            if (UpdateTwo.code === 0) {
              this.GetTwoDetail(classify1id)
            }
          } else {
            const AddTwo = AddTwoClass({name, classify1id, image}, 'post')
            if (AddTwo.code === 0) {
              this.GetTwoDetail(classify1id)
            }
          }
        }
      },

      back() {
        this.isOne = true
        this.TwoClass = []
      },

      async GetTwoDetail(item) {
        this.oneClassId = !item.id ? item : item.id
        const result = await FindChildClassById
        this.TwoClass = result
        this.isOne = false
      },

      async DeleteClass(item) {
        const isOne = this.isOne
        if (isOne === true) {
          const deleteOne = await deleteMessage(item.id, 'oneClass')
          if (deleteOne.code === 0) {
            this.getClass(this.page) //点击第几页
          }
        } else {
          const deleteTwo = deleteMessage(item.id, 'twoClass')
          if (deleteTwo.code === 0) {
            this.GetTwoDetail(this.oneClassId) //点击第几页
          }
        }
      },

      handleAvatarSuccess(res, file) {
        this.form.imageUrl = file.response.data.thumbnailUrl
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //关闭dialog前
      closeExpertFormDialog(done) {
        this.form.imageUrl = ''
        this.UpdateOneClass = false
        done();//done 用于关闭 Dialog
      },
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
