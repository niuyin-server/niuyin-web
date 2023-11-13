<template>
  <div class="nav-center">
    <div class="nav-center-search"
         ref="NavSearch">
      <!-- 输入框 -->
      <el-popover popper-class="search-popover"
                  :width="480"
                  trigger="hover"
                  popper-style="padding: 20px;">
        <template #reference>
          <div class="flex-center wh100">
            <el-input
                class="search-input"
                v-model="searchData"
                :placeholder="searchDefaults"
                @keyup.enter.native="searchConfirm"
                clearable>
            </el-input>
            <el-button class="search-btn cb fw600" type="info" plain @click="searchConfirm">
              <i class="iconfont icon-search mr-5r"></i><span>搜索</span>
            </el-button>
          </div>
        </template>
        <template #default>
          <div class="search-pop">
            <!--            顶部搜索历史-->
            <div class="pop-top">
              <div v-if="searchHistory">
                <h4 class="mb5">搜索历史</h4>
                <el-tag class="cp cb"
                        v-for="item in searchHistory"
                        :key="item.id"
                        style="margin-bottom: 3px;margin-right: 5px"
                        type="info"
                        closable
                        @click="handleSearchHistorySelect(item.keyword)"
                        @close="handleSearchHistoryClose(item.id)">
                  {{ item.keyword }}
                </el-tag>
              </div>
            </div>
            <!--            中间搜索推荐-->
            <div class="pop-center">
              <div v-if="searchHistory">
                <h4 class="mtb5">猜你想搜</h4>
                <div class="flex-between">
                  <p class="cp cb w49 p5px one-line search-hover-item"
                     v-for="item in searchDiscover"
                     @click="handleSearchDiscoverSelect(item.keyword)">
                  </p>
                </div>
              </div>
            </div>
            <!--            底部热门搜索-->
            <div class="pop-bottom">
              <div v-if="searchHistory">
                <h4 class="mtb5">牛音热搜</h4>
                <div v-for="item in 5"
                     class="cb cp p5px one-line flex-row search-hover-item">
                  <el-icon>
                    <CaretTop/>
                  </el-icon>
                  <span>{{ item }}热搜数据</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {
  ArrowRightBold, CaretTop,
  Message, QuestionFilled,
  Sunrise, SwitchButton, UserFilled,
} from '@element-plus/icons-vue'
import {searchHistoryLoad, delSearchHistory} from "@/api/search.js";
import axios from "axios";

export default {
  name: "NavCenter",
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  components: {CaretTop, Sunrise, SwitchButton, ArrowRightBold, QuestionFilled, Message},
  props: {},
  data() {
    return {
      user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {},
      // 输入框的数据
      searchData: "",
      // 默认搜索词
      searchDefaults: "输入你感兴趣的内容",
      // 搜索历史
      searchHistory: [],
      // 猜你想搜：
      searchDiscover: [],
      // 热搜数据
      hotSearch: [],
    }
  },
  created() {
    // 搜索记录
    this.getSearchHistory()
    // 猜你想搜
    this.getSearchDiscover()
    // this.getHotSearch()
  },
  mounted() {
    this.$nextTick(() => {
      this.getSearchHistory()
    })
  },
  methods: {
    getSearchHistory() {
      searchHistoryLoad().then(res => {
        if (res.code === 200) {
          this.searchHistory = res.data
        }
      })
    },
    getSearchDiscover() {
      // todo
      this.searchDiscover.push({id: 1, keyword: "你好"})
    },
    getHotSearch() {
      axios.get("https://s.search.bilibili.com/main/hotword")
          .then(res => {
            console.log(res)
          })
    },
    // 判断选中了哪个搜索历史
    handleSearchHistorySelect(keyword) {
      this.searchData = keyword;
      this.routerJump();
    },
    // 选中猜你想搜
    handleSearchDiscoverSelect(keyword) {
      this.searchData = keyword;
      this.routerJump();
    },
    // 确认搜索
    searchConfirm() {
      if (this.searchData === "") {
        this.searchData = this.searchDefaults;
      }
      this.routerJump();
      this.getSearchHistory()
    },
    // 路由跳转
    routerJump() {
      // 跳转到搜索页面
      this.$router.push(`/videoSearch?keyword=${this.searchData}`);
    },
    // 删除搜索历史记录
    handleSearchHistoryClose(id) {
      delSearchHistory(id).then(res => {
        if (res.code === 200) {
          this.getSearchHistory()
        }
      })
    },
  },
}
</script>

<style scoped>
</style>
