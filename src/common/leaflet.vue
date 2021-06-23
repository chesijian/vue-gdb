<template>

    <div >
        <remote-script src="../../static/js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
        <remote-script v-if="leafletLoaded" src="../../static/js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script>
        <div id="map" style="width: 100%; height: 600px; border: 1px solid #ccc"></div>
    </div>
</template>
<script>   
import { lmap } from '../../static/js/leaflet/lib/map.js';
import $ from 'jquery';

export default {
  props: ['config'],
  data() {
    return {
      leafletLoaded: false,
      leafletDrawLoaded: false

    };
  },
  created() {
    this.util.init(this);
    //console.info("unloading=======created========");
    //this.config =  this.defaultConfig;
  },
  activated() {
    //console.info("unloading=======activated========");
  },
  mounted() {
    //console.info("unloading=======mounted========");

  },
  methods: {
    loaded() {
        //this.cookieUtil.set('data','[]');
      if (this.leafletLoaded) {
          var data =  JSON.parse(this.cookieUtil.get('data'));
        var config = {
          tools: {
            polygon:false,//是否允许绘制多边形，不配置默认是允许
            rectangle:true,//是否允许绘制多边形，不配置默认是允许
            marker:false,//是否允许绘制多边形，不配置默认是允许
            save: false,//是否允许保存,不配置默认是允许
            edit: true//是否允许编辑，不配置默认是允许
          },
          listeners: {
            'layer:click' : this.onLmapLayerClick,
            'layer:created' : this.onLmapLayerCreated,
            'save' : this.onLmapSave
          },
          data: data,
          center: [512, 384],
          bounds: [1024, 768], //坐标范围
          imageUrl: 'http://5b0988e595225.cdn.sohucs.com/images/20170926/4ea260c083da4db6a244f84c4f247f4c.jpeg'
        };
        lmap.$ = $;
        //console.info( lmap.drawControl);
        //var defaultIcon = L.Icon.Default();
        //console.info(defaultIcon);
        
        lmap.getData();
        lmap.init(this,config);
      }
    },onLmapLayerClick(layer){
        console.info("======onLayerClick=====");
        console.info(layer);
    },onLmapLayerCreated(layer){
        console.info("======onLmapLayerCreated=====");
        console.info(layer);
    },onLmapSave(data){
        console.info("======onLmapSave=====");
        console.info(data);
        this.cookieUtil.set('data',JSON.stringify(data));

    }
  }
};
</script>
 
<style >
@import "../../static/js/leaflet/lib/leaflet.css";
@import "../../static/js/leaflet/lib/leaflet.draw.css";

</style>