<template>
  <el-form label-width="80px" :model="accountForm" :rules="rules">
    <el-form-item label="旧密码" prop="oldpassword">
      <el-input type="password" v-model="accountForm.oldpassword" placeholder="请输入旧密码"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newpassword">
      <el-input type="password" v-model="accountForm.newpassword" placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop='confirmpassword'>
      <el-input type="password" v-model="accountForm.confirmpassword" placeholder="请再次输入新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-row :offset="80" style="width: 100%;"> 
        <el-col :span="12">
        <el-button @click="updatepassword">修改密码</el-button>

        </el-col>
        <el-col :span="12">
          <el-button @click="updatepassword">退出登录</el-button>
        </el-col>

      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'accountIndex',
  data() {
    return {
      accountForm: {
        oldpassword: '',
        newpassword: '',
        confirmpassword: ''
      },
      rules: {
        oldpassword: [
          { required: true, message: '请输入自己的密码', trigger: 'blur' }

        ],
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }

        ],
        confirmpassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.accountForm.newpassword) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }

            }
          }

        ]
      }
    };
  },
  methods: {
    updatepassword() {

    }

  },

}

</script>

<style lang='less' scoped></style>
