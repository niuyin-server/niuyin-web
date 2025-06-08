<template>
  <div class="browser-frame min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="flex items-center justify-between p-6 border-b border-[var(--niuyin-border-color)]">
      <div class="flex items-center space-x-2">
        <i class="fas fa-play-circle text-2xl text-[var(--niuyin-primary-color)]"></i>
        <span class="text-xl font-bold">芝士学爆视频</span>
      </div>

    </nav>

    <!-- 主内容区 -->
    <main class="flex-grow">
      <!-- Hero区域 -->
      <section class="hero-gradient py-20 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">开启合作新篇章</h1>
          <p class="text-xl text-[var(--niuyin-text-color)] opacity-80 mb-10 max-w-2xl mx-auto">
            芝士学爆视频平台拥有超过50万活跃用户，我们致力于为品牌提供创新的合作解决方案，共同创造价值。
          </p>
          <div class="flex justify-center space-x-4">
            <button class="btn-primary">立即合作</button>
            <button class="card px-6 py-3 font-medium">了解更多</button>
          </div>
        </div>
      </section>

      <!-- 合作优势 -->
      <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">为什么选择芝士学爆</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              我们提供创新的合作模式与专业的营销解决方案，助力品牌实现价值最大化
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- 优势1 -->
            <div class="card p-8 flex flex-col items-center text-center">
              <div class="icon-container mb-6">
                <i class="feature-icon fas fa-users"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">海量用户群体</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80">
                覆盖500万+高质量用户，精准触达目标人群，提升品牌影响力
              </p>
            </div>

            <!-- 优势2 -->
            <div class="card p-8 flex flex-col items-center text-center">
              <div class="icon-container mb-6">
                <i class="feature-icon fas fa-bullseye"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">精准投放系统</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80">
                基于AI算法的精准投放，实现高效转化，最大化投资回报率
              </p>
            </div>

            <!-- 优势3 -->
            <div class="card p-8 flex flex-col items-center text-center">
              <div class="icon-container mb-6">
                <i class="feature-icon fas fa-lightbulb"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">创新合作模式</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80">
                定制化合作方案，从内容共创到品牌联动，满足多样化需求
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 合作方式 -->
      <section class="py-16 px-6 bg-[var(--niuyin-icon-bg)]">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">多元化合作方式</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              我们提供多种灵活的合作模式，满足不同品牌的营销需求
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- 方式1 -->
            <div class="card p-6 hover:border-[var(--niuyin-primary-color)]">
              <div class="icon-container mb-4">
                <i class="feature-icon fas fa-ad"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">广告投放</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                开屏广告、信息流广告、视频贴片等多种广告形式
              </p>
              <a href="#" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
                了解更多 <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>

            <!-- 方式2 -->
            <div class="card p-6 hover:border-[var(--niuyin-primary-color)]">
              <div class="icon-container mb-4">
                <i class="feature-icon fas fa-handshake"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">品牌合作</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                品牌冠名、联合活动、IP合作等深度品牌合作模式
              </p>
              <a href="#" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
                了解更多 <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>

            <!-- 方式3 -->
            <div class="card p-6 hover:border-[var(--niuyin-primary-color)]">
              <div class="icon-container mb-4">
                <i class="feature-icon fas fa-film"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">内容共创</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                定制化内容创作、PGC/UGC合作、内容植入等
              </p>
              <a href="#" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
                了解更多 <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>

            <!-- 方式4 -->
            <div class="card p-6 hover:border-[var(--niuyin-primary-color)]">
              <div class="icon-container mb-4">
                <i class="feature-icon fas fa-store"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">电商合作</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                直播带货、商品橱窗、达人种草等电商转化解决方案
              </p>
              <a href="#" class="text-[var(--niuyin-primary-color)] font-medium flex items-center">
                了解更多 <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 成功案例 -->
      <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">成功合作案例</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              众多知名品牌选择与芝士学爆合作，实现共赢
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400" alt="品牌1"
                 class="partner-logo w-32 h-32 object-contain mx-auto">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400" alt="品牌2"
                 class="partner-logo w-32 h-32 object-contain mx-auto">
            <img src="https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=400" alt="品牌3"
                 class="partner-logo w-32 h-32 object-contain mx-auto">
            <img src="https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&w=400" alt="品牌4"
                 class="partner-logo w-32 h-32 object-contain mx-auto">
          </div>

          <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card p-8">
              <div class="flex items-start mb-6">
                <div class="icon-container">
                  <i class="feature-icon fas fa-chart-line"></i>
                </div>
                <div class="ml-6">
                  <h3 class="text-xl font-semibold mb-2">科技品牌营销案例</h3>
                  <p class="text-[var(--niuyin-text-color)] opacity-80">
                    通过定制内容+开屏广告组合投放，帮助某科技品牌新品上市活动实现ROI 1:8的优异表现
                  </p>
                </div>
              </div>
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48"></div>
            </div>

            <div class="card p-8">
              <div class="flex items-start mb-6">
                <div class="icon-container">
                  <i class="feature-icon fas fa-shopping-bag"></i>
                </div>
                <div class="ml-6">
                  <h3 class="text-xl font-semibold mb-2">电商直播带货案例</h3>
                  <p class="text-[var(--niuyin-text-color)] opacity-80">
                    联合头部主播为时尚品牌打造专场直播，单场GMV突破1200万，创类目新高
                  </p>
                </div>
              </div>
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系表单 -->
      <section class="py-16 px-6 bg-[var(--niuyin-icon-bg)]">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">开启合作之旅</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              填写以下信息，我们的商务团队将在24小时内与您联系
            </p>
          </div>

          <div class="card p-8">
            <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium mb-2">姓名</label>
                <input type="text" class="form-input w-full" placeholder="请输入您的姓名">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">公司名称</label>
                <input type="text" class="form-input w-full" placeholder="请输入公司名称">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">职位</label>
                <input type="text" class="form-input w-full" placeholder="请输入您的职位">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">联系电话</label>
                <input type="tel" class="form-input w-full" placeholder="请输入联系电话">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2">合作意向</label>
                <select class="form-input w-full">
                  <option>请选择合作类型</option>
                  <option>广告投放</option>
                  <option>品牌合作</option>
                  <option>内容共创</option>
                  <option>电商合作</option>
                  <option>其他</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-2">具体需求</label>
                <textarea class="form-input w-full h-32" placeholder="请简要描述您的合作需求"></textarea>
              </div>
              <div class="md:col-span-2 flex justify-center mt-4">
                <button type="submit" class="btn-primary px-12">提交申请</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-[var(--niuyin-border-color)] py-8 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <i class="fas fa-play-circle text-2xl text-[var(--niuyin-primary-color)] mr-2"></i>
            <span class="text-xl font-bold">芝士学爆视频</span>
          </div>
          <div class="text-sm text-[var(--niuyin-text-color)] opacity-75">
            © 2023 芝士学爆视频平台 版权所有
          </div>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="#" class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-weibo"></i>
            </a>
            <a href="#" class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-weixin"></i>
            </a>
            <a href="#" class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<!--
*@author roydon
*@date 2024/4/26 21:06
-->
<script>
export default {
  name: 'Cooperation',
  props: {},
  components: {},
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  emits: [],
  methods: {}
}
</script>

<style scoped>
:root {
  --niuyin-text-color: #1a202c;
  --niuyin-border-color: #e2e8f0;
  --niuyin-primary-color: #3b82f6;
  --niuyin-icon-bg: rgba(59, 130, 246, 0.1);
  --niuyin-bg-color: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --niuyin-text-color: #f7fafc;
    --niuyin-border-color: #2d3748;
    --niuyin-primary-color: #60a5fa;
    --niuyin-icon-bg: rgba(96, 165, 250, 0.1);
    --niuyin-bg-color: #1a202c;
  }
}

body {
  background-color: var(--niuyin-bg-color);
  color: var(--niuyin-text-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

.browser-frame {
  margin: 1rem;
  border: 1px solid var(--niuyin-border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.hero-gradient {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05));
}

.card {
  background-color: var(--niuyin-bg-color);
  border: 1px solid var(--niuyin-border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background-color: var(--niuyin-icon-bg);
  transition: all 0.3s ease;
}

.feature-icon {
  color: var(--niuyin-primary-color);
  font-size: 24px;
}

.btn-primary {
  background-color: var(--niuyin-primary-color);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.form-input {
  background-color: var(--niuyin-bg-color);
  border: 1px solid var(--niuyin-border-color);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--niuyin-text-color);
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--niuyin-primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

.partner-logo {
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s ease;
}

.partner-logo:hover {
  filter: grayscale(0);
  opacity: 1;
}
</style>
