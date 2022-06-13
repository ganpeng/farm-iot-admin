import router from './routers';
import wsCache from '@/util/webStorage';

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['Login'];

/**
 * 关于路由的方法集合
 * @type {{isWhitePage: ((value))}}
 */
let routerUtil = {
  /**
   *Judge the current page if somebody can access to without token and permission
   * @param routerName a router name
   * @return {Boolean}
   */
  isWhitePage(routerName) {
    for (let i = 0; i < whitePagesList.length; i++) {
      if (routerName === whitePagesList[i]) {
        return true;
      }
    }
    return false;
  }
};

// 定义路由钩子函数，跳转时定义路由导航
router.beforeEach((to, from, next) => {
  let token = wsCache.localStorage.get('login') && wsCache.localStorage.get('login').token;
  // 白名单而且没有token,直接跳转
  if (routerUtil.isWhitePage(to.name) && !token) {
    next();
    // 白名单但是存在token,跳转到首页,防止手动更改url
  } else if (routerUtil.isWhitePage(to.name) && token) {
    next({name: 'Dashboard'});
    // next();
    // 非白名单且不存在token，跳转到登录页面
  } else if (!token) {
    next({name: 'Login'});
    // 非白名单、存在token、存在跳转路由，直接跳转
  } else if (to.name) {
    next();
    // 非白名单、存在token、不存在跳转路由，跳转到404页面
  } else {
    next({name: 'ErrorNotFound'});
  }
});

export default router;
