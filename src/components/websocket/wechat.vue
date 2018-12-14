<template>
<div id="imChat">
  <div class="sidebar">
    <div class="card">
      <header>
        <img src="~@/assets/img/avatar.png" class="avatar" width="40" height="40">
       <p class="name">{{userName}}</p>
      </header>
      <footer>
        <input class="search" type="text" placeholder="search user...">
      </footer>
    </div>
    <div class="list">
      <ul>
        <li v-for="guest in guestNames" :key="guest.userName" :class="{ active: guest.userName === currentsid }" 
          @click="clickUser(guest.userName)">
          <!-- v-if  v-else 此处设置了是否在线的样式-->
          <img v-if="guest.isOnline" class="avatar" width="30" height="30" src="~@/assets/img/1.jpg">
          <img v-else class="avatar" width="30" height="30" src="~@/assets/img/2.jpg"> 
          <!-- v-if  v-else 此处设置了是否有新消息的样式-->
          <el-badge value="new" class="item" v-if="guest.hasNewInfo">
            <p class="name">{{guest.userName}}</p>
          </el-badge>
          <p class="name" v-else>{{guest.userName}}</p>
        </li>
      </ul>
    </div>
  </div>
  <div class="main">
    <div class="message" id="message">
      <ul>
        <li v-for="message in currentMessages" :key="message.id">
          <p class="time">
            <span>{{message.createDate}}</span>
          </p>
          <div class="main" :class="{ self: message.userName !==userName }">
            <img v-if="message.userName ===userName" class="avatar" width="30" height="30" src="~@/assets/img/avatar.png">
            <img v-else class="avatar" width="30" height="30" src="~@/assets/img/1.jpg"> 
            <div class="text" v-html="message.content">{{message.content}}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- TODO:如果增加上传图片和查看历史记录功能的话 -->
    <div style="border-top:1px solid #aaa;width:100%;height:30px;">
      <icon-svg style="margin:5px;float:right;cursor: pointer;fill:black;" name="time"></icon-svg>
      <icon-svg style="margin-left:10px;margin-top:5px;float:left;cursor: pointer;fill:black;" name="image"></icon-svg>
    </div>
    <div class="content">
      <el-input rows="7" type="textarea" placeholder="按 Ctrl + Enter 发送" v-model="chatContent" @keyup.native="addContent"></el-input>
    </div>
    <audio src="/static/video/msg.wav" id="notice"></audio>
  </div>
</div>
</template>
<script>
export default {
  name: 'wechat',
  data () {
    return {
      userName: '',
      guestNames: [],
      currentsid: '',
      currentMessages: [],
      chatContent: '<img class="avatar" width="30" height="30" src="~@/assets/img/1.jpg">',
      websocket: null,
      isguest: false
    }
  },
  activated () {
    // 在初始化的时候获取到当前的用户
    this.userName = this.$store.state.user.name

    // 先获取用户的角色信息，来判断当前用户是否是guest，根据此来获取用户列表
    this.getUserRoleInfo()
  },
  mounted () {
    // 增加了websocket连接
    this.initWebsocket()
  },
  updated () {
    var container = this.$el.querySelector('#message')
    container.scrollTop = container.scrollHeight
  },
  destroyed () {
    this.websocket.close()
  },
  methods: {
    // 建立websocket连接
    initWebsocket () {
      var _this = this
      if ('WebSocket' in window) {
        _this.websocket = new WebSocket('ws://localhost:8081/renren-fast/websocket/' + this.$store.state.user.name)
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
        console.log('收到消息' + event.data)
        // 后台发送过来的信息用WsMessage包装
        let message = JSON.parse(event.data)
        if (message.type === 'ADDUSER') {
          for (let element of _this.guestNames) {
            if (element.userName === message.sid) {
              element.isOnline = true
            }
          }
        } else if (message.type === 'QUIT') {
          for (let element of _this.guestNames) {
            if (element.userName === message.sid) {
              element.isOnline = false
            }
          }
        } else if (message.type === 'CONTENT') {
          // 提示音
          _this.$el.querySelector('#notice').play()
          if (message.userName === _this.currentsid) {
            _this.currentMessages.push(message)
          }
          // 更新用户展示状态，当不是当前选中项且有新消息传来时显示新的样式
          for (let element of _this.guestNames) {
            if (element.userName === message.userName && _this.currentsid !== message.userName) {
              element.hasNewInfo = true
            }
          }
        }
      }
      _this.websocket.onerror = function (event) {
        console.log('websocket出错')
      }
    },
    // 点击用户名时获取聊天记录
    clickUser (guest) {
      this.currentsid = guest
      this.getUserHistory()
      // 修改标识是否有新消息的样式
      for (let element of this.guestNames) {
        if (element.userName === this.currentsid) {
          element.hasNewInfo = false
        }
      }
    },
    // 获取当前用户的角色列表
    getUserRoleInfo () {
      this.$http({
        url: this.$http.adornUrl(`/knowledge/question/roleInfo/${this.userName}`),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.isguest = data.isGuest
          console.log(data.isGuest)
          console.log(this.isguest)
        }
      }).then(this.getUserList)
    },
    // 获取用户列表
    getUserList () {
      let tempUrl = ''
      if (!this.isguest) {
        tempUrl = 'guestNames'
      } else {
        tempUrl = 'adminNames'
      }
      this.$http({
        url: this.$http.adornUrl(`/knowledge/question/${tempUrl}`),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.guestNames = data.data
          if (this.guestNames.length > 0) {
            this.currentsid = this.guestNames[0].userName
            this.getUserHistory()
          }
        }
      })
    },
    // 获取当前用户的聊天记录
    getUserHistory () {
      console.log(this.currentsid)
      this.$http({
        url: this.$http.adornUrl('/knowledge/question/chatContent'),
        method: 'get',
        params: this.$http.adornParams({
          userName: this.userName,
          SID: this.currentsid
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data)
          this.currentMessages = data.contentList
        }
      })
    },
    // 发送交谈内容
    addContent (e) {
      if (e.ctrlKey && e.keyCode === 13 && this.chatContent.length) {
        let wsMessage = {
          userName: '',
          content: '',
          sid: '',
          type: ''
        }
        wsMessage.userName = this.userName
        wsMessage.content = this.chatContent
        wsMessage.sid = this.currentsid
        wsMessage.type = 'CONTENT'
        this.currentMessages.push(wsMessage)
        this.chatContent = ''
        // 后台去请求数据记录到数据库中
        this.$http({
          url: this.$http.adornUrl(`/knowledge/question/save`),
          method: 'post',
          data: this.$http.adornData({
            'content': wsMessage.content,
            'sid': wsMessage.sid,
            'userName': wsMessage.userName
          })
        })
        // 通知给后台
        console.log('发送消息:' + JSON.stringify(wsMessage))
        this.websocket.send(JSON.stringify(wsMessage))
      }
    }
  }
}
</script>
<style>
#imChat {
  margin: 20px auto;
  width: 800px;
  height: 600px;
  overflow: hidden;
  border-radius: 3px;
  border:3px solid #263238;
}
#imChat .sidebar,
#imChat .main {
  height: 100%;
}
#imChat .sidebar {
  float: left;
  width: 200px;
  color: #f4f4f4;
  background-color: #2e3238;
}
#imChat .main {
  position: relative;
  overflow: hidden;
  background-color: #eee;
}
#imChat .content {
  /* position: absolute; */
  width: 100%;
  bottom: 0;
  left: 0;
}
#imChat .message {
  height: calc(100% - 180px);
}
img{
  width: 30px;
  height: 30px;
}
ul{
  list-style-type: none; 
  padding: 0px; 
  margin: 0px;
}
.card {
  padding: 12px;
  border-bottom: solid 1px #24272c;
}
.card footer {
  margin-top: 10px;
}
.card .avatar,
.card .name {
  vertical-align: middle;
}
.card .avatar {
  border-radius: 2px;
}
.card .name {
  display: inline-block;
  margin: 0 0 0 15px;
  font-size: 16px;
}
.card .search {
  padding: 0 10px;
  width: 100%;
  font-size: 12px;
  color: #fff;
  height: 30px;
  line-height: 30px;
  border: solid 1px #3a3a3a;
  border-radius: 4px;
  outline: none;
  background-color: #26292e;
}.list li {
  padding: 12px 15px;
  border-bottom: 1px solid #292c33;
  cursor: pointer;
  transition: background-color 0.1s;
}
.list li:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
.list li.active {
  background-color: rgba(255, 255, 255, 0.1);
}
.list .avatar,
.list .name {
  vertical-align: middle;
}
.list .avatar {
  border-radius: 2px;
}
.list .name {
  display: inline-block;
  margin: 0 0 0 15px;
}
.message {
  padding: 10px 15px;
  overflow-y: scroll;
}
.message li {
  margin-bottom: 15px;
}
.message .time {
  margin: 7px 0;
  text-align: center;
}
.message .time > span {
  display: inline-block;
  padding: 0 18px;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
  background-color: #dcdcdc;
}
.message .avatar {
  float: left;
  margin: 0 10px 0 0;
  border-radius: 3px;
}
.message .text {
  display: inline-block;
  position: relative;
  padding: 0 10px;
  max-width: calc(100% - 40px);
  min-height: 30px;
  line-height: 2.5;
  font-size: 12px;
  text-align: left;
  word-break: break-all;
  background-color: #fafafa;
  border-radius: 4px;
}
.message .text:before {
  content: " ";
  position: absolute;
  top: 9px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #fafafa;
}
.message .self {
  text-align: right;
}
.message .self .avatar {
  float: right;
  margin: 0 0 0 10px;
}
.message .self .text {
  background-color: #b2e281;
}
.message .self .text:before {
  right: inherit;
  left: 100%;
  border-right-color: transparent;
  border-left-color: #b2e281;
}
.content {
  height: 160px;
  border-top: solid 1px #ddd;
}
icon-svg path:hover {
  cursor: pointer;
  fill: red;
} 
</style>

