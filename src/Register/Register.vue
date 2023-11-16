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
          <div class="title" style="padding: 10px;">欢迎使用牛音</div>
        </h2>
        <!-- 表单 -->
        <div class="form-cont">
          <el-tabs class="form" style="float:none;">
            <el-tab-pane label="账号密码注册" name="up"></el-tab-pane>
          </el-tabs>
          <div>
            <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form">
              <!-- 账号密码注册 -->
              <div>
                <el-form-item prop="username">
                  <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="账号">
                    <!--                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>-->
                    <!--                    <User slot="prefix" style="width: 1em; height: 1em; margin-right: 8px" />-->
                    <template #prefix>
                      <el-icon class="el-input__icon">
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码"
                            @keyup.enter.native="handleRegister">
                    <!--                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>-->
                  </el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                  <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off"
                            placeholder="确认密码密码"
                            @keyup.enter.native="handleRegister">
                    <!--                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>-->
                  </el-input>
                </el-form-item>
              </div>

              <!-- 按钮 -->
              <el-form-item style="width:100%;">
                <el-button :loading="loading" type="primary" style="width:100%;"
                           @click.native.prevent="handleRegister">
                  <span v-if="!loading">注册</span>
                  <span v-else>注 册 中...</span>
                </el-button>
                <div style="float: right" v-if="login">
                  <router-link class="link-type" :to="'/login'">立即登录
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
import {register} from "@/api/member.js";

export default {
  name: "Register",
  data() {
    return {
      login:true,
      registerForm: {
        username: "",
        password: "",
        confirmPassword: ""
      },
      registerRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"},
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"},
        ],
        confirmPassword: [
          {required: true, trigger: "blur", message: "请再次输入您的密码"},
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
              register({
                username: this.registerForm.username,
                password: this.registerForm.password,
                confirmPassword: this.registerForm.confirmPassword
              }).then(res => {
                if (res.code != 200) {
                  this.login = false
                  this.$message.warning(res.msg)
                } else {
                  this.login = true
                  this.$message.success(res.msg)
                }
              })
        }
      });


    },
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

</style>
