<template>
  <el-scrollbar>
    <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
      <el-scrollbar>
        <li v-for="item in videoList" class="infinite-list-item">
          <div class="video-box">
            <div class="video-container">
              <video class="myVideo" :src="item.videoUrl" controls>
                您的浏览器不支持video标签!
              </video>
            </div>
            <div class="video-info" :title="item.videoTitle">{{ item.videoTitle }}</div>
          </div>
        </li>
      </el-scrollbar>
    </ul>
  </el-scrollbar>
</template>

<script>

export default {
  name: 'VideoPlayerScroll',
  components: {},
  props: {
    videoList: Array,
  },
  data() {
    return {
      showVideo: true,
    }
  },
  emits: ['reloadVideoFeed'],
  computed: {},
  methods: {
    load() {
      // this.count += 2
      console.log("load")
    }
  },
  mounted() {
    let _this = this;//赋值vue的this
    // 实现鼠标移入时停止自动轮播，移出时开始自动轮播
    // _this.videoSwiper.el.onmouseover = function () {
    //   _this.videoSwiper.autoplay.stop();
    // };
    // _this.videoSwiper.el.onmouseout = function () {
    //   _this.videoSwiper.autoplay.start();
    // };
  },
}
</script>

<style scoped>
.video-player {
  width: 100%;
  border-radius: 1rem;
  height: 100%;
}

.video-container {
  width: 90%;
  float: left;
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  margin: 0 auto;
  height: calc(100vh - 160px);
}


.video-box {
  height: 100%;
  width: 100%;

  .video-container {
    height: 100%;
    width: 100%;

    .myVideo {
      height: 100%;
      position: relative;
      width: 100%;
      border-radius: 1rem;
    }
  }

  .video-info {
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    width: 100%;
    padding: 1rem;
  }

}
</style>

