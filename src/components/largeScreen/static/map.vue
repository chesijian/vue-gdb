<template>
    <div :id="id"></div>
</template>

<script>
var map = null,
    markers = [],
    geocoder = null,
    infoWindow = null;


export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        mapModel:{
            type:Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            heatmap: {},
            defaultIcon: require("@/assets/image/indexImg/site.png"),
            noProjIcon: require("@/assets/image/indexImg/position.png"),
        }
    },
    mounted() {
        this.$nextTick(()=> {
            this.initMap(this.id);
        })
    },
    watch: {
        mapModel(val) {
            console.log("mapModel=====",val)
            this.initMap(this.id);
        }   
    },
    methods: {
        initMap(id) {
            var _this = this,
                centerPosition;
            // if(this.mapModel.positionArr) {
            //     centerPosition = this.mapModel.positionArr[0].addrLocation.split(',');
            // }
			map = new AMap.Map(id, {
				center: [117.000923, 36.675807],
				resizeEnable: true,
				// layers: [new AMap.TileLayer.Satellite()],//卫星图
				zoom: 4
            });
            
            map.setMapStyle('amap://styles/blue');
            if(this.mapModel.mapType != undefined && this.mapModel.mapType == "heatmap"){
                //实例化热力图
                map.plugin(["AMap.Heatmap"], function() {
                    //初始化heatmap对象
                    _this.heatmap = new AMap.Heatmap(map, {
                        radius: 25, //给定半径
                        opacity: [0, 0.9]
                    });
                });
               if(Object.keys(_this.heatmap).length != 0) {
                   _this.heatmap.setDataSet({
                        data: _this.mapModel.heatmapData,
                        max: 3
                    });
               }
            }
            if(this.mapModel.positionArr != undefined && this.mapModel.positionArr.length != 0){
                this.initMarkers();
            }
            
        },
        initMarkers(mapData){
            mapData.forEach(item=>{
                if(item.location != undefined){
                    var markerPosition = item.location.split(",");
                    if(item.type && item.type == 2) {
                        var marker = new AMap.Marker({
                            icon: this.noProjIcon,
                            position: [markerPosition[0], markerPosition[1]]
                        });
                    } else {
                        var marker = new AMap.Marker({
                            icon: this.defaultIcon,
                            position: [markerPosition[0], markerPosition[1]]
                        });
                    }
                    marker.data = item;
                    marker.on('click', this.showInfoC);
                    map.add(marker);
                }
                
            });
        },
        showInfoC(e){
            this.mapModel.callBack(e.target.data)
        }
    },
    watch: {
        id(newVal) {
            if(newVal) {
                setTimeout(()=> {
                    this.initMap(newVal);
                },500)
            }
        }
    }
}
</script>


