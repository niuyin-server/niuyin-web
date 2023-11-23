<template>
  <div class="wh100 pr" style="background: black">
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

.carousel-point-num {
  position: absolute;
  top: 2%;
  right: 3%;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 10px 6px;
  background-color: var(--niuyin-bg-color5);
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
