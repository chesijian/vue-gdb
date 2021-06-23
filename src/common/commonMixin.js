
export const commonMixin = {
  data: function () {
    return {

    }
  },
  props: {

  },
  computed:{

  },
  created () {

  },
  mounted () {

  },
  methods: {
    getParam(key){
      if(this.$route.params){
        if(this.$route.params[key]){
          return this.$route.params[key];
        }
      }
      return null;
    },isNull(obj){
      if(obj === undefined || obj === ''){
        return true;
      }
      return false;
    },isNotNull(obj){
      return !isNull(obj);
    },
    openByName(name,params,query){
      let route = {name: name};
      if(params){
        route.params = JSON.parse(params);
      }
      if(query){
        route.query = JSON.parse(query);
      }
      // console.info('--------111-------'+typeof params)
      // console.info(route)
      // console.info(params);
      // this.$router.push(route);
      this.$router.push({
        name: name,
        params: route.params
      })
    },
    openByPath(path,query,params){
      let route = {path: path};
      if(params){
        route.params = params;
      }
      if(query){
        route.query = query;
      }
      console.info('--------222-------')
      this.$router.push(route);
    },warn(msg){
      this.util.warn(msg)
    },info(msg){
      this.util.info(msg)
    }
  }
}
