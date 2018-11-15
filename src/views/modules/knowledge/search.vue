<template>
<div>
  <el-form :inline="true" :model="dataForm" >
    <el-form-item style="margin-top:20px;">
      <!--从后台查询出来关联词有个bug  必须要按回车键才能进行使用；这里去掉了-->
      <!--<el-select style="width:500px;" v-model="dataForm.key" filterable remote reserve-keyword allow-create default-first-option
              placeholder="关键字" clearable :remote-method="remoteMethod" :loading="loading" @change="getDataListForButton()">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->

      <el-input v-model="dataForm.key" style="width:400px;" placeholder="关键字" clearable></el-input>
    </el-form-item>
    <el-form-item  style="margin-top:20px;">
      <el-button @click="getDataListForButton()">查询</el-button>
    </el-form-item>
  </el-form>
  <div id="searchInfo">
    <span style="float: left;margin-left: 15px;"></span>
    <span>知识库全文检索功能，找到相关内容<b id="CountOfResults">{{eshits}}</b>篇，用时{{estook}}毫秒</span>
  </div>
  <el-row :gutter="20">
   <el-col :span="18">
      <div >
      <div >
        <transition :name="transition">
          <div class="news-list">
            <transition-group tag="ul" name="item">
              <div v-for="item in dataList" :key="item.id" :item="item" class="item-view" v-if="item">
                <div class="news-item">
                    <span class="score">{{ item.likeNum }}</span>
                    <div class="title">
                        <a @click="detailHandle(item.id)">{{ item.title }}</a>
                        
                    </div>
                    <div>
                        <a @click="detailHandle(item.id)">{{ item.brief }}</a>
                    </div>
                    <span class="meta">
                        <span class="time">
                          ({{ item.userName }})
                          <icon-svg name="time"></icon-svg>  {{ item.reviewDate }}
                          <icon-svg name="view"></icon-svg>  {{ item.viewNum }}
                        </span>
                    </span> 
                </div>
              </div>
            </transition-group>
          </div>
        </transition>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <detail-show v-if="detailVisible" ref="DetailShow" @refreshDataList="getDataList"></detail-show>
      </div>
    </div>
   </el-col>
   <el-col :span="6" style="border-left: 1px solid #ccc;">
    <div class="sideRightWidget" style="margin-top:100px">
      <b>按浏览数筛选</b><br>
      <div class="index_tab">
        <a href="#" :key="item" v-for="(item,index) in viewList" :class="{tab_selected:item===dataForm.viewCount}" 
        @click="changeView(item)"> 
          <template v-if="index === 0">全部</template>
          <template v-else>{{item}}次以上</template>
        </a>
      </div>
    </div>

    <div class="sideRightWidget">
      <b>按推荐数筛选</b><br>
      <div class="index_tab">
        <a href="#" :key="item" v-for="(item,index) in dianzanList" :class="{tab_selected:item===dataForm.dianzanCount}" 
        @click="changeDianzan(item)"> 
          <template v-if="index === 0">全部</template>
          <template v-else>{{item}}次以上</template>
        </a>
      </div>
    </div>

    <div class="sideRightWidget">
    <b>按时间筛选</b><br>
    <div class="index_tab">
       <a href="#" :key="item" v-for="(item,index) in dateRangeList" :class="{tab_selected:item===dataForm.dateRange}" 
        @click="changeDateRange(item)"> 
          <template v-if="index === 0">全部</template>
          <template v-else>{{item}}</template>
        </a>
    </div>  
    <p></p>
    </div>
   </el-col>
</el-row>
<detail v-if="detailVisible" ref="detail"  @refreshDataList="getDataList"></detail>
</div>
</template>

<script>
import detail from './detail'
export default {
  data () {
    return {
      dataForm: {
        key: '',
        dianzanCount: 0,
        viewCount: 0,
        dateRange: '全部'
      },
      dataList: [],
      dianzanList: [0, 2, 10, 100],
      viewList: [0, 200, 500, 1000],
      dateRangeList: ['全部', '一周内', '一月内', '三月内', '一年内'],
      estook: '',
      eshits: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      detailVisible: false,
      options: [],
      loading: false,
      transition: 'slide-right'
    }
  },
  components: {
    detail
  },
  mounted () {
    // this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/knowledge/content/search'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          dianzanCount: this.dataForm.dianzanCount,
          viewCount: this.dataForm.viewCount,
          dateRange: this.dataForm.dateRange
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.esData.page.list
          this.totalPage = data.esData.page.totalCount
          this.estook = data.esData.took
          this.eshits = data.esData.totalHits
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    getDataListForButton () {
      this.pageIndex = 1
      this.getDataList()
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
    // 详情
    detailHandle (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
    },
    // 去后台查找title；列表
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
      }
      setTimeout(() => {
        this.loading = false
        this.options = this.$http({
          url: this.$http.adornUrl(`/knowledge/content/search/titleForRemote/${query}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.options = data.titleList.map(item => {
              return {value: item, label: item}
            })
          } else {
            console.log(query)
            this.options = [query]
          }
        })
      }, 200)
    },
    // 点击点赞数的方法
    changeDianzan (item) {
      this.pageIndex = 1
      this.dataForm.dianzanCount = item
      this.getDataList()
    },
    // 点击浏览数的方法
    changeView (item) {
      this.pageIndex = 1
      this.dataForm.viewCount = item
      this.getDataList()
    },
    // 点击时间段的方法
    changeDateRange (item) {
      this.pageIndex = 1
      this.dataForm.dateRange = item
      this.getDataList()
    }
  }
}
</script>

<style>
.news-list{
    background-color:#fff;
    border-radius: 2px;
    margin: 30px 0;
    transition: all .5s cubic-bezier(.55,0,.1,1);
}
.news-list ul{
    list-style-type: none;
    padding: 0;
    margin: 0;
}
.news-item{
    background-color: #fff;
    padding: 10px 30px 10px 80px;
    border-bottom: 1px solid #eee;
    position: relative;
    line-height: 20px;
    min-width: 700px;
}
.score{
    color:#ff6600;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
}
.meta{
    font-size: .85em;
    color: #828282;
}
.host{
    font-size: .85em;
    color: #828282;
}
.news-item a{
    cursor: pointer;
}
.sideRightWidget {
    font-size: 12px;
    border-top: 1px solid #ddd;
    padding: 10px 5px;
    line-height: 200%;
}
.index_tab {
    padding-right: 15px;
    font-size: 12px;
    margin-right: 0;
}
.index_tab a {
    margin-right: 15px;
}

a.tab_selected {
    font-weight: bold;
    text-decoration: none;
    color: #000;
}
#searchInfo{
  clear: both;
    text-align: right;
    margin-left: 5px;
    margin-right: 5px;
    padding-right: 1em;
    font-size: 12px;
    border-top: 1px solid #d9e1f7;
    background-color: #d5ddf3;
    height: 1.7em;
    padding-top: 1px;
    border-top: 1px solid #36c;
}
</style>