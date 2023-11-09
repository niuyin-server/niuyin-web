<template>
  <div class="container">
  <div class="login-container">
    <div class="login-from">
      <div class="login-image">
      </div>
      <!-- 登陆页面的表单 -->
      <div class="logon-form-big">
        <div class="logon-form-top">
          <div>
            <span class="title">欢迎使用本系统</span>
          </div>
          <div class="login-if">
            <el-tabs class="form" v-model="loginType" style="float:none;">
              <el-tab-pane label="账号密码登录" name="up"></el-tab-pane>
              <el-tab-pane label="手机短信登录" name="sms"></el-tab-pane>
              <el-tab-pane label="二维码登录" name="qr"></el-tab-pane>
            </el-tabs>
          </div>
          <!--登录表单-->
          <el-form :model="loginForm" label-width="120px" v-if="login">
            <div class="div-if" v-if="loginType==='up'">
              <el-form-item label="账号">
                <el-input v-model="loginForm.name" placeholder="请输入账号"/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginForm.password" placeholder="请输入密码"/>
              </el-form-item>
            </div>

            <div class="div-if" v-if="loginType==='sms'">
              <el-input placeholder="请输入手机号" v-model="loginform.inputPhone">
                <el-select style="width: 20px;height: 10px" v-model="select" slot="prepend" placeholder="请选择">
                  <el-option label="餐厅名" value="1"></el-option>
                  <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option>
                </el-select>
              </el-input>
            </div>

            <el-form-item>
              <el-button
                  @click="handleUserLogin"
                  type="primary"
                  style="width: 240px"
              >登录
              </el-button
              >
              <el-button
                  @click="handleRegisterUser"
                  type="primiry"
                  style="width: 240px"
              >注册
              </el-button
              >
            </el-form-item>
          </el-form>
          <!-- 注册页面的表单 -->
          <el-form
              v-else
              :model="registerform"
              status-icon="true"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
          >
            <el-form-item label="账号" prop="name">
              <el-input
                  type="text"
                  v-model="registerform.name"
                  autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                  type="password"
                  v-model="registerform.password"
                  autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                  type="password"
                  v-model="registerform.checkPass"
                  autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 20px">
              <el-button
                  @click="goregister"
                  type="primiry"
                  style="width: 240px; background-color: #07a7e1"
              >注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="logon-form-bottom">
          <el-divider class="el-divider-horizontal">其他方式登录</el-divider>
          <el-button round>其他方式登录</el-button>
        </div>
      </div>
    </div>
  </div></div>
</template>

<script>
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/useUserStore";
import {userLogin, register, getInfo} from '@/api/member.js';

export default {
  name: "LoginIndex",
  data() {
    return {
      loginType: "up",
      login: true,
      loginForm: {
        username: "",
        password: "",
      },
      registerform: {
        name: "",
        password: "",
        confirmPassword: "",
      },
      rules: {
        name: [
          {required: true, message: "请输入账号", trigger: "blur"},
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 3, max: 18, message: "长度必须3到18位", trigger: "blur"},
        ],
        confirmPassword: [
          {required: true, message: "请再次输入密码", trigger: "blur"},
          {min: 3, max: 18, message: "长度必须3到18位", trigger: "blur"},
        ],
      },
    };
  },
  created() {
  },
  methods: {
    // 登录
    handleUserLogin() {
      userLogin(this.loginForm).then(res => {
        if (res.code === 200) {
          const userStore = useUserStore()
          userStore.settoken(res.data.token)
          this.$message.success(res.msg)
          this.$router.push('/index')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getUserInfo() {
      getInfo().then(res => {
        if (res.code === 200) {
          localStorage.setItem("userInfo", JSON.stringify(res.data))
        }
      })
    },
    handleRegisterUser() {
      this.login = false;
    },
    // 注册
    goregister() {
      this.login = true;
      register({
        username: this.registerform.name,
        password: this.registerform.password,
        confirmPassword: this.registerform.checkPass,
      }).then((res) => {
        if (res.code != 200) {
          this.login = false;
          ElMessage({
            message: res.msg,
            type: "warning",
          });
        } else {
          this.login = true;
          ElMessage({
            message: res.msg,
            type: "success",
          });
        }
      });
    },
  },
  setup() {
  },
};
</script>

<style scoped>
@import "@/assets/styles/login.scss";
</style>
