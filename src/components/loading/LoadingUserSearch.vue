<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <el-skeleton class="w100 " :loading="loading" animated>
    <template #template>
      <div class="p1rem" style="display: flex; align-items: center; " v-for="i in 3">
        <el-skeleton-item variant="circle" class="wh5rem"/>
        <div class="wh100" style="padding-left: 1rem">
          <el-skeleton-item variant="h1" style="width: 40%"/>
          <el-skeleton-item variant="h1" style="margin-top: .75rem;width: 80%"/>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<style scoped>

</style>
