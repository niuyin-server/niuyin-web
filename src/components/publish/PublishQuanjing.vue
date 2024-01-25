<template>
  <div class="p10px">
    <div class="">
      <div class="upload-container">
        <el-upload class="uploader"
                   drag
                   :action="videoUploadUrl"
                   :headers="headers"
                   multiple
                   :disabled="uploaderVisible"
                   v-loading="loading"
                   :show-file-list="true"
                   :on-success="handleVideoSuccess"
                   :before-upload="beforeUploadVideo"
                   :on-progress="uploadVideoProcess"
                   v-model:file-list="imageFileList"
                   list-type="picture">
          <el-icon :size="60" :color="'var(--niuyin-primary-color)'">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            <div class="mtb5 fw600"><em>点击上传 或 将图片拖拽入此区域</em></div>
            <p class="cg fs8">最多支持上传<span>{{ imageLimit }}</span>张图片，图片格式不支持gif格式</p>
          </div>
        </el-upload>
      </div>
      <div class="flex-between ptb10px">
        <div class="w33 p10px">
          <div class="upload-bg p1rem b-radius5">
            <p class="mb5 fw600">图片格式</p>
            <p class="fs8 cg one-line">支持常用图片格式，暂不支持gif格式</p>
          </div>
        </div>
        <div class="w33 p10px">
          <div class="upload-bg p1rem b-radius5">
            <p class="mb5 fw600">图片大小</p>
            <p class="fs8 cg one-line">图片大小不超过10MB</p>
          </div>
        </div>
        <div class="w33 p10px">
          <div class="upload-bg p1rem b-radius5">
            <p class="mb5 fw600">图片比例</p>
            <p class="fs8 cg one-line">图文的宽高比建议不超过1:2</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth.js";
import {publishVideo, saveVideoTag} from "@/api/video.js";
import {UploadFilled} from "@element-plus/icons-vue";

export default {
  name: "PublishQuanjing",
  components: {UploadFilled},
  data() {
    return {
      loading: false,
      uploaderVisible: false,
      videoUploadUrl: import.meta.env.VITE_API_BASE_URL + "/video/api/v1/upload/image",
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      videoUploadPercent: undefined,
      // 视频标签对象
      videoTags: [],
      videoTagIds: [],
      videoTag: {
        tagId: null,
        tag: ''
      },
      tagInputVisible: false,
      tagInputValue: undefined,
      tagBtn: true,
      imageFileList: [],
      videoForm: {
        videoTitle: '',
        videoUrl: '',
        categoryId: undefined,
        coverImage: '',
        videoDesc: '',
        videoTags: [],
        imageFileList: [],
      },
      imageLimit: 10, // 限制上传个数
      supportImageType: [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ],
    }
  },
  methods: {
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
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 验证视频格式
    beforeUploadVideo(file) {
      if (this.supportImageType.indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
      }
    },
    // 上传进度显示
    uploadVideoProcess(event, file, fileList) {
      this.loading = true
      this.videoUploadPercent = Math.floor(event.percent)
    },
    // 获取上传地址
    handleVideoSuccess(res, file) {
      this.videoUploadPercent = 0
      if (res.code === 200) {
        this.loading = false
        // this.videoForm.imageFileList = this.imageFileList
        this.imageFileList.forEach(item => {
          this.videoForm.imageFileList.push(item.response.data)
        })
        // console.log(this.videoForm.imageFileList)
        if (this.imageFileList.length >= this.imageLimit) {
          this.uploaderVisible = true
        }
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

</style>
