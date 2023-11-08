<template>
  <el-row>
    <el-col :span="12" class="bgimage" style="min-height:100vh">


    </el-col>

    <el-col :span="6" :offset="3" style="height: 100%; margin-top: 250px;">
      <div style="height: 90px;width: 90px; transform: translateX(200px);">
        <img id="loginHead" src="../assets/268303cadd2e4579bf35faecb5d5914b.jpeg">
      </div>
      <!-- 登陆页面的表单 -->
      <el-form :model="loginform" label-width="120px" v-if="login">
        <el-form-item label="账号">
          <el-input v-model="loginform.name" placeholder="请输入账号"/>


        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="loginform.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleUserLogin" type="primary" style="width: 240px;">登录</el-button>
          <el-button @click="handleRegisterUser" type="primiry" style="width: 240px;">注册</el-button>

        </el-form-item>

      </el-form>
      <!-- 注册页面的表单 -->
      <el-form v-else :model="registerform" status-icon="true" :rules="rules" ref="ruleForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="账号" prop="name">
          <el-input type="text" v-model="registerform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="registerform.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-button @click="goregister" type="primiry"
                     style="width: 240px; background-color:#07A7E1;">注册
          </el-button>

        </el-form-item>
      </el-form>

    </el-col>

  </el-row>
</template>

<script>
import {reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {userLogin, register, getInfo} from '@/api/user'
import {useUserStore} from '@/store/useUserStore'

export default {
  name: 'LoginIndex',
  data() {
    return {
      login: true,
    }
  },
  async created() {

  },
  methods: {

    // 登录
    handleUserLogin() {
      userLogin(this.loginform.name, this.loginform.password).then(res => {
        if (res.code === 200) {
          const userstore = useUserStore()
          userstore.settoken(res.data.token)
          this.getUserInfo();
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
      this.login = false
    },
    // 注册
    goregister() {
      this.login = true
      register({
        username: this.registerform.name,
        password: this.registerform.password,
        confirmPassword: this.registerform.checkPass
      }).then(res => {
        if (res.code != 200) {
          this.login = false
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
        } else {
          this.login = true
          ElMessage({
            message: res.msg,
            type: 'success',
          })
        }
      })

    }
  },
  setup() {
    const loginform = reactive({
      name: '',
      password: ''
    })
    const registerform = reactive({
          name: '',
          password: '',
          checkPass: ''
        }
    )
    const rules = {
      name: [
        {required: true, message: '请输入账号', trigger: 'blur'},
        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
      ],
      password: [{required: true, message: '请输入密码', trigger: 'blur'},
        {min: 3, max: 18, message: '长度必须3到18位', trigger: 'blur'},
      ],
      checkPass: [{required: true, message: '请再次输入密码', trigger: 'blur'},
        {min: 3, max: 18, message: '长度必须3到18位', trigger: 'blur'},
      ]
    }

    return {loginform, registerform, rules}
  }
}

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
</style>
