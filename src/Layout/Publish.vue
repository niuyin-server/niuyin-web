<template>
  <div class="publish-container">
    <el-scrollbar>
      <el-form :model="videoForm" :rules="rules" ref="ruleForm" label-width="100px">
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
            <div v-else-if="videoForm.videoUrl === '' && videoFlag === false" class="el-icon-plus video-uploader-icon">
              <Plus style="width: 1em; height: 1em;"/>
            </div>
            <el-progress v-if="videoFlag === true"
                         type="circle"
                         :percentage="videoUploadPercent"
                         style="margin-top:30px;"></el-progress>
            <img v-if="videoForm.videoUrl !== '' && videoFlag === false"
                 :src="videoForm.coverImage"
                 class="video"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="视频标题" prop="videoTitle">
          <el-input v-model="videoForm.videoTitle"></el-input>
        </el-form-item>
        <el-form-item label="视频分类" prop="categoryId">
          <el-radio-group v-model="videoForm.categoryId">
            <el-radio-button :label="item.id" v-for="item in categoryList">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视频简介" prop="videoDesc">
          <el-input type="textarea" v-model="videoForm.videoDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
// 接口引入
import {publishVideo, videoCategory} from "@/api/video";
// 七牛引入
import * as qiniu from "qiniu-js";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/useUserStore";

export default {
  name: "Publish",
  data() {
    return {
      title: "发布视频",
      videoFlag: false,
      loading: false,
      videoUploadUrl: "http://localhost:9090/video/api/v1/upload",
      headers: {
        Authorization: 'Bearer ' + useUserStore().token,
      },
      videoUploadPercent: undefined,
      videoForm: {
        videoTitle: '',
        videoUrl: '',
        categoryId: undefined,
        coverImage: '',
        videoDesc: ''
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
      }
    };
  },
  created() {
    this.getVideoCategory()
  },
  mounted() {
    this.$nextTick(() => {
      this.showVideoPlayer = true;
    });
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
          // console.log(this.videoForm)
          publishVideo(this.videoForm).then(res => {
            if (res.code === 200) {
              ElMessage({
                message: res.msg,
                type: 'success',
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
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
      console.log(event.percent, file, fileList)
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
        this.$message.error('视频上传失败，请重新上传！')
      }
    },
  }
};
</script>

<style scoped lang="less">
.publish-container {
  border-radius: 1rem;
  height: 100%;
  background-color: aliceblue;
  padding: 1rem;
}

.video-uploader {
  width: 100%;

  .video-uploader-icon {
    border: 2px dashed darkblue !important;
    border-radius: 0.5rem;
    font-size: 28px;
    color: black;
    width: 100%;
    height: 100%;
    line-height: 180px;
    text-align: center;
  }

}

.video-uploader .el-upload:hover {
  border: 2px dashed #d83f3f !important;
}

.video {
  width: 320px;
  height: 180px;
  border-radius: 1rem;
  display: block;
}

</style>

