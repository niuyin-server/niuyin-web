<template>
  <div style="margin: 0 1rem 1rem 0">
    <!--    <i-frame :src="url"/>-->

    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="carousel-container">
          <el-carousel height="200px">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 class="small justify-center" text="2xl">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="source-code-wrapper">
          <div v-for="item in sourceCodeRepositoryList" :key="item.id"
               @click="openLink(`${item.url}`)" class="source-code-card flex-row cp text-hv-gold">
            <div class="source-code-icon">
              <svg class="icon3rem operate-svg" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
            </div>
            <div>
              <div class="source-code-name one-line fs125 fw600">{{ item.name }}</div>
              <div class="source-code-desc one-line fs9 cg fw600">{{ item.desc }}</div>
              <div class="source-code-info cw fw600 flex-start">
                star
                <svg class="icon operate-svg mlr5" aria-hidden="true">
                  <use xlink:href="#icon-favorite-num"></use>
                </svg>
                {{ item.starNum }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<!--
*@author roydon
*@date 2024/4/26 20:46
-->
<script>

export default {
  name: 'NiuyinGithub',
  props: {},
  components: {},
  data() {
    return {
      url: "https://github.com/niuyin-server",
      sourceCodeRepositoryList: [
        {
          id: 1,
          name: "niuyin-server",
          desc: "niuyin后端",
          icon: "#icon-spring-cloud",
          url: "https://github.com/niuyin-server",
          starNum:"3"
        },
        {
          id: 2,
          name: "niuyin-web",
          desc: "niuyin web端",
          icon: "#icon-vue",
          url: "https://github.com/niuyin-server",
          starNum:"2"
        },
        {
          id: 3,
          name: "niuyin-creator",
          desc: "niuyin创作者中心",
          icon: "#icon-vue",
          url: "https://github.com/niuyin-server",
          starNum:"3"
        },
        {
          id: 4,
          name: "niuyin-android",
          desc: "niuyin安卓端",
          icon: "#icon-android",
          url: "https://github.com/niuyin-server",
          starNum:"2"
        },
      ],
    }
  },
  created() {
  },
  mounted() {
  },
  emits: [],
  methods: {
    openLink(link) {
      console.log(link);
      window.open(link, "_blank")
    },
  }
}
</script>

<style scoped>
.carousel-container {
  border-radius: 1rem;
  overflow: hidden;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.source-code-wrapper {
  border-radius: 1rem;
  overflow: hidden;


  .source-code-card {
    background-color: var(--niuyin-primary-color-2);
    margin-bottom: 1rem;
    padding: .5rem;
    border-radius: 1rem;

    .source-code-icon {
      margin: 1rem;
    }

    .source-code-name {
    }

    .source-code-desc {
      margin-top: 0.5rem;
    }

    .source-code-info {
      margin-top: 0.5rem;
    }
  }
}
</style>
