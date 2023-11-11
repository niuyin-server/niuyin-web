<template>
  <div class="video-card">
    <div class="video-cover-image">
      <el-image class="cover-image" :src="video.coverImage"/>
      <div class="video-like">
        <i class="iconfont icon-like-num "></i>
        <span class="ml-5r">{{ video.likeNum }}</span>
      </div>
    </div>
    <div class="video-info">
      <p v-html="video.videoTitle" class="video-title two-line fs8"></p>
      <div class="video-author one-line">
        <span v-if="video.userNickName">{{ video.userNickName }} · </span>
        <span class="cg fs8">{{ video.createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "VideoCard",
  props: {
    video: Object,
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {},
  filters: {
    //计算时间，类似于几分钟前，几小时前，几天前等
    // changeTime(val) {
    //   let time = new Date(val); //先将接收到的json格式的日期数据转换成可用的js对象日期
    //   return new timeago().format(time, 'zh_CN'); //转换成类似于几天前的格式
    // }
  }
}
</script>

<style scoped>
.video-card {
  background: rgba(250, 250, 250, 1);
  border-radius: 1rem;
  width: 24.5%;
  box-shadow: rgba(0, 0, 0, 0.133) 0 1.6px 3.6px 0, rgba(0, 0, 0, 0.11) 0 0.3px 0.9px 0;
  transition: all 0.3s ease;
  height: 240px;
  margin-bottom: 10px;

  .video-cover-image {
    width: 100%;
    height: 70%;
    overflow: hidden;
    border-radius: 1rem 1rem 0 0;
    position: relative;

    .cover-image {
      height: 100%;
      width: 100%;
      cursor: pointer;
      border-radius: 1rem 1rem 0 0;
    }

    .cover-image:hover {
      transition: all 0.5s ease;
      transform: scale(1.1);
    }

    .video-like {
      position: absolute;
      bottom: 5%;
      color: white;
      left: 5%;

    }
  }

  .video-info {
    width: 100%;
    height: 30%;
    padding: 10px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;


    .video-title {

    }

    .video-author {

    }
  }

}

.video-card:hover {
  box-shadow: 1px 1px 0 0 grey;
}

/*移动端适配*/
@media (max-width: 500px) {
  .video-card {
    width: 49%;
    height: 160px;
  }
}

</style>
