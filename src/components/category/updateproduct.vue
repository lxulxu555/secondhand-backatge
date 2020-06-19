<template>
  <div>
    <div class="back" v-if="isDetail === false">
      <div class="el-icon-back" @click="back"/>
    </div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="productInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍">
        <el-input v-model="productInfo.intro" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="productInfo.price1" type="number"></el-input>
      </el-form-item>
      <el-form-item label="是否下架">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeSwitch"
        >
        </el-switch>

      </el-form-item>
      <el-form-item label="选择分类">
        <el-cascader
          v-model="productInfo.classify2_id"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品图片" prop="image">
        <el-upload
          action="http://eurasia.plus:8800/api/upload/image"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="form.imageUrl"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item style="margin-top: -10px">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "updateproduct",
    data() {
      return {
        isDetail: false,
        productInfo: {},
        options: [],
        dialogImageUrl: '',
        dialogVisible: false,
        value: true,
        form: {
          TwoClassId: '',
          imageUrl: []
        }
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },

      getParams() {
        // 取到路由带过来的参数
        const routerQuery = this.$route.query.product
        this.productInfo = routerQuery
        this.value = routerQuery.state !== 0
        const imageData =
          routerQuery.images.toString().split(',').map(item => ({
            name: item,
            url: item
          }))
        this.form.imageUrl = imageData
      },

      getAllClass() {
        this.http.get('classify1/findAll', '', 'get').then(res => {
          const data = res.data.map(item => ({
            value: item.id,
            label: item.name,
            children: item.classify2List.map(item => ({
              value: item.id,
              label: item.name
            }))
          }))
          this.options = data
        })
      },

      handleChange(value) {
        this.form.TwoClassId = value.toString().split(',')[1]
      },

      handleRemove(file, fileList) {
        const url = file.url
        this.http.post('upload/deleteImage', {url}, 'post').then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        this.form.imageUrl = fileList
      },

      handleAvatarSuccess(res, file) {
        const image = ({
          name: file.response.data.thumbnailUrl,
          url: file.response.data.thumbnailUrl
        })
        this.form.imageUrl.push(image)
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      changeSwitch(e) {
        if (e === true) {
          this.productInfo.state = 1
        } else {
          this.productInfo.state = 0
        }
      },

      onSubmit() {
        const ImageData = []
        ImageData.push(this.form.imageUrl.map(item => item.url))
        const images = ImageData.toString()
        const {name, intro, price1, state, classify2_id, id} = this.productInfo
        const twoClassId = this.form.TwoClassId === '' ? classify2_id : this.form.TwoClassId
        this.http.put('goods/update', {name, intro, price1, state, twoClassId, images}, 'put').then(res => {
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
  }
  ,

  created()
  {
    this.getParams()
  }
  ,
  mounted()
  {
    this.getAllClass()
  }
  }
</script>

<style scoped>
  .back {
    position: relative;
    width: 50px;
    height: 50px;
    top: 5px;
    right: 25px;
    z-index: 1;
  }

  .el-icon-back {
    position: absolute;
    font-size: 30px;
    /*出现鼠标指针*/
    cursor: pointer;
  }

  .el-form {
    margin-top: -50px;
  }
</style>
