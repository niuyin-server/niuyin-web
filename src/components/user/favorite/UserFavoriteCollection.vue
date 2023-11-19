<template>
  <div class="favorite-collection-container">
    <div class="flex-between">
      <div class="collection-edge cp" v-for="(item,index) in collectionList">
        <div class="collection-container">
          <div class="collection-head flex-between">
            <div class="coll-title fs9 fw600">{{ item.title }}</div>
            <!--              操作区域-->
            <div class="coll-op cp">
              <el-popconfirm
                  confirm-button-text="Y"
                  cancel-button-text="N"
                  :icon="InfoFilled"
                  :teleported="false"
                  icon-color="#626AEF"
                  title="删除收藏夹？">
                <template #reference>
                  <el-icon>
                    <MoreFilled/>
                  </el-icon>
                </template>
              </el-popconfirm>
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
</template>

<script>
import {collectionInfoList} from "@/api/behave.js";
import {Film, InfoFilled, MoreFilled, UserFilled} from "@element-plus/icons-vue";

export default {
  name: "UserFavoriteCollection",
  components: {MoreFilled},
  computed: {
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
      collectionList: [], //收藏夹集合
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
