<template>
  <div class="discover-container wh100">
    <el-scrollbar>
      <el-empty v-if="videoList.size === 0" description="暂无数据"/>
      <el-skeleton class="w100" :loading="loading" animated>
        <template #template>
          <div class="loading-container" v-for="i in 2">
            <div class="loading-item" v-for="i in 5">
              <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
              <div class="p1rem">
                <el-skeleton-item variant="h1" style="width: 80%"/>
                <div>
                  <el-skeleton-item variant="text"/>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div class="hotVideo-list w100" style="height: auto">
            <div class="hotVideos cp"
                 v-masonry
                 fit-width="true"
                 transition-duration="0.2s"
                 column-width=".discover-item"
                 item-selector=".discover-item">
              <!--              热榜-->
              <!--              <div style="height: 600px;" class="discover-item">-->
              <!--                <el-card class="discover-card wh100">-->
              <!--                  <el-tabs v-model="activeName" @tab-click="handleHotTabClick">-->
              <!--                    <el-tab-pane v-for="item in hotTabShow"-->
              <!--                                 :key="item.id"-->
              <!--                                 :label="item.tabName"-->
              <!--                                 :lazy="true"-->
              <!--                                 :name="item.tabName">-->
              <!--                      <div v-for="it in item.dataList" class="p10px">-->
              <!--                        <p>{{ it }}</p>-->
              <!--                      </div>-->
              <!--                    </el-tab-pane>-->
              <!--                  </el-tabs>-->
              <!--                </el-card>-->
              <!--              </div>-->
              <!--              热门视频-->
              <div v-for='(item,index) in videoList'
                   :key="item.videoId"
                   v-masonry-tile
                   class="discover-item">
                <VideoDiscoverCard :video="item"/>
              </div>
            </div>
            <Loading v-if="loadingIcon" :is-full-screen="false"/>
          </div>
        </template>
      </el-skeleton>
      <div v-if="dataNotMore">
        <el-divider>暂无更多数据</el-divider>
      </div>
    </el-scrollbar>
    <el-backtop :right="16" :bottom="16" target=".main-container  .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<!--
*@author roydon
*@date 2023/12/7 11:13
-->
<script>
import {pushVideo} from "@/api/video.js";
import {UserFilled} from "@element-plus/icons-vue";
import VideoShowCard from "@/components/video/VideoShowCard.vue";
import Loading from "@/components/Loading.vue";
import VideoDiscoverCard from "@/components/video/card/VideoDiscoverCard.vue";

export default {
  name: 'Discover',
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  props: {},
  components: {VideoDiscoverCard, VideoShowCard, Loading},
  data() {
    return {
      loading: true,
      loadingIcon: false,
      dataNotMore: false,
      loadingData: true,
      videoList: [],
    }
  },
  created() {
    // this.initPushVideo()
  },
  mounted() {
    this.initPushVideo()
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    initPushVideo() {
      this.loading = true
      pushVideo().then(res => {
        if (res.code === 200) {
          this.videoList = res.data
          this.loading = false
          pushVideo().then(res => {
            if (res.code === 200) {
              this.videoList = this.videoList.concat(res.data)
            }
          })
        }
      })
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 200) {
        //加载更多
        if (this.loadingData) {
          this.loadingData = false
          this.loadingIcon = true
          pushVideo().then(res => {
            if (res.code === 200) {
              if (res.data.length === 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.videoList = this.videoList.concat(res.data)
              this.loadingIcon = false
              setTimeout(() => {
                this.loadingData = true
              }, 1000);
            } else {
              this.loadingIcon = false
            }
          })
        }
      }
    },

    // 跳转到用户页面
    handlePersonInfo(userId) {

    },
  }
}
</script>

<style scoped>
@import "@/assets/styles/discover.scss";
</style>
