<template>
  <el-container style="z-index: 99 ;color: white;">
    <el-header>
      <el-row>
        <el-col :span="12">1
          <div class="headerLeft">
            <img src="">

          </div>
        </el-col>
        <el-col :span="12">2
          <div class="headerRight">

            <router-link to="/useredit">编辑资料</router-link>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>Main</el-main>
  </el-container>

</template>

<script>
import edit from '@/components/user/Edit.vue'

export default {
  name: 'User',
  components: {
    edit
  },
  data() {
    return {
      editDialog: false, //编辑信息弹框
    }
  },
  methods: {}
}

</script>

<style lang='less' scoped>

</style>
