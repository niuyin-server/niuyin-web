<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
import LoadingUserSearch from "@/components/loading/LoadingUserSearch.vue";
import {searchUser} from "@/api/search.js";
import {removeHtmlTags} from "@/utils/roydon.js";


const loadingNew = ref(true)
const loadingMore = ref(false)
const userSearchList = ref([])
const searchFrom = ref({
  keyword: null,// 搜索输入框的数据  url 上的keyword
  pageNum: 1,
  pageSize: 10,
  publishTimeLimit: 0,
})

const loadUserSearch = async (dto) => {
  const res = await searchUser(dto)
  if (res.code !== 200 || res.data === null) {
    loadingNew.value = false
    return
  }
  userSearchList.value = [...userSearchList.value, ...res.data]
  loadingNew.value = false
}

const handleFollow = (userId) => {

}

// 监听路由变化，更新 keyword 参数
watch(() => route.query, (newQuery) => {
  searchFrom.value.keyword = newQuery.keyword
})

onMounted(() => {
  searchFrom.value.keyword = route.query.keyword
  loadUserSearch(searchFrom.value)
})
</script>

<template>
  <div class="hint-container">
    <LoadingUserSearch :loading="loadingNew"/>
    <div class="cp user-container oh" v-for="item in userSearchList" :key="item.videoId">
      <div class="user-main w100">
        <div class="user-main-left">
          <img class="user-avatar" :src="item.avatar" :alt="item.username">
          <span class="fw600 plr10px" v-html="item.nickName"></span>
        </div>
        <div class="user-btn">
          <el-button class="user-edit-btn" @click="handleFollow(item.userId)" type="primary">关注</el-button>
        </div>
      </div>
      <div class="user-info">
        <div class="fs9">
          <span>芝士号：</span> <span>{{ removeHtmlTags(item.username) }}</span><span
            class="ml1r cg">|</span>
          <span class="ml1r">粉丝数：</span> <span>{{ item.fans }}</span><span class="ml1r cg">|</span>
          <span class="ml1r">获赞数：</span> <span>{{ item.likes }}</span>
        </div>
        <p class="cg fs9 mt1rem">这是一段描述~</p>
      </div>
      <img class="user-cover" :src="item.avatar" alt="">
    </div>
  </div>
</template>

<style scoped>
.user-container {
  display: flex;
  background-color: var(--bg-video-card);
  margin-bottom: 1rem;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  border-radius: 10px;
  padding: 1rem;

  .user-main {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-main-left {
      display: flex;
      align-items: center;

      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 32px;
      }
    }

    .user-btn {
      z-index: 1;
    }
  }

  .user-info {
    margin-top: 1rem;
  }

  .user-cover {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(10%, 10%);
    width: 100px;
    z-index: 0;
    filter: blur(.5rem);
    height: 100px;
    border-radius: 50%;
  }
}

</style>
