export const SessionUtil = function() {
  this.sessionCacheKey = "cache-session";
  this.oldAuthCacheKey = "cache-old-auths";
  this.userCacheKey = "cache-user";

  this.setItem = function(name, value) {
    window.localStorage.setItem(name, JSON.stringify(value));
  };

  this.getItem = function(name) {
    var data = window.localStorage.getItem(name);
    try { data = JSON.parse(data); } catch (e) {
        return null;
    }
    return data;
  };

  this.initSession = function(res) {

    this.setItem(this.sessionCacheKey, res.data);
    window.cache_session = res.data;
  };
  this.getSession = function() {
    var session = window.cache_session;
    if (!session) {
      session = this.getItem(this.sessionCacheKey);
    }
    return session
  };
  
  this.removeSession = function () {
    localStorage.removeItem(this.sessionCacheKey)
    window.cache_session = null
    localStorage.clear();
  }

  this.getAccessToken = function (vue) { // 获取token
    var session = this.getSession()
    console.log("session=======>",session);
    if (session) {
      return session.access_token||session.token
    }
    return null
  }

  this.getAppId = function() { // 获取系统所属应用id

    return window.app_id;
}
  
  this.getCompanyUid = function(vue) { //当前登录人所属组织编码
    var session = this.getSession();
    if (session != null) {
        return session.company.id;
    }
    return null;
  };
  this.getCompanyId = function(vue) { //当前登录人所属组织编码
      var session = this.getSession();
      if (session != null) {
          return session.company.departId;
      }
      return null;
  };
  this.getCompanyName = function(vue) { //当前登录人所属组织编码
      var session = this.getSession();
      if (session != null) {
          return session.company.departName;
      }
      return null;
  };
  this.getUser = function() {
    var session = this.getSession();
    if (session&&session.user) {
      return session.user;
    }
    return null;
  };
  this.getUserId = function(vue) {
      var session = this.getSession();
      if (session != null) {
          return session.user.userId;
      }
      return null;
  };
  this.getUserUid = function(vue) {
      var session = this.getSession();
      if (session != null) {
          return session.user.id;
      }
      return null;
  };
  this.getUserName = function(vue) {
      var session = this.getSession();
      if (session != null) {
          return session.user.userName;
      }
      return null;
  };
  this.getCompanyName = function(vue) { //当前登录人所属组织编码
    var session = this.getSession();
    if (session != null) {
        return session.company.departName;
    }
    return null;
};
this.isAllowMenu = function(resourceId) { //是否有菜单权限
  return true;
  if ('/page/index' == resourceId) {
      return true;
  }
  //判断是否公司管理员
  //console.info("======isAllowMenu=====" + this.isCompanyAdmin());
  if (this.isAdmin()) {
      return true;
  }
  if (this.isCompanyAdmin()) {
      return true;
  }
  let data = {}
      // 判断是否是路由
  if (resourceId.startsWith('/')) {
      //判断某个资源路由是否有权限
      data = this.getMenus()
          // console.log(resourceId+'=========isAllowMenu========', data)
      if (data && data[resourceId]) {
          return true
      }

  } else {
      // 菜单编码
      data = this.getMenuCodes()
  }
  if(resourceId=="0201"){
      console.log(resourceId+'=========isAllowMenu========', data)
  }
  // console.log(resourceId+'=========isAllowMenu========', data)
  if (data != undefined && data != null) {
      if (data[resourceId] != undefined && data[resourceId] != null) {
          return true;
      }
  }
  return false
};
this.isAllowBtn = function(formKey, resourceId) { //是否有按钮权限
  return this.isAllow(formKey, resourceId)
};
this.isAllowAdd = function(formKey) { //是否有新增按钮权限
  return this.isAllow(formKey, 'btnAdd')
}
this.isAllowEdit = function(formKey) { //是否有编辑按钮权限
  return this.isAllow(formKey, 'btnEdit')
}
this.isAllowDelete = function(formKey) { //是否有删除按钮权限
  return this.isAllow(formKey, 'btnDelete')
}
this.isAllowExport = function(formKey) { //是否有导出按钮权限
  return this.isAllow(formKey, 'btnExport')
}
  /**
   * 兼容旧的做法
   * @param resourceId
   * @returns {boolean}
   */
this.isAllow = (formKey, resourceId) => {
  return true;
  if (this.isAdmin()) {
      return true
  }
  if (this.isCompanyAdmin()) {
      return true
  }
  if (resourceId) {
      let vm = util.vue || Vue
      if (validUtil.isNotNull(formKey)) {
          try {
              vm.$store.dispatch('getFormAuths', formKey)
              let auths = vm.$store.state.formAuths[formKey]
              // console.log('-----isAllow----auths--->>',auths )
              if (auths && auths[resourceId]) {
                  return true
              } else {
                  return false
              }
          } catch (error) {
              return false
          }

      }
  }
  // console.log('----------isAllow------end----')
  return false;
};
this.containRole = function(key) { //是否包含角色
  return true;
  var data = this.getRoles();
  if (data != undefined && data != null) {
      for (var i = 0; i < data.length; i++) {
          var role = data[i].roleId;
          if (role == key) {
              return true;
          }
      }
  }
  return false;
};
this.isAdmin = function() { //公司管理员
  if (this.containRole('ROLE_ADMIN')) {
      return true;
  }
  return false;
};
this.isCompanyAdmin = function() { //公司管理员
  if (this.containRole('ROLE_COMPANY_ADMIN')) {
      return true;
  }
  return false;
};
  
 
}

export const sessionUtil = new SessionUtil();
