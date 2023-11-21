<template>
  <div class="p10px" ref="ruleForm">
    <div class="flex-between pr">
      <div class="w50">
        <div>
          <h5>作品标题</h5>
          <el-input class="mtb5"
                    v-model="videoForm.videoTitle"
                    type="text"
                    maxlength="100"
                    show-word-limit
                    placeholder="添加标题"/>
        </div>
        <div class="mtb5">
          <h5>作品描述</h5>
          <el-input class="mtb5"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    v-model="videoForm.videoDesc"/>
        </div>
        <div class="mtb5">
          <h5>#添加标签</h5>
          <div class="mtb5">
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
                class="ml-1 w100p mtb5"
                @keyup.enter.native="handleInputConfirm"/>
            <el-button v-else class="button-new-tag" v-show="tagBtn" size="small" @click="showTagInput">
              + 标签
            </el-button>
          </div>
          <p class="cg fs7">提示：添加标签有助于后台进行筛选推送，最多支持添加5个标签</p>
        </div>
        <div class="mtb5">
          <h5>封面设置</h5>
          <el-upload
              class="cover-uploader"
              :action="videoUploadUrl"
              :headers="headers"
              :show-file-list="false"
              :limit="1"
              :on-success="handleCoverImageSuccess"
              :before-upload="beforeCoverImagerUpload">
            <img v-if="videoForm.coverImage" :src="videoForm.coverImage" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <p class="cg fs7">提示：优质的封面会极大增加同城曝光，</p>
        </div>
        <div class="upload-container">
          <el-upload class="uploader"
                     drag
                     :multiple="true"
                     :show-file-list="true"
                     :action="videoUploadUrl"
                     :headers="headers"
                     :limit="imageLimit"
                     list-type="picture"
                     :disabled="uploaderVisible"
                     v-loading="loading"
                     :on-success="handleVideoSuccess"
                     :before-upload="beforeUploadVideo"
                     :on-progress="uploadVideoProcess"
                     :on-preview="handlePictureCardPreview"
                     :on-remove="handleRemove">
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
              <p class="mb5 fw600 one-line fs8">图片格式</p>
              <p class="fs7 cg one-line">支持常用图片格式，暂不支持gif格式</p>
            </div>
          </div>
          <div class="w33 p10px">
            <div class="upload-bg p1rem b-radius5">
              <p class="mb5 fw600 one-line fs8">图片大小</p>
              <p class="fs7 cg one-line">图片大小不超过10MB</p>
            </div>
          </div>
          <div class="w33 p10px">
            <div class="upload-bg p1rem b-radius5">
              <p class="mb5 fw600 one-line fs8">图片比例</p>
              <p class="fs7 cg one-line">图文的宽高比建议不超过1:2</p>
            </div>
          </div>
        </div>
        <div class="mtb5">
          <h5>添加音乐</h5>
          <div class="mtb5">
            <div class="container flex-between p1rem b-radius5 fw600 fs8"
                 style="background-color: var(--niuyin-upload-bg);">
              <div class="container-left flex-center">
                <img class="audio-control--1FSrl"
                     src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiMxQzFGMjMiIGZpbGwtb3BhY2l0eT0iMC4zNSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE5LjQ5NTEgMTAuODE4MkMyMC4xMDQ0IDExLjE0NjEgMjAuNCAxMS43ODgyIDIwLjQgMTIuNjIwNlYxOC40MDAxQzIwLjQgMTguNDM1NiAyMC4zOTY5IDE4LjQ3MDQgMjAuMzkxIDE4LjUwNDJDMjAuMzk2OSAxOC41Njg3IDIwLjQgMTguNjM0IDIwLjQgMTguNzAwMUMyMC40IDE5Ljg1OTggMTkuNDU5OCAyMC44MDAxIDE4LjMgMjAuODAwMUMxNy4xNDAyIDIwLjgwMDEgMTYuMiAxOS44NTk4IDE2LjIgMTguNzAwMUMxNi4yIDE3LjU0MDMgMTcuMTQwMiAxNi42MDAxIDE4LjMgMTYuNjAwMUMxOC42MjIxIDE2LjYwMDEgMTguOTI3MiAxNi42NzI2IDE5LjIgMTYuODAyMVYxMi42MjA2QzE5LjIgMTIuMDcyMSAxOS4wMjU0IDExLjkyODEgMTguOTI2NSAxMS44NzQ5QzE4Ljc2ODMgMTEuNzg5OCAxOC40NzU2IDExLjc2MzUgMTguMDUzOCAxMS44Njk0TDE0LjQ1MzYgMTIuNzcyNEMxNC4wMTQ3IDEyLjg4MjMgMTMuOCAxMy4xNTUxIDEzLjggMTMuNTIzNlYxOS4xMDA2QzEzLjggMTkuMTI0IDEzLjc5ODYgMTkuMTQ3MiAxMy43OTYgMTkuMTY5OUMxMy43OTg2IDE5LjIxMyAxMy44IDE5LjI1NjQgMTMuOCAxOS4zMDAxQzEzLjggMjAuNDU5OCAxMi44NTk4IDIxLjQwMDEgMTEuNyAyMS40MDAxQzEwLjU0MDIgMjEuNDAwMSA5LjU5OTk4IDIwLjQ1OTggOS41OTk5OCAxOS4zMDAxQzkuNTk5OTggMTguMTQwMyAxMC41NDAyIDE3LjIwMDEgMTEuNyAxNy4yMDAxQzEyLjAyMjEgMTcuMjAwMSAxMi4zMjcyIDE3LjI3MjYgMTIuNiAxNy40MDIxVjEzLjUyMzZDMTIuNiAxMi41MTEyIDEzLjI4NTMgMTEuODI3OSAxNC4xNjE3IDExLjYwODRMMTcuNzYxNiAxMC43MDU1QzE4LjI5MTYgMTAuNTcyNCAxOC45NDUxIDEwLjUyMjIgMTkuNDk1MSAxMC44MTgyWk0xMS43IDE4LjQwMDFDMTEuMjAyOSAxOC40MDAxIDEwLjggMTguODAzIDEwLjggMTkuMzAwMUMxMC44IDE5Ljc5NzEgMTEuMjAyOSAyMC4yMDAxIDExLjcgMjAuMjAwMUMxMi4xOTcgMjAuMjAwMSAxMi42IDE5Ljc5NzEgMTIuNiAxOS4zMDAxQzEyLjYgMTguODAzIDEyLjE5NyAxOC40MDAxIDExLjcgMTguNDAwMVpNMTcuNCAxOC43MDAxQzE3LjQgMTguMjAzIDE3LjgwMjkgMTcuODAwMSAxOC4zIDE3LjgwMDFDMTguNzk3IDE3LjgwMDEgMTkuMiAxOC4yMDMgMTkuMiAxOC43MDAxQzE5LjIgMTkuMTk3MSAxOC43OTcgMTkuNjAwMSAxOC4zIDE5LjYwMDFDMTcuODAyOSAxOS42MDAxIDE3LjQgMTkuMTk3MSAxNy40IDE4LjcwMDFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K">
                <div class="desc--14I7W">点击添加合适作品风格音乐</div>
              </div>
              <div class="container-right cp flex-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="icon--335wN">
                  <path
                      d="M8.667 2L12 5.333l1.39-1.39c.522-.521.522-1.365 0-1.886L11.944.609a1.333 1.333 0 00-1.885 0L8.668 2zM.499 13.09l1.12-3.924a.667.667 0 01.17-.288L7.667 3 11 6.333l-5.877 5.878a.667.667 0 01-.289.17L.911 13.5a.333.333 0 01-.412-.411z"
                      fill="#6f6Faa" fill-opacity="0.6"></path>
                </svg>
                <span>选择音乐</span></div>
            </div>
          </div>
        </div>
        <div class="mtb5">
          <h5>添加到</h5>
          <div class="mtb5 flex-between">
            <div class="w30 p5px">
              <el-select class="w100" v-model="value" clearable placeholder="合集">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </div>
            <div class="w70 p5px">
              <el-select class="w100" v-model="value2" clearable placeholder="不选择合集">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
              </el-select>
            </div>
          </div>
        </div>

        <div class="mtb5">
          <h3>发布设置</h3>
          <el-divider/>
          <div class="mtb5">
            <h5>设置谁可以看</h5>
            <el-radio-group class="mtb5" v-model="whoCanWatchId">
              <el-radio-button :label="item.id" v-for="item in whoCanWatchList">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="mtb5">
            <h5>发布时间</h5>
            <el-radio-group class="mtb5" v-model="publishTimeType">
              <el-radio-button :label="item.id" v-for="item in publishTimeTypeOptions">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="mtb5" v-if="publishTimeType==='1'">
            <h5>选择发布时间</h5>
            <el-date-picker
                v-model="valueTime"
                class="mtb5"
                style="width: 100% !important;"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                :size="'large'"
                placeholder="选择发布时间"
                :picker-options="pickerOptions"
            />
          </div>
        </div>
        <div class="mtb5">
          <el-button class="w100" type="primary" @click="submitForm">发布</el-button>
        </div>
      </div>
      <!--    移动端回显-->
      <div class="w50 flex-center">
        <div class="flex-column">
          <div class="mobile-preview">
            <div class="phone-container oh">
              <div class="phone-screen">
                <div class="carousel-container">
                  <div class="carousel">
                    <el-carousel trigger="hover" height="100%">
                      <el-carousel-item class="carousel-item" v-for="item in videoForm.imageFileList" :key="item">
                        <img
                            style="width: 100%;height: auto ;position: absolute;top:50%;left: 50%;transform: translate(-50%, -50%);border-radius: 25px"
                            :src="item"/>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
                <img :src="user.avatar" class="avatar-class" alt=""/>
                <img src="//lf-cdn-tos.bytescm.com/obj/static/douyin-creator-content/micro/imgs/out.052ae810.png"
                     class="preview-card" alt=""/>
                <img class="preview-like" src="@/assets/images/preview-like.png" alt=""/>
                <div class="layer-top">
                  <div class="bottom-binder">
                    <div class="one-line fs7 fw500">
                      <span class="">@{{ user.nickName }}</span>
                      <i class="iconfont icon-tuwen ml5" style="font-size: 0.8rem;"></i>
                      <span class="fs7 fw500">图文</span>
                    </div>
                    <div id="phoneText" class="input-text--1URCd"><span><span></span></span></div>
                    <div class="music-binder" style="display: flex;align-items: center">
                      <img class="mr5" style="width: 16px;height: 16px;display: inline-block"
                           src="@/assets/logo/logo-niuyin-new.png"/>
                      <marquee class="fs5" style="display: inline-block">roydon创作的原声</marquee>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 class="mtb5">开启定位</h5>
            <el-switch
                v-model="videoForm.positionFlag"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </div>
          <div v-if="videoForm.positionFlag==='1'">
            <h5 class="mtb5">选择定位</h5>
            <MapView @emitSelectAddress="selectAddressEmit"/>
            <p class="cg fs7 mtb5">提示：点击定位按钮进行定位，选择定位有助于同城推送</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth.js";
import {publishVideo, saveVideoTag} from "@/api/video.js";
import {Delete, Plus, UploadFilled, ZoomIn} from "@element-plus/icons-vue";
import {userInfoX} from "@/store/userInfoX";
import MapView from "@/components/map/MapView.vue";

export default {
  name: "PublishImage",
  components: {MapView, Delete, ZoomIn, Plus, UploadFilled},
  data() {
    return {
      user: userInfoX().userInfo,
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
        publishType: '1',
        videoTitle: '',
        videoDesc: '',
        coverImage: '',
        videoUrl: '',
        categoryId: undefined,
        videoTags: [],
        imageFileList: [],
        positionFlag: '1',
        position: {},
      },
      imageLimit: 10, // 限制上传个数
      supportImageType: [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/webp',
      ],
      disabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      options: [
        {
          value: '1',
          label: '合集'
        }
      ],
      value: undefined,
      value2: undefined,
      whoCanWatchList: [
        {id: '0', name: "公开可见"},
        {id: '1', name: "仅好友可见"},
        {id: '2', name: "仅自己可见"},
      ],
      whoCanWatchId: '0',
      publishTimeTypeOptions: [
        {id: '0', name: "立即发布"},
        {id: '1', name: "定时发布"},
      ],
      publishTimeType: '0',
      valueTime: undefined,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - (24 * 3600 * 1000)
        }
      },
    }
  },
  methods: {
    submitForm() {
      this.videoForm.videoTags = this.videoTagIds
      console.log(this.videoForm)
      publishVideo(this.videoForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
        }
      })
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
        this.videoForm.imageFileList.push(res.data)
        console.log(this.videoForm.imageFileList)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 上传封面
    beforeCoverImagerUpload(file) {
      if (this.supportImageType.indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
      }
    },
    handleCoverImageSuccess(res, file) {
      if (res.code === 200) {
        this.loading = false
        this.videoForm.coverImage = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    handleRemove(file) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
              console.log(this.videoTagIds)
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
    // 接收子组件传递进来的定位地址数据
    selectAddressEmit(val) {
      this.videoForm.position = val
    }
  }
}
</script>

<style scoped>
.mobile-preview {
  height: 575px;
}

.phone-container {
  width: 270px;
  height: auto;
}

.phone-screen {
  position: absolute;
  width: 243px;
  height: 515px;
  top: 10px;
  z-index: 1;
  border-radius: 24px;
}

.avatar-class {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 235px;
  right: 9px;
  border-radius: 15px;
  border: 1px solid grey;
}

.preview-card {
  width: 243px;
  height: 515px;
  border-radius: 24px;
  position: absolute;
  top: 0;
  z-index: -1;
}

.preview-like {
  width: 243px;
  height: 224px;
  position: absolute;
  top: 232px;
  right: 5px;
}

.layer-top {
  position: absolute;
  bottom: 60px;
  left: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-like {
  width: 234px;
  height: 224px;
  position: absolute;
  top: 238px;
  right: 5px;
}

.cover-uploader {

  & img {
    width: 100px;
    height: 100px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  border-radius: 10px;
  border: 2px solid grey;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.carousel-container {
  position: absolute;
  width: 243px;
  height: 458px;
  padding: 0 5px;
  top: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: 24px;

  .carousel {
    position: relative;
    height: 100%;

    &:deep(.el-carousel) {
      height: 100%;
    }

    &:deep( .el-carousel__container) {
      height: 100% !important;
    }

    .carousel-item {

    }
  }

}
</style>
