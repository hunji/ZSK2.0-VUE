import Vue from 'vue'

Vue.directive('scroll-bottom', {
  updated: function (el) {
    console.log(el.scrollTop)
    console.log(el.clientHeight)
    el.scrollTop = el.clientHeight
  }
})
