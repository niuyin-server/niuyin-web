<template>
  <div class="search-container wh100" ref="searchContainer">
    <el-scrollbar>
      <div class="grid-3-1">
        <div class="search-left">
          <div class="search-select flex-between">
            <div class="search-select-left">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="item in videoSearchTabShow"
                             :key="item.id"
                             :label="item.tabName"
                             :lazy="true"
                             :name="item.id">
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="search-select-right">
              <el-popover class="user-popover"
                          :width="320"
                          trigger="click"
                          popper-style="padding: 20px;border-radius: 8px">
                <template #reference>
                  <div class="cp flex-center text-hv-primary">
                    <span class="mr5px">筛选</span>
                    <el-icon>
                      <Filter/>
                    </el-icon>
                  </div>
                </template>
                <template #default>
                  <div class="mb5">
                    <h4 class="mb5">排序依据</h4>
                    <div class="flex-between">
                      <div class="w33 cp tac text-hv-primary" v-for="item in FilterOptionSort" style="padding: 5px"
                           @click="handleSearchSortFilter(item)">
                        <div v-if="item.id===filterSort" class="bgc-primary-4 b-radius1 tac" style="padding: 4px 2px">
                          {{ item.title }}
                        </div>
                        <div v-else class=" b-radius1 tac" style="padding: 4px 2px"> {{ item.title }}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 class="mb5">发布时间</h4>
                    <div class="flex-between ">
                      <div class="w25 cp text-hv-primary" v-for="item in FilterOptionPublishTime" style="padding: 5px"
                           @click="handleSearchTimeFilter(item)">
                        <div v-if="item.id===filterTime" class="bgc-primary-4 b-radius1 tac" style="padding: 4px 2px">
                          {{ item.title }}
                        </div>
                        <div v-else class=" b-radius1 tac" style="padding: 4px 2px"> {{ item.title }}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
          <!--        todo 标签-->
          <router-view/>
        </div>
        <div class="search-right">
          <h4 class="mb1rem">相关搜索</h4>
          <div>
            <!--          十条搜索建议-->
            <div v-for="(item,index) in videoSearchSuggestList" class="p5px">
              <p class="text-hv-primary cp one-line search-suggest-hover-item" @click="handleClickSuggest(item)">
                <span class="mr5px"><el-icon><Search/></el-icon></span>
                <span class="fs9 one-line" style="line-height: 1.3">{{ item }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
  <el-backtop :right="16" :bottom="16" target=".search-container .el-scrollbar__wrap" :visibility-height="10"/>
</template>

<script>
import {videoSearchSuggest} from "@/api/search.js";
import {Filter, Search} from "@element-plus/icons-vue";
import VideoSearchOneCard from "@/components/video/card/VideoSearchOneCard.vue";
import {removeHtmlTags} from "@/utils/roydon.js";

export default {
  name: "VideoSearch",
  components: {VideoSearchOneCard, Filter, Search},
  props: {},
  data() {
    return {
      loading: false,
      searchFrom: {
        keyword: this.$route.query.keyword,// 搜索输入框的数据  url 上的keyword
        pageNum: 1,
        pageSize: 10,
        publishTimeLimit: 0,
      },
      videoSearchList: [],
      videoSearchTabShow: [
        {id: 0, tabName: "视频", tabUrl: "/search/video"},
        {id: 1, tabName: "用户", tabUrl: "/search/user"}
      ],
      activeName: 0,
      FilterOptionSort: [
        {id: 0, title: "综合排序"},
        {id: 1, title: "最新发布"},
        {id: 2, title: "最多点赞"},
      ],
      FilterOptionPublishTime: [
        {id: 0, title: "不限"},
        {id: 1, title: "一天内"},
        {id: 2, title: "一周内"},
        {id: 3, title: "一月内"},
      ],
      filterSort: 0,
      filterTime: 0,
      videoSearchSuggestList: [],
    }
  },
  created() {
  },
  mounted() {
    // this.loadSearchVideo()
    this.loadVideoSearchSuggest()
    // this.hintContainerScrollToTop()
  },
  watch: {
    $route(to, from) {
      if (to.query.keyword !== undefined) {
        // console.log("watch to keyword change > " + to.query.keyword)
        this.searchFrom.keyword = to.query.keyword
        // console.log("watch from keyword change > " + from.query.keyword)
        // this.loadSearchVideo();
        this.loadVideoSearchSuggest()
      }
    },
    searchFrom(o, n) {
      // console.log("watch searchFrom change > " + o)
    },
  },
  methods: {
    // loadSearchVideo() {
    //   this.loading = true
    //   searchVideo(this.searchFrom).then(res => {
    //     if (res.code === 200) {
    //       this.videoSearchList = res.data
    //       this.loading = false
    //     }
    //   })
    // },
    // hintContainerScrollToTop() {
    //   this.$nextTick(() => {
    //     const divElement = this.$refs.searchContainer;
    //     // console.log(divElement.scrollTop)
    //     divElement.scrollTop = 0;
    //   });
    // },
    loadVideoSearchSuggest() {
      const params = {
        "keyword": this.searchFrom.keyword
      }
      videoSearchSuggest(params).then(res => {
        if (res.code === 200) {
          this.videoSearchSuggestList = res.data
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab.props.name);
      // 跳转到videoSearchTabShow，带上keyword参数
      // this.searchFrom.keyword =
      // this.$router.push({path=})

      this.$router.push(`${this.videoSearchTabShow[tab.props.name].tabUrl}?keyword=${this.searchFrom.keyword}`);
      // const route = tab.props.name
      // console.log(this.$route.path)
      // console.log(this.$route.matched[1].path)
      // this.$router.push(route)
    },
    handleSearchSortFilter(item) {
      // console.log(item)
      this.filterSort = item.id
      this.loading = true
      // searchVideo(this.searchFrom).then(res => {
      //   if (res.code === 200) {
      //     this.videoSearchList = res.data
      //     this.loading = false
      //   }
      // })
    },
    handleSearchTimeFilter(item) {
      this.filterTime = item.id
      this.searchFrom.publishTimeLimit = this.filterTime
      this.loading = true
      // searchVideo(this.searchFrom).then(res => {
      //   if (res.code === 200) {
      //     this.videoSearchList = res.data
      //     this.loading = false
      //   }
      // })
    },
    // 点击标签
    handleClickTag(tag) {
      const keyword = removeHtmlTags(tag)
      this.$route.query.keyword = keyword
      // this.$router.push({ name: 'videoSearch', params: { keyword: keyword }});
      this.searchFrom.keyword = keyword
      // this.loadSearchVideo();
    },
    // 点击相关搜索
    handleClickSuggest(item) {
      const keyword = removeHtmlTags(item)
      console.log(keyword)
      this.$route.query.keyword = keyword
      // this.$router.push({ name: 'videoSearch', params: { keyword: keyword }});
      this.searchFrom.keyword = keyword
      // this.loadSearchVideo();
    },
  }
}
</script>
<style scoped>
.search-container {
  border-radius: 1rem;
  margin: 0 auto;

  .search-left {
    z-index: 9999;

    .search-select {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  }

  .search-right {
    height: max-content;
    position: sticky;
    top: 0;
    z-index: 10;
  }
}

.search-suggest-hover-item {
  line-height: 1;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  transition: all .3s ease-in;

  &:hover {
    background-color: rgba(211, 211, 211, 0.5)
  }
}

:deep(.el-tabs__item) {
  font-size: 1rem;
}

:deep(.bg-mask) {
  background: none !important;
}
</style>
