<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <el-skeleton class="w100" :loading="loading" animated>
    <template #template>
      <div class="loading-container" v-for="i in 2">
        <div class="loading-item" v-for="i in 5">
          <el-skeleton-item variant="image" style="width: 100%; height: 300px"/>
          <div class="p1rem">
            <el-skeleton-item variant="h1" style="width: 80%"/>
            <div>
              <el-skeleton-item variant="text"/>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<style scoped>

</style>
