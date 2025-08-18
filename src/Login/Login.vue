<template>
  <div
      class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <!-- 主容器 -->
    <div class="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <!-- 左侧品牌区域 -->
        <div
            class="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
          <!-- 背景装饰 -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div class="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
            <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <!-- 品牌信息 -->
          <div class="relative z-10 text-center">
            <div class="flex items-center justify-center mb-6">
              <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-3">
                <span class="text-2xl font-bold text-blue-600">芝</span>
              </div>
              <h1 class="text-3xl font-bold">芝士学爆</h1>
            </div>

            <p class="text-xl mb-4 opacity-90">让学习像视频一样简单</p>
            <p class="text-lg opacity-80">AI智能助教24小时伴学</p>

            <!-- 特色标签 -->
            <div class="flex flex-wrap justify-center gap-3 mt-8">
              <span class="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">视频学习</span>
              <span class="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">AI助教</span>
              <span class="px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">个性化</span>
            </div>
          </div>

          <!-- 装饰图片区域 -->
          <div class="mt-8 relative">
            <div
                class="w-80 h-48 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <el-icon size="24">
                    <VideoPlay/>
                  </el-icon>
                </div>
                <p class="text-sm opacity-80">沉浸式学习体验</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧登录区域 -->
        <div class="lg:w-1/2 p-8 lg:p-12">
          <div class="max-w-md mx-auto">
            <!-- 标题 -->
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">欢迎回来</h2>
              <p class="text-gray-600 dark:text-gray-400">登录您的账户继续学习之旅</p>
            </div>

            <!-- 登录方式切换 -->
            <el-tabs v-model="loginType" class="mb-6">
              <el-tab-pane label="账号密码登录" name="up">
                <template #label>
                  <span class="flex items-center">
                    <el-icon class="mr-2">
                      <User/>
                    </el-icon>
                    账号密码登录
                  </span>
                </template>
              </el-tab-pane>
              <el-tab-pane label="短信验证登录" name="sms">
                <template #label>
                  <span class="flex items-center">
                    <el-icon class="mr-2">
                      <Iphone/>
                    </el-icon>
                    短信验证登录
                  </span>
                </template>
              </el-tab-pane>
            </el-tabs>

            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
              <!-- 账号密码登录 -->
              <div v-if="loginType === 'up'" class="space-y-4">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" placeholder="请输入手机号或邮箱" class="h-12">
                    <template #prefix>
                      <el-icon>
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" class="h-12"
                            show-password
                            @keyup.enter="handleLogin">
                    <template #prefix>
                      <el-icon>
                        <Lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- 短信验证登录 -->
              <div v-if="loginType === 'sms'" class="space-y-4">
                <el-form-item prop="telephone">
                  <el-input v-model="loginForm.telephone" placeholder="请输入手机号" class="h-12">
                    <template #prefix>
                      <el-icon>
                        <Iphone/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="smsCode">
                  <el-input v-model="loginForm.smsCode" placeholder="请输入验证码" class="h-12"
                            @keyup.enter="handleLogin">
                    <template #prefix>
                      <el-icon>
                        <Key/>
                      </el-icon>
                    </template>
                    <template #suffix>
                      <el-button v-if="mobileCodeTimer <= 0" type="primary" link @click="getSmsCode" class="text-sm">
                        获取验证码
                      </el-button>
                      <span v-else class="text-sm text-gray-500">
                        {{ mobileCodeTimer }}s后重试
                      </span>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- 记住登录和忘记密码 -->
              <div class="flex items-center justify-between mb-4 mt-2">
                <el-checkbox v-model="rememberMe" class="text-sm">
                  自动登录
                </el-checkbox>
                <el-button type="primary" link class="text-sm">
                  忘记密码？
                </el-button>
              </div>

              <!-- 登录按钮 -->
              <el-form-item>
                <el-button type="primary" size="large" class="w-full h-12 text-base font-medium" :loading="loading"
                           @click="handleLogin">
                  {{ loading ? '登录中...' : '登录' }}
                </el-button>
              </el-form-item>
            </el-form>

            <!-- 其他登录方式 -->
            <div class="mt-8">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-4 bg-white dark:bg-gray-800 text-gray-500">其他登录方式</span>
                </div>
              </div>

              <div class="flex justify-center space-x-4 mt-6">
                <el-button circle size="large" class="w-12 h-12">
                  <i class="fab fa-weixin text-green-500 text-xl"></i>
                </el-button>
                <el-button circle size="large" class="w-12 h-12">
                  <i class="fab fa-qq text-blue-400 text-xl"></i>
                </el-button>
                <el-button circle size="large" class="w-12 h-12">
                  <i class="fab fa-weibo text-red-500 text-xl"></i>
                </el-button>
              </div>
            </div>

            <!-- 注册链接 -->
            <div class="text-center mt-8">
              <span class="text-gray-600 dark:text-gray-400">还没有账号？</span>
              <el-button type="primary" link @click="showRegisterDialog = true" class="ml-1">
                立即注册
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <el-dialog v-model="showRegisterDialog" title="加入芝士学爆" width="500px" :before-close="handleCloseRegister"
               class="register-dialog">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="default" label-width="80px">
        <el-form-item label="手机号" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入手机号" class="h-12">
            <template #prefix>
              <el-icon>
                <Iphone/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="smsCode">
          <el-input v-model="registerForm.smsCode" placeholder="请输入验证码" class="h-12">
            <template #prefix>
              <el-icon>
                <Key/>
              </el-icon>
            </template>
            <template #suffix>
              <el-button v-if="registerCodeTimer <= 0" type="primary" link @click="getRegisterSmsCode" class="text-sm">
                获取验证码
              </el-button>
              <span v-else class="text-sm text-gray-500">
                {{ registerCodeTimer }}s后重试
              </span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请设置6-20位密码" class="h-12"
                    show-password>
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" class="h-12"
                    show-password>
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="flex items-center space-x-2 py-2 px-4">
          <el-checkbox v-model="agreeTerms"/>
          <span class="text-sm text-gray-600 dark:text-gray-400">
              我已阅读并同意
              <el-button type="primary" link class="p-0 text-sm">《用户协议》</el-button>
              和
              <el-button type="primary" link class="p-0 text-sm">《隐私政策》</el-button>
            </span>
        </div>
      </el-form>

      <template #footer>
        <div class="flex space-x-3">
          <el-button size="large" @click="showRegisterDialog = false" class="flex-1">
            取消
          </el-button>
          <el-button type="primary" size="large" :loading="registerLoading" @click="handleRegister" class="flex-1">
            {{ registerLoading ? '注册中...' : '注册' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {userLogin, userSmsLogin, register} from "@/api/member.js";
import {setToken} from "@/utils/auth.js";
import {
  User,
  Lock,
  Iphone,
  Key,
  VideoPlay,
  ChatDotRound,
  Star
} from '@element-plus/icons-vue';

export default {
  name: "LoginNew",
  components: {
    User,
    Lock,
    Iphone,
    Key,
    VideoPlay,
    ChatDotRound,
    Star
  },
  data() {
    // 自定义验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };

    return {
      loginType: "up",
      loading: false,
      registerLoading: false,
      showRegisterDialog: false,
      rememberMe: false,
      agreeTerms: false,
      mobileCodeTimer: 0,
      registerCodeTimer: 0,

      // 登录表单
      loginForm: {
        username: "",
        password: "",
        telephone: "",
        smsCode: "",
      },

      // 注册表单
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        smsCode: ""
      },

      // 登录验证规则
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"},
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
        ],
        telephone: [
          {required: true, trigger: "blur", message: "手机号不能为空"},
          {
            pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
            message: "手机号格式错误",
            trigger: "blur"
          }
        ],
        smsCode: [
          {required: true, trigger: "blur", message: "请输入验证码"},
        ]
      },

      // 注册验证规则
      registerRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入手机号"},
          {
            pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
            message: "手机号格式错误",
            trigger: "blur"
          }
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入密码"},
          {min: 6, max: 20, message: "密码长度为6-20位", trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, trigger: "blur", message: "请再次输入密码"},
          {validator: validateConfirmPassword, trigger: "blur"}
        ],
        smsCode: [
          {required: true, trigger: "blur", message: "请输入验证码"},
        ]
      }
    };
  },

  methods: {
    // 登录处理
    handleLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;

          if (this.loginType === "up") {
            // 账号密码登录
            userLogin(this.loginForm.username, this.loginForm.password)
                .then(res => {
                  if (res.code === 200) {
                    setToken(res.data.token);
                    this.$message.success(res.msg);
                    this.$router.push('/');
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(error => {
                  this.$message.error('登录失败，请重试');
                  console.error(error);
                })
                .finally(() => {
                  this.loading = false;
                });
          } else if (this.loginType === "sms") {
            // 短信验证登录
            userSmsLogin(this.loginForm.telephone, this.loginForm.smsCode)
                .then(res => {
                  if (res.code === 200) {
                    setToken(res.data.token);
                    this.$message.success(res.msg);
                    this.$router.push('/');
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(error => {
                  this.$message.error('登录失败，请重试');
                  console.error(error);
                })
                .finally(() => {
                  this.loading = false;
                });
          }
        }
      });
    },

    // 获取登录短信验证码
    getSmsCode() {
      if (this.mobileCodeTimer > 0) return;

      if (!this.loginForm.telephone) {
        this.$message.warning('请先输入手机号');
        return;
      }

      // 这里应该调用发送短信验证码的API
      // sendSmsCode(this.loginForm.telephone).then(res => {
      this.$message.success("验证码已发送");
      this.mobileCodeTimer = 60;
      const timer = setInterval(() => {
        this.mobileCodeTimer--;
        if (this.mobileCodeTimer <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      // });
    },

    // 获取注册短信验证码
    getRegisterSmsCode() {
      if (this.registerCodeTimer > 0) return;

      if (!this.registerForm.username) {
        this.$message.warning('请先输入手机号');
        return;
      }

      // 这里应该调用发送短信验证码的API
      // sendSmsCode(this.registerForm.username).then(res => {
      this.$message.success("验证码已发送");
      this.registerCodeTimer = 60;
      const timer = setInterval(() => {
        this.registerCodeTimer--;
        if (this.registerCodeTimer <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      // });
    },

    // 注册处理
    handleRegister() {
      if (!this.agreeTerms) {
        this.$message.warning('请先同意用户协议和隐私政策');
        return;
      }

      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          this.registerLoading = true;

          register({
            username: this.registerForm.username,
            password: this.registerForm.password,
            confirmPassword: this.registerForm.confirmPassword
          })
              .then(res => {
                if (res.code === 200) {
                  this.$message.success(res.msg);
                  this.showRegisterDialog = false;
                  this.resetRegisterForm();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(error => {
                this.$message.error('注册失败，请重试');
                console.error(error);
              })
              .finally(() => {
                this.registerLoading = false;
              });
        }
      });
    },

    // 关闭注册弹窗
    handleCloseRegister() {
      this.showRegisterDialog = false;
      this.resetRegisterForm();
    },

    // 重置注册表单
    resetRegisterForm() {
      this.registerForm = {
        username: "",
        password: "",
        confirmPassword: "",
        smsCode: ""
      };
      this.agreeTerms = false;
      this.registerCodeTimer = 0;
      if (this.$refs.registerFormRef) {
        this.$refs.registerFormRef.resetFields();
      }
    }
  },

  beforeUnmount() {
    // 清理定时器
    if (this.mobileCodeTimer > 0) {
      this.mobileCodeTimer = 0;
    }
    if (this.registerCodeTimer > 0) {
      this.registerCodeTimer = 0;
    }
  }
};
</script>

<style scoped>
/* 自定义样式 */
.login-page {
  background: var(--niuyin-bg-color, #ffffff);
  color: var(--niuyin-text-color, #000000);
}

/* Element Plus 组件样式覆盖 */
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--niuyin-primary-color, rgb(17, 72, 210));
}

:deep(.el-tabs__item.is-active) {
  color: var(--niuyin-primary-color, rgb(17, 72, 210));
}

:deep(.el-button--primary:hover) {
  background-color: var(--niuyin-primary-color, rgb(17, 72, 210));
  border-color: var(--niuyin-primary-color, rgb(17, 72, 210));
  opacity: 0.8;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--niuyin-primary-color, rgb(17, 72, 210));
  border-color: var(--niuyin-primary-color, rgb(17, 72, 210));
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-page > div {
    margin: 1rem;
  }
}

@media (max-width: 768px) {
  .login-page > div > div {
    flex-direction: column;
  }

  .login-page > div > div > div:first-child {
    min-height: 300px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-page {
    background: var(--niuyin-bg-color, #1a1a1a);
    color: var(--niuyin-text-color, #ffffff);
  }
}
</style>
