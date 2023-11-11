<template>
  <div class="amap-container">
    <el-amap ref="map"
             :center="amap.center"
             :zoom="amap.zoom"
             @init="initMap"
             @click="clickMap">
      <!-- 比例尺 -->
      <el-amap-control-scale :visible="true"></el-amap-control-scale>
      <!-- 缩放 -->
      <el-amap-control-tool-bar :visible="true" position="RB" :offset="[30, 200]"></el-amap-control-tool-bar>
      <!-- 旋转 -->
      <el-amap-control-control-bar :visible="true" position="LT" :offset="[20, 80]"></el-amap-control-control-bar>
      <!-- 地图类型切换 -->
      <el-amap-control-map-type :visible="true"></el-amap-control-map-type>
      <!-- 鹰眼切换 -->
      <el-amap-control-hawk-eye :visible="true"></el-amap-control-hawk-eye>
      <!-- POI搜索 -->
      <el-amap-search-box :visible="true" @select="selectPoi" @choose="choosePoi"></el-amap-search-box>
      <!-- 地图标点 -->
      <el-amap-marker v-for="(marker, index) in amap.markers" :key="index" :position="marker.position"></el-amap-marker>
      <!-- 定位 -->
      <el-amap-control-geolocation :visible="true" position="RB" :offset="[180, 20]"></el-amap-control-geolocation>
    </el-amap>
    <div class="amap-dialog" v-if="amap.address">
      <h5>{{ amap.center }}</h5>
      <h6>{{ amap.address }}</h6>
    </div>
    <div class="amap-button" v-if="amap.address">
      <el-button type="primary" @click="handleSelectAddress">选择此地址</el-button>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue';

let amap = reactive({
  center: null,
  address: '',
  zoom: 16,
  markers: null,
  geocoder: null,
});

let addressResult = reactive({
  longitude: null, //经度
  latitude: null, //纬度
  address: '', //完整地址
  adcode: null, //编码
  province: null,
  city: null,
  cityCode: null,
  district: null,
});
// 鼠标点击或者回车选中某个POI信息时触发此事件
const selectPoi = (e) => {
  const poi = e.poi;
  addPointer([poi.location.lng, poi.location.lat]);
};

// 鼠标或者键盘上下键选择POI信息时触发此事件
const choosePoi = (e) => {
  addPointer([e.poi.location.lng, e.poi.location.lat]);
};

// 地图初始化完成
const initMap = (e) => {
  // e 是地图实例
  amap.geocoder = new window.AMap.Geocoder();
};

// 地图点击事件
const clickMap = (e) => {
  addPointer([e.lnglat.lng, e.lnglat.lat]);
};

// 地图缩放
const zoomchange = (e) => {
  amap.zoom = e.target.getZoom();
};

// 增加标点
const addPointer = (position) => {
  // 改变中心位置
  amap.center = position;
  addressResult = {}
  addressResult.longitude = position[0]
  addressResult.latitude = position[1]
  // 添加标点
  amap.markers = [{
    position,
    id: Math.ceil(Math.random() * 1000),
  }];
  // 放大
  amap.zoom = 17;
  amap.geocoder.getAddress(position, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      // result为对应的地理位置详细信息
      // 完整地址
      amap.address = result.regeocode.formattedAddress;
      addressResult.address = result.regeocode.formattedAddress;
      // 地址邮编
      addressResult.adcode = result.regeocode.addressComponent.adcode;
      // 省份
      addressResult.province = result.regeocode.addressComponent.province
      // 城市
      addressResult.city = result.regeocode.addressComponent.city
      addressResult.cityCode = result.regeocode.addressComponent.citycode
      // 县
      addressResult.district = result.regeocode.addressComponent.district
    }
  });
};

const handleSelectAddress = (e) => {
  console.log(addressResult)
}
</script>

<style scoped>
.amap-container {
  height: 500px;
  border-radius: 1rem;
  background-color: transparent !important;
  position: relative;

  .amap-dialog {
    position: absolute;
    left: 50%;
    top: 16px;
    text-align: center;
    padding: 0.5rem;
    transform: translate(-50%, 0);
    background-color: rgba(242, 242, 243, 0.5) !important;
    border-radius: 0.5rem !important;
    backdrop-filter: blur(10px);
    box-shadow: rgba(0, 0, 0, 0.133) 0 1.6px 3.6px 0, rgba(0, 0, 0, 0.11) 0 0.3px 0.9px 0;
  }

  .amap-button {
    position: absolute;
    left: 50%;
    bottom: 1rem;
    text-align: center;
    padding: 0.5rem;
    transform: translate(-50%, 0);
    background-color: rgba(242, 242, 243, 0.5) !important;
    border-radius: 0.5rem !important;
    backdrop-filter: blur(10px);
  }
}
</style>
