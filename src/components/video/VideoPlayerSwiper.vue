<template>
  <div class="wh100 pr flex-between">
    <div class="swiper-container video-player">
      <swiper class="videoSwiper"
              ref="videoSwiper"
              :modules="modules"
              :loop="false"
              :lazy="false"
              :focusableElements="'video'"
              :slidesPerView="1"
              :spaceBetween="0"
              :autoplay="false"
              :direction="'vertical'"
              :observer="true"
              :observe-parents="true"
              :observe-slide-children="true"
              @keydown="keyDown"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
              @realIndexChange="onRealIndexChange"
              @wheel="handleWheel"
              :mousewheel="true">
        <swiper-slide v-for="(item,index) in videoList" :key="item.videoId" :virtual-index="index">
          <VideoPlayerSlide :video="item"/>
        </swiper-slide>
      </swiper>
    </div>
    <div class="swiper-operate flex-center">
      <div class="player-playswitch-tab">
        <div class="player-playswitch-prev cp" @click="handleSwiperPrev">
          <el-icon color="#c0bdbd" :size="18">
            <ArrowUpBold/>
          </el-icon>
        </div>
        <div class="player-playswitch-next cp" @click="handleSwiperNext">
          <el-icon color="#c0bdbd" :size="18">
            <ArrowDownBold/>
          </el-icon>
        </div>
      </div>

    </div>
    <div class="feedback">
      <div class="feedback-icon flex-center cp">
        <el-icon color="#5a5a5a" :size="20">
          <QuestionFilled/>
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue'; // swiper所需组件
// 这是分页器和对应方法，swiper好像在6的时候就已经分离了分页器和一些其他工具
import {Autoplay, Navigation, Pagination, A11y, Mousewheel} from 'swiper';
// 引入swiper样式，对应css 如果使用less或者css只需要把scss改为对应的即可
import 'swiper/css'
import 'swiper/css/pagination' // 轮播图底面的小圆点
import 'swiper/css/navigation'
import {
  createFavorite,
  favoriteVideoToCollection,
  likeVideo,
  myFavoriteList,
  onlyFavoriteVideo,
  videoInWhoseCollection
} from "@/api/behave.js";
import {followUser} from "@/api/social.js";
import {
  ArrowDownBold,
  ArrowUpBold, ChatDotRound, ChromeFilled,
  CirclePlus,
  Close,
  MoreFilled,
  QuestionFilled,
  UserFilled
} from "@element-plus/icons-vue";
import ImagePlayer from "@/components/video/ImagePlayer.vue";
import VideoPlayer from "@/components/video/VideoPlayer.vue"; // 轮播图两边的左右箭头
import VideoComment from "@/components/video/comment/VideoComment.vue";
import {videoFeed} from "@/api/video.js";
import VideoPlayerSlide from "@/components/video/swiper/VideoPlayerSlide.vue";
// import 'swiper/css/scrollbar'  // 轮播图的滚动条

export default {
  name: 'VideoPlayerSwiper',
  components: {
    VideoPlayerSlide,
    VideoComment,
    Swiper,
    SwiperSlide,
    ImagePlayer,
    CirclePlus, QuestionFilled, ArrowDownBold, ArrowUpBold, MoreFilled, VideoPlayer,
  },
  computed: {
    UserFilled() {
      return UserFilled
    },
    ChatDotRound() {
      return ChatDotRound
    },
    ChromeFilled() {
      return ChromeFilled
    },
    Close() {
      return Close
    },
  },
  props: {
    videoList: {
      type: Array,
      required: true,
      default: []
    },
    loading: Boolean
  },
  data() {
    return {
      videoSwiper: {},
      modules: [Autoplay, Pagination, Navigation, A11y, Mousewheel],
      realIndex: 0,
      loadMore: false,
      dialogFormVisible: false,
      favoriteBtn: false,
      publishTime: null,
      userFavoriteForm: {
        title: "",
        description: "",
        coverImage: "",
        showStatus: "0"
      },
      userFavoriteList: '',
      userFavoriteTotal: undefined,
      showVideo: true,
      timeOut: null,
      drawer: false,
      commentInput: '',
      // 视频评论查询参数
      commentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        videoId: undefined,
      },
      commentTotal: 0,
      videoId: '',
      videoCommentTree: [],
      showVideoComment: false, // 控制评论子组件显隐
      videoDisplay: true,
      isLiked: false, // 是否已经快捷键点赞
      startIndex: 1,
      favoriteChecked: [],//已选收藏夹
      waitLoadData: false, //待加载数据
    }
  },
  emits: ['reloadVideoFeed'],
  created() {
  },
  mounted() {
    // this.initSwiper();
    this.onSwiper(this.videoSwiper);
    // this.$nextTick(() => {
    //   this.videoSwiper.update(); // 数据更新后更新Swiper实例
    // });
  },
  watch: {
    videoList(newList) {
      this.$nextTick(() => {
        this.videoSwiper.update(); // 数据更新后更新Swiper实例
      });
    },
  },
  methods: {
    // initSwiper() {
    //   this.$nextTick(() => {
    //     // this.swiper = this.$refs.videoSwiper.swiper;
    //     this.videoSwiper.update(); // 更新Swiper实例
    //     this.videoSwiper.slideTo(0, 0); // 将Swiper滚动到第一个slide的位置
    //   });
    // },
    onSwiper(s) {
      this.videoSwiper = s
      // console.log(this.videoSwiper)
    },
    onSlideChange() {
      console.log("slide change")
      // let videos = document.getElementsByClassName("videoPlayer");
      // console.log(videos)
      // for (let i = 0; i < videos.length; i++) {
      //   setTimeout(() => {
      //     videos[i].pause();
      //     videos[i].load();
      //   }, 1);
      // }
    },
    onReachEnd() {
      console.log("slide end")
    },
    onRealIndexChange(swiper) {
      this.realIndex = swiper.realIndex
    },
    // 鼠标滚轮事件
    handleWheel() {
      const _that = this;
      this.drawer = false
      this.showVideoComment = false
      if (!_that.timeOut) {
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          console.log("handleWheel" + this.realIndex)
          if (this.realIndex === this.videoList.length - 1) {
            if (this.waitLoadData) {
              this.$emit("reloadVideoFeed", true)
            }
            this.waitLoadData = true
            console.log("end end end end end......")
          }
        }, 200);
      }
    },
    // 操控按钮--切换上一个
    handleSwiperPrev() {
      console.log("handleSwiperPrev")
      const _that = this;
      this.drawer = false
      this.showVideoComment = false
      if (!_that.timeOut) {
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          this.videoSwiper.slidePrev()
        }, 200);
      }
    },
    // 操控按钮--切换下一个
    handleSwiperNext() {
      console.log("handleSwiperNext")
      const _that = this;
      this.drawer = false
      this.showVideoComment = false
      if (!_that.timeOut) {
        _that.timeOut = setTimeout(() => {
          _that.timeOut = null;
          this.videoSwiper.slideNext()
          console.log("handleWheel" + this.realIndex)
          if (this.realIndex === this.videoList.length - 1) {
            if (this.waitLoadData) {
              this.$emit("reloadVideoFeed", true)
            }
            this.waitLoadData = true
            console.log("end end end end end......")
          }
        }, 200);
      }
    },
    // 鼠标悬停显示
    handleFavoriteOver(videoId) {
      // console.log("handleFavoriteShow" + videoId)
      // 查询登录用户的收藏夹列表
      myFavoriteList().then(res => {
        if (res.code === 200) {
          this.userFavoriteList = res.data
        }
      })
      // 查询当前视频在那些收藏夹
      videoInWhoseCollection(videoId).then(res => {
        if (res.code === 200) {
          this.favoriteChecked = res.data
        }
      })
      // 鼠标悬停事件改为显示
      this.$refs[`favoritePop${videoId}`][0].showPopper = true
    },
    // 鼠标离开后显示事件改为不显示
    handleFavoriteLeave(videoId) {
      this.$refs[`favoritePop${videoId}`][0].showPopper = false
    },
    // 点赞视频
    videoLikeClick(videoId) {
      this.videoList.forEach((item, index) => {
        if (item.videoId === videoId) {
          // 设置为已点赞
          item.weatherLike = !item.weatherLike
          if (item.weatherLike) {
            item.likeNum += 1
          } else {
            item.likeNum -= 1
          }
        }
      })
      likeVideo(videoId).then(res => {
        if (res.code === 200) {

        } else {
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              // 设置为已点赞
              item.weatherLike = !item.weatherLike
              if (item.weatherLike) {
                item.likeNum += 1
              } else {
                item.likeNum -= 1
              }
            }
          })
        }
      })
    },
    // 打开评论抽屉
    videoCommentClick(videoId) {
      this.videoId = videoId
      this.drawer = true
      this.showVideoComment = true
    },
    // 接收子组件增加视频评论传值
    updateVideoCommentNumEmit(videoId) {
      this.videoList.forEach((item, index) => {
        if (item.videoId === videoId) {
          // 评论数+1
          item.commentNum += 1
        }
      })
    },
    keyDown(e) {
      if (e.keyCode === 38) {
        console.log("方向键--上")
        const _that = this;
        this.drawer = false
        this.showVideoComment = false
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            _that.videoSwiper.slidePrev()
          }, 1000);
        }
      }
      if (e.keyCode === 40) {
        console.log("方向键--下")
        const _that = this;
        this.drawer = false
        this.showVideoComment = false
        if (!_that.timeOut) {
          _that.timeOut = setTimeout(() => {
            _that.timeOut = null;
            _that.videoSwiper.slideNext()
          }, 1000);
        }
      }
      if (e.keyCode === 37) {
        console.log("方向键--左")
      }
      if (e.keyCode === 39) {
        console.log("方向键--右")
      }
    },
    // 跳转用户详情页面
    handleLinkUserInfo(userId) {
      console.log(userId)
    },
    // 关注用户
    handleAttUser(userId) {
      followUser(userId).then(res => {
        if (res.code === 200) {
          this.$message.success('关注成功')
          // 将数组此条数据改为已关注 weatherFollow = true
          this.videoList.forEach((item, index) => {
            if (item.userId === userId) {
              item.weatherFollow = true;
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    keyDownZ(videoId, e) {
      // 点赞
      if (e.keyCode === 90) {
        console.log(videoId)
        if (!this.isLiked) {
          this.videoLikeClick(videoId)
          this.isLiked = true
        }
      }
    },
    // 创建收藏夹
    handleCreateFavorite() {
      console.log(this.userFavoriteForm)
      createFavorite(this.userFavoriteForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogFormVisible = false
          this.userFavoriteForm = {}
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 监听收藏夹多选事件变化
    handleFavoriteCheckedChange(val) {
      this.favoriteBtn = false
    },
    // 仅仅收藏视频
    handleOnlyFavoriteVideo(videoId) {
      onlyFavoriteVideo(videoId).then(res => {
        if (res.code === 200) {
          // 收藏成功，将数组此视频的是否收藏改为已收藏
          this.$message.success("收藏成功")
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              if (!item.weatherFavorite) {
                item.favoritesNum += 1;
              }
              item.weatherFavorite = true;
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 收藏视频到收藏夹
    handleCollectVideo(videoId) {
      const dto = {
        "videoId": videoId,
        "favorites": this.favoriteChecked
      }
      favoriteVideoToCollection(dto).then(res => {
        if (res.code === 200 && res.data === true) {
          // 收藏成功
          this.$message.success("收藏成功")
          this.videoList.forEach((item, index) => {
            if (item.videoId === videoId) {
              if (!item.weatherFavorite) {
                item.favoritesNum += 1;
              }
              item.weatherFavorite = true;
            }
          })
        } else if (res.code === 200 && res.data === false) {
          // 从收藏夹移除
          this.$message.success("收藏成功")
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消收藏
    handleCancelFavoriteOver(videoId) {
      console.log("取消收藏=》" + videoId)
      myFavoriteList().then(res => {
        if (res.code === 200) {
          this.userFavoriteList = res.data
        }
      })
      // 鼠标悬停事件改为显示
      this.$refs[`favoritePop${videoId}`][0].showPopper = true
    },
    parseAddress(pos) {
      let add = pos.address.split(pos.province)[1]
      // 排除城市
      if (pos.city !== "") {
        add = add.split(pos.city)[1]
      }
      // 排除县
      if (pos.district !== "") {
        add = add.split(pos.district)[1]
      }
      // 排除街道
      if (pos.township !== "") {
        add = add.split(pos.township)[1]
      }
      return add
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy")
    if (this.videoSwiper) {
      this.videoSwiper.destroy();
      this.videoSwiper = {};
    }
  },
}
</script>
<style scoped>
@import "@/assets/styles/components/video-player-swiper.scss";
</style>
