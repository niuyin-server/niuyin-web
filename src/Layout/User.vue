<template>
  <div class="">
    <!--    <div style="position: fixed;-->
    <!--    right: 0;-->
    <!--    top: 0;-->
    <!--    z-index: -10;"><img :src="memberInfo.backImage">-->
    <!--    </div>-->
    <el-scrollbar class="scrollbar">
      <!--      用户信息区域-->
      <div class="user-container" :style="{ backgroundImage: `url(${memberInfo.backImage})` }">
        <div v-viewer class="avatar-area">
          <el-avatar v-if="user.avatar" class="user-avatar pr" :src="user.avatar"/>
          <el-avatar v-else class="user-avatar pr" :icon="UserFilled"/>
          <div class="image-dot dn-phone"></div>
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
          <div class="user-profile mtb5 dn-phone">
            <span class="userid">芝士ID：{{ user.userId }}</span>
            <span class="gender-age">
              <svg v-if="user.sex==='1'" class="icon1rem" aria-hidden="true">
              <use xlink:href="#icon-man"></use></svg>
              <svg v-else-if="user.sex==='0'" class="icon1rem" aria-hidden="true">
              <use xlink:href="#icon-woman"></use></svg>
              <svg v-else class="icon1rem" aria-hidden="true">
              <use xlink:href="#icon-sex-primary"></use></svg>
              <span class="ml-5r">{{ '22岁' }}</span></span>
            <span class="city">{{ memberInfo.province + " · " + memberInfo.city }}</span>
            <span v-if="memberInfo.campus" class="school">
              <el-icon :size="16" class="mr-5r">
                <School/>
              </el-icon>
              {{ memberInfo.campus }}
            </span>
          </div>
          <div class="user-description ">
            <p class="one-line fs8">{{ memberInfo.description }}</p>
          </div>
        </div>
        <div class="user-op h100" style="min-height: 100px">
          <div class="trust-login-switch dn-phone">
            <div class="trust-login-tips flex-center">
              <el-tooltip content="保存登录信息，下次登陆免验证" placement="top">
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
            <el-button class="user-edit-btn" @click="handleEditProfile" type="primary">编辑资料</el-button>
            <el-button class="user-edit-btn" @click="handleEditInfo" type="primary">详细信息</el-button>
          </div>
        </div>
      </div>
      <!--  作品，喜欢，收藏  -->
      <div>
        <div class="user-works pr">
          <!--          tab栏-->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in userVideoTabShow"
                         :key="item.id"
                         :lazy="true"
                         :name="item.tabUrl">
              <template #label>
                <div class="flex-center">
                  <span>{{ item.tabName }}</span>
                  <svg v-if="item.lock" class="icon1rem ml-5r" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                  </svg>
                </div>
              </template>
              <router-view/>
            </el-tab-pane>
          </el-tabs>
          <!--          作品搜索-->
          <div v-if="activeName==='/user/videoPost'" class="pa flex-center"
               style="height: 40px;top: 0;right: 0px;z-index: 200">
            <div class="dn-phone" style="padding: 5px 0">
              <el-input
                  class="search-input fs8"
                  style="height: 30px"
                  v-model="searchKeyword"
                  :placeholder="searchDefaults"
                  @keyup.enter.native="searchConfirm"
                  clearable>
                <template #append>
                  <el-button type="primary" @click="searchConfirm">
                    <el-icon style="vertical-align: middle">
                      <Search/>
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
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
                       :on-error="handleUploadAvatarError"
                       :on-success="handleUploadAvatarSuccess">
              <img v-if="user.avatar||userForm.avatar" :src="userForm.avatar" class="avatar"/>
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
            <el-radio-button :label="'1'">
              <svg class="icon1rem" aria-hidden="true">
                <use xlink:href="#icon-man"></use>
              </svg>
              男
            </el-radio-button>
            <el-radio-button :label="'0'">
              <svg class="icon1rem" aria-hidden="true">
                <use xlink:href="#icon-woman"></use>
              </svg>
              女
            </el-radio-button>
            <el-radio-button :label="'2'">
              <svg class="icon1rem" aria-hidden="true">
                <use xlink:href="#icon-sex-primary"></use>
              </svg>
              保密
            </el-radio-button>
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
        <div class="edit-background w100">
          <el-tooltip content="上传背景图片" placement="top" effect="customized">
            <el-upload class="background-uploader w100"
                       :action="backImageUploadUrl"
                       :headers="headers"
                       :show-file-list="false"
                       :on-success="handleUploadBackImageSuccess">
              <img v-if="memberInfoForm.backImage" :src="memberInfoForm.backImage" class="back-image"/>
              <i v-else class="iconfont icon-camera avatar-uploader-icon"/>
            </el-upload>
          </el-tooltip>
        </div>
        <div class="edit-birthday">
          <div class="mtb5">出生日期</div>
          <el-date-picker
              style="width: 100% !important;"
              v-model="memberInfoForm.birthday"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              :size="'large'"
              placeholder="选择出生日期"
          />
        </div>
        <div class="edit-city">
          <div class="mtb5">选择城市</div>
          <el-cascader :options="options"
                       class="w100"
                       v-model="selectedOptions"
                       @change="addressChoose"/>
        </div>
        <div class="edit-campus">
          <div class="mtb5">学校</div>
          <el-input
              v-model="memberInfoForm.campus"
              maxlength="64"
              class="w-50 m-2"
              placeholder="输入学校"
              show-word-limit
              type="text"
          />
        </div>
        <el-row>
          <el-col :span="12">
            <div class="edit-like">
              <div class="mtb5">我的喜欢可见</div>
              <div class="tac">
                <el-switch
                    v-model="memberInfoForm.likeShowStatus"
                    class="mt-2 tac"
                    inline-prompt
                    active-value="0"
                    inactive-value="1"
                    :active-icon="Check"
                    :inactive-icon="Close"/>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="edit-favorite">
              <div class="mtb5">收藏夹可见</div>
              <div class="tac">
                <el-switch
                    v-model="memberInfoForm.favoriteShowStatus"
                    class="mt-2"
                    inline-prompt
                    active-value="0"
                    inactive-value="1"
                    :active-icon="Check"
                    :inactive-icon="Close"/>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="edit-desc">
          <div class="mtb5">输入描述信息</div>
          <el-input
              v-model="memberInfoForm.description"
              :rows="2"
              type="textarea"
              placeholder="这是一段描述"
          />
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
import {Check, Close, QuestionFilled, School, Search, UserFilled} from "@element-plus/icons-vue";
import {
  regionData,
} from "element-china-area-data";
import {userInfoX} from "@/store/userInfoX";
import {getToken} from "@/utils/auth.js";

export default {
  name: 'User',
  components: {Search, School, QuestionFilled},
  computed: {
    Search() {
      return Search
    },
    UserFilled() {
      return UserFilled
    },
    Check() {
      return Check
    },
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
      avatarUploadUrl: import.meta.env.VITE_API_BASE_URL + "/member/api/v1/avatar",
      backImageUploadUrl: import.meta.env.VITE_API_BASE_URL + "/member/api/v1/info/backImage/upload",
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      followNum: 0, // 关注数
      fansNum: 0, //粉丝数
      likeAllNum: 0, //获赞数
      userVideoTabShow: [
        {id: 1, tabName: "作品", tabUrl: "/user/videoPost", lock: false},
        {id: 2, tabName: "喜欢", tabUrl: "/user/videoLike", lock: false},
        {id: 3, tabName: "收藏", tabUrl: "/user/videoFavorite", lock: false},
        {id: 4, tabName: "观看历史", tabUrl: "/user/videoViewHistory", lock: false}
      ],
      // 省市区级联
      options: regionData,
      selectedOptions: [],
      searchKeyword: "",
      searchDefaults: "请输入作品名称"
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
          this.memberInfoForm = res.data.memberInfo
          if (this.memberInfoForm.likeShowStatus === '1') {
            // 喜欢被禁用
            this.userVideoTabShow.forEach((item, index) => {
              if (item.id === 2) {
                item.lock = true
              }
            })
          }
          if (this.memberInfoForm.favoriteShowStatus === '1') {
            // 收藏被禁用
            this.userVideoTabShow.forEach((item, index) => {
              if (item.id === 3) {
                item.lock = true
              }
            })
          }
          userInfoX().setUserInfo(this.user)
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
      this.selectedOptions = [this.memberInfoForm.province, this.memberInfoForm.city, this.memberInfoForm.region]
    },
    //头像上传成功回调
    handleUploadAvatarSuccess(res) {
      if (res.code === 200) {
        this.userForm.avatar = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    // 上传失败回调
    handleUploadAvatarError(res) {

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
    },
    /**省市区三级联动 */
    addressChoose(value) {
      // console.log(this.regionData);
      // console.log("地址", value)
      // console.log("地址编码", value[value.length - 1])
      this.memberInfoForm.adcode = value[value.length - 1]
      this.memberInfoForm.province = value[0]
      this.memberInfoForm.city = value[1]
      this.memberInfoForm.region = value[value.length - 1]
    },
    //头像上传成功回调
    handleUploadBackImageSuccess(res) {
      if (res.code === 200) {
        this.memberInfoForm.backImage = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    //取消
    cancelUpdateInfo() {
      this.editInfoDialogVisible = false
    },
    // 确认提交用户详情
    confirmUpdateInfo() {
      // console.log(this.memberInfoForm)
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
    searchConfirm() {
      // console.log("searchConfirm keyword >" + this.searchKeyword)
    },
  }
}

</script>

<style scoped>
@import "@/assets/styles/user.scss";
</style>
