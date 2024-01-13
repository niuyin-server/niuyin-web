<template>
  <div class="flex-between" v-loading="loadingIcon">
    <el-skeleton class="w100" :loading="loading" animated>
      <template #template>
        <div class="loading-container" v-for="i in 1">
          <div class="loading-item" v-for="i in 5">
            <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
            <div style="padding: 14px">
              <el-skeleton-item variant="h1" style="width: 70%"/>
              <div>
                <el-skeleton-item variant="text"/>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <VideoCard
            v-for="item in likeVideoList"
            :video="item"/>
      </template>
    </el-skeleton>
    <div class="w100">
      <el-empty v-show="likeVideoTotal<=0" description="暂无数据"/>
    </div>
  </div>
  <div v-if="dataNotMore">
    <el-divider>暂无更多数据</el-divider>
  </div>
</template>

<script>
import VideoCard from "@/components/video/VideoCard.vue";
import {decodeData} from "@/utils/roydon.js";
import {personVideoLikePage} from "@/api/behave.js";

export default {
  name: "PersonVideoLike",
  components: {VideoCard},
  data() {
    return {
      loading: true,
      dialogVisible: false,
      likeVideoList: [],
      likeVideoTotal: undefined,
      videoQueryParams: {
        userId: decodeData(this.$route.params.userId),
        videoTitle: undefined,
        pageNum: 1,
        pageSize: 10
      },
      loadingData: true,
      loadingIcon: false,
      dataNotMore: false
    }
  },
  created() {
    this.initVideoList()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    initVideoList() {
      this.loading = true
      personVideoLikePage(this.videoQueryParams).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.likeVideoList = res.rows
          this.likeVideoTotal = res.total
          this.loading = false
        }
      })
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10) {
        if (this.dataNotMore) {
          return
        }
        //加载更多
        if (this.loadingData) {
          this.loadingIcon = true
          this.loadingData = false
          this.videoQueryParams.pageNum += 1
          personVideoLikePage(this.videoQueryParams).then(res => {
            if (res.code === 200) {
              if (res.rows.length === 0) {
                this.dataNotMore = true
                this.loadingIcon = false
                this.loadingData = false
                return;
              }
              this.likeVideoList = this.likeVideoList.concat(res.rows)
              this.loadingIcon = false

            } else {
              this.loadingIcon = false
            }
          })
          setTimeout(() => {
            // 流控
            this.loadingData = true
          }, 1000);
        }
      }
    },
  }
}

</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .loading-item {
    width: 19%;
  }
}
</style>
