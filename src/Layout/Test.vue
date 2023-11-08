<template>
  <div class="sup_contbox_content">
    <swiper ref="videoSwiper" :options="swiperOptionVideos" @slideChange="slideChange" v-if="courseList.length!=0">
      <swiper-slide class="swiper-item" v-for='(item,index) of courseList' :key='item.id'>
        <div class="qhbox">
          <div class="vrteacher">
            <video class="myVideo" :src="item.urls" controls="controls" loop width="100%" height="100%"
                   style="border-radius: 10px">
              您的浏览器不支持video标签!
            </video>
          </div>
          <div class="videointroces" :title="item.introduce">{{ item.introduce }}</div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
//引入video样式
import {videoPlayer} from 'vue-video-player';
import {swiper, swiperSlide} from "vue-awesome-swiper";
import 'video.js/dist/video-js.css'

export default {
  name: 'Test',
  components: {
    videoPlayer,
    swiper,
    swiperSlide,
  },
  data() {
    return {
      // 精品课程
      courseList: [
        {
          id: 0,
          urls: 'static/images/video01.mp4',
          introduce: '视频1'
        },
        {
          id: 1,
          urls: 'static/images/video02.mp4',
          introduce: '视频2'
        },
        {
          id: 2,
          urls: 'static/images/video03.mp4',
          introduce: '视频3'
        },
        {
          id: 3,
          urls: 'static/images/video04.mp4',
          introduce: '视频4'
        },
        {
          id: 4,
          urls: 'static/images/video05.mp4',
          introduce: '视频5'
        }
      ],
      swiperOptionVideos: {
        initialSlide: 0,//默认第几张
        loop: true, //循环
        speed: 900,//滑动速度
        autoplay: {
          delay: 10000,//10秒切换一次
          disableOnInteraction: false,
        },
      },
    }
  },
  computed:
      {
        videoSwiper() {
          return this.$refs.videoSwiper.swiper
        }
      }
  ,
  methods: {
    // 视频轮播监听滑动事件
    slideChange() {
      var videos = document.getElementsByClassName("myVideo");
      for (let i = 0; i < videos.length; i++) {
        setTimeout(() => {
          videos[i].pause();
          videos[i].load();
        }, 150);
      }
      setTimeout(() => {
        // this.videoSwiper.activeIndex为当前slide的序号
        videos[this.videoSwiper.activeIndex].play();
      }, 200);
    }
  }
  ,
  mounted() {
    let _this = this;//赋值vue的this
    // 实现鼠标移入时停止自动轮播，移出时开始自动轮播
    _this.videoSwiper.el.onmouseover = function () {
      _this.videoSwiper.autoplay.stop();
    };
    _this.videoSwiper.el.onmouseout = function () {
      _this.videoSwiper.autoplay.start();
    };
  }
}
</script>
<style></style>
