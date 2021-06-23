<template>
  <div class="box" style="background: #000;">
    <div class="mask-box" @click.stop.prevent="cancel"></div>
    <div class="querter-box">
      <div style="height:40px;margin:5px 0 0 5px;">
        <input
          id="tipinput"
          style="width:90%;height:38px;border:1px solid #ccc;text-indent:5px;"
          type="text"
          v-model="searchValue"
          @keyup.enter="handleClick"
          placeholder="请输入地址查询"
        />
        <i></i>
        <el-button @click="handleClick">搜索</el-button>
      </div>
      <div class="mymap" id="container"></div>
      <!-- <div class="input-card">
        <div class="leftbtn">
          <el-button type="primary" round size="small" @click="drawPolygon">绘制多边形</el-button>
          <el-button type="primary" round size="small" @click="drawpoin">地图选点</el-button>
          <el-button type="primary" round size="small" @click="clearall">清除</el-button>
        </div>
        <div class="righttext">备注：绘制多边形时点击右键结束绘制</div>
      </div> -->
      <div style="overflow:auto;height:50px">
        <div>
          <h4 style="color:#000;font-weight:400;margin-top:20px;font-size:17px;">{{tempObj.address}}</h4>
        </div>
      </div>

      <div class="pop-footBtn">
        <el-button @click="close" size="small">关闭</el-button>
        <el-button type="warning" size="small" @click="addAddress">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import 'https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js';
import { mapState, mapActions } from "vuex";
var map;
var circle;
var geolocation;
var geocoder;
var markers = [];
var searchService;
var mouseTool;
var auto;
export default {
  name: "chooseAddress",
  data() {
    return {
      searchValue: "",
      addressVisible: false,
      tempObj: {points:[]},
      items: {
        textAlign: "left",
        padding: "0 10px",
        minHeight: "1.6rem",
        height: "auto",
        borderBottom: "1px solid #ccc",
        paddingLeft: "28px",
        position: "relative"
      },
      ifRenderMarker: false //是否渲染标记
    };
  },
  components: {
    // Search,XButton,Checklist,Icon
  },
  computed: {
    ...mapState({
      username: state => state.username,
      userUid: state => state.userUid,
      curLng: state => state.curLng,
      curLat: state => state.curLat
    })
  },
  watch: {},
  props: ["address", "location"], 
  mounted() {
    // const oScript = document.createElement("script");
    // oScript.type = "text/javascript";
    // oScript.src =
    //   "https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js";
    // document.body.appendChild(oScript);
      this.init();
  },
  methods: {
    init() {
      let that = this;
      let centerArr = [113.322463, 23.12635];
      let zoomNum = 10;
      if (this.location) {
        let location = this.location;
        centerArr = location.split(",");
        zoomNum = 18;
      } else {
        console.log("使用默认值初始化地图");
      }
      map = new AMap.Map("container", {
        center: centerArr,
        resizeEnable: true,
        zoom: zoomNum
      });
      
      // 查询模块============
      AMap.plugin("AMap.PlaceSearch", function() {
        searchService = new AMap.PlaceSearch({
          map: map
        });
      });
      //输入提示
    //   let autoOptions = {
    //     input: "tipinput"
    //   };
    //   AMap.plugin("AMap.Autocomplete", function() {
    //     auto = new AMap.Autocomplete(autoOptions);
    //   });

    //   AMap.event.addListener(auto, "select", function(event) {
    //     searchService.setCity(event.poi.adcode);
    //     searchService.search(event.poi.name); //关键字查询查询
    //   });
      AMap.event.addListener(searchService, "markerClick", function(e){
        console.log('当前marker的经纬度信息',e.data.location);//当前marker的经纬度信息
        that.searchAddress(e.data.location);
      });
      
      AMap.plugin("AMap.Geocoder", function() {
        geocoder = new AMap.Geocoder({
          //city: "010"//城市，默认：“全国”
        });
      });
	  map.on("click", this.showInfoClick);

    },
    searchAddress(lnglat) {
      //添加数据
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === "complete" && result.info === "OK") {
          //获得了有效的地址信息:即，result.regeocode.addressComponent
          var item = {
            check: false,
            name: result.regeocode.addressComponent.street,
            province: result.regeocode.addressComponent.province,
            city: result.regeocode.addressComponent.city,
            county: result.regeocode.addressComponent.district,
            address: result.regeocode.formattedAddress,
            location: lnglat.lng + "," + lnglat.lat,
            lngitude: lnglat.lng,
            latitude: lnglat.lat,
            points:this.tempObj.points
          };
          this.tempObj = item;
        } else {
          //获取地址失败
          this.util.error("获取地址失败");
          console.debug("获取地址失败");
        }
      });
    },
    renderMarker(latLng) {
      map.setCenter(latLng);
      //设置当前位置
      var marker = new AMap.Marker({
        position: latLng,
        map: map
      });
      //清空数组
      var overlay;
      while ((overlay = markers.pop())) {
        overlay.setMap(null);
      }

      //添加数据
      markers.push(marker);
      // if(this.ifRenderMarker){
      // 	map.setCenter(latLng);
      // 	//设置当前位置
      // 	var marker = new qq.maps.Marker({
      // 		map : map,
      // 		position : latLng
      // 	});
      // 	//清空数组
      // 	var overlay;
      // 	while (overlay = markers.pop()) {
      // 		overlay.setMap(null);
      // 	}
      // 	//添加数据
      // 	markers.push(marker);
      // }
    },
    handleClick() {
      var _this = this;
      if (this.validUtil.isNotEmpty(this.searchValue)) {
        this.tempObj = {};
        this.ifRenderMarker = true;
        // searchService.setPageCapacity(15);
        searchService.search(this.searchValue);
      }
    },
    // locationAgain(location, range) {
    //   var _this = this;
    //   if (!this.util.isNotEmpty(location)) {
    //     return;
    //   }
    //   var locations = location.split(",");
    //   var region = new qq.maps.LatLng(locations[1], locations[0]);
    //   map.setCenter(region);
    //   this.ifRenderMarker = true;
    //   this.renderMarker(region);
    //   this.searchAddress(region);
    // },
    close() {
      this.address.addressVisible = false;
    },
    addAddress() {
      if (this.tempObj.location == undefined) {
        this.util.error("请选择一个地点！");
        return;
      }
      let location = this.tempObj.location;
      let province = this.tempObj.province;
      let city = this.tempObj.city;
      let county = this.tempObj.county;
      let points = this.tempObj.points;
      this.address.addressVisible = false;
      this.$emit("chooseAddress", {
        address: this.tempObj.address,
        addressLocation: location,
        province: province,
        city: city,
        county: county,
        points:points
      });
    },
    showInfoClick(event) {
      this.renderMarker(event.lnglat);
      this.searchAddress(event.lnglat);
    }
  }
};
</script>
<style>
.amap-sug-result {
  left: calc((100vw - 1060px) / 2) !important;
  top: calc((100vh - 600px) / 2 + 40px) !important;
  position: fixed;
  z-index: 3200;
  background-color: #fefefe;
  border: 1px solid #d1d1d1;
}
</style>
<style scoped>
/* .head,.mymap{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
} */
span:before {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR…f81+TuKpc3NI9dzSb6ylk1k/9Cm+krTnka/mxKvXW5Ufs3VqBHBb9drYAAAAAASUVORK5CYII=)
    no-repeat 0 0;
  position: absolute;
  content: "";
  left: 0;
  width: 22px;
  height: 22px;
  top: 1px;
}
.mask-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3099;
}
.querter-box {
  width: 1060px;
  transform: translate(-50%, -50%);
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  height: 600px;
  z-index: 3100;
  overflow: hidden;
  color: #333;
  text-align: left;
}

.pop-footBtn {
  position: absolute;
  bottom: 3px;
  right: 20px;
  height: 45px;
  line-height: 45px;
}
.mymap {
  /* top: 44px; */
  height: 460px;
}
.icon-success {
  position: absolute;
  left: 3px;
  top: 14px;
}
.icon-success::before {
  margin: 0 !important;
}
.input-card {
  width: 600px;
  display: flex;
  justify-content: space-around;
}
.righttext {
  height: 33px;
  line-height: 33px;
}

/* #check-my-map .el-radio{
	position: relative
}
#check-my-map .el-radio__input{
	position: absolute;
    left: -23px;
    top: 21px;
}
#check-my-map .el-radio__label{
	display: block;
	padding-top:15px;
} */
</style>
