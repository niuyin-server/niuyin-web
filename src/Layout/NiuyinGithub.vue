<template>
  <!--  <div style="margin: 0 1rem 1rem 0">-->
  <!--    <i-frame :src="url"/>-->

  <!--    <el-row :gutter="24">-->
  <!--      <el-col :xs="24" :sm="24" :lg="12">-->
  <!--        <div class="carousel-container">-->
  <!--          <el-carousel height="200px">-->
  <!--            <el-carousel-item v-for="item in 4" :key="item">-->
  <!--              <h3 class="small justify-center" text="2xl">{{ item }}</h3>-->
  <!--            </el-carousel-item>-->
  <!--          </el-carousel>-->
  <!--        </div>-->
  <!--      </el-col>-->
  <!--      <el-col :xs="24" :sm="24" :lg="12">-->
  <!--        <div class="source-code-wrapper">-->
  <!--          <div v-for="item in sourceCodeRepositoryList" :key="item.id"-->
  <!--               @click="openLink(`${item.url}`)" class="source-code-card flex-row cp text-hv-gold">-->
  <!--            <div class="source-code-icon">-->
  <!--              <svg class="icon3rem operate-svg" aria-hidden="true">-->
  <!--                <use :xlink:href="item.icon"></use>-->
  <!--              </svg>-->
  <!--            </div>-->
  <!--            <div>-->
  <!--              <div class="source-code-name one-line fs125 fw600">{{ item.name }}</div>-->
  <!--              <div class="source-code-desc one-line fs9 cg fw600">{{ item.desc }}</div>-->
  <!--              <div class="source-code-info cw fw600 flex-start">-->
  <!--                star-->
  <!--                <svg class="icon operate-svg mlr5" aria-hidden="true">-->
  <!--                  <use xlink:href="#icon-favorite-num"></use>-->
  <!--                </svg>-->
  <!--                {{ item.starNum }}-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </el-col>-->
  <!--    </el-row>-->
  <!--  </div>-->
  <div class="browser-frame flex flex-col">
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
      <section class="hero-gradient py-16 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">探索芝士学爆视频的源代码</h1>
            <p class="text-xl text-[var(--niuyin-text-color)] opacity-80 max-w-2xl mx-auto mb-8">
              我们开源了完整的视频平台代码库，欢迎开发者探索、学习并参与贡献
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="https://github.com/niuyin-server" target="_blank" class="btn-primary flex items-center">
                <i class="fab fa-github mr-2"></i> 访问GitHub组织
              </a>
              <button class="flex items-center text-[var(--niuyin-primary-color)] font-medium">
                <i class="fas fa-book mr-2"></i> 查看贡献指南
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 仓库展示区 -->
      <section class="py-16 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">开源代码仓库</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              8个精心维护的代码库，构建完整的视频平台生态系统
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- 仓库1 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-server"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin后端</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                基于Spring Boot构建的高性能视频服务平台，处理核心业务逻辑和API
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">Java</span>
                <span class="tech-tag">Spring Boot</span>
                <span class="tech-tag">MySQL</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-backend" target="_blank" class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库2 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-desktop"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin前端</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                使用Vue.js构建的响应式Web应用，提供流畅的视频观看体验
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">Vue.js</span>
                <span class="tech-tag">Tailwind CSS</span>
                <span class="tech-tag">Webpack</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-frontend" target="_blank"
                 class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库3 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin移动端</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                跨平台移动应用，使用Flutter构建，支持iOS和Android平台
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">Flutter</span>
                <span class="tech-tag">Dart</span>
                <span class="tech-tag">Firebase</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-mobile" target="_blank" class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库4 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-database"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin数据库</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                数据库架构设计和迁移脚本，支持MySQL和Redis
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">MySQL</span>
                <span class="tech-tag">Redis</span>
                <span class="tech-tag">SQL</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-database" target="_blank"
                 class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库5 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-file-alt"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin接口文档</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                RESTful API文档，使用OpenAPI规范，支持在线测试
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">OpenAPI</span>
                <span class="tech-tag">Swagger</span>
                <span class="tech-tag">YAML</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-api-docs" target="_blank"
                 class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库6 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-code-branch"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyinDevOps</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                持续集成/持续部署流水线，容器化配置和基础设施代码
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">Docker</span>
                <span class="tech-tag">Kubernetes</span>
                <span class="tech-tag">GitHub Actions</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-devops" target="_blank" class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库7 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-vial"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin测试</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                自动化测试套件，包括单元测试、集成测试和端到端测试
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">JUnit</span>
                <span class="tech-tag">Jest</span>
                <span class="tech-tag">Cypress</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-tests" target="_blank" class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>

            <!-- 仓库8 -->
            <div class="repo-card p-6 flex flex-col">
              <div class="repo-icon mb-4">
                <i class="fas fa-tools"></i>
              </div>
              <h3 class="text-xl font-semibold mb-2">niuyin工具</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4 flex-grow">
                开发辅助工具和实用脚本，提高开发效率和代码质量
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="tech-tag">Shell</span>
                <span class="tech-tag">Python</span>
                <span class="tech-tag">Node.js</span>
              </div>
              <a href="https://github.com/niuyin-server/niuyin-tools" target="_blank" class="btn-primary text-center">
                <i class="fab fa-github mr-2"></i> 查看源码
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 获取源码指南 -->
      <section class="py-16 px-6 bg-[var(--niuyin-icon-bg)]">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">如何获取和使用源码</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              多种方式获取源代码，开启你的开发之旅
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="repo-icon mx-auto mb-6">
                <i class="fas fa-download"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">下载ZIP文件</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                访问仓库页面，点击"Code"按钮选择"Download ZIP"获取完整源码:cite[1]:cite[8]
              </p>
            </div>

            <div class="text-center">
              <div class="repo-icon mx-auto mb-6">
                <i class="fas fa-code-branch"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">克隆仓库</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                使用Git命令克隆仓库到本地，保留完整版本历史:cite[4]:cite[5]
              </p>
              <div class="flex mt-4">
                <div class="clone-input flex-grow truncate text-left">git clone
                  https://github.com/niuyin-server/niuyin-frontend.git
                </div>
                <div class="clone-btn flex items-center">
                  <i class="far fa-copy mr-2"></i> 复制
                </div>
              </div>
            </div>

            <div class="text-center">
              <div class="repo-icon mx-auto mb-6">
                <i class="fas fa-share-alt"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">Fork仓库</h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                创建你自己的副本，进行修改并通过Pull Request贡献代码:cite[10]
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 贡献指南 -->
      <section class="py-16 px-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">参与贡献</h2>
            <p class="text-lg text-[var(--niuyin-text-color)] opacity-75 max-w-2xl mx-auto">
              加入我们的开源社区，共同打造更好的视频平台
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card p-6 border border-[var(--niuyin-border-color)] rounded-2xl">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-bug text-[var(--niuyin-primary-color)] mr-3"></i> 报告问题
              </h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                在GitHub仓库的Issues页面报告你发现的Bug或提出改进建议:cite[3]
              </p>
              <ul class="list-disc pl-5 text-[var(--niuyin-text-color)] opacity-80 space-y-2">
                <li>清晰描述问题现象</li>
                <li>提供重现步骤和环境信息</li>
                <li>添加相关截图或日志</li>
              </ul>
            </div>

            <div class="card p-6 border border-[var(--niuyin-border-color)] rounded-2xl">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-code text-[var(--niuyin-primary-color)] mr-3"></i> 提交代码
              </h3>
              <p class="text-[var(--niuyin-text-color)] opacity-80 mb-4">
                通过Pull Request提交你的代码贡献:cite[4]
              </p>
              <ul class="list-disc pl-5 text-[var(--niuyin-text-color)] opacity-80 space-y-2">
                <li>Fork项目仓库到你的账号</li>
                <li>创建新分支进行开发</li>
                <li>编写测试并确保通过所有检查</li>
                <li>提交清晰的Commit信息</li>
              </ul>
            </div>
          </div>

          <div class="mt-12 text-center">
            <a href="https://github.com/niuyin-server/.github/blob/main/CONTRIBUTING.md" target="_blank"
               class="btn-primary inline-flex items-center">
              <i class="fas fa-book-open mr-2"></i> 查看完整贡献指南
            </a>
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
            © 2025 芝士学爆视频平台 | 遵循MIT开源许可证
          </div>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/niuyin-server" target="_blank"
               class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-[var(--niuyin-text-color)] hover:text-[var(--niuyin-primary-color)] transition">
              <i class="fab fa-discord"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<!--
*@author roydon
*@date 2024/4/26 20:46
-->
<script>

export default {
  name: 'NiuyinGithub',
  props: {},
  components: {},
  data() {
    return {
      url: "https://github.com/niuyin-server",
      sourceCodeRepositoryList: [
        {
          id: 1,
          name: "niuyin-server",
          desc: "niuyin后端",
          icon: "#icon-spring-cloud",
          url: "https://github.com/niuyin-server",
          starNum: "3"
        },
        {
          id: 2,
          name: "niuyin-web",
          desc: "niuyin web端",
          icon: "#icon-vue",
          url: "https://github.com/niuyin-server",
          starNum: "2"
        },
        {
          id: 3,
          name: "niuyin-creator",
          desc: "niuyin创作者中心",
          icon: "#icon-vue",
          url: "https://github.com/niuyin-server",
          starNum: "3"
        },
        {
          id: 4,
          name: "niuyin-android",
          desc: "niuyin安卓端",
          icon: "#icon-android",
          url: "https://github.com/niuyin-server",
          starNum: "2"
        },
      ],
    }
  },
  created() {
  },
  mounted() {
  },
  emits: [],
  methods: {
    openLink(link) {
      console.log(link);
      window.open(link, "_blank")
    },
  }
}
</script>

<style scoped>
/*//.carousel-container {
//  border-radius: 1rem;
//  overflow: hidden;
//}
//
//.demonstration {
//  color: var(--el-text-color-secondary);
//}
//
//.el-carousel__item h3 {
//  color: #475669;
//  opacity: 0.75;
//  line-height: 150px;
//  margin: 0;
//  text-align: center;
//}
//
//.el-carousel__item:nth-child(2n) {
//  background-color: #99a9bf;
//}
//
//.el-carousel__item:nth-child(2n + 1) {
//  background-color: #d3dce6;
//}
//
//.source-code-wrapper {
//  border-radius: 1rem;
//  overflow: hidden;
//
//
//  .source-code-card {
//    background-color: var(--niuyin-primary-color-2);
//    margin-bottom: 1rem;
//    padding: .5rem;
//    border-radius: 1rem;
//
//    .source-code-icon {
//      margin: 1rem;
//    }
//
//    .source-code-name {
//    }
//
//    .source-code-desc {
//      margin-top: 0.5rem;
//    }
//
//    .source-code-info {
//      margin-top: 0.5rem;
//    }
//  }
//}*/
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
  min-height: calc(100vh - 2rem);
}

.hero-gradient {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05));
}

.repo-card {
  background-color: var(--niuyin-bg-color);
  border: 1px solid var(--niuyin-border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.repo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: var(--niuyin-primary-color);
}

.repo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background-color: var(--niuyin-icon-bg);
  transition: all 0.3s ease;
}

.repo-icon i {
  color: var(--niuyin-primary-color);
  font-size: 24px;
}

.btn-primary {
  background-color: var(--niuyin-primary-color);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.tech-tag {
  display: inline-block;
  background-color: var(--niuyin-icon-bg);
  color: var(--niuyin-primary-color);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.85rem;
}

.clone-input {
  background-color: var(--niuyin-bg-color);
  border: 1px solid var(--niuyin-border-color);
  border-radius: 12px;
  padding: 10px 16px;
  color: var(--niuyin-text-color);
  font-family: monospace;
}

.clone-btn {
  background-color: var(--niuyin-icon-bg);
  color: var(--niuyin-primary-color);
  border-radius: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clone-btn:hover {
  background-color: var(--niuyin-primary-color);
  color: white;
}
</style>
