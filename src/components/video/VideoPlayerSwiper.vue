<template>
  <swiper class="video-swiper" ref="videoSwiper"
          @swiper="onSwiper"
          :options="swiperOptionVideos"
          @slideChange="slideChange"
          @reachEnd="slideVideoEnd">
    <swiper-slide class="swiper-item" v-for='(item,index) of videoList' :key='item.videoId'>
      <div class="video-box">
        <div class="video-container">
          <video class="myVideo" :src="item.videoUrl" controls>
            您的浏览器不支持video标签!
          </video>
        </div>
        <div class="video-info" :title="item.videoTitle">{{ item.videoTitle }}</div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
//引入video样式
// import {videoPlayer} from 'vue-video-player';
import {Swiper, SwiperSlide} from 'swiper/vue';
// import 'video.js/dist/video-js.css'
import 'swiper/css';

export default {
  name: 'VideoPlayerSwiper',
  components: {
    // videoPlayer,
    Swiper,
    SwiperSlide,
  },
  props: {
    videoList: Array,
  },
  data() {
    return {
      showVideo: true,
      swiperOptionVideos: {
        initialSlide: 0,//默认第几张
        loop: true, //循环
        speed: 1000,//滑动速度
        direction: "vertical",
        watchOverflow: true,//因为仅有1个slide，swiper无效
        // preventClicks: false,//当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
      },
    }
  },
  emits: ['reloadVideoFeed'],
  computed: {
    videoSwiper() {
      return this.$refs.videoSwiper.swiper
    }
  },
  methods: {
    // 视频轮播监听滑动事件
    slideChange() {
      const videos = document.getElementsByClassName("myVideo");
      console.log("视频轮播监听滑动事件")
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
          videos[i].load();
        }, 100);
      }
      // if (this.videoSwiper.activeIndex == this.videoList.length) {
      //   console.log("滑动到最后一个元素")
      // }
      // setTimeout(() => {
      //   // this.videoSwiper.activeIndex为当前slide的序号
      //   videos[this.videoSwiper.activeIndex].play();
      // }, 200);
    },
    slideVideoEnd(swiper) {
      // console.log(swiper)
      console.log(swiper.activeIndex)
      if (swiper.activeIndex === this.videoList.length - 2) {
        console.log("滑动到最后一个元素231213")
        this.$emit("reloadVideoFeed", this.showVideo);
        swiper.activeIndex = 0
      }
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
  setup() {
    const onSwiper = (swiper) => {
      // console.log(swiper);
    };
    return {
      onSwiper,
    };
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

.video-behave-swift {
  width: 10%;
  height: 100%;
  float: right;
}

.video-swiper {
  height: 100%;
  width: 100%;

  .swiper-item {
    height: 100%;
    width: 100%;

    .video-box {
      height: 100%;
      width: 100%;

      .video-container {
        height: 100%;
        width: 100%;
        position: relative;

        .myVideo {
          height: 100%;
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
  }
}
</style>
