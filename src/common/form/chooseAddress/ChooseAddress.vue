<template>
	<div class="box" style="background: #000;">
		<div class="mask-box" @click.stop.prevent="cancel"></div>
		<div class="querter-box">
			<!-- <div style="height:40px">
				<input  v-model="searchValue" placeholder="搜索" type="search" v-on:keyup.enter.native="handleClick"></input>
			</div> -->
			<div style="height:40px">
				<input style="width:90%;height:40px" type="text" v-model="searchValue" @keyup.enter="handleClick">
				<i></i>
				<button @click="handleClick">搜索</button>
			</div>
			<div class="mymap" id="container"></div>
			<div style="overflow:auto;height:50px">
				<!-- 此处循环, 后端返回的 数组 -->
				<!-- <div @click="checkItem(item)" v-for="(item,index) in pointLists" > -->
					<div>
						<h4 style="color:#000;font-weight:400;margin-top:20px;font-size:17px;">{{tempObj.address}}</h4>
						<!-- <span style="color:#B1A6A6;font-weight:400;margin-bottom:3px;font-size:14px;">{{item.address}}</span> -->
					</div>
				<!-- </div> -->
			</div>
			
			<div class="pop-footBtn">
				<el-button @click="close" size="small">关闭</el-button>
                <el-button type="warning" size="small" @click="addAddress">保存</el-button>
			</div>
			
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
var map;
var circle;
var geolocation;
var geocoder;
var markers=[];
var searchService;
export default {
  name: 'chooseAddress',
  data () {
    return {
		searchValue:'',
		addressVisible: false,
		tempObj:{},
		pointLists:[],
		items: {
			textAlign: 'left',
			padding: '0 10px',
			minHeight:'1.6rem',
			height:'auto',
			borderBottom: '1px solid #ccc',
			paddingLeft: '28px',
			position: 'relative',
		},
		ifRenderMarker:false  //是否渲染标记
		 
    }
  },
  components:{
    // Search,XButton,Checklist,Icon
  },
	computed: {
  	...mapState({
  			username: state => state.username,
			userUid: state => state.userUid,
  			curLng: state => state.curLng,
			curLat: state => state.curLat
			
  	}),
  },
  watch:{
		
  },
  props: ['address'],
	mounted() {
			this.init();
  },
  created(){
	//   circle = new AMap.Circle({
	// 		// center: [locations[0],locations[1]],
	// 		radius: 100,
	// 		fillOpacity:0.2,
	// 		map: map
	// 	});
  },
  methods: {
	init() {
		var _this = this;
		map = new qq.maps.Map(document.getElementById('container'),{
			// center: center,
			zoom: 4
		});
		geocoder = new qq.maps.Geocoder();
		searchService = new qq.maps.SearchService({
			complete : function(results){
				console.log(results);
				var pois = results.detail.pois;
				_this.renderMarker(pois[0].latLng);
				for(var i = 0,l = pois.length;i < l; i++){
					var poi = pois[i];
					var item ={
						check:false,
						name:pois[i].name,
						address:pois[i].address,
						location:pois[i].latLng.getLng()+","+pois[i].latLng.getLat()
					};
					// _this.pointLists.push(item);
					
				}
			}
		});
		qq.maps.event.addListener(map, 'click', (e)=> {
			//设置当前位置
			var marker = new qq.maps.Marker({
				map : map,
				position : e.latLng
			});
			//清空数组
			var overlay;
			while (overlay = markers.pop()) {
				overlay.setMap(null);
			}
			//添加数据
			markers.push(marker);
			this.searchAddress(e.latLng);

		});
			
	},
	searchAddress(latLng){
		var keyword = "公司";
		this.pointLists=[];
		this.ifRenderMarker=false;
		//对指定经纬度进行解析
		geocoder.getAddress(latLng);
		//设置服务请求成功的回调函数
		geocoder.setComplete((result)=> {
			console.log(result);
			var addressObj= result.detail.addressComponents;
			var address= addressObj.province+addressObj.city+addressObj.district+addressObj.town+addressObj.street;
			var location = result.detail.location;
			var item ={
				check:false,
				province: addressObj.province,
				city: addressObj.city,
				county: addressObj.district,
				name:result.detail.address,
				address:address,
				location:location.getLng()+","+location.getLat()
			};
			// this.pointLists.push(item);
			this.tempObj=item;
		});
	
		// searchService.setPageCapacity(15);
		// searchService.searchNearBy(keyword, latLng, 8000);
	},
	renderMarker(latLng){
		if(this.ifRenderMarker){
			map.setCenter(latLng);
			//设置当前位置
			var marker = new qq.maps.Marker({
				map : map,
				position : latLng
			});
			//清空数组
			var overlay;
			while (overlay = markers.pop()) {
				overlay.setMap(null);
			}
			//添加数据
			markers.push(marker);
		}
	},
	handleClick() {
		var _this=this;
		if (this.validUtil.isNotEmpty(this.searchValue)) {
			this.pointLists=[];
			this.tempObj={};
			this.ifRenderMarker=true;
			searchService.setPageCapacity(15);
			searchService.search(this.searchValue);
		}
		
	},
	locationAgain(location,range){
		var _this = this;
		if(!this.util.isNotEmpty(location)){
			return;
		}
		var locations = location.split(",");
		var region = new qq.maps.LatLng(locations[1],locations[0]);
		map.setCenter(region);
		this.ifRenderMarker=true;
		this.renderMarker(region);
		this.searchAddress(region);
		
	},
	checkItem(item){
			console.log(item);
			this.tempObj=item;
			var location = item.location.split(",");
			var region = new qq.maps.LatLng(location[1],location[0]);
			this.ifRenderMarker=true;
			this.renderMarker(region);
			
	},
	close(){
		
		this.address.addressVisible = false;
	},
	addAddress(){
		if(this.tempObj.location==undefined){
			this.util.error("请选择一个地点！");
			return;
		}
		var location =  this.tempObj.location;
		var province =  this.tempObj.province;
		var city =  this.tempObj.city;
		var county =  this.tempObj.county;
		this.address.addressVisible = false;
		this.$emit('chooseAddress',{address: this.tempObj.address,addressLocation: location,province:province,city:city,county:county});
		 
	}
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .head,.mymap{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
} */
span:before {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR…f81+TuKpc3NI9dzSb6ylk1k/9Cm+krTnka/mxKvXW5Ufs3VqBHBb9drYAAAAAASUVORK5CYII=) no-repeat 0 0;
    position: absolute;
    content: "";
    left: 0;
    width: 22px;
    height: 22px;
    top: 1px;
}
.mask-box{
    width: 100%;height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3099;
}
.querter-box{
    width: 1060px;
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 600px;
    z-index: 3100;
    overflow: hidden;
    color: #333;
    text-align: left
}

.pop-footBtn{
	position: absolute;
    bottom: 3px;
    right: 20px;
    height: 45px;
    line-height: 45px;
}
.mymap{
	/* top: 44px; */
	height: 460px;
}
.icon-success{
	position: absolute;   
	left: 3px;
    top: 14px;
}
.icon-success::before{
	margin:0!important;
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
