<template>
  <div class="card">
    <header>
      <img src="~@/assets/img/1.jpg" class="avatar" width="40" height="40">
      <p class="name">username</p>
    </header>
    <footer>
      <input class="search" type="text" placeholder="search user...">
    </footer>
  </div>
</template>

<style>
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
}
</style>
