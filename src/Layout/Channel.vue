<template>
  <div class="channel-container">
    <el-scrollbar>
      <el-tabs type="border-card">
        <el-tab-pane v-for="item in channelList"
                     :label="item.name"
                     :id="item.id"
                     :lazy="true"
                     :key="item.id">
          <VideoCategoryPage
              v-if="showVideoPlayer"
              :channel-id="item.id"/>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script>
import {videoCategory} from "@/api/video"
import VideoCategoryPage from "@/components/video/VideoCategoryPage.vue"

export default {
  name: "Channel",
  components: {VideoCategoryPage},
  data() {
    return {
      channelList: [],
      showVideoPlayer: true,
    };
  },
  created() {
    this.getChannelList()
  },
  methods: {
    getChannelList() {
      videoCategory().then(res => {
        if (res.code === 200) {
          this.channelList = res.data
        }
      })
    },
  }
};
</script>

<style scoped>
.channel-container {
  width: 100%;
  border-radius: 1rem;
  height: 100%;
  //backdrop-filter: blur(20px);
  background-color: aliceblue
}
</style>
