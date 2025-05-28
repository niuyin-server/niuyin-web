<script setup>
const aiRouters = [
  {id: 1, name: "聊天", class: "fa-robot", link: "/ai/chat"},
  {id: 2, name: "绘画", class: "fa-image", link: "/ai/image"},
  {id: 3, name: "视频", class: "fa-video", link: "/ai/video"},
  {id: 4, name: "知识库", class: "fa-book", link: "/ai/knowledge"}
]
</script>
<!-- ai助手引导页 todo 后续需要在引导页完成订阅才能调用对应功能 -->
<template>
  <div class="flex flex-col h-full flex-1">
    <nav class="ai-nav flex flex-row">
      <div class="flex-col">
        <div class="pl-3 pr-3 border-b border-[var(--niuyin-border-color)]">
          <h1 class="text-xl font-semibold">AI助手</h1>
          <p class="text-sm text-gray-500 mt-1">探索AI的无限可能</p>
        </div>
      </div>
      <div class="flex-1 h100 flex-col">
        <!--        渲染ai路由-->
        <div class="flex border-b border-[var(--niuyin-border-color)] h100">
          <div class="ai-router-container">
            <router-link class="ai-router-link h100 flex-center"
                         v-for="(item, i) in aiRouters"
                         :key="i"
                         :to="item.link">
              <div class="ai-tab-item h100">
                <div class="round flex-center">
                  <i class="fas mr-2 text-[var(--niuyin-primary-color)]" :class="item.class"></i>
                </div>
                <span class="dn-phone">{{ item.name }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <div class="ai-container flex flex-1 oh">
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-router-container {
  display: flex;

  .ai-router-link {
    color: var(--niuyin-text-color) !important;
    text-decoration: none;
    transition: all .3s ease-in-out;
    font-size: 1rem;
  }
}

.ai-tab-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  transition: all .3s ease-in-out;
  padding: 0 1rem 2px .25rem;
  border-bottom: 2px solid transparent;
}

.router-link-exact-active .ai-tab-item {
  font-weight: 600;
  font-size: 1rem !important;
  color: var(--niuyin-primary-color);
  padding-bottom: 0;
  border-bottom: 2px solid var(--niuyin-primary-color);
}
</style>
