
<template>
    <div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-button v-if="isAuth('knowledge:type:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table border :data="dataList" v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="id" header-align="center" align="center" width="50" label="编号"></el-table-column>
            <table-tree-column prop="typeName" header-align="center" align="center"  label="类型名称"></table-tree-column>
            <el-table-column prop="description" header-align="center" align="center"  label="描述"></el-table-column>
            <el-table-column header-align="center" align="center"  label="操作">
                <template slot-scope="scope">
                    <el-button  v-if="isAuth('knowledge:type:update')" type="text" size="small" @click.native="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button  v-if="isAuth('knowledge:type:delete')" type="text" size="small" @click.native="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="AddOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './knowledgetype-add-or-update'
import TableTreeColumn from '@/components/table-tree-column'
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    TableTreeColumn,
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/type/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'id')
        this.dataListLoading = false
      })
    },
    // 新增和修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.AddOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/knowledge/type/delete/${id}`),
          method: 'post',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
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
