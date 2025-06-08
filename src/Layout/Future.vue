<script setup lang="ts">

</script>

<template>
  <div class="browser-frame flex flex-col">
    <!-- 导航栏 -->
    <nav class="flex items-center justify-between p-6 border-b border-[var(--niuyin-border-color)]">
      <div class="flex items-center space-x-3">
        <div class="icon-container">
          <i class="feature-icon fas fa-play-circle"></i>
        </div>
        <span class="text-2xl font-bold tech-font neon-text">芝士学爆</span>
      </div>

      <div class="hidden md:flex items-center space-x-6">
        <a href="#"
           class="nav-link text-lg font-semibold tech-font hover:text-[var(--neon-blue)] transition-all relative group">
          产品介绍
          <span
              class="absolute bottom-0 left-0 w-0 h-1 bg-[var(--neon-blue)] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#"
           class="nav-link text-lg font-semibold tech-font hover:text-[var(--neon-blue)] transition-all relative group">
          核心功能
          <span
              class="absolute bottom-0 left-0 w-0 h-1 bg-[var(--neon-blue)] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#"
           class="nav-link text-lg font-semibold tech-font hover:text-[var(--neon-blue)] transition-all relative group">
          AI实验室
          <span
              class="absolute bottom-0 left-0 w-0 h-1 bg-[var(--neon-blue)] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#" class="nav-link text-lg font-semibold tech-font text-[var(--neon-blue)] relative group">
          未来展望
          <span class="absolute bottom-0 left-0 w-full h-1 bg-[var(--neon-blue)]"></span>
        </a>
      </div>

      <div class="flex items-center space-x-4">
        <button class="btn-primary tech-font">
          <i class="fas fa-rocket mr-2"></i>立即体验
        </button>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="flex-grow">
      <!-- Hero区域 -->
      <section class="hero-gradient py-24 px-6">
        <div class="max-w-6xl mx-auto text-center">
          <div class="mb-8">
                        <span
                            class="px-4 py-2 bg-[var(--niuyin-icon-bg)] text-[var(--neon-blue)] rounded-full text-sm font-bold tech-font">
                            未来科技 · 触手可及
                        </span>
          </div>
          <h1 class="text-5xl md:text-7xl font-bold mb-6 tech-font glitch" data-text="重新定义AI与视频融合">
            重新定义AI与视频融合
          </h1>
          <p class="text-xl md:text-2xl text-[var(--niuyin-text-color)] opacity-90 mb-10 max-w-3xl mx-auto">
            芝士学爆是下一代智能视频平台，融合<span class="gradient-text font-bold">先进AI技术</span>，为用户提供前所未有的创作、学习和娱乐体验
          </p>
          <div class="flex flex-wrap justify-center gap-6 mt-12">
            <button class="btn-primary tech-font pulse">
              <i class="fas fa-play-circle mr-2"></i>观看演示
            </button>
            <button
                class="px-8 py-4 border border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-xl font-medium text-lg tech-font hover:bg-[rgba(0,243,255,0.1)] transition-all">
              探索技术细节
            </button>
          </div>

          <div class="mt-20 flex justify-center">
            <div
                class="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[var(--neon-blue)] to-transparent">
            </div>
          </div>
        </div>
      </section>

      <!-- 核心价值 -->
      <section class="py-20 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 tech-font neon-text">核心产品价值</h2>
            <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 max-w-2xl mx-auto">
              融合视频与AI技术的创新平台，开启智能交互新时代
            </p>
          </div>

          <div class="interactive-grid">
            <div class="future-card p-8 text-center floating" style="animation-delay: 0s;">
              <div class="icon-container mx-auto mb-6">
                <i class="feature-icon fas fa-video"></i>
              </div>
              <h3 class="text-2xl font-semibold mb-4 tech-font">沉浸式视频体验</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-90">
                智能推荐算法带来无限沉浸的视频浏览体验，基于用户行为的个性化内容推送
              </p>
            </div>

            <div class="future-card p-8 text-center floating" style="animation-delay: 1s;">
              <div class="icon-container mx-auto mb-6">
                <i class="feature-icon fas fa-brain"></i>
              </div>
              <h3 class="text-2xl font-semibold mb-4 tech-font">强大AI能力</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-90">
                集成全球领先AI模型，提供对话、创作、绘画等多模态智能交互
              </p>
            </div>

            <div class="future-card p-8 text-center floating" style="animation-delay: 2s;">
              <div class="icon-container mx-auto mb-6">
                <i class="feature-icon fas fa-cogs"></i>
              </div>
              <h3 class="text-2xl font-semibold mb-4 tech-font">智能产品融合</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-90">
                革命性的MCP技术将AI深度融入产品功能，创造真正智能化的用户体验
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 未来展望 -->
      <section class="future-gradient py-24 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-20">
            <h2 class="text-4xl font-bold mb-6 tech-font neon-text">未来技术展望</h2>
            <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 max-w-2xl mx-auto">
              我们正在构建的未来，将重新定义AI与产品的融合
            </p>
          </div>

          <!-- MCP重点介绍 -->
          <div class="mcp-highlight p-8 mb-20">
            <div class="flex flex-col lg:flex-row items-center">
              <div class="lg:w-2/5 mb-10 lg:mb-0 flex justify-center">
                <div class="relative">
                  <div
                      class="w-64 h-64 rounded-full bg-[rgba(0,243,255,0.1)] flex items-center justify-center pulse">
                    <div
                        class="w-48 h-48 rounded-full bg-[rgba(189,0,255,0.1)] flex items-center justify-center">
                      <i class="fas fa-infinity text-7xl gradient-text"></i>
                    </div>
                  </div>
                  <div
                      class="absolute top-0 right-0 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white px-4 py-2 rounded-full text-sm font-bold tech-font">
                    MCP v2.0
                  </div>
                </div>
              </div>
              <div class="lg:w-3/5 lg:pl-12">
                <h3 class="text-3xl font-bold mb-6 tech-font">产品智能融合平台 (MCP)</h3>
                <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 mb-8">
                  MCP (Product Intelligence Convergence Platform)
                  是我们革命性的下一代产品框架，将AI深度融入产品核心功能，实现真正的产品智能化。
                </p>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <i class="fas fa-microchip text-[var(--neon-blue)] text-xl mt-1 mr-3"></i>
                    <span class="text-lg">AI与产品功能的量子级耦合，实现零延迟响应</span>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-sync-alt text-[var(--neon-blue)] text-xl mt-1 mr-3"></i>
                    <span class="text-lg">自适应产品界面，根据用户脑电波实时重构UI</span>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-bolt text-[var(--neon-blue)] text-xl mt-1 mr-3"></i>
                    <span class="text-lg">智能工作流自动化，预测并执行复杂任务序列</span>
                  </div>
                  <div class="flex items-start">
                    <i class="fas fa-network-wired text-[var(--neon-blue)] text-xl mt-1 mr-3"></i>
                    <span class="text-lg">跨宇宙场景的无缝AI辅助，实现多维空间应用切换</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发展路线图 -->
          <div class="mb-20">
            <h3 class="text-3xl font-bold mb-12 text-center tech-font">量子跃迁路线图</h3>

            <div class="max-w-4xl mx-auto">
              <div class="timeline-item">
                <div class="timeline-dot">
                  <i class="fas fa-check"></i>
                </div>
                <div class="future-card p-8">
                  <h4 class="text-2xl font-semibold mb-4 tech-font">2023 Q4 - 基础平台构建</h4>
                  <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 mb-6">
                    完成视频核心功能开发，实现AI对话基础框架
                  </p>
                  <div class="holographic-bar w-full mb-4"></div>
                  <div class="flex flex-wrap gap-3">
                                        <span
                                            class="px-4 py-2 bg-[rgba(59,130,246,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">视频上传</span>
                    <span
                        class="px-4 py-2 bg-[rgba(59,130,246,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">推荐算法</span>
                    <span
                        class="px-4 py-2 bg-[rgba(59,130,246,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">多模型AI</span>
                  </div>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot">
                  <i class="fas fa-check"></i>
                </div>
                <div class="future-card p-8">
                  <h4 class="text-2xl font-semibold mb-4 tech-font">2024 Q1 - AI功能扩展</h4>
                  <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 mb-6">
                    推出AI绘画、智能体创建和知识库管理功能
                  </p>
                  <div class="holographic-bar w-full mb-4" style="width: 85%"></div>
                  <div class="flex flex-wrap gap-3">
                                        <span
                                            class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">AI绘画</span>
                    <span
                        class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">智能体</span>
                    <span
                        class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">知识库</span>
                  </div>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot">
                  <i class="fas fa-cog fa-spin"></i>
                </div>
                <div class="future-card p-8">
                  <h4 class="text-2xl font-semibold mb-4 tech-font">2024 Q3 - MCP Alpha</h4>
                  <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 mb-6">
                    发布MCP框架Alpha版本，实现基础产品-AI融合功能
                  </p>
                  <div class="holographic-bar w-full mb-4" style="width: 45%"></div>
                  <div class="flex flex-wrap gap-3">
                                        <span
                                            class="px-4 py-2 bg-[rgba(0,243,255,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">智能工作流</span>
                    <span
                        class="px-4 py-2 bg-[rgba(0,243,255,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">自适应UI</span>
                    <span
                        class="px-4 py-2 bg-[rgba(0,243,255,0.2)] text-[var(--neon-blue)] rounded-full text-sm tech-font">场景融合</span>
                  </div>
                </div>
              </div>

              <div class="timeline-item">
                <div class="timeline-dot">
                  <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="future-card p-8">
                  <h4 class="text-2xl font-semibold mb-4 tech-font">2025 Q1 - MCP正式版</h4>
                  <p class="text-xl text-[var(--niuyin-text-color)] opacity-90 mb-6">
                    全面推出MCP平台，实现AI与产品的深度智能融合
                  </p>
                  <div class="holographic-bar w-full mb-4" style="width: 20%"></div>
                  <div class="flex flex-wrap gap-3">
                                        <span
                                            class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">预测式交互</span>
                    <span
                        class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">跨功能AI</span>
                    <span
                        class="px-4 py-2 bg-[rgba(189,0,255,0.2)] text-[var(--neon-purple)] rounded-full text-sm tech-font">智能产品核心</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 未来功能终端 -->
          <div class="future-card p-1 overflow-hidden text-white">
            <div class="terminal">
              <div class="terminal-header">
                <div class="terminal-buttons">
                  <div class="terminal-btn btn-close"></div>
                  <div class="terminal-btn btn-min"></div>
                  <div class="terminal-btn btn-max"></div>
                </div>
                <div class="text-sm">future_tech@zhishixuebao:~</div>
              </div>
              <div class="terminal-body">
                <div class="code-line"><span class="text-green-400">future_tech@zhishixuebao</span><span
                    class="text-white">:~$ </span>load_future_features</div>
                <div class="code-line">> 正在加载未来科技功能...</div>
                <div class="code-line">> 初始化量子AI核心...</div>
                <div class="code-line">> 连接多维数据流...</div>
                <div class="code-line">> 验证用户权限...</div>
                <div class="code-line">> 访问批准！加载未来功能：</div>
                <div class="code-line">-----------------------------------------</div>
                <div class="code-line">1. <span class="text-cyan-300">全息视频协作平台</span> - 实现跨空间实时创作</div>
                <div class="code-line">2. <span class="text-cyan-300">神经接口集成</span> - 通过脑电波控制视频编辑</div>
                <div class="code-line">3. <span class="text-cyan-300">量子渲染引擎</span> - 实时生成电影级画质</div>
                <div class="code-line">4. <span class="text-cyan-300">跨宇宙内容同步</span> - 访问平行宇宙创意资源</div>
                <div class="code-line">5. <span class="text-cyan-300">AI导演系统</span> - 自动生成个性化视频叙事</div>
                <div class="code-line">-----------------------------------------</div>
                <div class="code-line">> 准备部署到MCP框架... <span class="text-green-400">完成</span></div>
                <div class="code-line">> 所有功能将在2025年Q1上线</div>
                <div class="code-line"><span class="text-green-400">future_tech@zhishixuebao</span><span
                    class="text-white">:~$ </span><span class="cursor"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="py-24 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-bold mb-8 tech-font neon-text">加入科技革命</h2>
          <p class="text-2xl text-[var(--niuyin-text-color)] opacity-90 mb-12 max-w-2xl mx-auto">
            现在体验芝士学爆，提前感受AI与视频融合的革命性体验
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <button class="btn-primary tech-font pulse">
              <i class="fas fa-user-astronaut mr-2"></i>立即注册
            </button>
            <button
                class="px-8 py-5 border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-xl font-medium text-lg tech-font hover:bg-[rgba(0,243,255,0.1)] transition-all">
              <i class="fas fa-vr-cardboard mr-2"></i>VR体验预览
            </button>
          </div>

          <div class="mt-20">
            <div class="inline-flex space-x-6">
              <div
                  class="w-12 h-12 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-github text-xl text-[var(--neon-blue)]"></i>
              </div>
              <div
                  class="w-12 h-12 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-twitter text-xl text-[var(--neon-blue)]"></i>
              </div>
              <div
                  class="w-12 h-12 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-discord text-xl text-[var(--neon-blue)]"></i>
              </div>
              <div
                  class="w-12 h-12 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-youtube text-xl text-[var(--neon-blue)]"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-[var(--niuyin-border-color)] py-12 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <div class="icon-container">
                <i class="feature-icon fas fa-play-circle"></i>
              </div>
              <span class="text-2xl font-bold tech-font">芝士学爆</span>
            </div>
            <p class="text-[var(--niuyin-text-color)] opacity-90 mb-6">
              下一代智能视频与AI融合平台，重新定义创作与娱乐体验
            </p>
            <div class="flex space-x-4">
              <div
                  class="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-weibo text-lg text-[var(--neon-blue)]"></i>
              </div>
              <div
                  class="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-weixin text-lg text-[var(--neon-blue)]"></i>
              </div>
              <div
                  class="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center hover:bg-[rgba(59,130,246,0.4)] transition-all cursor-pointer">
                <i class="fab fa-github text-lg text-[var(--neon-blue)]"></i>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-6 tech-font">产品</h4>
            <ul class="space-y-4">
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>视频中心
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>AI对话
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>AI绘画
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>智能体
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>MCP平台
              </a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-6 tech-font">资源</h4>
            <ul class="space-y-4">
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>开发者文档
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>API接口
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>社区论坛
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>学习资源
              </a></li>
              <li><a href="#"
                     class="text-[var(--niuyin-text-color)] opacity-90 hover:text-[var(--neon-blue)] transition-all flex items-center">
                <i class="fas fa-arrow-right text-xs mr-3 text-[var(--neon-blue)]"></i>技术博客
              </a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-6 tech-font">联系我们</h4>
            <ul class="space-y-4">
              <li class="flex items-start">
                <i class="fas fa-envelope mt-1.5 mr-3 text-[var(--neon-blue)]"></i>
                <span class="text-[var(--niuyin-text-color)] opacity-90">contact@zhishixuebao.com</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-phone-alt mt-1.5 mr-3 text-[var(--neon-blue)]"></i>
                <span class="text-[var(--niuyin-text-color)] opacity-90">400-888-8888</span>
              </li>
            </ul>
          </div>
        </div>

        <div
            class="border-t border-[var(--niuyin-border-color)] mt-12 pt-8 text-center text-sm text-[var(--niuyin-text-color)] opacity-70">
          © 2025 芝士学爆智能科技有限公司 版权所有 | 京ICP备88888888号-7 | 未来已来，智造无限可能
        </div>
      </div>
    </footer>
  </div>

</template>

<style scoped>

.browser-frame {
  margin: 1rem;
  border: 1px solid var(--niuyin-border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  min-height: calc(100vh - 2rem);
  backdrop-filter: blur(12px);
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.browser-frame::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
  animation: scanline 6s linear infinite;
}

.hero-gradient {
  background: linear-gradient(135deg, rgba(37, 61, 195, 0.9), rgba(20, 137, 140, 0.7));
  position: relative;
  overflow: hidden;
}

.hero-gradient::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  z-index: -1;
}

.future-gradient {
  background: linear-gradient(135deg, rgba(24, 18, 43, 0.9), rgba(42, 20, 66, 0.7));
  position: relative;
}

.future-card {
  background: rgba(25, 30, 60, 0.4);
  border: 1px solid var(--niuyin-border-color);
  border-radius: 16px;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.future-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple), var(--neon-blue));
  z-index: -1;
  border-radius: 18px;
  opacity: 0.7;
  animation: borderPulse 3s infinite;
}

.future-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  border-color: var(--neon-blue);
}

.future-card:hover::before {
  opacity: 1;
}

.hologram-card {
  perspective: 1000px;
}

.hologram-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.hologram-card:hover .hologram-card-inner {
  transform: rotateY(180deg);
}

.hologram-front,
.hologram-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hologram-back {
  transform: rotateY(180deg);
  background: rgba(20, 25, 50, 0.9);
}

.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: var(--niuyin-icon-bg);
  transition: all 0.4s ease;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.icon-container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.icon-container:hover::after {
  opacity: 0.3;
}

.icon-container:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px var(--niuyin-primary-color);
}

.feature-icon {
  color: var(--neon-blue);
  font-size: 28px;
  z-index: 2;
}

.btn-primary {
  background: linear-gradient(45deg, var(--niuyin-primary-color), #5e60ce);
  color: white;
  border-radius: 12px;
  padding: 14px 32px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: 0.5s;
}

.btn-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 25px rgba(59, 130, 246, 0.6);
}

.btn-primary:hover::before {
  left: 100%;
}

.tech-font {
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.neon-text {
  text-shadow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue);
}

.gradient-text {
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.timeline-item {
  position: relative;
  padding-left: 40px;
  padding-bottom: 60px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--neon-blue), var(--neon-purple));
  box-shadow: 0 0 10px var(--neon-blue);
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-purple));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 15px var(--neon-blue);
  z-index: 10;
}

.holographic-bar {
  height: 6px;
  border-radius: 3px;
  background: rgba(96, 165, 250, 0.2);
  overflow: hidden;
  position: relative;
}

.holographic-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 65%;
  background: linear-gradient(90deg, var(--neon-blue), var(--niuyin-primary-color));
  animation: progressPulse 2s infinite;
}

.mcp-highlight {
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  background: rgba(30, 15, 60, 0.6);
  background-clip: padding-box;
  border-radius: 16px;
}

.mcp-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 243, 255, 0.1), rgba(189, 0, 255, 0.1));
  z-index: -1;
  border-radius: inherit;
}

.mcp-highlight::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: conic-gradient(transparent,
  rgba(0, 243, 255, 0.3),
  rgba(189, 0, 255, 0.3),
  transparent 70%);
  animation: rotate 20s linear infinite;
  z-index: -1;
}

.interactive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.floating {
  animation: floating 6s ease-in-out infinite;
}

.pulse {
  animation: pulse 3s infinite;
}

@keyframes floating {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

@keyframes borderPulse {
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.3;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes scanline {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes progressPulse {
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.8;
  }
}

.terminal {
  background: rgba(10, 15, 30, 0.9);
  border-radius: 12px;
  border: 1px solid var(--niuyin-border-color);
  font-family: monospace;
  overflow: hidden;
  position: relative;
}

.terminal-header {
  background: rgba(20, 25, 50, 0.7);
  padding: 8px 15px;
  display: flex;
  align-items: center;
}

.terminal-buttons {
  display: flex;
  gap: 8px;
  margin-right: 10px;
}

.terminal-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.btn-close {
  background: #ff5f56;
}

.btn-min {
  background: #ffbd2e;
}

.btn-max {
  background: #27c93f;
}

.terminal-body {
  padding: 20px;
  height: 200px;
  overflow-y: auto;
}

.code-line {
  margin-bottom: 8px;
  animation: type 0.1s steps(20, end);
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 18px;
  background: var(--neon-blue);
  animation: blink 1s infinite;
  margin-left: 5px;
}

@keyframes type {
  from {
    width: 0;
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% {
    clip: rect(31px, 9999px, 94px, 0);
  }

  10% {
    clip: rect(112px, 9999px, 76px, 0);
  }

  20% {
    clip: rect(85px, 9999px, 77px, 0);
  }

  30% {
    clip: rect(27px, 9999px, 97px, 0);
  }

  40% {
    clip: rect(64px, 9999px, 98px, 0);
  }

  50% {
    clip: rect(61px, 9999px, 85px, 0);
  }

  60% {
    clip: rect(99px, 9999px, 114px, 0);
  }

  70% {
    clip: rect(34px, 9999px, 115px, 0);
  }

  80% {
    clip: rect(98px, 9999px, 129px, 0);
  }

  90% {
    clip: rect(43px, 9999px, 96px, 0);
  }

  100% {
    clip: rect(82px, 9999px, 64px, 0);
  }
}

@keyframes glitch-anim2 {
  0% {
    clip: rect(65px, 9999px, 119px, 0);
  }

  10% {
    clip: rect(79px, 9999px, 63px, 0);
  }

  20% {
    clip: rect(101px, 9999px, 82px, 0);
  }

  30% {
    clip: rect(73px, 9999px, 29px, 0);
  }

  40% {
    clip: rect(105px, 9999px, 69px, 0);
  }

  50% {
    clip: rect(34px, 9999px, 84px, 0);
  }

  60% {
    clip: rect(64px, 9999px, 25px, 0);
  }

  70% {
    clip: rect(118px, 9999px, 109px, 0);
  }

  80% {
    clip: rect(101px, 9999px, 120px, 0);
  }

  90% {
    clip: rect(106px, 9999px, 23px, 0);
  }

  100% {
    clip: rect(7px, 9999px, 60px, 0);
  }
}
</style>
