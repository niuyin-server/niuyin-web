<template>
  <div class="video-card flex-row">
    <div class="video-cover-image wh100"
         @mouseover="handleMouseover" @mouseleave="handleMouseleave">
      <!--      <el-image class="cover-image pa eli-ofc cp wh100" :src="video.coverImage"/>-->
      <div v-if="!playVideo" class="cover-image" ref="coverImage">
        <el-image class="eli-ofc cp" :src="video.coverImage"/>
        <div class="video-like  flex-center">
          <svg class="icon1rem" aria-hidden="true">
            <use xlink:href="#icon-like-num"></use>
          </svg>
          <span class="ml-5r">{{ video.likeNum }}</span>
        </div>
        <div class="video-duration flex-center">
          <span class="fs8 cw">{{ formatDuration(video.videoInfo) }}</span>
        </div>
        <div v-if="video.publishType==='1'" class="flex-center video-type-pics">
          <svg class="icon1rem ml5" aria-hidden="true">
            <use xlink:href="#icon-pics"></use>
          </svg>
          <span class="type-desc fs7 fw500">图文</span>
        </div>
      </div>
      <div v-if="playVideo" class="background-custom">
        <!--            图文轮播-->
        <ImagePlayer v-if="video.publishType==='1'" class="imagePlayer wh100"
                     :style="{ height: imagePlayerHeight + 'px' }" :image-list="video.imageList"/>
        <!--            视频-->
        <VideoPlayer v-if="video.publishType==='0'"
                     class="videoPlayer wh100"
                     id="videoPlayer"
                     :video="video"/>
      </div>
    </div>
    <div class="video-info" @click="handleVideoPlayDialog">
      <p v-html="video.videoTitle" class="video-title two-line fs8"></p>
      <div class="video-author one-line flex-between">
        <span v-if="video.userNickName" class="fs7 cp text-hv-gold">@{{ video.userNickName }}</span>
        <span class="cg fs7">发布于 · {{ smartDateFormat(video.createTime) }}</span>
      </div>
    </div>
  </div>
  <el-dialog
      v-model="userVideoDialogVisible"
      :modal="false"
      custom-class="user-video-dialog"
      fullscreen
      :destroy-on-close="true"
      align-center>
    <VideoPlayDialog :dialog-video="video" @dialogVisible="dialogVisibleEmit"/>
  </el-dialog>
</template>

<script>
import VideoPlayer from "@/components/video/VideoPlayer.vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import VideoPlayDialog from "@/components/video/VideoPlayDialog.vue";

export default {
  name: "VideoShowCard",
  components: {VideoPlayDialog, ImagePlayer, VideoPlayer},
  props: {
    video: Object,
  },
  data() {
    return {
      playVideo: false,
      imagePlayerHeight: 0,
      userVideoDialogVisible: false,
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
    });
  },
  methods: {
    handleMouseover() {
      this.playVideo = true
      if (this.video.publishType === '1') {
        const coverImageHeight = this.$refs.coverImage.clientHeight;
        this.imagePlayerHeight = coverImageHeight;
      }
    },
    handleMouseleave() {
      this.playVideo = false
    },
    formatDuration(videoInfo) {
      if (videoInfo == null || videoInfo == "" || videoInfo == undefined) {
        return
      }
      const info = JSON.parse(videoInfo);
      const durationInSeconds = info.duration;
      let formattedDuration = '';

      if (durationInSeconds >= 3600 * 1000) {
        formattedDuration = new Date(durationInSeconds).toISOString().substr(11, 8);
      } else {
        formattedDuration = new Date(durationInSeconds).toISOString().substr(14, 5);
      }

      return formattedDuration;
    },
    handleVideoPlayDialog() {
      this.userVideoDialogVisible = true
    },
    dialogVisibleEmit(flag) {
      this.userVideoDialogVisible = flag
    },
  },
}
</script>

<style scoped>
.video-card {
  background-color: var(--bg-video-card);
  border-radius: 1rem;
  display: flex;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .12);
  }

  .video-cover-image {
    object-fit: contain;
    overflow: hidden;
    border-radius: 1rem 1rem 0 0;
    position: relative;
    background-size: contain;

    .cover-image {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 1rem 1rem 0 0;
    }

    .cover-image:hover {
      transition: all .5s ease;
      transform: scale(1.1);
    }

    .video-like {
      position: absolute;
      bottom: .5rem;
      color: white;
      left: .5rem;
    }

    .video-duration {
      position: absolute;
      bottom: .5rem;
      color: white;
      right: .5rem;
      background-color: rgba(51, 51, 51, 0.57);
      border-radius: .4rem;
      padding: 3px 6px;
    }
  }

  .video-info {
    width: 100%;
    padding: 10px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;

    .video-title {

    }

    .video-author {
      margin-top: .5rem;
    }
  }

}

.video-type-pics {
  position: absolute;
  left: 5%;
  top: 4%;
  padding: 5px 10px;
  background: var(--niuyin-bg-color2);
  backdrop-filter: blur(10px);
  border-radius: 6px;

  .type-desc {
    margin-left: 2px;
    color: gold;
  }
}

/*移动端适配*/
/*@media (max-width: 500px) {
  .video-card {
    width: 49%;
    height: 160px;
  }
}*/

/*@media (max-width: 1440px) {
  .video-card {
    width: 25%;
    height: 160px;
  }
}*/

:deep(.d-player-wrap .d-player-control) {
  height: 10px !important;
}

:deep(.d-player-wrap .d-player-control .d-control-tool) {
  display: none !important;
}

</style>
