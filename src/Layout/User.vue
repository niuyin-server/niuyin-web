<template>
  <div class="main-container">
    <el-scrollbar>
      <div class="user-container">
        <div v-viewer class="avatar-area dn-phone">
          <img class="user-avatar" :src="user.avatar"/>
        </div>
        <div class="user-info">
          <div class="username"><h1>{{ user.nickName }}</h1></div>
          <div class="follow-fans-like">
            <div class="user-info-follow flex-center">
              <div class="mr-5r cg fs8">关注</div>
              <div class="follow-right fw600">{{ followNum }}</div>
            </div>
            <div class="=user-info-fans flex-center">
              <div class="mr-5r cg fs8">粉丝</div>
              <div class="follow-right fw600">{{ fansNum }}</div>
            </div>
            <div class="user-info-like flex-center">
              <div class="mr-5r cg fs8">获赞</div>
              <div class="fw600">{{ likeAllNum }}</div>
            </div>
          </div>
          <div class="user-profile">
            <span class="userid">牛音ID：{{ user.userId }}</span>
            <span class="gender-age">
              <i v-if="user.sex==='1'" class="iconfont icon-man"></i>
              <i v-else-if="user.sex==='0'" class="iconfont icon-woman"></i>
              <i v-else class="iconfont icon-sex-primary"></i>
              <span class="ml-5r">{{
                  getAge(memberInfo.birthday) + '岁'
                }}</span></span>
            <span class="city">{{ memberInfo.province + " · " + memberInfo.city }}</span>
            <span class="school">中原工学院</span>
          </div>
        </div>
        <div class="trust-login-switch dn-phone">
          <div class="trust-login-tips">
            <el-tooltip content="保存登录信息，下次登陆免验证" placement="bottom">
              <el-icon :size="20">
                <QuestionFilled/>
              </el-icon>
            </el-tooltip>
          </div>
          <div class="trust-login-switch-title">保存登录信息</div>
          <div class="trust-login-switch-button">
            <el-switch v-model="saveLogin"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </div>
        </div>
        <div class="user-edit">
          <el-button @click="handleEditProfile" type="primary">编辑资料</el-button>
          <el-button @click="handleEditInfo" type="primary">详细信息</el-button>
        </div>
      </div>
      <!--  作品，喜欢，收藏  -->
      <div>
        <div class="user-works">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in userVideoTabShow"
                         :key="item.id"
                         :label="item.tabName"
                         :lazy="true"
                         :name="item.tabUrl">
              <router-view/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-scrollbar>
    <!--  编辑资料弹框  -->
    <el-dialog class="oh edit-info-dialog"
               v-model="editDialogVisible"
               width="400px"
               :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h3 class="one-line" :id="titleId" :class="titleClass">编辑资料</h3>
        <el-button circle :icon="Close" class="cb" type="info" @click="close">
        </el-button>
      </template>
      <el-scrollbar>
        <div class="edit-avatar">
          <el-tooltip content="上传头像" placement="top" effect="customized">
            <el-upload class="avatar-uploader"
                       :action="avatarUploadUrl"
                       :headers="headers"
                       :show-file-list="false"
                       :on-success="handleUploadAvatarSuccess">
              <img v-if="user.avatar" :src="userForm.avatar" class="avatar"/>
              <i v-else class="iconfont icon-camera avatar-uploader-icon"/>
            </el-upload>
          </el-tooltip>
          <div class="I5fCASKY cg">点击修改头像</div>
        </div>
        <div class="edit-nickname">
          <div class="N3OJZMVX">昵称</div>
          <el-input v-model="userForm.nickName"
                    maxlength="20"
                    class="w-50 m-2"
                    placeholder="记得填写昵称"
                    show-word-limit
                    type="text"/>
        </div>
        <div class="edit-gender">
          <div class="N3OJZMVX">性别</div>
          <el-radio-group v-model="userForm.sex">
            <el-radio-button :label="'1'"><i class="iconfont icon-man"></i>男</el-radio-button>
            <el-radio-button :label="'0'"><i class="iconfont icon-woman"></i>女</el-radio-button>
            <el-radio-button :label="'2'"><i class="iconfont icon-sex-primary"></i>保密</el-radio-button>
          </el-radio-group>
        </div>
        <!--  确认按钮  -->
        <div class="edit-button">
          <el-button type="info" class="cg fw600" @click="cancelUpdateProfile">取消</el-button>
          <el-button type="primary" class="fw600" @click="confirmUpdateProfile">保存</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>
    <!--  编辑详细信息弹框  -->
    <el-dialog class="oh edit-info-dialog"
               v-model="editInfoDialogVisible"
               width="400px"
               :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h3 class="one-line" :id="titleId" :class="titleClass">编辑详细信息</h3>
        <el-button circle :icon="Close" class="cb" type="info" @click="close">
        </el-button>
      </template>
      <el-scrollbar>
        <div class="edit-nickname">
          <div class="N3OJZMVX">年龄</div>
          <el-input v-model="userForm.nickName"
                    maxlength="20"
                    class="w-50 m-2"
                    placeholder="记得填写昵称"
                    show-word-limit
                    type="text"/>
        </div>
        <div class="edit-gender">
        </div>
        <!--  确认按钮  -->
        <div class="edit-button">
          <el-button type="info" class="cg fw600" @click="cancelUpdateInfo">取消</el-button>
          <el-button type="primary" class="fw600" @click="confirmUpdateInfo">保存</el-button>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import {getInfo, updateMemberInfo, updateUserProfile} from "@/api/member.js";
import {followAndFans} from "@/api/social.js";
import {userLikeNums} from "@/api/video.js";
import {Close, QuestionFilled} from "@element-plus/icons-vue";
import {useUserStore} from "@/store/useUserStore";

export default {
  name: 'User',
  components: {QuestionFilled},
  computed: {
    Close() {
      return Close
    }
  },
  data() {
    return {
      user: {},
      memberInfo: {},
      editDialogVisible: false, //编辑资料弹框
      editInfoDialogVisible: false, //编辑详细信息弹框
      activeName: this.$route.path,
      saveLogin: true,
      userForm: {},
      memberInfoForm: {},
      avatarUploadUrl: "http://localhost:9090/member/api/v1/avatar",
      headers: {
        Authorization: 'Bearer ' + useUserStore().token,
      },
      followNum: 0, // 关注数
      fansNum: 0, //粉丝数
      likeAllNum: 0, //获赞数
      userVideoTabShow: [
        {id: 1, tabName: "作品", tabUrl: "/user/videoPost"},
        {id: 2, tabName: "喜欢", tabUrl: "/user/videoLike"},
        {id: 3, tabName: "收藏", tabUrl: "/user/videoFavorite"},
        {id: 4, tabName: "观看历史", tabUrl: "/user/videoViewHistory"}
      ]
    }
  },
  created() {
    this.getUserInfo()
  },
  mounted() {
    this.$nextTick(() => {
      this.activeName = this.$route.path
    })
  },
  methods: {
    getUserInfo() {
      getInfo().then(res => {
        if (res.code === 200) {
          this.user = res.data
          this.memberInfo = res.data.memberInfo
          this.userForm = {...this.user}
          localStorage.setItem("userInfo", JSON.stringify(this.user))
          this.getUserFollowFansLike(res.data.userId)
        }
      })
    },
    getUserFollowFansLike(userId) {
      // 查询关注、粉丝
      followAndFans(userId).then(res => {
        if (res.code === 200) {
          this.followNum = res.data.followedNums
          this.fansNum = res.data.fanNums
        }
      })
      // 查询获赞
      userLikeNums(userId).then(res => {
        if (res.code === 200) {
          this.likeAllNum = res.data
        }
      })
    },
    handleClick(tab, event) {
      // console.log(tab.props.name);
      const route = tab.props.name
      // console.log(this.$route.path)
      // console.log(this.$route.matched[1].path)
      this.$router.push(route)
    },
    // 编辑资料
    handleEditProfile() {
      this.editDialogVisible = true

    },
    // 编辑详细信息
    handleEditInfo() {
      this.editInfoDialogVisible = true
    },
    handleUploadAvatarSuccess(res) {
      this.userForm.avatar = res.data
    },
    // 确认提交
    confirmUpdateProfile() {
      updateUserProfile(this.userForm).then(res => {
        if (res.code === 200) {
          this.editDialogVisible = false
          this.$message.success(res.msg)
          this.getUserInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cancelUpdateProfile() {
      this.editDialogVisible = false
      this.userForm = {}
    },
    cancelUpdateInfo() {
      this.editInfoDialogVisible = false

    },
    // 确认提交用户详情
    confirmUpdateInfo() {
      updateMemberInfo(this.memberInfoForm).then(res => {
        if (res.code === 200) {
          this.editInfoDialogVisible = false
          this.$message.success(res.msg)
          this.getUserInfo()
        } else {
          this.$message.error(res.msg)
        }
      })
    },

  }
}

</script>

<style scoped>
@import "@/assets/styles/user.scss";

@media (max-width: 500px) {
  .user-container .user-info {
    margin-left: 0 !important;
  }
}
</style>
