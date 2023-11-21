<template>
  <div class="wh100" style="background: black">
    <!--    arrow="always"-->
    <el-carousel class="wh100" trigger="hover" arrow="always">
      <el-carousel-item v-for="item in imageList" :key="item">
        <img class="tlc mwh100" :src="item" alt=""/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "ImagePlayer",
  props: {
    imageList: Array,
  },
  data() {
    return {}
  },
  methods: {}
}

</script>

<style scoped>
:deep(.el-carousel__arrow--left) {
  left: 8%;
}

:deep(.el-carousel__arrow--right) {
  right: 8%;
}
</style>
