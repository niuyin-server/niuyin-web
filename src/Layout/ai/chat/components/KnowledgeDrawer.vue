<script setup>
import {computed, onMounted, ref} from 'vue'
import {getModelRolePage} from "@/api/ai/model/role.js";
import {UserFilled} from "@element-plus/icons-vue";

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:drawer',
  'create:conversation'
])

const drawerProxy = computed({
  get: () => props.drawer,
  set: (newValue) => emit('update:drawer', newValue)
})

const queryDTO = ref({
  pageNum: 1,
  pageSize: 10,
  name: null,
  category: null,
})

const loading = ref(false)

const modelRoleList = ref([])
const modelRoleTotal = ref(0)

const initModelRolePage = async () => {
  loading.value = true
  const res = await getModelRolePage(queryDTO.value)
  modelRoleList.value = res.data.rows
  modelRoleTotal.value = res.data.total
  loading.value = false
}

const handleCurrentChange = (v) => {
  queryDTO.pageNum = v
  initModelRolePage()
}
const handleSizeChange = (v) => {
  queryDTO.pageSize = v
  initModelRolePage()
}

const activeName = ref('1')

const handleClick = (tab, event) => {
  console.log(tab, event);
}

const handleClickRoleToConversation = (item) => {
  emit('create:conversation', item)
}

onMounted(() => {
  initModelRolePage()
})
</script>

<template>
  <div class="drawer-container">
    <el-drawer v-model="drawerProxy" title="知识库" destroy-on-close>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane lazy label="我的角色" name="2">我的角色
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<style scoped>
.drawer-container :deep(.el-overlay ) {
  background-color: transparent !important;
}
</style>
