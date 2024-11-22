<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

import {removeHtmlTags, smartDateFormat} from "@/utils/roydon.js";
import {searchVideo, videoSearchSuggest} from "@/api/search.js";

import VideoSearchOneCard from "@/components/video/card/VideoSearchOneCard.vue";
import LoadingVideoSearch from "@/components/loading/LoadingVideoSearch.vue";

const loadingNew = ref(true)
const loadingMore = ref(false)
const videoSearchList = ref([])
const searchFrom = ref({
  keyword: null,// 搜索输入框的数据  url 上的keyword
  pageNum: 1,
  pageSize: 10,
  publishTimeLimit: 0,
})

const loadVideoSearch = async (dto) => {
  const res = await searchVideo(dto)
  if (res.code !== 200 || res.data === null) {
    loadingNew.value = false
    return
  }
  videoSearchList.value = [...videoSearchList.value, ...res.data]
  loadingNew.value = false
}

const handleClickTag = (tag) => {
  const keyword = removeHtmlTags(tag)
  route.query.keyword = keyword
  // this.$router.push({ name: 'videoSearch', params: { keyword: keyword }});
  this.searchFrom.keyword = keyword
  this.loadSearchVideo();
}
// 监听路由参数的变化
// watch(() => route.params, (toParams, previousParams) => {
//   // 当路由参数发生变化时执行的回调函数
//   console.log('路由参数变化了', toParams, previousParams)
//   // 这里可以添加处理逻辑，比如重新获取数据等
// })

// 监听路由变化，更新 keyword 参数
watch(() => route.query, (newQuery) => {
  searchFrom.value.keyword = newQuery.keyword
})

onMounted(() => {
  searchFrom.value.keyword = route.query.keyword
  loadVideoSearch(searchFrom.value)
})
</script>

<template>
  <div class="hint-container" id="hint-container" ref="hintContainer">
    <LoadingVideoSearch :loading="loadingNew"/>
    <div class="" v-for="item in videoSearchList" :key="item.videoId">
      <div class="user-container">
        <img class="user-avatar" :src="item.userAvatar">
        <span class="username" v-html="item.userNickName"></span>
        <span class="publish-time cg fs9"> · {{ smartDateFormat(item.publishTime) }}</span>
      </div>
      <p class="hint-title fw600" v-html="item.videoTitle"></p>
      <div class="mb1rem">
                <span class="hint-tags mr5px fs9 cp text-hv-gold" v-for="ite in item.tags">
                  <span>#</span><span @click="handleClickTag(ite)" v-html="ite"/>
                </span>
      </div>
      <div>
        <VideoSearchOneCard :video="item"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.user-container {
  display: flex;
  justify-content: flex-start;
  border-radius: 10px;

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 32px;
  }

  .username {
    line-height: 50px;
    padding: 0 10px;
  }
}

.hint-title {
  margin: 1rem 0;
}

</style>
