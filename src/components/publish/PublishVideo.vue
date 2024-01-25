<template>
  <div class="p10px">
    <el-form :model="videoForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row>
        <el-col :lg="12" :xs="24">
          <el-form-item label="上传视频" prop="videoUrl">
            <!-- action必选参数, 上传的地址 -->
            <el-upload class="video-uploader"
                       :action="videoUploadUrl"
                       :show-file-list="false"
                       :headers="headers"
                       :limit="1"
                       v-loading="loading"
                       :on-success="handleVideoSuccess"
                       :before-upload="beforeUploadVideo"
                       :on-progress="uploadVideoProcess">
              <video v-if="videoForm.videoUrl !== '' && videoFlag === false"
                     :src="videoForm.videoUrl"
                     class="video"
                     controls
              ></video>
              <div v-else-if="videoForm.videoUrl === '' && videoFlag === false"
                   class="el-icon-plus video-uploader-icon">
                <Plus style="width: 1em; height: 1em;"/>
              </div>
              <el-progress v-if="videoFlag === true"
                           type="circle"
                           :percentage="videoUploadPercent"
                           style="margin-top:30px;"></el-progress>

            </el-upload>
          </el-form-item>
          <el-form-item label="视频封面" prop="coverImage" v-if="videoForm.coverImage">
            <div v-viewer>
              <img v-if="videoForm.videoUrl !== '' && videoFlag === false"
                   :src="videoForm.coverImage"
                   class="video" alt=""/>
            </div>
          </el-form-item>
        </el-col>
        <el-col :lg="12" :xs="24">
          <el-form-item label="视频标题" prop="videoTitle">
            <el-input v-model="videoForm.videoTitle" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="视频分类" prop="categoryId">
            <el-radio-group v-model="videoForm.categoryId">
              <el-radio-button :label="item.id" v-for="item in categoryList">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="视频标签" prop="videoTags">
            <el-tag v-for="item in videoTags"
                    :key="item.tag"
                    class="mx-1 mr-5r"
                    effect="dark"
                    round
                    closable
                    @close="handleTagClose(item)">
              {{ item.tag }}
            </el-tag>
            <el-input
                v-if="tagInputVisible"
                ref="RefTagInput"
                v-model="tagInputValue"
                class="ml-1 w100p"
                @keyup.enter.native="handleInputConfirm"/>
            <el-button v-else class="button-new-tag ml-1" v-show="tagBtn" size="small" @click="showTagInput">
              + 标签
            </el-button>
          </el-form-item>
          <el-form-item label="视频简介" prop="videoDesc">
            <el-input type="textarea" v-model="videoForm.videoDesc" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth.js";
import {publishVideo, saveVideoTag, videoCategory} from "@/api/video.js";
import {Plus} from "@element-plus/icons-vue";

export default {
  name: "PublishVideo",
  components: {Plus},
  data() {
    return {
      videoFlag: false,
      loading: false,
      videoUploadUrl: import.meta.env.VITE_API_BASE_URL + "/video/api/v1/upload",
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      videoUploadPercent: undefined,

      videoForm: {
        publishType: '0',
        videoTitle: '',
        videoUrl: '',
        categoryId: undefined,
        coverImage: '',
        videoDesc: '',
        videoTags: [],
        positionFlag: '0',
        position: {},
      },
      categoryList: [],//视频分类集合
      rules: {
        videoTitle: [
          {required: true, message: '请输入视频标题', trigger: 'blur'},
          {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
        ],
        videoDesc: [
          {required: true, message: '请填写视频简介', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ]
      },
      // 视频标签对象
      videoTags: [],
      videoTagIds: [],
      videoTag: {
        tagId: null,
        tag: ''
      },
      tagInputVisible: false,
      tagInputValue: undefined,
      tagBtn: true
    }
  },
  created() {
    this.getVideoCategory()
  },
  methods: {
    getVideoCategory() {
      videoCategory().then(res => {
        if (res.code === 200) {
          this.categoryList = res.data
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.videoForm.videoTags = this.videoTagIds
          publishVideo(this.videoForm).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      });
    },
    // 验证视频格式
    beforeUploadVideo(file) {
      if ([
        'video/mp4',
        'video/ogg',
        'video/flv',
        'video/avi',
        'video/wmv',
        'video/rmvb',
        'video/mkv'
      ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },
    // 上传进度显示
    uploadVideoProcess(event, file, fileList) {
      // console.log(event.percent, file, fileList)
      this.videoFlag = true
      this.loading = true
      this.videoUploadPercent = Math.floor(event.percent)
    },
    // 获取上传地址
    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.videoUploadPercent = 0
      if (res.code === 200) {
        // console.log(res.data)
        this.loading = false
        this.videoForm.videoUrl = res.data.videoUrl
        this.videoForm.coverImage = res.data.vframe
      } else {
        this.$message.error(res.msg)
      }
    },
    // 添加视频标签
    handleInputConfirm() {
      if (this.videoTags.length > 5) {
        this.tagInputVisible = false
        this.tagBtn = false
      } else {
        this.videoTag.tag = this.tagInputValue
        saveVideoTag(this.videoTag).then(res => {
          if (res.code === 200) {
            this.videoTag.tagId = res.data
            if (!this.videoTagIds.includes(res.data)) {
              this.videoTags.push(this.videoTag)
              this.videoTagIds.push(res.data)
              // console.log(this.videoTagIds)
            }
            this.tagInputVisible = false
            this.tagInputValue = null
            this.videoTag = {}
            if (this.videoTagIds.length >= 5) {
              this.tagBtn = false
            }
          }
        })
      }
    },
    // 展示标签输入框
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.RefTagInput.focus()
      })
    },
    // 删除标签
    handleTagClose(item) {
      this.videoTagIds.splice(this.videoTagIds.indexOf(item.tagId), 1)
      this.videoTags.splice(this.videoTags.indexOf(item), 1)
    },

  }

}
</script>

<style scoped>
.video-uploader {
  width: 100%;

  .video-uploader-icon {
    border: 2px dashed darkblue !important;
    border-radius: 0.5rem;
    font-size: 28px;
    color: black;
    width: 100%;
    height: 100%;
    line-height: 200px;
    text-align: center;
  }

}

.video-uploader .el-upload:hover {
  border: 2px dashed #d83f3f !important;
}

.video {
  width: 320px;
  height: 200px;
  border-radius: 1rem;
  display: block;
}

</style>
