<template>
      <MapView/>
<!--  <MediaCardWaterfall :data="mediaList"></MediaCardWaterfall>-->
</template>
<script>
import MapView from "@/components/map/MapView.vue"
import MediaCardWaterfall from "@/components/media/MediaCardWaterfall.vue"

export default {
  name: "VideoViewHistory",
  components: {MapView, MediaCardWaterfall},
  data() {
    return {
    }
  },
  created() {
  },
  methods: {}
}
</script>
<style scoped>

</style>
