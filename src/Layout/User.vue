<template>
  <div class="main-container">
    <div class="user-container">
      <div class="avatar-area">
        <img class="user-avatar" :src="user.avatar"/>
      </div>
      <div class="user-info">
        <div class="username"><h1>{{ user.nickName }}</h1></div>
        <div class="follow-fans-like">
          <div class="user-info-follow flex-center">
            <div class="mr-5r cg fs8">关注</div>
            <div class="follow-right fw600">17</div>
          </div>
          <div class="=user-info-fans flex-center">
            <div class="mr-5r cg fs8">粉丝</div>
            <div class="follow-right fw600">34</div>
          </div>
          <div class="user-info-like flex-center">
            <div class="mr-5r cg fs8">获赞</div>
            <div class="fw600">45</div>
          </div>
        </div>
        <div class="user-profile">
          <span class="userid">牛音ID：{{ user.userId }}</span>
          <span class="gender-age">
            <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 12 12"
                 style="margin-right: 4px;">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8 1.25a.75.75 0 000 1.5h1.09L7.54 4.298a.757.757 0 00-.058.066 4 4 0 10.968 1.112.752.752 0 00.15-.117L10.25 3.71V5a.75.75 0 001.5 0V2a.75.75 0 00-.75-.75H8zM5 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                  fill="#168EF9">
            </path>
            </svg>
            <span>23岁</span>
          </span>
          <span class="city">河南·郑州</span>
          <span class="school">中原工学院</span>
        </div>
      </div>
      <div class="trust-login-switch">
        <div class="trust-login-tips">
          <el-tooltip content="保存登录信息，下次登陆免验证" placement="bottom">
            <el-icon :size="20">
              <QuestionFilled/>
            </el-icon>
          </el-tooltip>
        </div>
        <div class="trust-login-switch-title">保存登录信息</div>
        <div class="trust-login-switch-button">
          <el-switch
              v-model="saveLogin"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </div>
      </div>
      <div class="user-edit">
        <el-button @click="handleEditProfile" type="primary">编辑资料</el-button>
      </div>
    </div>
    <!--  作品，喜欢，收藏  -->
    <div>
      <div class="user-works">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="作品" name="first">作品</el-tab-pane>
          <el-tab-pane label="喜欢" name="second">喜欢</el-tab-pane>
          <el-tab-pane label="收藏" name="third">收藏</el-tab-pane>
          <el-tab-pane label="观看历史" name="fourth">观看历史</el-tab-pane>
        </el-tabs>
      </div>
    </div>


    <el-dialog v-model="editDialogVisible"
               style="height: 60vh;overflow: hidden"
               width="480px"
               :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h3 class="one-line" :id="titleId" :class="titleClass" style="color: black">编辑资料</h3>
        <el-button circle :icon="Close" type="info" @click="close">
        </el-button>
      </template>
      <el-scrollbar>
        <div class="edit-avatar">
          <el-tooltip content="上传头像" placement="top">
            <el-upload
                class="avatar-uploader"
                action="http://localhost:9090/member/api/v1/avatar"
                :show-file-list="false"
                :on-success="handleUploadAvatarSuccess"
            >
              <img v-if="user.avatar" :src="userForm.avatar" class="avatar"/>
              <i v-else class="iconfont icon-camera avatar-uploader-icon"/>
            </el-upload>
          </el-tooltip>
          <div class="I5fCASKY cg">点击修改头像</div>
        </div>
        <div class="edit-nickname">
          <div class="N3OJZMVX">昵称</div>
          <el-input
              v-model="userForm.nickName"
              maxlength="10"
              class="w-50 m-2"
              placeholder="记得填写昵称"
              show-word-limit
              type="text"
          />
        </div>
        <div class="edit-gender">
          <div class="N3OJZMVX">性别</div>
          <el-radio-group v-model="userForm.sex">
            <el-radio-button :label="'1'"><i class="iconfont icon-man"></i>男</el-radio-button>
            <el-radio-button :label="'0'"><i class="iconfont icon-woman"></i>女</el-radio-button>
            <el-radio-button :label="'2'"><i class="iconfont icon-sex-primary"></i>保密</el-radio-button>
          </el-radio-group>
        </div>
        <!--      确认按钮-->
        <div class="edit-button">
          <el-button type="info" class="cg fw600" @click="cancelUpdateProfile">取消</el-button>
          <el-button type="primary" class="fw600" @click="confirmUpdateProfile">保存</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!--    <el-scrollbar>-->

    <!--    </el-scrollbar>-->
  </div>
</template>

<script>
import {getInfo} from "@/api/member.js";
import {Close} from "@element-plus/icons-vue";

export default {
  name: 'User',
  computed: {
    Close() {
      return Close
    }
  },
  data() {
    return {
      user: {},
      editDialogVisible: false, //编辑信息弹框
      activeName: 'second',
      saveLogin: true,
      userForm: {},
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then(res => {
        if (res.code === 200) {
          this.user = res.data
          this.userForm = this.user
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleEditProfile() {
      this.editDialogVisible = true

    },
    handleUploadAvatarSuccess() {

    },
    confirmUpdateProfile() {

    },
    cancelUpdateProfile() {
      this.editDialogVisible = false

    }

  }
}

</script>

<style scoped>
@import "@/assets/styles/user.scss";
</style>
