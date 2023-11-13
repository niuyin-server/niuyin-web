<template>
  <div class="nav-center">
    <div class="nav_center_search"
         ref="NavSearch">
      <!-- 输入框 -->
      <el-popover class="search-popover"
                  :width="430"
                  trigger="click"
                  popper-style="padding: 20px;">
        <template #reference>
          <div class="flex-center wh100">
            <el-input
                class="search-input"
                v-model="searchData"
                :placeholder="searchDefaults"
                @keyup.enter.native="searchConfirm"
                clearable>
              <!--          <template #default="{item}">-->
              <!--            <el-tag class="mx-1"-->
              <!--                    closable-->
              <!--                    type="info"-->
              <!--                    @close="handleDelSearchHistory(item)"-->
              <!--                    effect="plain">-->
              <!--              {{ item }}-->
              <!--            </el-tag>-->
              <!--          </template>-->
            </el-input>
          </div>
        </template>
        <template #default>
          <div
              class="demo-rich-conent"
              style="display: flex; gap: 16px; flex-direction: column"
          >
            <el-avatar
                :size="60"
                src="https://avatars.githubusercontent.com/u/72015883?v=4"
                style="margin-bottom: 8px"
            />
            <div>
              <p
                  class="demo-rich-content__name"
                  style="margin: 0; font-weight: 500"
              >
                Element Plus
              </p>
              <p
                  class="demo-rich-content__mention"
                  style="margin: 0; font-size: 14px; color: var(--el-color-info)"
              >
                @element-plus
              </p>
            </div>

            <p class="demo-rich-content__desc" style="margin: 0">
              Element Plus, a Vue 3 based component library for developers,
              designers and product managers
            </p>
          </div>
        </template>
      </el-popover>
      <el-button class="search-btn" type="info" plain @click="searchConfirm">
        <i class="iconfont icon-search search-logo"></i><span>搜索</span>
      </el-button>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>

</style>
