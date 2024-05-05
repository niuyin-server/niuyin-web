<template>
  <div class="video-note-container">
    <div class="video-note-list">
      <el-scrollbar v-infinite-scroll="loadMoreVideoNote">
        <div v-for="item in videoNoteList"
             class="video-note-item cp" @click="handleNoteDetail(item.noteId)">
          <div class="video-note-author flex-center">
            <img class="user-avatar" :src="item.author.avatar" :alt="item.author.userName">
            <span class="username" v-html="item.author.nickName"></span>
            <span class="publish-time cg fs9"> · {{ smartDateFormat(item.createTime) }}</span>
          </div>
          <div class="video-note-entity">
            <h3 class="mtb5">{{ item.noteTitle }}</h3>
            <p>
              <v-md-preview :text="item.noteContent"></v-md-preview>
            </p>
          </div>
        </div>
        <div v-if="videoNoteTotal" class="w100">
          <el-divider>暂无更多数据</el-divider>
        </div>
        <el-empty v-show="videoNoteTotal<=0" description="暂无数据"/>
        <el-backtop :right="16" :bottom="16" target=".el-dialog .el-scrollbar__wrap"
                    :visibility-height="10"/>
      </el-scrollbar>

    </div>
    <v-md-editor v-model="text" height="400px"></v-md-editor>
    <el-tooltip content="发布笔记，展开/关闭" placement="top">
      <div class="operate-write flex-column flex-center cp" @click="handleWriteNote">
        <svg class="icon1-5rem" aria-hidden="true">
          <use xlink:href="#icon-note"></use>
        </svg>
      </div>
    </el-tooltip>
    <div v-if="noteWriteVisible" class="write-note-area flex-column" style="z-index: 3">

      <div class="flex-between">
        <h2>
          写笔记
        </h2>
        <el-button type="primary" @click="handlePublishNote">发布</el-button>
      </div>

      <div>

        <h4 class="mtb5">标题</h4>
        <el-input v-model="videoNoteDTO.noteTitle"
                  maxlength="100"
                  class="w-50 m-2"
                  placeholder="请填写笔记标题"
                  show-word-limit
                  minlength="1"
                  type="text"/>
      </div>
      <div class="oh " style="flex: 1;margin-top: .5rem;">
        <v-md-editor v-model="videoNoteDTO.noteContent" height="100%"></v-md-editor>
      </div>
    </div>
  </div>
  <!--  <el-dialog v-model="noteWriteVisible"-->
  <!--             custom-class="secondly-dialog"-->
  <!--             title="发布笔记"-->
  <!--             width="50%">-->
  <!--    <div class="N3OJZMVX">标题</div>-->
  <!--    <el-input v-model="videoNoteDTO.noteTitle"-->
  <!--              maxlength="20"-->
  <!--              class="w-50 m-2"-->
  <!--              placeholder="记得填写昵称"-->
  <!--              show-word-limit-->
  <!--              type="text"/>-->
  <!--    <v-md-editor v-model="videoNoteDTO.noteContent" mode="preview"></v-md-editor>-->
  <!--  </el-dialog>-->
  <el-dialog v-model="noteDetailVisible" :show-close="false">
    <div class="p1rem">
      <div><h3>{{ videoNoteVO.noteTitle }}</h3></div>
      <v-md-preview :text="videoNoteVO.noteContent"></v-md-preview>
    </div>
  </el-dialog>
</template>

<!--
*@author roydon
*@date 2024/5/5 18:40
*视频笔记 component
-->
<script>
import {videoNotePage, addVideoNote, getVideoNote} from "@/api/behave"
import {smartDateFormat} from "@/utils/roydon.js";

export default {
  name: 'VideoNote',
  props: {
    videoId: Object
  },
  components: {},
  data() {
    return {
      text: "123",
      videoNotePageDTO: {
        videoId: this.videoId,
        pageNum: 1,
        pageSize: 10
      },
      videoNoteList: [],
      videoNoteTotal: null,
      noteWriteVisible: false,
      videoNoteDTO: {
        videoId: this.videoId,
        noteTitle: "",
        noteContent: ""
      },
      noteDetailVisible: false,
      videoNoteVO: {},
    }
  },
  created() {
  },
  mounted() {
    this.initVideoNotePage()
  },
  emits: [],
  methods: {
    smartDateFormat,
    initVideoNotePage() {
      videoNotePage(this.videoNotePageDTO).then(res => {
        if (res.code === 200 && res.total > 0) {
          if (res.rows != null && res.rows.length > 0) {
            this.videoNoteList = this.videoNoteList.concat(res.rows)
          }
          this.videoNoteTotal = res.total
        }
      })
    },
    loadMoreVideoNote() {

    },
    handleWriteNote() {
      this.noteWriteVisible = !this.noteWriteVisible
    },
    handlePublishNote() {
      addVideoNote(this.videoNoteDTO).then(res => {
        if (res.code === 200) {
          this.$message.success("发布成功")
          this.noteWriteVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleNoteDetail(noteId) {
      getVideoNote(noteId).then(res => {
        if (res.code === 200) {
          this.noteDetailVisible = true
          this.videoNoteVO = res.data
        }
      })
    },
  }
}
</script>

<style scoped>
.video-note-container {
  position: relative;
  width: 100%;
  height: 100%;

  .video-note-list {
    height: 100%;

    .video-note-item {
      padding: 1rem;
    }
  }
}

.video-note-author {
  display: flex;
  justify-content: flex-start;
  border-radius: .5rem;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  .username {
    padding: 0 1rem;
  }
}

.operate-write {
  position: absolute;
  bottom: 4rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 50%;
  background-color: var(--color-bg-b0);
  z-index: 10;
}

.write-note-area {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  transition: all 1s ease-in-out;
  height: 80%;
  background-color: var(--color-bg-b0);
  border-radius: 1rem 1rem 0 0;
  padding: 1rem;
}

</style>
