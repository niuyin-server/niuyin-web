<template>
  <div class="vue3-video-play">
    <videoPlay
        v-bind="options"
        :poster="options.poster"
        :ref="'videoPlay'+video.videoId"
        :id="video.videoId"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @timeupdate="onTimeupdate"
        @canplay="onCanplay"/>
  </div>
</template>

<script>
// vue3视频播放器
import videoPlay from 'vue3-video-play/lib/index' // 引入组件

export default {
  name: "VideoPlayer",
  components: {
    videoPlay
  },
  props: {
    video: Object,
  },
  data() {
    return {
      options: {
        width: "100%", //播放器宽度
        height: "100%", //播放器高度
        color: "#0760e6", //主题色
        title: "", //视频名称
        src: this.video.videoUrl, //视频源
        poster: this.video.coverImage, // 视频封面
        muted: false, //静音
        speed: true, // 关闭进度条拖动
        webFullScreen: false,
        speedRate: ["0.5", "0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        autoPlay: false, //自动播放
        loop: false, //循环播放
        mirror: false, //镜像画面
        ligthOff: false, //关灯模式
        volume: 0.5, //默认音量大小
        control: true, //是否显示控制
        controlBtns: [
          "audioTrack",
          "quality",
          "speedRate",
          "setting",
          "volume",
          "pip",
          "pageFullScreen",
          "fullScreen",
        ], //显示所有按钮,
      },
      videoPlay: false,
      videoDuration: "00:00",
    }
  },
  emits: ['videoDuration', 'videoOnPlay', 'videoOnPause'],
  created() {
    console.log(this.video)
  },
  watch: {
    video(newVideo) {
      this.options.src=newVideo.videoUrl
      this.options.poster=newVideo.coverImage
    }
  },
  methods: {
    onPlay(ev) {
      // console.log('播放')
      this.videoPlay = true
      this.$emit("videoOnPlay", this.video.videoId)
    },
    onPause(ev) {
      // console.log('暂停')
      this.videoPlay = false
      this.$emit("videoOnPause", this.video.videoId)
    },
    // 播放结束
    onEnded(ev) {
      console.log('end')
    },
    onTimeupdate(ev) {
      // console.log(ev.target.duration)
      this.videoDuration = ev.target.duration
      // console.log(this.videoDuration)
      this.$emit("videoDuration", this.videoDuration)
      // console.log(ev.target.currentTime)
    },
    onCanplay(ev) {
      // console.log(ev, '可以播放')
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy")
  },
}

</script>

<style scoped>
/*@import 'vue3-video-play/dist/style.css'; */
.vue3-video-play {
  backdrop-filter: blur(60px) !important;
}

.video-play {
  float: left;
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  margin: 0 auto;
  height: calc(100vh - 160px);
}

.d-player-wrap {
  background-color: transparent;
}

:deep(.d-player-wrap .d-player-control) {
  z-index: 200;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  background-color: rgba(0, 0, 0, 0.2);
}

:deep(.d-slider .d-slider__runway) {
  background-color: rgba(0, 0, 0, 0.20);
}

:deep(.d-player-wrap .d-player-control .d-control-progress .d-progress-bar) {
  /*height: 5px;*/
  transition: height 0.2s;
}

:deep(.d-player-wrap .d-player-video .d-player-video-main) {
  max-width: 100%;
  max-height: 100%;
  transition: none !important;
  z-index: 10;
}
</style>
