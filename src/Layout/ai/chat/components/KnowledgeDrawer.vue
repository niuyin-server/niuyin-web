<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref} from 'vue'
import {LoadingOne, Edit, Delete, Data, Reload} from "@icon-park/vue-next";
import {createKnowledge, editKnowledge, getKnowledge, getKnowledgeList} from "@/api/ai/knowledge/knowledge.js";
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
  coverImg: [
    {required: true, message: '请选择封面', trigger: 'blur'},
  ],
  name: [
    {required: true, message: '请输入知识库名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  embeddingModelId: [
    {required: true, message: '请选择模型', trigger: 'blur'},
  ],
})

const editKnowledgeRules = ref({
  coverImg: [
    {required: true, message: '请选择封面', trigger: 'blur'},
  ],
  name: [
    {required: true, message: '请输入知识库名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  embeddingModelId: [
    {required: true, message: '请选择模型', trigger: 'blur'},
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

import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import {getDocumentList} from "@/api/ai/knowledge/document.js";

const onVue3EmojiPicker = (emoji) => {
  createKnowledgeForm.value.coverImg = emoji.i
  /* 结果示例
  {
      i: "ernes", // 表情图标
      n: ["kissing face"],
      r: "1f61a", // 包含肤色
      t: "neutral", // 肤色
      u: "1f61a" // 不带肤色
  }
  */
};
const onVue3EmojiPickerEdit = (emoji) => {
  editKnowledgeForm.value.coverImg = emoji.i
};

const editKnowledgeForm = ref(null)

/**
 * 编辑知识库
 * @param item
 */
const handleEditKnowledge = (item) => {
  console.log("编辑知识库", item)
  loadModelOptions()
  editKnowledgeForm.value = item
  documentUploadData.value.knowledgeId = item.id
  documentQueryDTO.value.knowledgeId = item.id
  updateDialogVisible.value = true
  documentObserverRef.value = new IntersectionObserver(observeIntersectionDocument, {threshold: 0.1}) // 调整阈值
  nextTick(() => {
    if (documentLoadingRef.value) {
      documentObserverRef.value.observe(documentLoadingRef.value)
    }
  })
}

const updateDialogClose = ()=>{
  updateDialogVisible.value = false
  documentUploadList.value = null
  documentList.value = []
  documentLoading.value = false
  documentHasMore.value = true

  if (documentObserverRef.value) {
    documentObserverRef.value.disconnect()
  }
}

const updateDialogVisible = ref(false)

const documentUploadList = ref(null)
const documentUploadUrl = import.meta.env.VITE_API_BASE_URL + "/ai/web-api/v1/knowledge/document/upload"
const headers = {
  Authorization: 'Bearer ' + getToken(),
}
const documentUploadData = ref({
  knowledgeId: null,
  segmentMaxTokens: 800
})
//上传成功回调
const handleUploadDocumentSuccess = (res) => {
  if (res.code === 200) {
    documentUploadList.value = res.data
    console.log(res.data)
  } else {
    ElMessage.error(res.msg)
  }
}
// 上传失败回调
const handleUploadDocumentError = (res) => {
  ElMessage.error(res.msg)
}

// 加载文档分页
const documentQueryDTO = ref({
  pageNum: 1,
  pageSize: 10,
  knowledgeId: null
})
const documentLoading = ref(false)

const documentList = ref([])
const documentTotal = ref(0)
const documentHasMore = ref(true)

const documentObserverRef = ref(null)
const documentLoadingRef = ref(null)

const loadMoreDocument = async () => {
  if (documentLoading.value || !documentHasMore.value) return
  documentLoading.value = true
  const res = await getDocumentList(documentQueryDTO.value)
  documentList.value = [...documentList.value, ...res.data.rows]
  documentTotal.value = res.data.total
  documentHasMore.value = res.data.hasMore
  documentQueryDTO.value.pageNum += 1
  // 重新计算页面高度
  await nextTick(() => {
    if (documentLoadingRef.value) {
      documentObserverRef.value.unobserve(documentLoadingRef.value)
      documentObserverRef.value.observe(documentLoadingRef.value)
    }
  })
  documentLoading.value = false
}

const observeIntersectionDocument = (entries) => {
  if (entries[0].isIntersecting) {
    loadMoreDocument()
  }
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
              <div class="rounded-xl bg-[var(--niuyin-icon-bg)] flex items-center justify-center">
                <div class="text-2xl m-2">{{ item.coverImg }}</div>
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
          </div>
          <p class="text-gray-500 mt-4 mb-6 text-sm">{{ item.description }}</p>
          <div class="flex justify-between items-center mt-auto">
            <div class="text-xs text-gray-500">最后更新: {{ smartDateFormat(item.updateTime) }}</div>
            <div class="flex space-x-2">
              <button
                  class="text-gray-500 hover:text-blue-500 py-1 px-2 rounded-full hover:bg-blue-50 transition-smooth"
                  @click="handleEditKnowledge(item)">
                <Edit/>
              </button>
              <button class="text-gray-500 hover:text-red-500 py-1 px-2 rounded-full hover:bg-red-50 transition-smooth">
                <Delete/>
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
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="图标" prop="coverImg">
              <el-popover
                  trigger="hover"
                  placement="bottom-start"
                  width="302"
              >
                <div class="py-2">

                  <EmojiPicker :native="true" @select="onVue3EmojiPicker"/>
                </div>
                <template #reference>
                  <el-input style="width: 42px" v-model="createKnowledgeForm.coverImg" disabled/>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识库名称" prop="name">
              <el-input v-model="createKnowledgeForm.name" placeholder="请输入知识库名称" maxlength="20" show-word-limit
                        clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog v-if="updateDialogVisible" :title="editKnowledgeForm.name" v-model="updateDialogVisible" width="72%" @close="updateDialogClose">
      <template #header="{ titleId, titleClass }">
        <div class="flex flex-row align-center">
          <div class="text-xl mr-2">{{ editKnowledgeForm.coverImg }}</div>
          <h4 :id="titleId" :class="titleClass" class="font-bold">{{ editKnowledgeForm.name }}</h4>
          <span
              class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Data class="mr-1"/> 已向量化</span>
        </div>
      </template>
      <!--      知识库内容-->
      <div class="flex-1 overflow-auto">
        <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
          <!-- 左侧知识库信息 -->
          <div class="lg:col-span-3">
            <div class="bg-[var(--bg-common-bg)] rounded-lg p-4">
              <div class="font-bold text-gray-900 mb-4 fs1rem">知识库信息</div>
              <el-form ref="createKnowledgeFormRef" :rules="editKnowledgeRules" :model="editKnowledgeForm"
                       label-position="top"
                       :hide-required-asterisk="true"
                       label-width="100px">
                <el-form-item label="图标" prop="coverImg" label-position="top">
                  <el-popover
                      trigger="hover"
                      placement="bottom-start"
                      width="302"
                  >
                    <div class="py-2">

                      <EmojiPicker :native="true" @select="onVue3EmojiPickerEdit"/>
                    </div>
                    <template #reference>
                      <el-input style="width: 42px" v-model="editKnowledgeForm.coverImg" disabled/>
                    </template>
                  </el-popover>
                </el-form-item>

              </el-form>
              <div class="space-y-4">
                <el-form-item label="知识库名称" prop="name" label-position="top">
                  <el-input v-model="editKnowledgeForm.name" placeholder="请输入知识库名称" maxlength="20"
                            show-word-limit
                            clearable></el-input>
                </el-form-item>
                <el-form-item label="知识库描述" prop="description" label-position="top">
                  <el-input v-model="editKnowledgeForm.description" placeholder="请输入知识库描述" maxlength="200"
                            show-word-limit
                            clearable type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="向量模型" prop="embeddingModelId" label-width="90px" label-position="left">
                  <el-select v-model="editKnowledgeForm.embeddingModelId" style="width: 100%"
                             clearable
                             placeholder="请选择向量模型">
                    <el-option v-for="item in modelOptions"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="top-k" prop="topK" label-width="90px" label-position="left">
                  <el-input-number v-model="editKnowledgeForm.topK" style="width: 100%" :min="1" :max="10"
                                   placeholder="请输入topK"></el-input-number>
                </el-form-item>
                <el-form-item label="相似度阈值" prop="similarityThreshold" label-width="90px" label-position="left">
                  <el-input-number v-model="editKnowledgeForm.similarityThreshold" style="width: 100%" :min="0"
                                   :precision="2" :step="0.1"
                                   :max="1"
                                   placeholder="请输入相似度阈值"></el-input-number>
                </el-form-item>
                <el-form-item label="启用" prop="stateFlag" label-width="90px" label-position="left">
                  <el-switch
                      v-model="editKnowledgeForm.stateFlag"
                      inline-prompt
                      :active-value="'1'"
                      :inactive-value="'0'"
                      :active-icon="Check"
                      :inactive-icon="Close"
                  />
                </el-form-item>
                <div>
                  <label class="font-medium text-gray-700 mb-1">创建时间：</label>
                  <span class="font-medium text-gray-900">2023-08-12 14:30</span>
                </div>

                <div>
                  <label class="font-medium text-gray-700 mb-1">最后更新：</label>
                  <span class="font-medium text-gray-900">2023-10-15 09:45</span>
                </div>
              </div>

              <div class="mt-6 flex space-x-3">
                <button
                    class="flex-1 bg-blue-200 text-primary-700 hover:bg-blue-300 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                  <Reload/>
                  更新信息
                </button>
              </div>
            </div>
          </div>
          <!-- 右侧文档列表 -->
          <div class="lg:col-span-7">
            <div class="flex justify-between items-center mb-4">
              <div class="font-bold text-gray-900 mb-4 fs1rem">文档列表</div>
              <!--              <button-->
              <!--                  class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-lg flex items-center transition duration-200">-->
              <!--                <i class="ri-add-line mr-1"></i> 添加文档-->
              <!--              </button>-->
              <el-upload
                  :action="documentUploadUrl"
                  :headers="headers"
                  :on-success="handleUploadDocumentSuccess"
                  :on-error="handleUploadDocumentError"
                  :limit="1"
                  :data="documentUploadData"
                  :show-file-list="false"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
              >
                <el-button type="primary"><i class="ri-add-line mr-1"></i> 添加文档</el-button>
              </el-upload>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <!-- 表格头部 -->
              <div
                  class="grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="col-span-5">文档名称</div>
                <div class="col-span-3">状态</div>
                <div class="col-span-2">切片数量</div>
                <div class="col-span-2 text-right">操作</div>
              </div>

              <!-- 文档行 1 -->
              <div class="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <div class="col-span-5 flex items-center">
                  <i class="ri-file-text-line text-primary-600 mr-3"></i>
                  <span class="text-gray-900 font-medium">产品使用手册.pdf</span>
                </div>
                <div class="col-span-3">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <i class="ri-checkbox-circle-line mr-1"></i> 已向量化
                                    </span>
                </div>
                <div class="col-span-2 text-gray-700">24</div>
                <div class="col-span-2 flex justify-end space-x-2">
                  <button class="text-blue-600 hover:text-blue-800">
                    <i class="ri-eye-line"></i>
                  </button>
                  <button class="text-gray-600 hover:text-gray-900">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <!-- 文档行 2 -->
              <div class="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                <div class="col-span-5 flex items-center">
                  <i class="ri-file-text-line text-primary-600 mr-3"></i>
                  <span class="text-gray-900 font-medium">API参考文档.docx</span>
                </div>
                <div class="col-span-3">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <i class="ri-checkbox-circle-line mr-1"></i> 已向量化
                                    </span>
                </div>
                <div class="col-span-2 text-gray-700">18</div>
                <div class="col-span-2 flex justify-end space-x-2">
                  <button class="text-blue-600 hover:text-blue-800">
                    <i class="ri-eye-line"></i>
                  </button>
                  <button class="text-gray-600 hover:text-gray-900">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <!-- 文档行 3（切片展开示例） -->
              <div class="border-b border-gray-100">
                <div class="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                     onclick="toggleSlices(this)">
                  <div class="col-span-5 flex items-center">
                    <i class="ri-file-text-line text-primary-600 mr-3"></i>
                    <span class="text-gray-900 font-medium">技术白皮书.md</span>
                  </div>
                  <div class="col-span-3">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <i class="ri-time-line mr-1"></i> 处理中
                                        </span>
                  </div>
                  <div class="col-span-2 text-gray-700">32</div>
                  <div class="col-span-2 flex justify-end space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="ri-eye-line"></i>
                    </button>
                    <button class="text-gray-600 hover:text-gray-900">
                      <i class="ri-edit-line"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>

                <!-- 切片列表 -->
                <div class="px-4 py-3 bg-gray-50 hidden" id="slices-container">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="font-medium text-gray-900">文档切片</h4>
                    <button
                        class="text-sm bg-primary-600 hover:bg-primary-700 text-white font-medium py-1 px-2 rounded flex items-center">
                      <i class="ri-add-line mr-1"></i> 添加切片
                    </button>
                  </div>

                  <div class="space-y-3">
                    <!-- 切片 1 -->
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                      <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-900">切片 #1</span>
                        <div class="flex space-x-2">
                          <button class="text-gray-600 hover:text-gray-900 text-sm">
                            <i class="ri-edit-line"></i>
                          </button>
                          <button class="text-red-600 hover:text-red-800 text-sm">
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <p class="text-gray-600 text-sm mt-2 line-clamp-2">
                        本产品采用先进的AI技术，提供智能解决方案。主要功能包括自然语言处理、图像识别和数据分析等模块...
                      </p>
                    </div>

                    <!-- 切片 2 -->
                    <div class="bg-white border border-gray-200 rounded-lg p-3">
                      <div class="flex justify-between">
                        <span class="text-sm font-medium text-gray-900">切片 #2</span>
                        <div class="flex space-x-2">
                          <button class="text-gray-600 hover:text-gray-900 text-sm">
                            <i class="ri-edit-line"></i>
                          </button>
                          <button class="text-red-600 hover:text-red-800 text-sm">
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <p class="text-gray-600 text-sm mt-2 line-clamp-2">
                        系统架构设计采用微服务模式，各个模块独立部署，通过API网关进行通信。这种设计提高了系统的可扩展性和稳定性...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref="documentLoadingRef" id="documentLoadingRef" class="flex justify-center items-center py-4">
              <LoadingOne v-if="documentLoading" class="animate-spin"/>
              <p v-if="!documentHasMore" class="text-gray-500">没有更多内容了</p>
            </div>
          </div>
        </div>
      </div>
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
