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
            <div v-loading="loadingIcon"
                 :element-loading-svg="svg"
                 class="hotVideos"
                 element-loading-svg-view-box="-10, -10, 50, 50"
                 v-masonry
                 fit-width="true"
                 transition-duration="0.2s"
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
              <!--                      &lt;!&ndash;                    <router-view/>&ndash;&gt;-->
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
                <!--                <el-card class="discover-card">-->
                <!--                  <div class="video-cover">-->
                <!--                    <el-image v-if="item.coverImage" class="eli-ofc wh100"-->
                <!--                              :src="item.coverImage">-->
                <!--                      <template #error>-->
                <!--                        <div class="image-slot">-->
                <!--                          <img class="failed-image wh100" src="@/assets/images/bg-mobile.png">-->
                <!--                          <el-icon>-->
                <!--                            <icon-picture/>-->
                <!--                          </el-icon>-->
                <!--                        </div>-->
                <!--                      </template>-->
                <!--                    </el-image>-->
                <!--                    &lt;!&ndash;                    <el-image v-else class="eli-ofc h100"&ndash;&gt;-->
                <!--                    &lt;!&ndash;                              src="@/assets/images/bg-mobile.png"/>&ndash;&gt;-->
                <!--                  </div>-->
                <!--                  <div class="user-info">-->
                <!--                    <div>-->
                <!--                      <p class="one-line fs9">{{ item.videoTitle }}</p>-->
                <!--                      <p class="one-line fs7 cg">{{ item.videoDesc }}</p>-->
                <!--                    </div>-->
                <!--                    <div>-->
                <!--                      <el-avatar v-if="item.userAvatar"-->
                <!--                                 class="cp"-->
                <!--                                 :lazy="true"-->
                <!--                                 :src="item.userAvatar"-->
                <!--                                 @click="handlePersonInfo(item.userId)"/>-->
                <!--                      <el-avatar v-else class="cp"-->
                <!--                                 :icon="UserFilled"-->
                <!--                                 @click="handlePersonInfo(item.userId)"/>-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                </el-card>-->
                <VideoShowCard :video="item"/>
              </div>
            </div>
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

export default {
  name: 'Discover',
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  props: {},
  components: {VideoShowCard},
  data() {
    return {
      loading: true,
      loadingIcon: false,
      dataNotMore: false,
      loadingData: true,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
      videoList: [],
    }
  },
  created() {
    this.initPushVideo()
  },
  mounted() {
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
