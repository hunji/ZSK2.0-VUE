<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="3">
                运维人员在线数：{{adminCount}}
                <ul>
                  <li v-for="admin in adminList" :key="admin">
                    {{admin}}
                  </li>
                </ul>
        </el-col>
        <el-col :span="3">
          游客在线数：{{guestCount}}
          <ul>
            <li v-for="guest in guestList" :key="guest">
              {{guest}}
            </li>
          </ul>
        </el-col>
              
        <el-col :span="18">
          {{guestMessage}}
        </el-col>
      </el-row>
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
export default {
  data () {
    return {
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      guestCount: 0,
      guestList: [],
      adminCount: 0,
      adminList: [],
      guestMessage: ''
    }
  },
  activated () {
    this.getDataList()
  },
  mounted () {
    // 增加了websocket连接
    this.initWebsocket()
  },
  destroyed () {
    this.websocket.close()
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
          this.guestCount = data.qData.guestCount
          this.adminCount = data.qData.adminCount
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
    // 建立websocket连接
    initWebsocket () {
      var _this = this
      if ('WebSocket' in window) {
        _this.websocket = new WebSocket('ws://localhost:8081/renren-fast/adminwebsocket/' + this.$store.state.user.name)
      } else {
        alert('该浏览器不支持websocket!')
      }
      _this.websocket.onopen = function (event) {
        console.log('建立连接')
      }
      _this.websocket.onclose = function (evnet) {
        console.log('关闭连接')
      }
      _this.websocket.onmessage = function (event) {
        let message = JSON.parse(event.data)
        if (message.type === 'ADDUSER') {
          _this.guestCount = message.guestCount
          _this.adminCount = message.adminCount
          _this.guestList = message.guestList
          _this.adminList = message.adminList
          _this.$notify({
            message: '有新用户登录',
            position: 'bottom-right'
          })
        } else if (message.type === 'QUIT') {
          _this.guestCount = message.guestCount
          _this.adminCount = message.adminCount
          _this.guestList = message.guestList
          _this.adminList = message.adminList
          _this.$notify({
            message: '有用户退出',
            position: 'bottom-right'
          })
        } else if (message.type === 'QUESTION') {
          _this.guestMessage += message.sid + ':' + message.message
        }
        console.log('收到消息:' + event.data)
        // _this.questions.push('回答：' + event.data)
      }
      _this.websocket.onerror = function (event) {
        console.log('websocket出错')
      }
    }
  }
}
</script>
