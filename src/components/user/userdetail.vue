<template>
  <el-row :gutter="30" type="flex">
    <el-col :span="12" :push="3">
      <el-form :model="form" label-width="50px" :rules="rules">
        <el-form-item label="邮箱" class="item" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="昵称" class="item" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话" class="item" prop="telnumber">
          <el-input v-model="form.telnumber" />
        </el-form-item>



        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男" />
            <el-radio style="margin-left: 80px;" label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form></el-col>
    <el-col :span="12">
      <div class="cover" style="margin-left: 180px;">
        <labal for="img">头像</labal>



        <input @change="upload" id="img" type="file" class="upload">
        <div style="width: 80px;height: 80px;">
          <img style="max-width: 100%; height: auto;" src="http://s3adm4szs.hb-bkt.clouddn.com/2023/11/03/a56f8ea051d54425bd071f2908834a49.png">
        </div>

      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { userupdate } from '@/api/user'
import request from '@/utils/request'

export default {
  name: 'userDetail',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      gender: '',
      telnumber: '',
      avatar: ''


    })
    const rules = {
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
      name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      telnumber: [{ required: true, min: 11, max: 11, message: '必须为手机号形式', trigger: 'blur' }]
    }
    return { form, rules }
  },
  methods: {
    async submit() {
      const res = await userupdate(this.form.name, this.form.email, this.form.telnumber, 'http://s3adm4szs.hb-bkt.clouddn.com/2023/11/03/a56f8ea051d54425bd071f2908834a49.png', this.form.gender)

      localStorage.removeItem("userInfo")
      console.log(res);
    },
    async upload(e: any) {

      const fd = new FormData()
      fd.set('file', e.target.files[0])

      const res = await request.post('/user/api/v1/avatar', {
        data: {
          fd
        }
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })


      console.log(res);

    }

  }



}



</script>

<style lang="less" scoped>
.upload {
  display: block;
  width: 80px;
  height: 80px;
  background-image: url('../../assets/user/userdetail.background.webp');
  background-size: cover;
  font-size: 0;


}

.item {
  padding-bottom: 50px;

  color: white;
}

.el-button {
  width: 800px;
}

.group {
  width: 300px;
  display: felx;
  justify-content: center;
}

.el-form {
  display: flex;
  flex-direction: column;

  justify-content: center;
  position: relative;
  right: 100px;

}

.el-form-item {
  width: 300px;
}
</style>
