<template>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="(tab) in favoriteTab"
                 :label="tab.tabName"
                 :name="tab.id"
                 :lazy="true"/>
  </el-tabs>
  <UserFavoriteCollection v-if="activeName===1"/>
  <UserFavoriteVideo v-if="activeName===2"/>
  <UserFavoriteMusic v-if="activeName===3"/>
  <div v-if="activeName===4" class="flex-between">
    <div class="w100">
      <el-empty description="暂无数据"/>
    </div>
  </div>
</template>

<script>
import VideoCard from "@/components/video/VideoCard.vue";
import {Close} from "@element-plus/icons-vue";
import {myFavoriteList, videoFavoritePage} from "@/api/behave.js";
import UserFavoriteVideo from "@/components/user/favorite/UserFavoriteVideo.vue";
import UserFavoriteCollection from "@/components/user/favorite/UserFavoriteCollection.vue";
import UserFavoriteMusic from "@/components/user/favorite/UserFavoriteMusic.vue";

export default {
  name: "VideoFavorite",
  components: {UserFavoriteMusic, UserFavoriteCollection, UserFavoriteVideo, VideoCard},
  computed: {
    Close() {
      return Close
    }
  },
  data() {
    return {
      dialogVisible: false,
      favoriteVideoList: [],
      favoriteVideoTotal: 0,
      videoQueryParams: {
        videoTitle: "",
        pageNum: 1,
        pageSize: 10
      },
      video: {},
      favoriteTab: [
        {id: 1, tabName: "收藏夹", tabUrl: "/user/videoPost"},
        {id: 2, tabName: "视频", tabUrl: "/user/videoLike"},
        {id: 3, tabName: "音乐", tabUrl: "/user/videoFavorite"},
        {id: 4, tabName: "合集", tabUrl: "/user/videoFavorite"},
      ],
      activeName: 2,
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
