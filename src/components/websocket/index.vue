<template>
    <div class="online-question">
      <el-card class="box-card" style="width: 400px;height: 500px; ">
        <div slot="header" class="clearfix">
          <span>在线咨询</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="clowsQuestion">关闭</el-button>
        </div>
        <div style="overflow-y:auto;height:330px;">
           <ul style="list-style-type: none; padding: 0px; margin: 0px;">
            <li v-for="question in questions"  :key="question">
              {{ question}}
            </li>
          </ul>
        </div>
        <div>{{questionInfo}}</div>
        <el-input class="question-content" type="textarea" :rows=2 placeholder="请输入问题,按回车进行提问" v-model="questionContent" @keyup.enter.native="addQuestion"></el-input>
      </el-card>
    </div>   
</template>

<script>
export default {
  data () {
    return {
      questionContent: '',
      questions: [],
      websocket: null,
      questionInfo: '',
      wsMessage: {
        type: '',
        message: '',
        sid: ''
      }
    }
  },
  activated () {
    this.initWebsocket()
  },
  destroyed () {
    this.websocket.close()
  },
  methods: {
    // 增加问题
    addQuestion () {
      if (this.questionContent.trim().length < 5) {
        this.questionInfo = '请输入超过5个字符'
        return
      }
      this.questions.push('提问：' + this.questionContent)
      this.wsMessage.type = 'QUESTION'
      this.wsMessage.message = this.questionContent
      this.wsMessage.sid = this.$store.state.user.name
      this.websocket.send(JSON.stringify(this.wsMessage))
      this.questionContent = ''
      this.questionInfo = ''
    },
    // 关闭在线问答模块
    clowsQuestion () {
      // this.questionVisible = false
    },
    // 建立websocket连接
    initWebsocket () {
      var _this = this
      if ('WebSocket' in window) {
        _this.websocket = new WebSocket('ws://localhost:8081/renren-fast/clientwebsocket/' + this.$store.state.user.name)
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
        debugger
        console.log('收到消息:' + event.data)
        _this.questions.push('回答：' + event.data)
      }
      _this.websocket.onerror = function (event) {
        console.log('websocket出错')
      }
    }
  }
}
</script>

<style>
.question-content{
    position: absolute;
    bottom: 20px;
    right: 15px;
    width: 90%;
}
</style>

