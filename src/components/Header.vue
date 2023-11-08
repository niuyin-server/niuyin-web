<template>
  <!--  导航栏-->
  <el-header class="niuyin-header">

    <div class="nav-left"></div>
    <!-- 导航栏中间区域 -->
    <div class="nav-center">
      <div
          class="nav_center_search"
          ref="NavSearch"
      >
        <!-- 输入框 -->
        <el-autocomplete
            class="search-input"
            slot="reference"
            v-model="searchData"
            :placeholder="searchDefaults"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
            @keyup.enter.native="searchConfirm"
            clearable
        >
          <template #default="{row,$index}">
            <el-tag
                class="mx-1"
                effect="plain"
            >
              {{ $index }}
            </el-tag>
          </template>

        </el-autocomplete>
        <el-button class="search-btn" type="info" plain @click="searchConfirm">
          <i class="iconfont icon-sousuo search_logo"></i>
          搜索
        </el-button>
      </div>
    </div>
    <div class="nav-right">
      <div style="align-items: center;display: flex;justify-content: center">
        <!--消息 -->
        <router-link class="link-type" :to="'/message'">
          <div class="flex-center icon-click"
               style=" cursor: pointer; flex-direction: column;margin: 0 10px;color: gray">
            <div style="height: 20px; justify-content: center; width: 20px;">
              <ChatLineRound style="width: 20px; height: 20px;font-weight: 600"/>
            </div>
            <p>
              <span style="font-size: 0.66rem;font-weight: 600">消息</span>
            </p>
          </div>
        </router-link>
        <!--发布视频-->
        <router-link class="link-type" :to="'/publish'">
          <div class="flex-center icon-click"
               style=" cursor: pointer; flex-direction: column;margin: 0 10px;color: gray">
            <div style="    height: 20px;justify-content: center;width: 20px;">
              <Plus style="width: 20px; height: 20px;font-weight: 600"/>
            </div>
            <p>
              <span style="font-size: 0.66rem;font-weight: 600">投稿</span>
            </p>
          </div>
        </router-link>
      </div>
      <el-dropdown>
        <router-link class="user-container" :to="'/user'">
          <el-avatar v-if="user.avatar" :src="user.avatar"/>
          <el-avatar v-else :icon="UserFilled"/>

          <span style="padding-left: 10px">{{ user.nickName }}</span>
        </router-link>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link class="link-type" @click="handleLogout" :to="'/login'"><span>退出登录</span>
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!--      <el-image :src="user.avatar"></el-image>-->

    </div>
  </el-header>
</template>

<script>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star, UserFilled,
} from '@element-plus/icons-vue'
import {useUserStore} from "@/store/useUserStore";
import {getInfo} from "@/api/user.js";

export default {
  name: "Header",
  computed: {
    UserFilled() {
      return UserFilled
    }
  },
  components: {Message},
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
      const results = this.searchHistory
      cb(results);
    },
    // 判断选中了哪个搜索历史
    handleSelect(item) {
      this.searchData = item.keyword;
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

    handleLogout() {
      localStorage.removeItem("userInfo")
      useUserStore().removetoken();
      this.$router.push('/login');
    }

  },
}
</script>

<style scoped>
.niuyin-header {
  text-align: right;
  position: relative;
  display: flex;
  align-items: center;
  background-color: aliceblue;
  justify-content: space-between;
  backdrop-filter: blur(20px);

  .nav-right {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }

}

/* nav中间部分 */
.nav-center {
  margin: 0 2rem;
}

.nav_center_search {
  width: 30vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 1.1rem;
  border: 2px solid black;

}

.search-input {
  flex: 1;
  height: 40px;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.search-history {
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  font-size: 12px
}

.search-btn {
  width: 90px;
  font-weight: 600;
  color: black;
  height: 40px;
  border-radius: 0 1rem 1rem 0;
  margin: 0;
  padding: 0;
}

.search_logo {
  font-size: 20px;
  margin-right: 5px;
  font-weight: 600;
  color: darkblue;
}

.user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.icon-click:hover {
  transition: all .3s ease-in;
  color: black !important;
  font-weight: 700 !important;
}

</style>
