<template>
  <div class="list">
    <ul>
      <li class="active">
        <img class="avatar" width="30" height="30" src="~@/assets/img/1.jpg"> 
        <el-badge value="new" >
          <p class="name">hunji</p>
        </el-badge>
      </li>
      <li>
        <img class="avatar" width="30" height="30" src="~@/assets/img/1.jpg">
        <p class="name">gwy</p>
      </li>
    </ul>
  </div>
</template>
<style>
.list li {
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
</style>

