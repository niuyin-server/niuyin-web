<template>
  <div>
    <videoPlay
        v-bind="options"
        :poster="options.poster"
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
      }
    }
  },
  emits: ['emitVideoDuration'],
  methods: {
    onPlay(ev) {
      // console.log('播放')
    },
    onPause(ev) {
      // console.log('暂停')
    },
    // 播放结束
    onEnded(ev) {
      console.log('end')
    },
    onTimeupdate(ev) {
      // console.log(ev.target.duration)
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
.d-player-wrap {
  background-color: transparent;
}

:deep(.d-player-wrap .d-player-control) {
  z-index: 200;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
