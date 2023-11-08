<template>
  <div class="video-container">
<!--    <video class="video-player"-->
<!--           v-if="showVideo"-->
<!--           controls-->
<!--           ref="video"-->
<!--           preload-->
<!--           :src="videoUrl"></video>-->
    <video-player class="video-player vjs-custom-skin"
                 ref="videoPlayer"
                 :playsinline="true"
                 :options="playerOptions"/>
  </div>
  <div class="video-behave-swift flex-center">
<!--    <el-button @click="getPreviousVideo" type="warning" circle/>-->
<!--    <el-button @click="getNextVideo" type="primary" circle/>-->
  </div>
</template>
<script>

export default {
  name: "VideoPlayer",
  props: {
    videoUrl: String,
  },
  data() {
    return {
      showVideo: true,
      duration: 0, // 视频总时长
      currentTime: 0, // 目前时长
      videoPlay: true,
      autoPlayVideo: "autoplay",
      playerOptions:{
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false,  // 如果为true,浏览器准备好时开始回放
        muted: false,     // 默认情况下将会消除任何音频。
        loop: false,      // 是否视频一结束就重新开始。
        preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9',  // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true,  // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "",  // 类型
          src: this.videoUrl             // url地址
        }],
        poster: '',  // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试',  // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,           // 当前时间和持续时间的分隔符
          durationDisplay: true,       // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true       // 是否显示全屏按钮
        }
      }
    }
  },
  emits: ['reloadVideoFeed'],
  created() {
  },
  mounted() {

  },
  methods: {},
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

.video-behave-swift {
  width: 10%;
  height: 100%;
  float: right;
}
</style>
