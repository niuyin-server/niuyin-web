<script setup>
import {ref, computed} from 'vue'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:drawer'])
const drawerProxy = computed({
  get: () => props.drawer,
  set: (newValue) => emit('update:drawer', newValue)
})
</script>

<template>
  <div class="drawer-container">
    <el-drawer v-model="drawerProxy" title="角色" destroy-on-close>
      <span>Hi there!</span>
    </el-drawer>
  </div>
</template>

<style scoped>
.drawer-container :deep(.el-overlay ){
  background-color: transparent !important;
}
</style>
