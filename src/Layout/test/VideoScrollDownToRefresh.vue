<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue'
import {recommendVideoFeed} from "@/api/recommend.js";
import {
  LoadingOne
} from '@icon-park/vue-next'

const props = defineProps({
  columnCount: {
    type: Number,
    default: 5
  }
})

const items = ref([])
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const observerRef = ref(null)
const loadingRef = ref(null)

// 每个视频的高度根据屏幕宽度和列数动态计算 比例16：9
const height = ref(window.innerWidth * 9 / 16 / props.columnCount)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  console.log('Loading more items...')
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // const res = await recommendVideoFeed(page.value)
    const res = videoMockData.data
    console.log(res)
    const newItems = res
    console.log('New items:', newItems)
    if (newItems.length === 0) {
      hasMore.value = false
    } else {
      items.value = [...items.value, ...newItems]
      page.value += 1
      // 重新计算页面高度
      nextTick(() => {
        if (loadingRef.value) {
          observerRef.value.unobserve(loadingRef.value)
          observerRef.value.observe(loadingRef.value)
        }
      })
    }
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

const observeIntersection = (entries) => {
  if (entries[0].isIntersecting) {
    loadMore()
  }
}

onMounted(() => {
  // height.value = Math.floor(window.innerWidth * 9 / 16 / props.columnCount)
  observerRef.value = new IntersectionObserver(observeIntersection, {threshold: 0.1}) // 调整阈值
  if (loadingRef.value) {
    observerRef.value.observe(loadingRef.value)
  }
})

onUnmounted(() => {
  if (observerRef.value) {
    observerRef.value.disconnect()
  }
})

watch(() => props.columnCount, (newColumnCount) => {
  // 如果需要处理列数变化的情况，可以在这里添加逻辑
})

const playVideo = (item) => {
  console.log("hover")
  item.showVideo = true
  const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
  if (videoElement && !videoElement.paused) {
    // 视频已经在播放中
    console.log('Video is already playing');
  } else if (videoElement) {
    // 开始播放视频
    videoElement.play().catch((error) => {
      console.error('Error playing video:', error);
    });
  }
}

const pauseVideo = (item) => {
  item.showVideo = false
  const videoElement = document.querySelector(`video[src="${item.videoUrl}"]`)
  if (videoElement) {
    videoElement.pause()
    videoElement.currentTime = 0
  }
}

const videoMockData = {
  "code": 200,
  "msg": "操作成功",
  "data": [
    {
      "videoId": "11946055393848852486e68baff",
      "userId": 2,
      "videoTitle": "我养的不只是猫咪，也是童年那个小小的自己",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/10/b49b34c0b0d0444ab6e2121cc197effe.webp",
      "videoUrl": "",
      "viewNum": 175,
      "likeNum": 3,
      "favoritesNum": 0,
      "publishType": "1",
      "showType": "0",
      "positionFlag": "1",
      "auditsStatus": "0",
      "videoInfo": null,
      "delFlag": "0",
      "createBy": "2",
      "createTime": "2024-01-10 11:35:55",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "还会心动吗",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg",
      "weatherLike": false,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "猫咪"
      ],
      "imageList": [
        "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/10/85551f8177b24886ad9c21b7856f1fdd.webp",
        "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/10/b49b34c0b0d0444ab6e2121cc197effe.webp"
      ],
      "position": {
        "positionId": 11,
        "videoId": "11946055393848852486e68baff",
        "longitude": 113.615441,
        "latitude": 34.749333,
        "province": "河南省",
        "city": "郑州市",
        "cityCode": "0371",
        "district": "中原区",
        "township": "建设路街道",
        "adcode": "410102",
        "address": "河南省郑州市中原区建设路街道中原工学院中原校区",
        "status": "0"
      },
      "hotScore": null
    },
    {
      "videoId": "1193511776071712768c67d8866",
      "userId": 2,
      "videoTitle": "我们什么时候会有一款像荒野大镖客2这样优秀的游戏",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/07/e695beeb1d7747f59907a3a3a9f51d9f.mp4?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/07/e695beeb1d7747f59907a3a3a9f51d9f.mp4",
      "viewNum": 50,
      "likeNum": 2,
      "favoritesNum": 0,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:23500,\"decoder:\"h264 (High) (avc1 / 0x31637661)\",\"bitRate:2557000,\"frameRate:30.0,\"width:576,\"height:1024}",
      "delFlag": "0",
      "createBy": "2",
      "createTime": "2024-01-07 11:09:42",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "还会心动吗",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg",
      "weatherLike": false,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "荒野大镖客",
        "steam",
        "3A"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "1232628705155612672bafee241",
      "userId": 2,
      "videoTitle": "梦幻联动",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/04/24/70a2529344114366880297f540f06874.mp4?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/04/24/70a2529344114366880297f540f06874.mp4",
      "viewNum": 63,
      "likeNum": 3,
      "favoritesNum": 0,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:11070,\"decoder:\"h264 (High) (avc1 / 0x31637661)\",\"bitRate:906000,\"frameRate:30.0,\"width:720,\"height:1280}",
      "delFlag": "0",
      "createBy": "2",
      "createTime": "2024-04-24 09:46:24",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 2,
      "userNickName": "还会心动吗",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg",
      "weatherLike": true,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "原神"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "124404256077145702417862200",
      "userId": 79,
      "videoTitle": "泥嚎 想泥啦",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/05/25/859daf30a0ca4c23877cdcbf12f2274c.mp4?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/05/25/859daf30a0ca4c23877cdcbf12f2274c.mp4",
      "viewNum": 0,
      "likeNum": 0,
      "favoritesNum": 0,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:6550,\"decoder:\"hevc (Main) (hvc1 / 0x31637668)\",\"bitRate:81000,\"frameRate:30.0,\"width:576,\"height:710}",
      "delFlag": "0",
      "createBy": "79",
      "createTime": "2024-05-25 21:41:00",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "小羔猫",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/05/25/5317d219a69f47a1951fe1345cc90226.jpg",
      "weatherLike": false,
      "weatherFavorite": false,
      "weatherFollow": false,
      "tags": [
        "小猫咪"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "1295510193760632832214fe285",
      "userId": 87,
      "videoTitle": "当你在我的世界开启电影模式",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/10/14/36fb028604d846578dc8909c01c619f3.mp4?x-oss-process=video/snapshot,t_14250,f_jpg,w_0,h_0,m_fast,ar_auto",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/10/14/36fb028604d846578dc8909c01c619f3.mp4",
      "viewNum": 0,
      "likeNum": 0,
      "favoritesNum": 0,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:19170,\"decoder:\"h264 (High) (avc1 / 0x31637661)\",\"bitRate:622000,\"frameRate:30.0,\"width:1280,\"height:720}",
      "delFlag": "0",
      "createBy": "87",
      "createTime": "2024-10-14 22:15:00",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "专属ᝰ心动",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/14/9ab3fbb8d1c148a5a6318edf8adbf1b3.jpg",
      "weatherLike": false,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "风景",
        "minecraft",
        "我的世界",
        "我的世界光影",
        "我的世界乌托邦之旅"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "11942256519644446728be22c93",
      "userId": 2,
      "videoTitle": "“向海风许愿，在山海相见”",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/09/a6034c0b9bfc451ba68c1f404dc60de7.mp4?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/09/a6034c0b9bfc451ba68c1f404dc60de7.mp4",
      "viewNum": 25,
      "likeNum": 2,
      "favoritesNum": 0,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:27000,\"decoder:\"h264 (High) (avc1 / 0x31637661)\",\"bitRate:1310000,\"frameRate:30.0,\"width:1280,\"height:720}",
      "delFlag": "0",
      "createBy": "2",
      "createTime": "2024-01-09 10:26:23",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "还会心动吗",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg",
      "weatherLike": true,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "地平线风景",
        "地平线"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "1191090727057096704d5f8f3ef",
      "userId": 2,
      "videoTitle": "2023年最后一天 艾特你的好朋友过来看地平线4风景大合集吧！",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2023/12/31/4b74383dcb0e4e6d88fbdb963d7362d3.png",
      "videoUrl": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2023/12/31/b5a85f79a63b41d1b98bc7a83b53cca5.mp4",
      "viewNum": 157,
      "likeNum": 4,
      "favoritesNum": 2,
      "publishType": "0",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": "{\"format:\"mov\",\"duration:38130,\"decoder:\"h264 (High) (avc1 / 0x31637661)\",\"bitRate:1280000,\"frameRate:30.0,\"width:1024,\"height:576}",
      "delFlag": "0",
      "createBy": "2",
      "createTime": "2023-12-31 18:49:19",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 3,
      "userNickName": "还会心动吗",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/10/07/4eb4963fa6bb4f85aa0ba1f748978993.jpeg",
      "weatherLike": false,
      "weatherFavorite": true,
      "weatherFollow": true,
      "tags": [
        "地平线风景",
        "steam游戏"
      ],
      "imageList": null,
      "position": null,
      "hotScore": null
    },
    {
      "videoId": "1195168590253260800b6e1a8c7",
      "userId": 38,
      "videoTitle": "出门忘记放饭它就生气了！小司：喵了个咪的 养不起就别养了！",
      "videoDesc": "",
      "coverImage": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/12/5f9f4e6b6076460880aa1c950c15c7d8.webp",
      "videoUrl": "",
      "viewNum": 56,
      "likeNum": 1,
      "favoritesNum": 1,
      "publishType": "1",
      "showType": "0",
      "positionFlag": "0",
      "auditsStatus": "0",
      "videoInfo": null,
      "delFlag": "0",
      "createBy": "38",
      "createTime": "2024-01-12 00:53:17",
      "updateBy": "",
      "updateTime": null,
      "commentNum": 0,
      "userNickName": "猫小司",
      "userAvatar": "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/member/2024/01/12/29c63e05ce4843d9a6744fe39a13f159.jpeg",
      "weatherLike": false,
      "weatherFavorite": false,
      "weatherFollow": true,
      "tags": [
        "猫咪我真是操心的命",
        "萌到爆炸了",
        "千万别嘲笑小猫咪"
      ],
      "imageList": [
        "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/12/5f9f4e6b6076460880aa1c950c15c7d8.webp",
        "https://niuyin-server.oss-cn-shenzhen.aliyuncs.com/video/2024/01/12/f469fa916129473ba9c73653595d3948.webp"
      ],
      "position": null,
      "hotScore": null
    }
  ]
}
</script>

<template>
  <div class="p-4">
    <div
        class="grid gap-4"
        :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
    >
      <!-- foreach items video card-->
      <div
          v-for="item in items"
          :key="item.videoId"
          class="flex flex-col break-inside-avoid shadow-md hover:shadow-lg transition ease-in-out duration-300 rounded-lg"

      >
        <!-- 封面区域 -->
        <div class="w-full h-auto relative"
             :style="{ height: `${height}px` }"
             @mouseover="playVideo(item)"
             @mouseout="pauseVideo(item)">
          <img
              :src="item.coverImage"
              :alt="item.videoTitle"
              class="w-full h-full rounded-t-lg absolute top-0 left-0"
              :style="{ height: `${height}px`, objectFit: 'cover' }"
              v-if="!item.showVideo"
          />
          <!-- 发布类型：publishType：0视频1图文 -->
          <video
              :src="item.videoUrl"
              class="w-full h-full rounded-t-lg absolute top-0 left-0"
              :style="{ height: `${height}px`, objectFit: 'cover' }"
              v-if="item.publishType==='0' && item.showVideo"
              controls
              preload="auto"
          ></video>
          <div class="w-full h-full rounded-t-lg absolute top-0 left-0"
               :style="{ height: `${height}px`, objectFit: 'cover' }"
               v-else-if="item.publishType==='1' && item.showVideo">
            轮播图
          </div>
          <img v-else
               :src="item.coverImage"
               :alt="item.videoTitle"
               :style="{ height: `${height}px`, objectFit: 'cover' }"
               class="w-full h-full rounded-t-lg absolute top-0 left-0"/>
        </div>
        <!-- 标题区域 -->
        <div class="h-auto p-3 flex flex-col justify-between grow">
          <div class="text-base text-clamp-2 font-semibold text-left">{{ item.videoTitle }}</div>
          <div class="flex justify-start mt-1">
            <img :src="item.userAvatar" :alt="item.userNickName" class="shadow-md size-8 rounded-full"/>
            <span class="text-xs flex ml-2" style="align-items: center;">{{ item.userNickName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="loadingRef" class="flex justify-center items-center py-8">
      <LoadingOne v-if="loading" class="animate-spin"/>
      <p v-if="!hasMore" class="text-gray-500">没有更多内容了</p>
    </div>
  </div>
</template>

<style scoped>

</style>
