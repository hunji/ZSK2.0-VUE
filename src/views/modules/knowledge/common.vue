
<template>
    <div>
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column type="index" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="typeName" header-align="center" align="center"  label="类型"></el-table-column>
        <el-table-column prop="title" header-align="center" align="center"  label="标题"></el-table-column>
        <el-table-column prop="brief" header-align="center" align="center"  label="简要描述"></el-table-column>
        <el-table-column prop="userName" header-align="center" align="center"  label="提交人"></el-table-column>
        <el-table-column prop="createDate" header-align="center" align="center"  label="创建时间"></el-table-column>
        <el-table-column header-align="center" align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="detailHandle(scope.row.id)">查看详情</el-button>
                    <el-button v-if="isAuth('knowledge:content:sendBack')"  type="text" size="small" @click="sendBackHandle(scope.row.id)">退回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <detail v-if="detailVisible" ref="detail"  @refreshDataList="getDataList"></detail>
    </div>
</template>

<script>
import detail from './detail'
export default {
  data () {
    return {
      dataForm: {
        typeName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      detailVisible: false
    }
  },
  components: {
    detail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/content/common'),
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
    },
    // 新增和修改
    detailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
    },
    sendBackHandle (id) {
      this.$confirm(`确定['退回']操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/knowledge/content/sendBack/${id}`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
