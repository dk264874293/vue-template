import router from '@/router'
import { isURL } from '@/utils/validate'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 添加动态路由
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  let temp = []
  for (const item of menuList) {
    const { list, url, id, name, icon } = item
    if (list && list.length >= 1) {
      temp = temp.concat(list)
    } else if (url && /\S/.test(url)) {
      const repUrl = url.replace(/^\//, '')
      const route = {
        path: repUrl.replace('/', '-'),
        component: null,
        name: repUrl.replace('/', '-'),
        meta: {
          id: id,
          title: name,
          isDynamic: true,
          isTab: true,
          iframeUrl: '',
          icon: icon
        }
      }
      if (isURL(repUrl)) {
        route['path'] = `i-${id}`
        route['name'] = `i-${id}`
        route['meta']['iframeUrl'] = repUrl
        continue
      } else {
        try {
          route['component'] = require('@/views/' + url + '/index.vue').default// () => import('@/views/' + menuList[i].url + '/index.vue') || null
        } catch (e) {
          continue
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    const mainRoutes = {
      path: '/',
      component: Layout,
      name: 'main',
      redirect: '/' + (routes.length === 0 ? 'Login' : routes[0]['path']),
      meta: { title: '主入口整体布局' },
      children: routes
    }
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' }}
    ])
  }
  return routes
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const asyncRoutes = fnAddDynamicMenuRoutes(roles)// asyncRoutes
      // console.log(accessedRoutes, 'accessedRoutes')
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // asyncRoutes
      commit('SET_ROUTES', asyncRoutes.map(_ => _.path))
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
