<template>
  <div class="category-video-container wh100">
    <!--    分类子分类-->
    <div v-if="videoCategoryChildrenList" class="category-children-list">
      <span v-for="item in videoCategoryChildrenList"
            :class="[childrenCategoryId===item.id ? 'active-item' : 'inactive', 'category-children-item']"
            @click="handlePullCategoryVideo(item.id)">
       {{ item.name }}
      </span>
    </div>
    <div class="wh100">
      <el-scrollbar>
        <el-empty v-show="videoTotal===0" description="暂无数据"/>
        <el-skeleton class="w100" :loading="loading" animated>
          <template #template>
            <div class="loading-container" v-for="i in 2">
              <div class="loading-item" v-for="i in 5">
                <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
                <div class="p1rem">
                  <el-skeleton-item variant="h1" style="width: 80%"/>
                  <div>
                    <el-skeleton-item variant="text"/>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <div class="video-list w100" style="height: auto">
              <div class="hotVideos"
                   v-masonry
                   fit-width="true"
                   transition-duration="0.2s"
                   item-selector=".video-item">
                <!--              分类视频-->
                <div v-for='(item,index) in videoList'
                     :key="item.videoId"
                     v-masonry-tile
                     class="video-item">
                  <el-card class="video-card">
                    <div class="video-cover">
                      <el-image class="eli-ofc h100"
                                :src="item.coverImage"/>
                    </div>
                    <div class="user-info">
                      <div>
                        <p class="one-line fs9">{{ item.videoTitle }}</p>
                        <p class="one-line fs7 cg">{{ item.videoDesc }}</p>
                      </div>
                      <div>
                        <el-avatar v-if="item.author.avatar"
                                   class="cp"
                                   :lazy="true"
                                   :src="item.author.avatar"
                                   @click="handlePersonInfo(item.userId)"/>
                        <el-avatar v-else class="cp"
                                   :icon="UserFilled"
                                   @click="handlePersonInfo(item.userId)"/>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
              <Loading v-if="loadingIcon" :is-full-screen="false"/>
            </div>
          </template>
        </el-skeleton>
        <div v-if="dataNotMore">
          <el-divider>暂无更多数据</el-divider>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<!--
*@author roydon
*@date 2023/12/20 20:08
-->
<script>
import {Close, UserFilled} from "@element-plus/icons-vue";
import {userInfoX} from "@/store/userInfoX";
import {encodeData} from "@/utils/roydon.js";
import {pushVideoByCategory, videoCategoryChildrenList} from "@/api/video";
import Loading from "@/components/Loading.vue";

export default {
  name: 'CategoryVideo2',
  computed: {
    Close() {
      return Close
    },
    UserFilled() {
      return UserFilled
    }
  },
  components: {Loading},
  data() {
    return {
      categoryId: this.$route.params.categoryId,
      loading: true,
      loadingIcon: false,
      loadingData: true,
      dataNotMore: false,
      svg: `<path class="path" d=" M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(10, 10, 10, 0)"/>`,
      videoList: [],
      videoTotal: null,
      videoCategoryChildrenList: null,
      childrenCategoryId: null,
    }
  },
  created() {
  },
  mounted() {
    this.initParentCategoryChildrenList()
    this.pushCategoryVideo(this.categoryId)
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  watch: {
    // categoryId(n, o) {
    //   console.log("watch categoryId change" + n)
    //   this.pushCategoryVideo()
    // }
    $route(to, from) {
      if (to.params.categoryId !== undefined) {
        this.categoryId = to.params.categoryId
        this.videoList = []
        this.videoTotal = null
        this.loading = true
        this.loadingIcon = false
        this.loadingData = true
        this.dataNotMore = false
        // console.log("to path > " + to.path)
        // console.log("from path > " + from.path)
        // console.log("watch categoryId change > " + this.categoryId)
        this.pushCategoryVideo(this.categoryId);
        this.initParentCategoryChildrenList()
      }
    }
  },
  methods: {
    pushCategoryVideo(categoryId) {
      this.loading = true
      this.videoTotal = null
      pushVideoByCategory(categoryId).then(res => {
        if (res.code === 200) {
          this.videoList = this.videoList.concat(res.data)
          this.videoTotal = this.videoList.length
          this.loading = false
        }
      })
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10) {
        //加载更多
        if (this.loadingData) {
          this.loadingData = false
          this.loadingIcon = true
          pushVideoByCategory(this.categoryId).then(res => {
            if (res.code === 200) {
              if (res.data.length === 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.videoList = this.videoList.concat(res.data)
              this.loadingIcon = false
              setTimeout(() => {
                // 流控
                this.loadingData = true
              }, 1000);
            } else {
              this.loadingIcon = false
            }
          })
        }
      }
    },
    // 跳转到用户详情页面
    handlePersonInfo(userId) {
      const loginUser = userInfoX().userInfo
      if (userId === loginUser.userId) {
        this.$router.push({
          path: '/user'
        })
      } else {
        this.$router.push({
          path: '/person/' + encodeData(userId)
        })
      }
    },
    initParentCategoryChildrenList() {
      videoCategoryChildrenList(this.categoryId).then(res => {
        if (res.code === 200) {
          this.videoCategoryChildrenList = res.data
          this.videoCategoryChildrenList.unshift({
            id: this.categoryId,
            name: "全部",
            categoryImage: null
          })
          this.childrenCategoryId = this.categoryId
        }
      })
    },
    // 点击指定子分类的视频
    handlePullCategoryVideo(id) {
      this.childrenCategoryId = id
      this.pushCategoryVideo(this.childrenCategoryId)
    }
  }
}
</script>

<style scoped>
.category-video-container {
  border-radius: 1rem;
  //padding-right: 1rem;
  overflow: hidden;
}

.loading-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .loading-item {
    width: 20%;
    padding: 0 0.5rem 1rem;
  }
}

.video-item {
  width: 20%;
  padding: 0 8px;
  margin-bottom: 10px;

  .video-card {
    display: flex;
    border-radius: 1rem;
    overflow: hidden;

    .user-info {
      height: 20%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

}

@media (max-width: 1208px) {
  .video-list .hotVideos .video-item {
    width: 25%;
  }
}

@media (max-width: 768px) {
  .video-list .hotVideos .video-item {
    width: 50%;
  }
}

.category-children-list {
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: .5rem;
  position: sticky;
  top: 0;
  z-index: 1;
  //backdrop-filter: blur(10px);
  //background-color: var(--color-bg-b0);

  .category-children-item {
    display: inline-block;
    padding: .5rem 1rem;
    background-color: var(--bg-video-card);
    border-radius: .5rem;
    margin: 0 .5rem;
    font-size: .9rem;
    cursor: pointer;

    &:hover {
      background-color: var(--niuyin-primary-color);
    }
  }

  .active-item {
    background-color: var(--niuyin-primary-color);
  }
}
</style>
