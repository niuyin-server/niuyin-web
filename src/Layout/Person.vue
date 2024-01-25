<template>
  <div class="main-container">
    <el-scrollbar>
      <div class="user-container">
        <div v-viewer class="avatar-area dn-phone">
          <img class="user-avatar" :src="user.avatar"/>
        </div>
        <div class="user-info">
          <div class="username"><h1>{{ user.nickName }}</h1></div>
          <div class="follow-fans-like">
            <div class="user-info-follow flex-center">
              <div class="mr-5r cg fs8">关注</div>
              <div class="follow-right fw600">{{ followNum }}</div>
            </div>
            <div class="=user-info-fans flex-center">
              <div class="mr-5r cg fs8">粉丝</div>
              <div class="follow-right fw600">{{ fansNum }}</div>
            </div>
            <div class="user-info-like flex-center">
              <div class="mr-5r cg fs8">获赞</div>
              <div class="fw600">{{ likeAllNum }}</div>
            </div>
          </div>
          <div class="user-profile">
            <span class="userid">牛音ID：{{ user.userId }}</span>
            <span class="gender-age">
              <i class="iconfont icon-man"></i>
              <span>23岁</span></span>
            <span class="city">河南·郑州</span>
            <span class="school">中原工学院</span>
          </div>
        </div>
      </div>
      <!--  作品，喜欢，收藏  -->
      <div>
        <div class="user-works">
          <el-tabs v-model="activeName">
            <el-tab-pane v-for="item in userVideoTabShow"
                         :key="item.id"
                         :label="item.tabName"
                         :lazy="true"
                         :name="item.id">
              <!--              <router-view/>-->
            </el-tab-pane>
          </el-tabs>
          <PersonVideoPost v-if="activeName===1"/>
          <PersonVideoLike v-if="activeName===2"/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {getPersonInfo} from "@/api/member.js";
import {followAndFans} from "@/api/social.js";
import {userLikeNums} from "@/api/video.js";
import {Close, QuestionFilled} from "@element-plus/icons-vue";
import {decodeData} from "@/utils/roydon.js";
import PersonVideoPost from "@/components/person/post/PersonVideoPost.vue";
import PersonVideoLike from "@/components/person/like/PersonVideoLike.vue";

export default {
  name: 'Person',
  components: {PersonVideoLike, PersonVideoPost, QuestionFilled},
  computed: {
    Close() {
      return Close
    }
  },
  data() {
    return {
      userId: decodeData(this.$route.params.userId),
      user: {},
      editDialogVisible: false, //编辑信息弹框
      followNum: 0, // 关注数
      fansNum: 0, //粉丝数
      likeAllNum: 0, //获赞数
      activeName: 1,
      userVideoTabShow: [
        {id: 1, tabName: "作品", tabUrl: "/person/" + this.$route.params.userId + "/videoPost"},
        {id: 2, tabName: "喜欢", tabUrl: "/person/" + this.$route.params.userId + "/videoLike"},
      ]
    }
  },
  created() {
    this.getPersonProfile()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.activeName = this.$route.path
    // })
  },
  methods: {
    getPersonProfile() {
      getPersonInfo(this.userId).then(res => {
        if (res.code === 200) {
          this.user = res.data
          // console.log(this.user)
          // this.getUserFollowFansLike(res.data.userId)
        }
      })
      followAndFans(this.userId).then(res => {
        if (res.code === 200) {
          this.followNum = res.data.followedNums
          this.fansNum = res.data.fanNums
        }
      })
      userLikeNums(this.userId).then(res => {
        if (res.code === 200) {
          this.likeAllNum = res.data
        }
      })
      this.$router.push("/person/" + this.$route.params.userId + "/videoPost")
    },
    handleClick(tab, event) {
      // console.log(tab.props.name);
      // console.log(this.userId);
      const route = tab.props.name
      // console.log(this.$route.path)
      // console.log(this.$route.matched[1].path)
      this.$router.push(route)
    },
  }
}

</script>

<style scoped>
@import "@/assets/styles/user.scss";

@media (max-width: 500px) {
  .user-container .user-info {
    margin-left: 0 !important;
  }
}
</style>
