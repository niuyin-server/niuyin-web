<template>
  <!--  侧边栏-->
  <el-aside class="niuyin-aside">
    <!-- logo -->
    <div class="oh w100"
         style="overflow:hidden;height: 60px;position:sticky;top: 0;left: 0;z-index: 1;">
      <router-link class="link-type flex-center wh100"
                   :to="'/index'"
                   tag="div">
        <div class="" style="text-align: right;width: 60px">
          <img style="width: 28px;height: 28px;display: inline-block"
               src="@/assets/logo/logo-cheese.png">
        </div>
        <div class="" style="width: calc(100% - 60px)">
          <span style="display:inline-block;width: 4px"></span>
          <span class="dn-phone fw500"
                style="display:inline-block;line-height: 60px;height: 60px;font-family: DouyinSansBold;font-size: 1.2rem;color: var(--niuyin-text-color)">芝士</span>
        </div>
      </router-link>
    </div>
    <el-scrollbar style="height: calc(100% - 60px)">
      <!-- tab栏区域 -->
      <div class="tabs-area">
        <ul class="tab-top">
          <li class="tab-top-item"
              v-for="(item, i) in tabsTopList"
              :key="i">
            <router-link class="router-link"
                         active-class="router-is-focus"
                         :to="item.link">
              <div class="tab-item">
                <div class="round">
                  <svg class="icon operate-svg" aria-hidden="true">
                    <use :xlink:href="item.class"></use>
                  </svg>
                </div>
                <span class="dn-phone">{{ item.name }}</span>
              </div>
            </router-link>
          </li>
        </ul>
        <!-- 分隔符 -->
        <div v-if="videoCategoryParentList">
          <el-divider/>
          <ul class="tab-center">
            <li class="tab-center-item"
                v-for="(item, i) in videoCategoryParentList"
                :key="i">
              <router-link class="router-link"
                           active-class="router-is-focus"
                           :to="'/category/'+item.id">
                <div class="tab-item">
                  <div class="round flex-center">
                    <!--                    <svg class="icon operate-svg" aria-hidden="true">-->
                    <!--                      <use :xlink:href="item.class"></use>-->
                    <!--                    </svg>-->
                    <img class="wh1point25rem" style="vertical-align: middle;" :src="item.categoryImage"/>
                  </div>
                  <span class="dn-phone">{{ item.name }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <!--        <el-divider/>-->
        <!--        <ul class="tab-center">-->
        <!--          <li class="tab-center-item"-->
        <!--              v-for="(item, i) in tabsCenterList"-->
        <!--              :key="i">-->
        <!--            <router-link class="router-link"-->
        <!--                         active-class="router-is-focus"-->
        <!--                         :to="item.link">-->
        <!--              <div class="tab-item">-->
        <!--                <div class="round">-->
        <!--                  <svg class="icon operate-svg" aria-hidden="true">-->
        <!--                    <use :xlink:href="item.class"></use>-->
        <!--                  </svg>-->
        <!--                </div>-->
        <!--                <span class="dn-phone">{{ item.name }}</span>-->
        <!--              </div>-->
        <!--            </router-link>-->
        <!--          </li>-->
        <!--        </ul>-->
        <!-- 分隔符 -->
        <el-divider/>
        <ul class="tab-center">
          <li class="tab-center-item"
              v-for="(item, i) in tabsBottomList"
              :key="i">
            <router-link class="router-link"
                         active-class="router-is-focus"
                         :to="item.link">
              <div class="tab-item">
                <div class="round">
                  <svg class="icon operate-svg" aria-hidden="true">
                    <use :xlink:href="item.class"></use>
                  </svg>
                </div>
                <span class="dn-phone">{{ item.name }}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import {Message} from "@element-plus/icons-vue";
import {videoCategoryParentList, videoCategoryTree} from "@/api/video.js";

export default {
  name: "Aside",
  components: {Message},
  props: {
    siteTitle: String,
  },
  data() {
    return {
      tabsTopList: [
        {id: 1, name: "首页", '--color': "blue", class: "#icon-index", link: "/index"},
        {id: 1, name: "推荐", '--color': "blue", class: "#icon-discover", link: "/discover"},
        {id: 2, name: "热门", '--color': "blue", class: "#icon-hotVideo", link: "/hotVideo"},
        {id: 3, name: "关注", '--color': "black", class: "#icon-follow", link: "/follow"},
        // {id: 4, name: "频道", '--color': "black", class: "#icon-channel", link: "/channel",},
        {id: 5, name: "我的", '--color': "black", class: "#icon-erciyuan", link: "/user",},
      ],
      tabsCenterList: [
        {id: 1, name: "知识", '--color': "black", class: "#icon-knowledge", link: "/category/12"},
        {id: 2, name: "游戏", '--color': "red", class: "#icon-game", link: "/category/11"},
        {id: 3, name: "娱乐", '--color': "red", class: "#icon-entertainment", link: "/category/23"},
        {id: 4, name: "音乐", '--color': "red", class: "#icon-music", link: "/category/9"},
        {id: 5, name: "二次元", '--color': "red", class: "#icon-erciyuan", link: "/category/1"},
        {id: 6, name: "生活", '--color': "red", class: "#icon-food", link: "/category/17"},
        {id: 7, name: "美食", '--color': "red", class: "#icon-food", link: "/category/18"},
      ],
      videoCategoryParentList: localStorage.getItem("videoCategoryParentList") ? JSON.parse(localStorage.getItem("videoCategoryParentList")) : null,
      tabsBottomList: [
        {id: 1, name: "商务合作", '--color': "red", class: "#icon-cooperation", link: "/cooperation"},
        {id: 2, name: "源码地址", '--color': "red", class: "#icon-github", link: "/niuyinGithub"},
      ],
    }
  },
  mounted() {
    this.initVideoCategoryParentList()
  },
  methods: {
    handleSelect(index) {
      // console.log(this.$router.options.routes)
    },
    initVideoCategoryParentList() {
      videoCategoryParentList().then(res => {
        if (res.code === 200) {
          if (this.videoCategoryParentList == null) {
            this.videoCategoryParentList = res.data
          }
          localStorage.setItem("videoCategoryParentList", JSON.stringify(res.data))
        }
      })
    },
  }
}
</script>

<style>
.niuyin-aside {
  width: fit-content;
}

@media (max-width: 520px) {

}

.tab-top-item {
  width: 100%;
  margin: 0.3rem 0;
  text-align: left;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.tab-center-item {
  width: 100%;
  margin: 0.3rem 0;
  text-align: left;
  font-size: 0.9rem;
  border-radius: 0.5rem;
}

.router-link {
  border-radius: 0.5rem;
  padding: 0.3rem 0;
  color: var(--niuyin-text-color);
  text-decoration: none;
}

.tab-item {
  margin: 1px 1rem;
  display: flex;
  padding: 0 10px;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  border-radius: 0.5rem;
  transition: all .3s ease-in;
}

.tab-item:hover {
  background-color: var(--bg-aside-a);
}

.round {
  display: inline-block;
  width: 36px;
  text-align: center;
  height: 36px;
  line-height: 36px;
}

.round i {
  border-radius: 50%;
  padding: 5px;
  font-size: 20px;
}

</style>
