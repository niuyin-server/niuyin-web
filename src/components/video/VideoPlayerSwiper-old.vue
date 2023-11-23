<template>
  <div class="swiper-container">
    <swiper :modules="modules"
            :loop="false"
            :enabled="true"
            :focusableElements="'video'"
            :slidesPerView="1"
            :spaceBetween="0"
            :pagination="{	clickable: true	}"
            :autoplay="false"
            :navigation="true"
            :direction="'vertical'"
            class="videoSwiper"
            ref="videoSwiper"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            @realIndexChange="onRealIndexChange"
            @reachEnd="onReachEnd"
            @wheel="handleWheel"
            :mousewheel="true">
      <swiper-slide v-for="item in videoList">
        <img :src="item.url"
             :key="item"
             alt=""/>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue'; // swiper所需组件
// 这是分页器和对应方法，swiper好像在6的时候就已经分离了分页器和一些其他工具
import {Autoplay, Navigation, Pagination, A11y, Mousewheel} from 'swiper';
// 引入swiper样式，对应css 如果使用less或者css只需要把scss改为对应的即可
import 'swiper/css'
import 'swiper/css/pagination' // 轮播图底面的小圆点
import 'swiper/css/navigation' // 轮播图两边的左右箭头
// import 'swiper/css/scrollbar'  // 轮播图的滚动条

export default {
  name: 'VideoPlayerSwiperOld',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    videoList: Array,
  },
  data() {
    return {
      videoSwiper: {},
      modules: [Autoplay, Pagination, Navigation, A11y, Mousewheel],
      waitPush: [
        {id: 1, url: "http://s38bf8bdn.hb-bkt.clouddn.com/2023/11/21/df629de7995c4c709688988f4ecba37f.webp"},
        {id: 2, url: "http://s38bf8bdn.hb-bkt.clouddn.com/2023/11/21/bf5aa29b4adb414ab24cc766262ab6c9.webp"},
        {id: 3, url: "http://s38bf8bdn.hb-bkt.clouddn.com/2023/11/21/e51de5dd0aea46fc8be4fc7d834fcfde.webp"},
      ],
      realIndex: 0,
      loadMore: false,
    }
  },
  emits: ['reloadVideoFeed'],
  methods: {
    onSwiper(s) {
      this.videoSwiper = s
      // console.log(s)
    },
    onSlideChange() {
      // console.log("slide change")
    },
    onReachEnd() {
      console.log("slide end")
    },
    onRealIndexChange(swiper) {
      this.realIndex = swiper.realIndex
    },
    // 鼠标滚轮事件
    handleWheel() {
      console.log("handleWheel" + this.realIndex)
      if (this.realIndex === this.videoList.length - 1) {
        this.videoList = [...this.videoList, ...this.waitPush];
      }
    },
    handleNext() {
      console.log("handleNext")
      this.videoSwiper.slideNext()
      if (this.realIndex === this.videoList.length - 1) {
        this.videoList = [...this.videoList, ...this.waitPush];
      }
    },
  },
  beforeDestroy() {
    if (this.videoSwiper) {
      this.videoSwiper.destroy();
      this.videoSwiper = null;
    }
  },
}
</script>
<style scoped>
.videoSwiper {
  width: 100%;
  height: 500px;
  border-radius: 1rem;
}

:deep(.swiper-slide) {
  text-align: center;
  height: 100%;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.videoSwiper img {
  height: 100%;
  object-fit: cover;
}

:deep(.swiper-pagination) .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background-color: rgb(229, 180, 127);
}

:deep(.swiper-pagination-bullet) {
  width: 14px;
  height: 14px;
  background-color: #fff;
}

.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
:deep(.swiper-pagination-horizontal.swiper-pagination-bullets) .swiper-pagination-bullet {
  margin: 0 8px;
}

:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: rgb(229, 180, 127);
}
</style>
