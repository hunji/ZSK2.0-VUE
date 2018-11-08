<template>
  <el-dialog  :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" top="30px">
    

    <el-tabs tab-position="left" value="first">
      <el-tab-pane label="知识内容" name="first">
        <el-form class="rform" :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
          <el-form-item label="类型" prop="typeId">
            <el-select v-model="dataForm.typeId" placeholder="请选择">
            <el-option
            v-for="item in knowledgeTypes"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label="简要描述" prop="brief">
            <el-input v-model="dataForm.brief" placeholder="简要描述"></el-input>
          </el-form-item>
          <el-form-item label="详情" prop="content">
          <!-- <el-input v-model="dataForm.content" placeholder="详情"></el-input> -->
          <div class="quill-wrap">
            <quill-editor class="quill-editor"
              v-model="dataForm.content"
              ref="QuillEditor"
              :options="editorOption">
            </quill-editor>
          </div>
          </el-form-item>
          </el-form>
      </el-tab-pane>
      <el-tab-pane label="资料" name="second">
        <el-upload class="upload-demo" multiple  
          :action="uploadUrl"
          :on-success="handleAvatarSuccess"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-remove="handleRemove"
          :file-list="fileList">
          <el-button size="small" v-show="btnShow" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传文件，且不超过50Mb</div>
        </el-upload>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)

export default{
  components: {
    quillEditor
  },
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        typeId: '',
        title: '',
        brief: '',
        content: ''
      },
      knowledgeTypes: [],
      dataRule: {
        typeId: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      },
      uploadUrl: this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`, false),
      imgUrl: window.SITE_CONFIG['ossftpurl'],
      fileList: [],
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'file',
            action: this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`, false),
            response: (res) => {
              return this.imgUrl + res.url
            }
          },
          toolbar: {
            container: container,
            handlers: {
              'image': function () {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      }
    }
  },
  computed: {
    btnShow: function () {
      return this.dataForm.id !== 0
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/type/allInfobuttheme'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.knowledgeTypes = data.allTypes
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/knowledge/content/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.typeId = data.knowledgeContent.typeId
              this.dataForm.title = data.knowledgeContent.title
              this.dataForm.brief = data.knowledgeContent.brief
              this.dataForm.content = data.knowledgeContent.content
            }
          })
        }
      })
      this.getFiles()
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/knowledge/content/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'typeId': this.dataForm.typeId,
              'title': this.dataForm.title,
              'brief': this.dataForm.brief,
              'content': this.dataForm.content
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 获取文件
    getFiles () {
      this.$http({
        url: this.$http.adornUrl('/sys/oss/list'),
        mehtod: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 100,
          contentID: this.dataForm.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.fileList = data.page.list
        } else {
          this.fileList = []
        }
      })
    },
    // 上传成功后的调用函数
    handleAvatarSuccess (res, file) {
      console.log(res.url)
      // 更新文件的contentID值为当前id
      this.$http({
        url: this.$http.adornUrl('/sys/oss/uploadFileUpdate'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.dataForm.id,
          url: res.url
        })
      }).then(data => {
        this.getFiles()
      })
    },
    // 点击文件时调用的函数
    handlePreview (file) {
      this.$http({
        url: this.$http.adornUrl(`/sys/oss/download/${file.id}`),
        responseType: 'blob',
        method: 'get',
        params: this.$http.adornParams(false)
      }).then(data => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let head = data.headers['content-disposition']
        let fname = 'file'
        if (head) {
          fname = decodeURI(head.split(';')[1].split('=')[1])
        }
        link.setAttribute('download', fname)
        document.body.appendChild(link)
        link.click()
      })
    },
    // 删除前的函数
    beforeRemove (file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}?`)
      }
    },
    // 删除调用函数
    handleRemove (file, fileList) {
      this.$http({
        url: this.$http.adornUrl(`/sys/oss/delete/${file.id}`),
        method: 'post'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.getFiles()
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style>
.quill-editor {
  height: 255px;
}

.rform{
  overflow-y: auto;
}
</style>