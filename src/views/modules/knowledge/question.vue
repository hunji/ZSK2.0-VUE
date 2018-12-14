<template>
    <div>
        <wechat></wechat>
     
        <el-form :inline="true" @keyup.enter.native="getDataList()">
          <el-form-item>
            
          </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="content" header-align="center" align="center"  label="内容"></el-table-column>
            <el-table-column prop="sid" header-align="center" align="center"  label="长连接SID"></el-table-column>
            <el-table-column prop="userName" header-align="center" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="createDate" header-align="center" align="center"  label="创建时间"></el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<style>

</style>

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
      dataListLoading: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/question/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.qData.page.list
          this.totalPage = data.qData.page.totalCount
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
    }
  }
}
</script>