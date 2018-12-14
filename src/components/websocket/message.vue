<template>
  <div>
    <div class="message">
      <ul>
        <li>
          <p class="time">
            <span>13:07</span>
          </p>
          <div class="main">
            <img class="avatar" width="30" height="30" src="~@/assets/img/1.jpg">
            <div class="text">提出的问题111111111</div>
          </div>
        </li>
        <li>
          <p class="time">
            <span>13:07</span>
          </p>
          <div class="main self">
            <img class="avatar" width="30" height="30" src="~@/assets/img/1.jpg">
            <div class="text">提出的问题222222</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="content">
      <textarea placeholder="按 Ctrl + Enter 发送">123456</textarea>
    </div>
  </div>
</template>
<style>
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
.content textarea {
  padding: 10px;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  font-family: "Micrsofot Yahei";
  resize: none;
}
</style>