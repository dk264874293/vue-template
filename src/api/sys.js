import request from '@/utils/request'

// 用户管理
// 获取用户列表
export function getSysUserList(username, page, limit) {
  return request({
    url: '/sys/user/getPage',
    method: 'get',
    params: {
      username, page, limit
    }
  })
}

// 获取单条数据
export function getSysUserGetOne(roleId) {
  return request({
    url: `/sys/user/getOne/${roleId}`,
    method: 'get'
  })
}

// 新增用户
export function setSysUserSave(data) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data
  })
}

// 修改用户
export function setSysUserUpdate(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data
  })
}

// 修改用户密码
export function setSysUserPassword(userId, password, newPassword) {
  return request({
    url: '/sys/user/password',
    method: 'post',
    data: {
      userId, password, newPassword
    }
  })
}

// 重置用户密码
export function setSysUserResetPwd(userId) {
  return request({
    url: '/sys/user/resetPwd',
    method: 'post',
    data: {
      userId
    }
  })
}

// 删除用户
export function delSysUserDelete(id) {
  return request({
    url: '/sys/user/delete?id=' + id,
    method: 'post'
  })
}

// 角色管理
// 获取角色列表
export function getSysRoleGetPage(roleName, page, limit) {
  return request({
    url: '/sys/role/getPage',
    method: 'get',
    params: {
      roleName, page, limit
    }
  })
}

// 获取所有角色列表
export function getSysRoleSelect() {
  return request({
    url: '/sys/role/select',
    method: 'get'
  })
}

// 获取单条数据
export function getSysRoleGetOne(id) {
  return request({
    url: `/sys/role/getOne/${id}`,
    method: 'get'
  })
}

// 新增角色
export function setSysRoleSave(data) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data
  })
}
// 修改角色
export function setSysRoleUpdate(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data
  })
}

// 删除角色
export function delSysRoleDelete(id) {
  return request({
    url: '/sys/role/delete?id=' + id,
    method: 'post'
  })
}

// 组织管理
// 获取组织列表
export function getSysPartyList() {
  return request({
    url: '/sys/party/list',
    method: 'get'
  })
}

// 组织新增
export function addSysPartySave(data) {
  return request({
    url: '/sys/party/save',
    method: 'post',
    data
  })
}

// 组织修改
export function setSysPartyUpdate(data) {
  return request({
    url: '/sys/party/update',
    method: 'post',
    data
  })
}

// 组织删除
export function delSysPartyDelete(id) {
  return request({
    url: `/sys/party/delete/${id}`,
    method: 'post'
  })
}

// 菜单管理
// 获取当前菜单列表
export function getSysMenuList() {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

// 获取菜单层级列表
export function getSysMenuSelect() {
  return request({
    url: '/sys/menu/select',
    method: 'get'
  })
}

// 获取路由详情
export function getSysMenuInfo(id) {
  return request({
    url: `/sys/menu/getOne/${id}`,
    method: 'get'
  })
}

// 新增菜单
export function addSysMenu(data) {
  return request({
    url: '/sys/menu/save',
    method: 'post',
    data
  })
}

// 修改菜单
export function changeSysMenu(data) {
  return request({
    url: '/sys/menu/update',
    method: 'post',
    data
  })
}

// 菜单删除
export function delSysMenuDelete(id) {
  return request({
    url: '/sys/menu/delete/' + id,
    method: 'post'
  })
}

// 系统日志
// 获取系统体制
export function getSysLogList(userName, current, size) {
  return request({
    url: '/sys/log/getPage',
    method: 'get',
    params: {
      userName, current, size
    }
  })
}

// 定时任务
export function getSysScheduleList(beanName) {
  return request({
    url: '/sys/schedule/list',
    method: 'get'
  })
}

// 文件上传
// 获取数据列表
export function getSysOssGetPage(page, limit) {
  return request({
    url: '/sys/oss/getPage',
    method: 'get',
    data: {
      page, limit
    }
  })
}

// 删除
export function defSysOssDelete(ids) {
  return request({
    url: '/sys/oss/delete',
    method: 'post',
    data: ids
  })
}

// 获取云详情
export function getSysOssConfig() {
  return request({
    url: '/sys/oss/config',
    method: 'get'
  })
}

// 提交云详情
export function setSysOssSaveConfig(data) {
  return request({
    url: '/sys/oss/saveConfig',
    method: 'post',
    data
  })
}
