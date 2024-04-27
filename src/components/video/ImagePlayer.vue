<template>
  <div class="wh100 pr">
    <div class="pa wh100" style="background-color: black">
      <img v-if="coverImage" class="video-cover wh100" style="" :src="coverImage" alt=""/>
    </div>
    <!--    arrow="always"-->
    <el-carousel class="wh100" trigger="hover" arrow="always" @change="handleCarouselChange">
      <el-carousel-item v-for="item in imageList" :key="item">
        <img class="tlc mwh100" :src="item" alt=""/>
      </el-carousel-item>
    </el-carousel>
    <div class="carousel-point-num">
      <span class="current">{{ curImageNum }}</span>
      <span class="total">{{ imageTotal }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImagePlayer",
  props: {
    coverImage: String,
    imageList: Array,
  },
  data() {
    return {
      imageTotal: this.imageList.length,
      curImageNum: 1,
    }
  },
  methods: {
    handleCarouselChange(newVal, OldVal) {
      this.curImageNum = newVal + 1
    }
  }
}

</script>

<style scoped>
:deep(.el-carousel__arrow--left) {
  left: 8%;
}

:deep(.el-carousel__arrow--right) {
  right: 8%;
}

:deep(.el-carousel__container) {
  height: 100% !important;
}

.video-cover {
  filter: blur(60px);
  opacity: 0.8;
  user-select: none;
}

.carousel-point-num {
  position: absolute;
  top: 2%;
  right: 3%;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 10px 6px;
  background-color: var(--niuyin-bg-color3);
  backdrop-filter: blur(2px);
  border-radius: 50%;

  .current:after {
    content: "/";
    margin: 0 1px;
    width: 0;
  }

  .total {

  }
}
</style>
