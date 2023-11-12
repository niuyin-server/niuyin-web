<template>
  <!--  导航栏-->
  <el-header class="niuyin-header backdrop-filter">
    <div class="nav-left"></div>
    <!-- 导航栏中间区域 -->
    <div class="nav-center">
      <div class="nav_center_search"
           ref="NavSearch">
        <!-- 输入框 -->
        <el-autocomplete
            class="search-input"
            slot="reference"
            v-model="searchData"
            :placeholder="searchDefaults"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
            @keyup.enter.native="searchConfirm"
            clearable>
          <template #default="{item}">
            <el-tag class="mx-1"
                    closable
                    type="info"
                    @close="handleDelSearchHistory(item)"
                    effect="plain">
              {{ item }}
            </el-tag>
          </template>
        </el-autocomplete>
        <el-button class="search-btn" type="info" plain @click="searchConfirm">
          <i class="iconfont icon-search search-logo"></i><span>搜索</span>
        </el-button>
      </div>
    </div>
    <div class="nav-right">
      <div class="flex-center dn-phone">
        <!--通知 -->
        <router-link class="link-type" :to="'/notice'">
          <div class="flex-center icon-click cg"
               style="cursor: pointer; flex-direction: column;margin: 0 10px;">
            <el-badge :value="2" class="item">
              <div style="height: 20px; justify-content: center; width: 20px;">
                <i class="iconfont icon-notice"></i>
              </div>
              <p>
                <span class="cg fs7">通知</span>
              </p>
            </el-badge>
          </div>
        </router-link>
        <!--消息 -->
        <router-link class="link-type" :to="'/message'">
          <div class="flex-center icon-click cg"
               style="cursor: pointer; flex-direction: column;margin: 0 10px;">
            <div style="height: 20px; justify-content: center; width: 20px;">
              <i class="iconfont icon-message"></i>
            </div>
            <p>
              <span class="cg fs7">消息</span>
            </p>
          </div>
        </router-link>
        <!--发布视频-->
        <router-link class="link-type" :to="'/publish'">
          <div class="flex-center icon-click cg"
               style="cursor: pointer; flex-direction: column;margin: 0 10px;">
            <div style="height: 20px;justify-content: center;width: 20px;">
              <!--              <Plus style="width: 20px; height: 20px;font-weight: 600"/>-->
              <i class="iconfont icon-upload"></i>
            </div>
            <p>
              <span class="cg fs7">投稿</span>
            </p>
          </div>
        </router-link>
      </div>
      <el-popover class="user-popover"
                  :width="400"
                  trigger="hover"
                  @show="handlePopoverShow"
                  popper-style="padding: 20px;">
        <template #reference>
          <router-link class="user-container" :to="'/user'">
            <el-avatar v-if="user.avatar" :src="user.avatar"/>
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
                    <div class="tac wh32">
                      <i :class="item.icon" class="icon-style"></i>
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

              </div>
              <div class="flex-center">
                <router-link class="link-type flex-center mr-5r" :to="'/'">
                  <el-icon>
                    <Sunrise/>
                  </el-icon>
                  <span class="ml-5r">换肤</span>
                </router-link>
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
  </el-header>
</template>

<script>
import {
  ArrowRightBold,
  Message, QuestionFilled,
  Sunrise, SwitchButton, UserFilled,
} from '@element-plus/icons-vue'
import {useUserStore} from "@/store/useUserStore";
import {getInfo} from "@/api/member.js";
import {myVideoCount} from "@/api/video.js";
import {myLikeCount, myFavoriteCount} from "@/api/behave.js";

export default {
  name: "Header",
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  components: {Sunrise, SwitchButton, ArrowRightBold, QuestionFilled, Message},
  props: {
    // user: Object,
    // 热搜数据
    hotsearch: {
      type: Array,
      default() {
        return [];
      },
    },
    searchHistory: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {},
      // 输入框的数据
      searchData: "",
      // 默认搜索词
      searchDefaults: "输入你感兴趣的内容",
      saveLogin: true, // 保存登录信息
      userPostInfo: [
        {id: 1, icon: "iconfont icon-videoPost", num: 0, title: "我的作品", url: "/user/videoPost"},
        {id: 2, icon: "iconfont icon-like-ed", num: 0, title: "我的喜欢", url: "/user/videoLike"},
        {id: 3, icon: "iconfont icon-favorite-ed", num: 0, title: "我的收藏", url: "/user/videoFavorite"},
        {id: 4, icon: "iconfont icon-history", num: 0, title: "观看历史", url: "/user/videoViewHistory"},
      ]
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      if (localStorage.getItem("userInfo") == null) {
        getInfo().then(res => {
          if (res.code === 200) {
            this.user = res.data
            localStorage.setItem("userInfo", JSON.stringify(res.data))
          }
        })
      }
    },
    // 输入框获取焦点时调用的方法
    querySearch(queryString, cb) {
      let results = this.searchHistory
      // results = queryString ? results.filter(this.createFilter(queryString)) : results;
      let res = results.map((item, index) => {
        return item.keyword
      })
      console.log(res)
      cb(res);
    },
    createFilter(queryString) {
      return (item) => {
        return item.value.toUpperCase().match(queryString.toUpperCase());
      };
    },
    // 判断选中了哪个搜索历史
    handleSelect(item) {
      this.searchData = item;
      this.routerJump();
    },
    // 确认搜索
    searchConfirm() {
      if (this.searchData === "") {
        this.searchData = this.searchDefaults;
      }
      this.routerJump();
    },
    // 路由跳转
    routerJump() {
      // 跳转到搜索页面
      this.$router.push(`/videoSearch?keyword=${this.searchData}`);
    },
    // 退出登录
    handleLogout() {
      localStorage.removeItem("userInfo")
      useUserStore().removetoken();
      this.$router.push('/login');
    },
    // 用户popover的show时间
    handlePopoverShow() {
      // 封装用户作品量、喜欢量、收藏量
      myVideoCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item, index) => {
            return item.id === 1 ? item.num = res.data : 0
          })
        }
      })
      myLikeCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item, index) => {
            return item.id === 2 ? item.num = res.data : 0
          })
        }
      })
      myFavoriteCount().then(res => {
        if (res.code === 200) {
          this.userPostInfo.forEach((item, index) => {
            return item.id === 3 ? item.num = res.data : 0
          })
        }
      })
    },
    // 删除搜索历史记录
    handleDelSearchHistory(item) {
      console.log(item)
    }
  },
}
</script>

<style scoped>
@import "@/assets/styles/header.scss";

</style>
