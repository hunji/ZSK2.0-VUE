<template>
    <div>
        <el-form :inline="true" @keyup.enter.native="getDataList()">
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="userName" header-align="center" align="center"  label="查询人名称"></el-table-column>
            <el-table-column prop="useDate" header-align="center" align="center"  label="查询时间"></el-table-column>
            <el-table-column prop="useContent" header-align="center" align="center"  label="查询内容"></el-table-column>
            <el-table-column prop="flowsn" header-align="center" align="center"  label="flowsn"></el-table-column>
            <el-table-column prop="flowName" header-align="center" align="center"  label="流程名称"></el-table-column>
            <el-table-column prop="stepName" header-align="center" align="center"  label="环节名称"></el-table-column>
            <el-table-column prop="otherInfo" header-align="center" align="center"  label="其他信息"></el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
export default {
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
        url: this.$http.adornUrl('/knowledge/history/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize
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
    }
  }
}
</script>

