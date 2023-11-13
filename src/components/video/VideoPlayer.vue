<template>
  <div>
    <videoPlay
        v-bind="options"
        :poster="options.poster"
        @play="onPlay"
        @pause="onPause"
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
    videoUrl: String,
    coverImage: String,
  },
  data() {
    return {
      options: {
        width: "100%", //播放器宽度
        height: "100%", //播放器高度
        color: "#0760e6", //主题色
        title: "", //视频名称
        src: this.videoUrl, //视频源
        poster: this.coverImage, // 视频封面
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
          "volume",
          "setting",
          "pip",
          "fullScreen",
        ], //显示所有按钮,
      }
    }
  },
  methods: {
    onPlay(ev) {
      console.log('播放')
    },
    onPause(ev) {
      console.log('暂停')
    },
    onTimeupdate(ev) {
      // console.log(ev, '时间更新')
    },
    onCanplay(ev) {
      // console.log(ev, '可以播放')
    },
  }
}

</script>

<style scoped>
/*@import 'vue3-video-play/dist/style.css'; */
.d-player-wrap {
  background-color: transparent;
}
</style>
