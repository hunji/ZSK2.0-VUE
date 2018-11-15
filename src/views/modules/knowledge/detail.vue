<template>
  <el-dialog width="70%" :title=" '内容详情'" :close-on-click-modal="false" :visible.sync="visible" >
      <el-tabs tab-position="left" value="first">
      <el-tab-pane label="知识内容" name="first" v-loading="dataLoading">
        <div style="display:table;margin:0 auto;width:85%">
          <div ><h2>{{dataForm.title}}</h2></div>
          <div class="meta">
            ({{ dataForm.userName }})
            <icon-svg name="time"></icon-svg><span>创建时间 {{ dataForm.createDate | formatDate}}</span>
            <icon-svg name="time"></icon-svg> <span>发布时间 {{ dataForm.reviewDate | formatDate}}</span>
            <span style="margin-left:300px;">点赞数 {{ dataForm.likeNum }}</span>
            <a style="margin-left:20px;"  href="#" @click="open(dataForm.id)"><icon-svg name="dianzan"></icon-svg></a>
          </div>
          <div class="content">  简要描述：{{ dataForm.brief }} </div>
          <span v-html="dataForm.content"></span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资料" name="second">
        资料列表：
        <ul>
          <template v-for="file in fileList" >
            <li :key="file.id" style="margin:5px;">
              <a :href="imgUrl+file.url" target="_blank">{{file.name}}</a>
            </li>
          </template>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { formatDate } from '@/utils/validate'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        content: '',
        title: '',
        typeId: '',
        createDate: '',
        reviewDate: '',
        state: '',
        brief: '',
        userName: ''
      },
      fileList: [],
      imgUrl: window.SITE_CONFIG['ossftpurl'],
      dataLoading: false
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.dataLoading = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/knowledge/content/info/${this.dataForm.id}`),
            method: 'get'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.knowledgeContent
            }
            this.dataLoading = false
          })
        }
      })
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/sys/oss/list'),
            mehtod: 'get',
            params: this.$http.adornParams({
              page: 1,
              limit: 100,
              contentID: this.dataForm.id
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.fileList = data.page.list
            }
          })
        }
      })
    },
    open (id) {
      this.$http({
        url: this.$http.adornUrl(`/knowledge/content/search/addLikeSum/${this.dataForm.id}`),
        method: 'post',
        data: this.$http.adornData()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '点赞成功',
            type: 'success'
          })
          this.init(id)
        }
      })
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>

<style>
.meta{
  margin: -5px 5px 20px 10px;
  font-size: .85em;
  color: #828282;
}
.content{
  margin: 10px;
}
</style>