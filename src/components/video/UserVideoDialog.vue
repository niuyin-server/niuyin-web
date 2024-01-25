<template>
  <el-dialog
      v-model="videoDialogVisible"
      title=""
      width="100%"
      align-center>
    <div>
      123
    </div>
  </el-dialog>
</template>

<script>

/**
 * 点击用户头像，弹出全屏弹窗展示视频内容
 * @author roydon
 */
export default {
  name: "UserVideoDialog",
  components: {},
  props: {
  },
  data() {
    return {
      videoDialogVisible: true
    }
  },
  created() {
    // console.log(this.videoDialogVisible)
  },
  mounted() {
  },
  emits: [],
  methods: {}
}
</script>

<style scoped>
:deep(.el-dialog) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>