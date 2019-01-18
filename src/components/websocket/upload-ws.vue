<template>
  <el-dialog
    title="上传文件"
    :close-on-click-modal="true"
    @close="closeHandle"
    :visible.sync="visible">
    <el-upload
      :action="url"
      list-type="picture"
      :on-success="successHandle"
      :file-list="fileList"
      style="text-align: center;">
      <!-- <i class="el-icon-upload"></i> -->
      <el-button size="small" type="primary">点击上传</el-button>
      <div class="el-upload__tip" slot="tip">支持jpg、png、gif格式的图片,以及其他类型的文件！</div>
    </el-upload>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        url: '',
        num: 0,
        successNum: 0,
        imgUrl: window.SITE_CONFIG['ossftpurl']
      }
    },
    methods: {
      init (id) {
        this.url = window.SITE_CONFIG.baseUrl + `/sys/oss/upload?token=${this.$cookie.get('token')}`
        this.visible = true
        this.fileList = []
      },
      // // 上传之前
      // beforeUploadHandle (file) {
      //   if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
      //     this.$message.error('只支持jpg、png、gif格式的图片！')
      //     return false
      //   }
      //   this.num++
      // },
      // 上传成功
      successHandle (response, file, fileList) {
        this.fileList = fileList
        this.successNum++
        if (response && response.code === 0) {
          if (this.num === this.successNum) {
            this.$confirm('操作成功, 是否继续操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(() => {
              this.visible = false
            })
          }
        } else {
          this.$message.error(response.msg)
        }
      },
      // 弹窗关闭时
      closeHandle () {
        debugger
        // 有文件上传了的时候把这些文件地址返回给填写内容
        if (this.fileList.length > 0) {
          let returnData = this.fileList.map(item => {
            return this.imgUrl + item.response.url
          })
          this.$emit('addImgPathToContent', returnData)
        }
        this.fileList = []
      }
    }
  }
</script>
