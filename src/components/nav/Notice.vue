<template>
  <div class="notice-container">
    <div class="notice-head flex-between p5-10"
         style="background-color: var(--el-bg-color-page);border-radius: 1rem 1rem 0 0">
      <h4>互动消息</h4>
      <div style="width: 40%">
        <el-select v-model="noticeQueryParams.noticeType"
                   :teleported="false"
                   @change="handleNoticePage"
                   placeholder="全部消息">
          <el-option
              v-for="item in noticeTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
        </el-select>
      </div>
    </div>
    <div class="notice-list plrb10" style="height:60vh;overflow-y:auto !important;"
         v-infinite-scroll="loadMore"
         :infinite-scroll-disabled="loadingNotice"
         :infinite-scroll-distance="10">
      <div class="infinite-list" v-loading="loading">
        <div class="infinite-list-item notice-item flex-start cp p5-10 mtb5 pr"
             style="background-color: var(--el-bg-color-page);border-radius: 10px"
             v-for="item in noticeList">
          <!--          头像-->
          <el-avatar v-if="item.operateAvatar"
                     lazy
                     class="hv-scale"
                     :size="50"
                     :src="item.operateAvatar"/>
          <el-avatar v-else
                     class="hv-scale"
                     :icon="UserFilled"/>
          <!--          信息-->
          <div class="notice-info ml-5r flex-wrap">
            <p class="one-line text-hv-gold"><strong>@ {{ item.nickName }}</strong></p>
            <p class="one-line mtb5"><span>{{ item.content }}</span></p>
            <p class="one-line cg fs8 flex-between">
              <div>
                <span v-if="item.remark " class="mr-5r">{{ item.remark }}</span>
                <span>{{ smartDateFormat(item.createTime) }}</span>
              </div>
            </p>
          </div>
          <!--            原-->
          <div class="notice-origin flex-column" style="align-items: flex-end">
            <img v-if="item.videoCoverImage"
                 class="hv-scale"
                 style="height: 60px;width: 60px;border-radius: 6px;object-fit: cover"
                 :src="item.videoCoverImage"/>
            <!--              关注通知-->
            <el-button v-else-if="item.noticeType==='1'"
                       type="primary">回关
            </el-button>
            <el-avatar v-else
                       style="height: 60px;width: 60px;border-radius: 6px;object-fit: cover"
                       :icon="UserFilled"/>
            <div class="notice-op dn pa" style="bottom: -5px">
              <el-popconfirm
                  confirm-button-text="Y"
                  cancel-button-text="N"
                  :icon="InfoFilled"
                  :teleported="false"
                  icon-color="#626AEF"
                  title="删除消息？"
                  class="p10px"
                  @confirm="handleDelNoticeConfirm(item.noticeId)"
                  @cancel.stop="handleDelNoticeCancel">
                <template #reference>
                  <el-icon>
                    <MoreFilled/>
                  </el-icon>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
        <div v-if="dataNotMore">
          <el-divider>暂无更多数据</el-divider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {delNotice, noticePage} from "@/api/notice.js";
import {InfoFilled, MoreFilled, UserFilled} from "@element-plus/icons-vue";
import {userInfoX} from "@/store/userInfoX";

let socket;
export default {
  name: "Notice",
  components: {MoreFilled},
  computed: {
    InfoFilled() {
      return InfoFilled
    },
    UserFilled() {
      return UserFilled
    }
  },
  data() {
    return {
      loading: false,
      loadingData: true,
      loadingIcon: true,
      dataNotMore: false,
      noticeList: [],
      noticeTotal: 0,
      noticeQueryParams: {
        noticeType: "",
        pageNum: 1,
        pageSize: 10
      },
      noticeTypeOption: [
        {id: 1, label: "全部消息", value: ""},
        {id: 2, label: "点赞", value: "0"},
        {id: 3, label: "关注", value: "1"},
        {id: 4, label: "收藏", value: "2"},
        {id: 5, label: "视频被评论", value: "3"},
        {id: 6, label: "回复评论", value: "4"},
        {id: 7, label: "赞了评论", value: "5"},
      ],
      loadingNotice: false,
      loginUser: userInfoX().userInfo,
    }
  },
  created() {
    this.getNoticeList()
    this.initWebSocket()
  },
  emits: ['noticeRefreshEmit'],
  methods: {
    initWebSocket() {
      // this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
      console.log(this.loginUser.userId);
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        // let socketUrl = "ws://127.0.0.1:8088/chat-server/" + username;
        let socketUrl = import.meta.env.VITE_API_WS_URL + "/notice/websocket/" + this.loginUser.userId;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data);
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    },
    // 分页获取通知
    getNoticeList() {
      this.loading = true
      noticePage(this.noticeQueryParams).then(res => {
        if (res.code === 200) {
          this.noticeList = res.rows
          this.noticeTotal = res.total
          this.loading = false
        }
      })
    },
    // 根据类型筛选
    handleNoticePage() {
      this.loading = true
      this.noticeQueryParams.pageNum = 1
      noticePage(this.noticeQueryParams).then(res => {
        if (res.code === 200) {
          this.noticeList = res.rows
          this.noticeTotal = res.total
          this.loading = false
          if (res.total === 0) {
            this.dataNotMore = true
          } else {
            this.dataNotMore = false
          }
        }
      })
    },
    // 删除通知
    handleDelNoticeConfirm(noticeId) {
      // console.log(noticeId)
      delNotice(noticeId).then(res => {
        if (res.code === 200) {
          this.getNoticeList()
          this.$emit('noticeRefreshEmit')
        }
      })
    },
    handleDelNoticeCancel() {
    },
    loadMore() {
      if (this.dataNotMore) {
        // console.log("dataNotMore")
        this.loading = false
        this.noticeQueryParams = {
          pageNum: 1,
          pageSize: 10
        }
        return
      }
      //加载更多
      // console.log("loadMore")
      this.loading = true
      this.loadingNotice = true
      this.noticeQueryParams.pageNum += 1
      noticePage(this.noticeQueryParams).then(res => {
        if (res.code === 200) {
          if (res.rows == null || res.rows.length < this.noticeQueryParams.pageSize) {
            this.dataNotMore = true
            this.loading = false
            return;
          }
          this.noticeList = this.noticeList.concat(res.rows)
          this.loading = false
          this.loadingNotice = false
        }
      })
    },
  }
}
</script>

<style scoped>
.el-select:deep(.el-input__wrapper) {
  box-shadow: none !important;
}

.el-input:deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
}

.el-select:deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #000000;
  box-shadow: none !important;
}

.infinite-list {
  height: 100%;
}

.notice-item {

  .notice-op {
    transition: all 0.3s ease;

    &:hover {
      color: var(--niuyin-primary-color);
    }
  }

  &:hover .notice-op {
    display: inline-block;
  }
}

</style>
