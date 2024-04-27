<template>
  <div class="nav-right">
    <div class="flex-center dn-phone">
      <!--通知-->
      <el-popover :width="320" ref="noticePopover">
        <template #reference>
          <div class="link-type cp" @mousemove="handleNoticeShow" @mouseleave="handleNoticeHide">
            <!--          <div class="link-type cp" >-->
            <div class="flex-column icon-click cg plr10px">
              <el-badge :value="noticeCount" class="item">
                <div s tyle="height: 20px; justify-content: center; width: 20px;">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-notice"></use>
                  </svg>
                </div>
              </el-badge>
              <p>
                <span class="cg fs7">通知</span>
              </p>
            </div>
          </div>
        </template>
        <template #default>
          <Notice v-if="showNotice" @noticeRefreshEmit="emitNoticeRefresh"/>
        </template>
      </el-popover>
      <!--消息 -->
      <router-link class="link-type cp" :to="'/message'">
        <div class="flex-column icon-click cg plr10px">
          <div style="height: 20px;width: 20px;">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-message"></use>
            </svg>
          </div>
          <p>
            <span class="cg fs7">消息</span>
          </p>
        </div>
      </router-link>
      <!--发布视频-->
      <router-link class="link-type cp" to="" @click.native="openTargetLink('http://106.14.105.101:5273')">
        <div class="flex-column icon-click cg plr10px">
          <div style="height: 20px;width: 20px;">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-upload"></use>
            </svg>
          </div>
          <p>
            <span class="cg fs7">投稿</span>
          </p>
        </div>
      </router-link>
    </div>
    <el-popover class="user-popover"
                :width="400"
                :inert="60"
                @show="handlePopoverShow"
                popper-style="padding: 20px;">
      <template #reference>
        <router-link class="user-container" :to="'/user'">
          <el-avatar v-if="user.avatar" class="hv-scale" :src="user.avatar"/>
          <el-avatar v-else :icon="UserFilled"/>
        </router-link>
      </template>
      <template #default>
        <div class="userinfo-area">
          <div class="userinfo-header flex-between">
            <p class="one-line fw600 cp">
              <router-link class="cg flex-center" to="/user/videoPost">
                <span>{{ user.nickName }}</span>
                <el-icon>
                  <ArrowRightBold/>
                </el-icon>
              </router-link>
            </p>
            <div class="trust-login flex-center">
              <div class="trust-login-title mr-5r cg fs7">保存登录信息</div>
              <div class="ml-5r">
                <el-switch v-model="saveLogin"
                           active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </div>
            </div>
          </div>
          <div class="userinfo-center">
            <div class="flex-between dn-phone">
              <!-- 我的作品 -->
              <router-link class="link-type flex-center" :to="item.url" v-for="item in userPostInfo">
                <div class="flex-center icon-click cg cp"
                     style="flex-direction: column;padding: 0 10px;">
                  <div class="tac wh32 hv-scale">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="item.icon"></use>
                    </svg>
                  </div>
                  <div>
                    <h4>{{ item.num }}</h4>
                  </div>
                  <p>
                    <span class="cg fs7">{{ item.title }}</span>
                  </p>
                </div>
              </router-link>
            </div>
          </div>
          <el-divider/>
          <div class="userinfo-footer flex-between">
            <div class="flex-center">
              <span>客服</span>
            </div>
            <div class="flex-center">
              <div class="link-type flex-center mr-5r cp switch-theme" @click="handleThemeSwitch">
                <el-icon>
                  <Sunrise/>
                </el-icon>
                <span class="ml-5r">换肤</span></div>
              <router-link class="link-type flex-center" @click="handleLogout" :to="'/login'">
                <el-icon>
                  <SwitchButton/>
                </el-icon>
                <span class="ml-5r">退出登录</span>
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
import {myVideoCount} from "@/api/video.js";
import {myLikeCount, myFavoriteCount} from "@/api/behave.js";
import {ArrowRightBold, Sunrise, SwitchButton, UserFilled} from "@element-plus/icons-vue";
import {themeX} from "@/store/themeX";
import Notice from "@/components/nav/Notice.vue";
import {noticeCount} from "@/api/notice.js";
import {tokenX} from "@/store/tokenX";
import {userInfoX} from "@/store/userInfoX";
import {removeToken} from "@/utils/auth.js";

export default {
  name: "NavRight",
  components: {SwitchButton, Sunrise, ArrowRightBold, Notice},
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  props: {
    user: Object,
  },
  data() {
    return {
      // 右侧导航栏
      rightNavList: [
        {id: 1, icon: "iconfont icon-notice", num: 2, title: "通知", url: "/notice"},
        {id: 2, icon: "iconfont icon-message", num: 0, title: "消息", url: "/message"},
        {id: 3, icon: "iconfont icon-upload", num: 0, title: "投稿", url: "/publish"},
      ],
      saveLogin: true, // 保存登录信息
      userPostInfo: [
        {id: 1, icon: "#icon-videoPost", num: 0, title: "我的作品", url: "/user/videoPost"},
        {id: 2, icon: "#icon-like-ed", num: 0, title: "我的喜欢", url: "/user/videoLike"},
        {id: 3, icon: "#icon-favorite-ed", num: 0, title: "我的收藏", url: "/user/videoFavorite"},
        {id: 4, icon: "#icon-history", num: 0, title: "观看历史", url: "/user/videoViewHistory"},
      ],
      showNotice: false,
      noticeCount: undefined,
      noticeCountQueryParams: {
        receiveFlag: "0"
      }
    }
  },
  created() {
    this.initTheme()
    this.initNotice()
  },
  emits: ['darkChangeEmit'],
  mounted() {
    // this.$nextTick(()=> {
    //   this.$refs.noticePopover.updatePopper()
    // })
  },
  methods: {
    initTheme() {
      const html = document.querySelector('html')
      const dark = themeX().dark
      if (dark) {
        html.classList.remove("light")
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
        html.classList.add("light")
      }
    },
    // 获取评论数量
    initNotice() {
      noticeCount(this.noticeCountQueryParams).then(res => {
        if (res.code === 200) {
          this.noticeCount = res.data
        }
      })
    },
    // 用户popover的show时间
    handlePopoverShow() {
      // 封装用户作品量、喜欢量、收藏量
      myVideoCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item) => {
            return item.id === 1 ? item.num = res.data : 0
          })
        }
      })
      myLikeCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item) => {
            return item.id === 2 ? item.num = res.data : 0
          })
        }
      })
      myFavoriteCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item) => {
            return item.id === 3 ? item.num = res.data : 0
          })
        }
      })
    },
    // 退出登录
    handleLogout() {
      tokenX().removeToken()
      userInfoX().removeUserInfo()
      removeToken()
      this.$router.push('/login');
    },
    // 主题切换，换肤功能
    handleThemeSwitch() {
      const html = document.querySelector('html')
      const dark = themeX().dark
      if (html) {
        this.$emit("darkChangeEmit", !dark)
        if (dark) {
          themeX().setDark(false)
          html.classList.remove("dark")
          html.classList.add("light")
        } else {
          themeX().setDark(true)
          html.classList.remove("light")
          html.classList.add("dark")
        }
      }
    },
    // 显示通知
    handleNoticeShow() {
      this.showNotice = true
    },
    // 通知弹框隐藏
    handleNoticeHide() {
      this.showNotice = true
    },
    // 接收子事件
    emitNoticeRefresh() {
      this.initNotice()
    },
    openTargetLink(link){
      window.open(link, "_blank")
    }
  }
}
</script>

<style scoped>
</style>
