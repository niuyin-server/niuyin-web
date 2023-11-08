<template>
  <div style="color:white">
    <el-container>
      <el-aside width="200px">
        <el-menu router>
            <el-menu-item index="/useredit/userdetail">信息设置</el-menu-item>
            <el-menu-item index="/useredit/useraccount">账号设置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 三级路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
    name:'editdialog'
}

</script>

<style lang='less' scoped>

</style>
