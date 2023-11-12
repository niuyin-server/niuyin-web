<template>
  <div>
<!--    <vue3VideoPlay-->
<!--        v-bind="options"-->
<!--        :poster="options.poster"-->
<!--        @play="onPlay"-->
<!--        @pause="onPause"-->
<!--        @timeupdate="onTimeupdate"-->
<!--        @canplay="onCanplay"/>-->
  </div>
</template>

<script>
// import vue3VideoPlay from "vue3-video-play";
// import "vue3-video-play/dist/style.css";

export default {
  name: "VideoPlayer",
  // components: {
  //   vue3VideoPlay
  // },
  props: {
    videoUrl: Array,
  },
  data() {
    return {
      options: {
        width: "800px", //播放器宽度
        height: "450px", //播放器高度
        color: "#409eff", //主题色
        title: "测试", //视频名称
        src: "https://media.w3.org/2010/05/sintel/trailer.mp4", //视频源
        poster: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/ironMan.jpg", // 视频封面
        muted: false, //静音
        speed: false, // 关闭进度条拖动
        webFullScreen: false,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
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
          "pageFullScreen",
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
      console.log(ev, '暂停')
    },
    onTimeupdate(ev) {
      console.log(ev, '时间更新')
    },
    onCanplay(ev) {
      console.log(ev, '可以播放')
    },
  }
}

</script>

<style scoped>
</style>
