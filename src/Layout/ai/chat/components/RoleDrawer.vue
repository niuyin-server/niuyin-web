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
    <el-drawer v-model="drawerProxy" title="角色仓库" destroy-on-close>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane lazy label="公共角色" name="1">
          <!-- 数据 -->
          <el-skeleton :loading="loading" animated>
            <template #template>
              <div v-for="i in 2" class="space-y-4 px-4 pt-4">
                <el-skeleton style="--el-skeleton-circle-size: 64px">
                  <template #template>
                    <el-skeleton-item variant="circle"/>
                  </template>
                </el-skeleton>
                <el-skeleton-item variant="h3" style="width: 40%"/>
                <el-skeleton-item variant="text" style="width: 70%"/>
              </div>
            </template>
            <template #default>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="item in modelRoleList"
                     class="flex flex-col p-4 space-y-4 border border-[var(--niuyin-border-color)] bg-[var(--bg-video-card)] rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                  <div class="flex space-x-4">
                    <div>
                      <el-avatar :size="50" :src="item.avatar">
                        <el-avatar :icon="UserFilled"/>
                      </el-avatar>
                    </div>
                    <div class="space-y-2">
                      <div class="fw600">{{ item.name }}</div>
                      <div class="text-xs text-gray-500">{{ item.description }}</div>
                    </div>
                  </div>
                  <div>
                    <button
                        @click="handleClickRoleToConversation(item)"
                        class="px-4 py-2 bg-[var(--niuyin-primary-color)] text-white rounded-full hover:bg-[var(--niuyin-primary-color-8)] transition-all shadow-md hover:shadow-lg">
                      立即使用
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </el-skeleton>
          <!--    分页-->
          <el-pagination v-show="modelRoleTotal>0"
                         class="mt-4 float-right"
                         :total="modelRoleTotal"
                         background
                         layout="total, sizes, prev, pager, next, jumper"
                         :page-sizes="[10, 20, 50]"
                         v-model:current-page="queryDTO.pageNum"
                         v-model:page-size="queryDTO.pageSize"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"/>
        </el-tab-pane>
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
