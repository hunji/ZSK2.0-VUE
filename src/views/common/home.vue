<template>
  <div class="mod-home">
    <h3>在线问答</h3>
    <wechat @getHistory='getHistory'></wechat>
     
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="content" header-align="center" align="center"  label="内容">
              <template slot-scope="scope">
                <div class="text" v-html="scope.row.content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="userName" header-align="center" align="center"  label="发起人" width="180"></el-table-column>
            <el-table-column prop="sid" header-align="center" align="center"  label="接收人" width="180"></el-table-column>
            <el-table-column prop="createDate" header-align="center" align="center"  label="创建时间" width="180"></el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
  </div>
</template>

<script>
import wechat from '@/components/websocket/wechat'
export default {
  components: {
    wechat
  },
  data () {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      userName: '',
      SID: '',
      dataListLoading: false
    }
  },
  activated () {
    // this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/question/chatContent'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          userName: this.userName,
          SID: this.SID
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    getHistory (userName, currentsid) {
      this.userName = userName
      this.SID = currentsid
      this.getDataList()
    }
  }
}
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

