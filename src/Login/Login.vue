<template>
<<<<<<<<< Temporary merge branch 1
  <div
    style="
      /* background-color: aquamarine; */
      position: absolute;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-image: linear-gradient(to bottom right,rgb(113, 165, 244), rgb(239, 253, 246));
    "
  >
    <div class="login">
      <div class="login-image">
        <!-- <img src="../assets/images/login.png" alt="handsome" /> -->
=========
  <el-row>
    <el-col :span="12" class="bgimage" style="min-height:100vh">


    </el-col>

    <el-col :span="6" :offset="3" style="height: 100%; margin-top: 250px;">
      <div style="height: 90px;width: 90px; transform: translateX(200px);">
>>>>>>>>> Temporary merge branch 2
      </div>
      <!-- 登陆页面的表单 -->
      <div class="logon-form-big">

        <div class="logon-form-top">
          <span style="display: flex;margin-left: 50px;font-weight: bold">欢迎使用本系统</span>
          <el-form :model="loginform" label-width="120px" v-if="login">
            <el-form-item label="账号">
              <el-input v-model="loginform.name" placeholder="请输入账号" />
            </el-form-item>

            <el-form-item label="密码">
              <el-input v-model="loginform.password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item>
              <el-button
                @click="handleUserLogin"
                type="primary"
                style="width: 240px"
                >登录</el-button
              >
              <el-button
                @click="handleRegisterUser"
                type="primiry"
                style="width: 240px"
                >注册</el-button
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
          <el-divider class="el-drover-horizontal">其他方式登录</el-divider>

          <el-button round>其他方式登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/useUserStore";
import {userLogin, register, getInfo} from '@/api/member.js';

export default {
  name: "LoginIndex",
  data() {
    return {

      loginType: "up",
      login: true,
<<<<<<<<< Temporary merge branch 1
      loginform: {
        name: "",
        password: "",
      },
      registerform: {
        name: "",
        password: "",
        checkPass: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度必须3到18位", trigger: "blur" },
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 3, max: 18, message: "长度必须3到18位", trigger: "blur" },
        ],
      },
    };
},
  created() {},
=========
      token: '',
    }
  },
  created() {

  },
  methods: {
    // 登录
    handleUserLogin() {
      userLogin(this.loginform.name, this.loginform.password).then(res => {
        if (res.code === 200) {
          const userStore = useUserStore()
          userStore.settoken(res.data.token)
          ElMessage({
            message: res.msg,
            type: 'success',
          })
          this.$router.push('/index')
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
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
  setup() {},
};
</script>

<style lang='less' scoped>
.bgimage {
  background-image: url(../assets/affeade4eb186004825a19e2eab59088.jpg);
  background-size: 100% auto;
}

.el-button + .el-button {
  margin-left: 0;
}

#loginHead {
  max-width: 100%;
  height: auto;
  background-repeat: no-repeat;
}
.login {
  width: 80vw;
  height: 60vh;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 2rem;
  display: flex;
}
.login-image {
  width: 40vw;
  height: 50vh;
  background: url(../assets/images/login.png) no-repeat;
  background-size: cover;
  border-radius: 2rem 0 0 2rem;
}
.logon-form-big {
  /* background-color: #f8f7f7; */
  width: 40vw;
  height: 50vh;
  display: grid;
  align-items: center;
  border-radius: 2rem;
}
.logon-form-top {
  background-color: #f8f7f7;
  width: 40vw;
  height: 30vh;
  display: grid;
  align-items: center;
  border-radius: 0 2rem 0 0;
}
.logon-form-bottom {
  background-color: #f8f7f7;
  width: 40vw;
  height: 20vh;
  display: grid;
  align-items: center;
  /* 水平居中把这个打开 */
  justify-content: center;
  border-radius: 0 0 2rem 0;
}
.el-drover-horizontal {
  display: flex;
  height: 1px;
  width: 100%;
}
</style>
