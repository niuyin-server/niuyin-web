<script setup>
import {computed, onMounted, ref} from 'vue'
import {getModelRolePage} from "@/api/ai/model/role.js";
import {UserFilled,Plus} from "@element-plus/icons-vue";

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
</script>

<template>
  <div class="drawer-container">
    <el-drawer v-model="drawerProxy" title="知识库" destroy-on-close>
      <el-button @click="dialogVisible = true" :icon="Plus"> 添加知识库 </el-button>
    </el-drawer>
    <el-dialog v-model="dialogVisible">

    </el-dialog>
  </div>
</template>

<style scoped>
.drawer-container :deep(.el-overlay ) {
  background-color: transparent !important;
}
</style>
