<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style>
/* 这里加了样式解决表格边框对不齐的问题 */
body .el-table th.gutter{
    display: table-cell!important;
}
</style>


