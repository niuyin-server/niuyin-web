<script setup>
import {computed, onMounted, ref} from 'vue'
import {getModelRolePage} from "@/api/ai/model/role.js";
import {UserFilled, Plus} from "@element-plus/icons-vue";
import {debounce} from "@/utils/roydon.js";
import {LoadingOne} from "@icon-park/vue-next";

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:drawer'
])

const drawerProxy = computed({
  get: () => props.drawer,
  set: (newValue) => emit('update:drawer', newValue)
})

const queryDTO = ref({
  pageNum: 1,
  pageSize: 10,
  name: null
})

const loading = ref(false)

const knowledgeList = ref([])
const knowledgeTotal = ref(0)

const initKnowledgePage = async () => {
  loading.value = true
  const res = await getModelRolePage(queryDTO.value)
  knowledgeList.value = res.data.rows
  knowledgeTotal.value = res.data.total
  loading.value = false
}

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initKnowledgePage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initKnowledgePage()
}

const dialogVisible = ref(false)
onMounted(() => {
  initKnowledgePage()
})

const scrollContainer = ref(null);
const hasMore = ref(true); // 是否还有更多数据可加载
const loadingMore = ref(false);

const handleScroll = debounce(() => {
  const container = scrollContainer.value;
  if (!container) return;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  // 距离底部一定阈值(如50px)时触发加载
  const threshold = 50;
  if (scrollHeight - (scrollTop + clientHeight) <= threshold) {
    loadMore();
  }
}, 100, false)

const loadMore = () => {
  if (!hasMore.value) return
  console.log('loadMore')
  loadingMore.value = true

}

</script>

<template>
  <div class="drawer-container">
    <el-drawer v-model="drawerProxy" title="🤓知识库" destroy-on-close size="42%">
      <!-- 知识库列表 -->
      <div class="w-full max-h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" ref="scrollContainer" @scroll="handleScroll" >
        <!-- 知识库卡片 -->
        <div v-for="item in 13" class="hover:shadow-lg transition-smooth hover:-translate-y-0.5 bg-[var(--bg-video-card)] rounded-xl border border-[var(--niuyin-border-color)] p-6 flex flex-col">
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <i class="ri-book-2-line text-indigo-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-[var(--niuyin-text-color)]">产品文档</h3>
                <span class="text-xs py-1 px-2 bg-blue-50 text-blue-600 rounded-full mt-1 inline-block">GPT-4</span>
              </div>
            </div>
            <button class="text-gray-400 hover:text-gray-600">
              <i class="ri-more-2-fill"></i>
            </button>
          </div>
          <p class="text-gray-500 mt-4 mb-6 text-sm">包含所有产品特性和使用说明的详细文档</p>
          <div class="flex justify-between items-center mt-auto">
            <div class="text-xs text-gray-500">最后更新: 2023-11-15</div>
            <div class="flex space-x-2">
              <button class="text-gray-500 hover:text-blue-500 py-1 px-2 rounded-full hover:bg-blue-50 transition-smooth">
                <i class="ri-pencil-line"></i>
              </button>
              <button class="text-gray-500 hover:text-red-500 py-1 px-2 rounded-full hover:bg-red-50 transition-smooth">
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- 知识库卡片 6 - 空状态 -->
        <div
            @click="dialogVisible = true"
            class="border-4 cp border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 text-center hover:border-[var(--niuyin-primary-color)] transition-smooth">
          <div class="w-14 h-14 rounded-full bg-[var(--niuyin-primary-color-3)] flex items-center justify-center mb-4">
            <i class="ri-add-line text-primary text-2xl"></i>
          </div>
          <h3 class="font-medium text-[var(--niuyin-text-color)] mb-1">添加新知识库</h3>
          <p class="text-gray-500 text-sm mb-4">点击创建新的知识库集合</p>
          <button id="addBtn2" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
            <i class="ri-add-line mr-1"></i> 新建知识库
          </button>
        </div>
        <div ref="loadingRef" class="flex justify-center items-center py-4">
          <LoadingOne v-if="loadingMore" class="animate-spin"/>
          <p v-if="!hasMore" class="text-gray-500">没有更多内容了</p>
        </div>
      </div>
    </el-drawer>
    <el-dialog v-model="dialogVisible">

    </el-dialog>
  </div>
</template>

<style scoped>
.drawer-container :deep(.el-overlay ) {
  background-color: transparent !important;
}
.transition-smooth {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
