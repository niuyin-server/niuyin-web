<template>
  <div class="search-container custom-loading-svg"
       :element-loading-svg="svg"
       element-loading-svg-view-box="-10, -10, 50, 50"
       v-loading="loading">
    <el-scrollbar>
      <div class="hint-container" v-for="item in videoSearchList" key="item.viderId">
        <div class="user-container">
          <img class="user-avatar" :src="item.avatar">
          <span class="username">{{ item.userNickName }}</span>
        </div>
        <p class="hint-title" v-html="item.videoTitle"></p>
        <video class="hint-video" :src="item.videoUrl" controls></video>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>

import {searchVideo} from "@/api/search.js";

export default {
  name: "VideoSearch",
  props: {},
  data() {
    return {
      loading: true,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
      searchFrom: {
        keyword: this.$route.query.keyword,// 搜索输入框的数据  url 上的keyword
        pageNum: 0,
        pageSize: 10,
      },
      videoSearchList: [],
    }
  },
  created() {
    this.loadSearchVideo()
  },
  mounted() {
  },
  methods: {
    loadSearchVideo() {
      this.loading = true
      searchVideo(this.searchFrom).then(res => {
        if (res.code === 200) {
          this.videoSearchList = res.data
          this.loading = false
        }
      })

    }
  }
}
</script>
<style scoped>
.search-container {
  border-radius: 1rem;
  width: 100%;
  height: 100%;
}

.hint-container {
  border-radius: 1rem;
  background: white;
  height: 100%;
  padding: 2rem;
  color: black;
}

.user-container {
  display: flex;
  border-radius: 10px;

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 32px;
  }

  .username {
    line-height: 50px;
    padding: 0 10px;
  }
}

.hint-title {
  margin: 1rem 0;
}

.hint-video {
  width: 100%;
  border-radius: 1rem;
  max-height: 400px;
}

</style>
