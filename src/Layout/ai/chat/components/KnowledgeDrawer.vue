<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from 'vue'
import {LoadingOne} from "@icon-park/vue-next";
import {getKnowledgeList} from "@/api/ai/knowledge/knowledge.js";
import {smartDateFormat} from "../../../../utils/roydon.js";
import {getModelList} from "@/api/ai/model/model.js";
import {Check, Close} from "@element-plus/icons-vue";
import {getToken} from "@/utils/auth.js";
import {ElMessage} from "element-plus";

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
const knowledgeHasMore = ref(true)

const observerRef = ref(null)
const loadingRef = ref(null)

const loadMore = async () => {
  if (loading.value || !knowledgeHasMore.value) return
  loading.value = true
  const res = await getKnowledgeList(queryDTO.value)
  knowledgeList.value = [...knowledgeList.value, ...res.data.rows]
  knowledgeTotal.value = res.data.total
  knowledgeHasMore.value = res.data.hasMore
  queryDTO.value.pageNum += 1
  // 重新计算页面高度
  await nextTick(() => {
    if (loadingRef.value) {
      observerRef.value.unobserve(loadingRef.value)
      observerRef.value.observe(loadingRef.value)
    }
  })
  loading.value = false
}

const observeIntersection = (entries) => {
  // if (entries[0].intersectionRatio <= 0) return;
  if (entries[0].isIntersecting) {
    loadMore()
  }
}

onMounted(() => {
  observerRef.value = new IntersectionObserver(observeIntersection, {threshold: 0.1}) // 调整阈值
  nextTick(() => {
    if (loadingRef.value) {
      observerRef.value.observe(loadingRef.value)
    }
  })

})

onUnmounted(() => {
  if (observerRef.value) {
    observerRef.value.disconnect()
  }
})

const clickKnowledgeInfo = (item) => {
  console.log("查看知识库详情", item)
}

const dialogVisible = ref(false)
const createKnowledgeForm = ref({
  name: null,
  description: null,
  embeddingModelId: null,
  topK: null,
  similarityThreshold: null,
  stateFlag: '1',
})
const createKnowledgeRules = ref({
  name: [
    {required: true, message: '请输入知识库名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
})

const clickCreateKnowledge = () => {
  loadModelOptions()
  nextTick(() => {
    dialogVisible.value = true
  })
}

const modelOptions = ref([])
const loadModelOptions = async () => {
  const res = await getModelList({type: "5"})
  modelOptions.value = res.data
}

const submitForm = () => {
  console.log("提交表单", createKnowledgeForm.value)
  // 填充模型标识
  createKnowledgeForm.value.embeddingModel = modelOptions.value.find(item => item.id === createKnowledgeForm.value.embeddingModelId)?.model

}

const uploadUrl = import.meta.env.VITE_API_BASE_URL + 'ai/web-api/knowledge/upload'
const headers = {
  Authorization: 'Bearer ' + getToken(),
}
//上传成功回调
const handleUploadSuccess = (res) => {
  if (res.code === 200) {
    createKnowledgeForm.value.coverImg = res.data
  } else {
    ElMessage.error(res.msg)
  }
}
// 上传失败回调
const handleUploadError = (res) => {

}

</script>

<template>
  <div class="drawer-container">
    <el-drawer v-model="drawerProxy" title="🤓知识库" size="45%">
      <!-- 知识库列表 -->
      <div class="w-full max-h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        <!-- 知识库卡片 -->
        <div v-for="item in knowledgeList"
             class="hover:shadow-lg transition-smooth bg-[var(--bg-video-card)] rounded-xl border border-[var(--niuyin-border-color)] p-4 flex flex-col">
          <!--          头部-->
          <div class="flex items-start justify-between w-full">
            <div class="flex items-center w-full cp" @click="clickKnowledgeInfo(item)">
              <div class=" rounded-xl bg-indigo-50 flex items-center justify-center">
                <i class="ri-book-2-line text-indigo-500 text-xl mx-5 my-4"></i>
              </div>
              <div class="ml-4 overflow-hidden">
                <div class="text-base font-semibold text-[var(--niuyin-text-color)] whitespace-nowrap truncate">
                  {{ item.name }}
                </div>
                <span
                    class="text-xs py-1 px-2 bg-blue-50 text-blue-600 rounded-full mt-1 inline-block whitespace-nowrap truncate">{{
                    item.embeddingModel
                  }}</span>
              </div>
            </div>
            <div>
              <button class="text-gray-400 hover:text-gray-600">
                <i class="ri-more-2-fill"></i>
              </button>
            </div>
          </div>
          <p class="text-gray-500 mt-4 mb-6 text-sm">{{ item.description }}</p>
          <div class="flex justify-between items-center mt-auto">
            <div class="text-xs text-gray-500">最后更新: {{ smartDateFormat(item.updateTime) }}</div>
            <div class="flex space-x-2">
              <button
                  class="text-gray-500 hover:text-blue-500 py-1 px-2 rounded-full hover:bg-blue-50 transition-smooth">
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
            @click="clickCreateKnowledge"
            class="border-4 cp border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 text-center hover:border-[var(--niuyin-primary-color)] transition-smooth">
          <div class="w-14 h-14 rounded-full bg-[var(--niuyin-primary-color-3)] flex items-center justify-center mb-4">
            <i class="ri-add-line text-primary text-2xl"></i>
          </div>
          <button id="addBtn2" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
            <i class="ri-add-line mr-1"></i> 新建知识库
          </button>
        </div>

      </div>
      <div ref="loadingRef" id="loadingRef" class="flex justify-center items-center py-4">
        <LoadingOne v-if="loading" class="animate-spin"/>
        <p v-if="!knowledgeHasMore" class="text-gray-500">没有更多内容了</p>
      </div>
    </el-drawer>
    <el-dialog title="创建知识库" v-model="dialogVisible">
      <el-form ref="createKnowledgeFormRef" :rules="createKnowledgeRules" :model="createKnowledgeForm"
               label-width="100px">
        <el-form-item label="知识库封面" prop="coverImg">
          <el-tooltip content="上传知识库封面" placement="top" effect="customized">
            <el-upload class="avatar-uploader"
                       :action="uploadUrl"
                       :headers="headers"
                       :show-file-list="false"
                       :on-error="handleUploadError"
                       :on-success="handleUploadSuccess">
              <img v-if="createKnowledgeForm.coverImg" :src="createKnowledgeForm.coverImg" class="cover" alt="cover"/>
              <i v-else class="iconfont icon-camera avatar-uploader-icon"/>
            </el-upload>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="知识库名称" prop="name">
          <el-input v-model="createKnowledgeForm.name" placeholder="请输入知识库名称" maxlength="20" show-word-limit
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="知识库描述" prop="description">
          <el-input v-model="createKnowledgeForm.description" type="textarea" placeholder="请输入知识库描述"
                    maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="向量模型" prop="embeddingModelId">
              <el-select v-model="createKnowledgeForm.embeddingModelId" style="width: 100%"
                         clearable
                         placeholder="请选择向量模型">
                <el-option v-for="item in modelOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="top-k" prop="topK">
              <el-input-number v-model="createKnowledgeForm.topK" style="width: 100%" :min="1" :max="10"
                               placeholder="请输入topK"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="相似度阈值" prop="similarityThreshold">
              <el-input-number v-model="createKnowledgeForm.similarityThreshold" style="width: 100%" :min="0"
                               :precision="2" :step="0.1"
                               :max="1"
                               placeholder="请输入相似度阈值"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用" prop="stateFlag">
              <el-switch
                  v-model="createKnowledgeForm.stateFlag"
                  inline-prompt
                  :active-value="'1'"
                  :inactive-value="'0'"
                  :active-icon="Check"
                  :inactive-icon="Close"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
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
