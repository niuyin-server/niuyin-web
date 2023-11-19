<template>
  <div class="favorite-collection-container">
    <div class="flex-between">
      <div class="collection-edge cp" v-for="(item,index) in collectionList">
        <div class="collection-container">
          <div class="collection-head flex-between">
            <div class="coll-title fs9 fw600">{{ item.title }}</div>
            <!--              操作区域-->
            <div class="coll-op cp">
              <el-popover placement="top"
                          trigger="hover"
                          popper-style="padding: 1rem;">
                <template #reference>
                  <el-icon>
                    <MoreFilled/>
                  </el-icon>
                </template>
                <template #default>
                  <div class="flex-center">
                    <el-button type="primary" @click="handleEditCollectionDialog(item.favoriteId)">编辑收藏夹
                    </el-button>
                  </div>
                  <div class="flex-center" style="margin-top: 0.5rem">
                    <el-button type="warning" @click="handleDelCollection(item.favoriteId)">删除收藏夹</el-button>
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
          <div class="collection-info flex-start">
            <p class="cg fs7 ptb10px">共 {{ item.videoCount }} 件作品</p>
          </div>
          <div class="collection-video flex-between">
            <div class="videos flex-center"
                 v-for="(cover,index) in item.videoCoverList">
              <el-image v-if="cover" class="video-cover eli-ofc" lazy :src="cover"/>
              <el-avatar v-else class="video-cover eli-ofc" :icon="Film"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  编辑详细信息弹框  -->
  <el-dialog v-model="editDialogVisible"
             :width="400"
             align-center
             :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h3 class="one-line" :id="titleId" :class="titleClass">编辑收藏夹</h3>
      <el-button circle :icon="Close" class="cb" type="info" @click="close">
      </el-button>
    </template>
    <div class="mb5">收藏夹名称</div>
    <el-input v-model="collectionForm.title"
              placeholder="收藏夹的名称"
              clearable
              maxlength="10"
              show-word-limit
              type="text"></el-input>
    <div class="mtb5">收藏夹描述</div>
    <el-input v-model="collectionForm.description"
              placeholder="收藏夹的描述..."
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"></el-input>
    <div class="flex-between mtb5">
      <div>
        <p class="fs8">>设置为公开</p>
        <p class="fs7 cg">公开后有机会被推荐，帮助到更多人</p>
      </div>
      <div>
        <el-switch
            v-model="collectionForm.showStatus"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>
    <!--  确认按钮  -->
    <div class="edit-button flex-center">
      <el-button class="w100 fw600" type="primary" @click="confirmUpdateCollection">保存</el-button>
    </div>
  </el-dialog>
  <!--  删除收藏夹dialog-->
  <el-dialog v-model="delDialogVisible"
             :width="400"
             :show-close="false" align-center>
    <template #header="{close}">
      <p style="color: var(--niuyin-text-color)">确定删除此收藏夹吗？</p>
      <el-button circle :icon="Close" class="cb" type="info" @click="close">
      </el-button>
    </template>
    <div class="mb1rem">
      <p>确认删除该收藏夹吗，删除后视频依旧可在收藏视频中查看~</p>
    </div>
    <div class="edit-button flex-center">
      <el-button class="w100 fw600" type="primary" @click="handleConfirmDelCollection">确定删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {collectionInfoList, deleteFavorite, updateFavorite} from "@/api/behave.js";
import {Close, Film, InfoFilled, MoreFilled, UserFilled} from "@element-plus/icons-vue";

export default {
  name: "UserFavoriteCollection",
  components: {MoreFilled},
  computed: {
    Close() {
      return Close
    },
    Film() {
      return Film
    },
    UserFilled() {
      return UserFilled
    },
    InfoFilled() {
      return InfoFilled
    }
  },
  props: {},
  data() {
    return {
      editDialogVisible: false,
      delDialogVisible: false,
      collectionList: [], //收藏夹集合
      favoriteId: '',
      collectionForm: {},
    }
  },
  created() {
    this.initCollectionList()
  },
  methods: {
    // 收藏夹集合
    initCollectionList() {
      collectionInfoList().then(res => {
        if (res.code === 200) {
          this.collectionList = res.data
          // 收藏夹集合操作，填充六张作品封面为空串
          this.collectionList.forEach((item, index) => {
            item.videoCoverList.forEach((ite, inde) => {

            })
            let old = item.videoCoverList
            item.videoCoverList = [...old, ...new Array(6 - old.length).fill('')]
          })
          // console.log(this.collectionList)
        }
      })
    },
    // 编辑操作
    handleEditCollectionDialog(favoriteId) {
      this.editDialogVisible = true
      this.collectionList.forEach((item, index) => {
        if (item.favoriteId === favoriteId) {
          this.collectionForm = item
        }
      })
    },
    // 删除收藏夹dialog
    handleDelCollection(favoriteId) {
      this.delDialogVisible = true
      this.favoriteId = favoriteId
    },
    // 删除收藏夹dialog
    handleConfirmDelCollection() {
      deleteFavorite(this.favoriteId).then(res => {
        if (res.code === 200) {
          this.delDialogVisible = false
          this.$message.success(res.msg)
          this.initCollectionList()
        } else {
          this.delDialogVisible = true
          this.$message.error(res.msg)
        }
      })
    },
    // 更新收藏夹
    confirmUpdateCollection() {
      updateFavorite(this.collectionForm).then(res => {
        if (res.code === 200) {
          this.editDialogVisible = false
          this.$message.success(res.msg)
        } else {
          this.editDialogVisible = true
          this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

<style scoped>
.collection-edge {
  width: 33.333333%;
  padding: 0 0.5rem 1rem;

  .collection-container {
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.13) 0 2px 3px 0, rgba(0, 0, 0, 0.11) 0 1px 1px 0;
    transition: all 0.3s ease;
    background-color: var(--el-bg-color-page);


    .collection-video {

      .videos {
        width: 16.666666%;

        .video-cover {
          width: 48px;
          height: 48px;
          border-radius: 6px;
        }

      }
    }
  }

}
</style>
