<template>
  <el-scrollbar v-if="show">
    <div class="video-comment-tree" v-for="(item, index) in videoCommentTree" :key="item.commentId">
      <div class="comment-container">
        <el-card class="comment-info">
          <div class="user-info">
            <el-image class="user-avatar" :src="item.avatar" alt="" lazy></el-image>
            <div class="user-nickname">
              <p class="nickname one-line">{{ item.nickName }}</p>
              <span class="cg fs7 create-time">{{ smartDateFormat(item.createTime) }}</span>
            </div>
          </div>
          <div class="comment-content">
            <p class="cw fs8 m mtb5 fw400">{{ item.content }}</p>
            <div class="flex-between">
              <div class="comment-operate flex-row">
                <div class="flex-center mr-5r tac cp operate-icon"
                     @click="handleReplay(item.commentId,item.commentId,item.nickName)">
                  <i class="iconfont icon-replay "></i>
                  <p class="cg fs7 ml2">回复</p>
                </div>
                <div class="flex-center mr-5r tac cp operate-icon">
                  <i class="iconfont icon-shared "></i>
                  <p class="cg fs7 ml2">分享</p>
                </div>
                <div class="flex-center mr-5r tac cp">
                  <!--                todo 判断是否已点赞-->
                  <i class="iconfont icon-like-grey operate-icon"></i>
                  <p class="cg fs7 ml2">{{ item.commentId }}</p>
                </div>
              </div>
              <div class="flex-center mr-5r tac cp">
                <el-popconfirm
                    confirm-button-text="Y"
                    cancel-button-text="N"
                    :icon="InfoFilled"
                    icon-color="#626AEF"
                    title="删除？"
                    style="padding: 10px"
                    @confirm="handleDelConfirm(item.commentId)"
                    @cancel="handleDelCancel">
                  <template #reference>
                    <el-icon v-if="item.userId === user.userId" color="red">
                      <DeleteFilled/>
                    </el-icon>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
          <!-- 二级子评论 -->
          <div class="comment-children">
            <div class="comment-container" v-for="(child, index) in item.children" :key="child.commentId">
              <div class="user-info">
                <el-image class="user-avatar" :src="child.avatar" lazy></el-image>
                <div class="user-nickname">
                  <p class="nickname one-line">{{ child.nickName }}
                    <span class="aite"
                          v-if="child.replayUserId != null">
                            {{ '@' + child.replayUserNickName }}
                          </span>
                  </p>
                  <span class="cg fs7 create-time">{{ smartDateFormat(child.createTime) }}</span>
                </div>
              </div>
              <div class="comment-content">
                <p class="cw fs8 m mtb5 fw400">{{ child.content }}</p>
                <div class="flex-between">
                  <div class="comment-operate flex-row">
                    <div class="flex-center mr-5r tac cp operate-icon"
                         @click="handleReplay(child.commentId,item.commentId,child.nickName)">
                      <i class="iconfont icon-replay "></i>
                      <p class="cg fs7 ml2">回复</p>
                    </div>
                    <div class="flex-center mr-5r tac cp operate-icon">
                      <i class="iconfont icon-shared "></i>
                      <p class="cg fs7 ml2">分享</p>
                    </div>
                    <div class="flex-center mr-5r tac cp">
                      <!--                todo 判断是否已点赞-->
                      <i class="iconfont icon-like-grey operate-icon"></i>
                      <p class="cg fs7 ml2">{{ item.commentId }}</p>
                    </div>
                  </div>
                  <div class="flex-center mr-5r tac cp">
                    <el-popconfirm
                        confirm-button-text="Y"
                        cancel-button-text="N"
                        :icon="InfoFilled"
                        icon-color="#626AEF"
                        title="删除？"
                        @confirm="handleDelConfirm(child.commentId)"
                        @cancel="handleDelCancel">
                      <template #reference>
                        <el-icon v-if="item.userId === user.userId" color="red">
                          <DeleteFilled/>
                        </el-icon>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-empty v-show="commentTotal<=0" description="暂无评论"/>
    <el-pagination v-show="commentTotal>0"
                   :total="commentTotal"
                   background
                   layout="prev, pager, next"
                   :page.sync="commentQueryParams.pageNum"
                   :limit.sync="commentQueryParams.pageSize" @pagination="getCommentList"/>
  </el-scrollbar>
  <div class="comment-input-area">
    <el-input slot="reference"
              v-model="commentInput"
              clearable
              @keyup.enter.native="handleCommentClick"
              placeholder="留下你的精彩评论吧">
      <template #prepend v-if="replayVisible">
        <el-tooltip content="点击此处取消回复哦 0.o" placement="bottom">
          <span class="cp cg" style="max-width: 100px; overflow: hidden" @click="handleCancelReplay">
            @{{ replayNickName }}</span>
        </el-tooltip>
      </template>
      <template #append>
        <el-button class="flex-center" @click="handleCommentClick">
          <el-icon :size="18" :color="'var(--niuyin-primary-color)'">
            <ChromeFilled />
          </el-icon>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script>
import {addVideoComment, videoCommentPageList, deleteVideoComment} from "@/api/behave.js";
import {ChromeFilled, DeleteFilled, InfoFilled} from "@element-plus/icons-vue";
import {userInfoX} from "@/store/userInfoX";

export default {
  name: "VideoComment",
  components: {ChromeFilled, DeleteFilled},
  computed: {
    InfoFilled() {
      return InfoFilled
    },
    ChromeFilled() {
      return ChromeFilled
    }
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      },
    },
    videoId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      commentInput: '',
      // 视频评论查询参数
      commentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        videoId: undefined,
      },
      commentDTO: {
        videoId: this.videoId,
        parentId: 0,
        originId: 0,
        content: ""
      },
      commentTotal: 0,
      videoCommentTree: [],
      replayVisible: false,
      replayNickName: '',
      replayCommentId: '', // 待回复评论id
      user: userInfoX().userInfo,
    }
  },
  emits: ['emitUpdateVideoCommentNum'],
  created() {
    this.getCommentList()
  },
  mounted() {
  },
  methods: {
    getCommentList() {
      console.log(this.videoId)
      this.commentQueryParams.videoId = this.videoId
      videoCommentPageList(this.commentQueryParams).then(res => {
        this.drawer = true
        this.videoCommentTree = res.rows;
        this.commentTotal = res.total;
      })
    },
    // 点击评论
    handleCommentClick() {
      // const data = {
      //   "videoId": this.videoId,
      //   "content": this.commentInput
      // }
      this.commentDTO.content = this.commentInput
      addVideoComment(this.commentDTO).then(res => {
        if (res.code === 200) {
          this.getCommentList();
          this.$message.success(res.msg)
          this.commentInput = null
          this.commentDTO.parentId = null
          this.commentDTO.originId = null
          this.commentDTO.content = null
          this.replayVisible = false
          // 通知父组件更新视频数组评论数量
          this.$emit("emitUpdateVideoCommentNum", this.videoId)
        }
      })
    },
    // 回复祖先评论
    handleReplay(parentId, originId, nickname) {
      this.replayVisible = true
      this.replayNickName = nickname
      console.log(parentId + "=" + originId + "=" + nickname)
      this.commentDTO.parentId = parentId
      this.commentDTO.originId = originId
    },
    // 删除我的评论
    handleDelConfirm(commentId) {
      console.log(commentId)
      deleteVideoComment(commentId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getCommentList()
        }
      })
    },
    handleDelCancel() {
    },
    handleCancelReplay() {
      this.commentDTO.parentId = null
      this.commentDTO.originId = null
      this.replayVisible = false
    }

  },
}

</script>

<style scoped>
/*视频评论树形结构*/
.video-comment-tree {
  height: 100%;
  overflow: hidden;
}

/*评论抽屉*/
.comment-container {
  margin: 0 0 1rem 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 0 2px 0 grey;
}

.user-info {
  display: flex;
  align-items: center;

  .user-nickname {
    padding-left: 10px;

    .nickname {
      color: grey;
      font-size: 0.8rem;
    }

    .create-time {
      padding-left: 0;
    }
  }
}

.comment-children {
  padding-left: 50px;
  margin-top: 1rem;
}

.comment-content {
  padding-left: 50px;
}

.aite {
  padding-left: 10px;
  color: blue;
}

.comment-input-area {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

.operate-icon {
  transition: all 0.3s linear, width 0.3s linear;
  text-align: center;
  vertical-align: middle;
}

.operate-icon:hover {
  transform: scale(1.1);
}

.operate-icon:hover {
  transform: scale(1.1);
}

.el-card {
  background-color: transparent;
}

</style>
