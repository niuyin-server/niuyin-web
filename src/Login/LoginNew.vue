<template xmlns="">
  <div class="container">
    <!-- <div class="logo"></div> -->
    <!-- 登录区域 -->
    <div class="content">
      <!-- 配图 -->
      <div class="pic"></div>
      <!-- 表单 -->
      <div class="field">
        <!-- [移动端]标题 -->
        <h2 class="mobile-title">
          <div class="title" style="padding: 10px;">欢迎使用芝士芝士学爆</div>
        </h2>
        <!-- 表单 -->
        <div class="form-cont">
          <el-tabs class="form" v-model="loginType" style="float:none;">
            <el-tab-pane label="账号密码登录" name="up"></el-tab-pane>
            <el-tab-pane label="手机短信登录" name="sms"></el-tab-pane>
          </el-tabs>
          <div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
              <!-- 账号密码登录 -->
              <div v-if="loginType === 'up'">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                            @keyup.enter.native="handleLogin">
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <Lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- 手机短信登录 -->
              <div v-if="loginType === 'sms'">
                <el-form-item prop="telephone">
                  <el-input v-model="loginForm.telephone" type="text" auto-complete="off" placeholder="请输入手机号">
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <Iphone/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="phoneCode">
                  <el-input v-model="loginForm.smsCode" type="text" auto-complete="off" placeholder="短信验证码"
                            class="sms-login-mobile-code-prefix" @keyup.enter.native="handleLogin">
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <Key/>
                      </el-icon>
                    </template>
                    <template #append>
                      <span v-if="mobileCodeTimer <= 0" class="getMobileCode cb" @click="getSmsCode"
                            style="cursor: pointer;">获取验证码</span>
                      <span v-if="mobileCodeTimer > 0" class="getMobileCode">{{ mobileCodeTimer }}秒后重试</span>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- 登录按钮 -->
              <el-form-item class="w100" v-if="loginType != 'qr'">
                <el-button :loading="loading"
                           type="primary"
                           class="w100"
                           @click.native.prevent="handleLogin">
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right" v-if="register">
                  <router-link class="link-type" :to="'/register'">立即注册
                  </router-link>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="footer">
      <span>Copyright © 2022-2023 niuyin All Rights Reserved</span>
    </div>
  </div>
</template>
<script>
import {userLogin, userSmsLogin} from "@/api/member.js";
import {tokenX} from "@/store/tokenX";
import {setToken} from "@/utils/auth.js";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      // 二维码登录
      qrCodeUrl: "",
      uuid: "",
      qrCodeState: "",
      timer: "",
      showQRCodeErrorMask: false,
      mobileCodeTimer: 0,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: true,
      loginType: "up",
      loginForm: {
        username: "",
        password: "",
        telephone: "",
        smsCode: "",
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"},
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}],
        telephone: [
          {required: true, trigger: "blur", message: "手机号不能为空"},
          {
            validator: function (rule, value, callback) {
              if (/^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/.test(value) === false) {
                callback(new Error("手机号格式错误"));
              } else {
                callback();
              }
            }, trigger: "blur"
          }
        ]
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    // $route: {
    //   handler: function (route) {
    //     this.redirect = route.query && route.query.redirect;
    //   },
    //   immediate: true,
    // },
  },
  created() {
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if(this.loginType==="up"){
            new Promise((resolve, reject) => {
              userLogin(this.loginForm.username, this.loginForm.password).then(res => {
                if (res.code === 200) {
                  setToken(res.data.token)
                  this.$message.success(res.msg)
                  this.$router.push('/')
                  resolve()
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(error => {
                reject(error)
              })
            })
          }else if(this.loginType==="sms"){
            new Promise((resolve, reject) => {
              userSmsLogin(this.loginForm.telephone, this.loginForm.smsCode).then(res => {
                if (res.code === 200) {
                  setToken(res.data.token)
                  this.$message.success(res.msg)
                  this.$router.push('/')
                  resolve()
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(error => {
                reject(error)
              })
            })
          }
        }
      });
    },
    /** ========== 手机短信登录 ========== */
    getSmsCode() {
      if (this.mobileCodeTimer > 0) return;
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
        // sendSmsCode(this.loginForm.telephone).then(res => {
          this.$message.success("获取验证码成功")
          this.mobileCodeTimer = 60;
          let msgTimer = setInterval(() => {
            this.mobileCodeTimer = this.mobileCodeTimer - 1;
            if (this.mobileCodeTimer <= 0) {
              clearInterval(msgTimer);
            }
          }, 1000);
        // });
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style scoped>
@import "@/assets/styles/login-new.scss";

.oauth-login-item img {
  height: 25px;
  width: 25px;
}

.oauth-login-item span:hover {
  text-decoration: underline red;
  color: red;
}

.sms-login-mobile-code-prefix {
  :deep(.el-input__prefix) {
    top: 22%;
  }
}
</style>
