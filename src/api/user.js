import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function getRouter() {
  return request({
    url: '/sys/menu/nav',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
