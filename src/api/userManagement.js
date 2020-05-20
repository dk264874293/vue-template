import request from '@/utils/request'

// 标签管理
// 获取标签列表
export function getSysLabelList(key, current, size) {
  return request({
    url: '/label/getPage',
    method: 'post',
    data: {
      key, current, size
    }
  })
}

// 获取单条数据
export function getSysLabelGetOne(roleId) {
  return request({
    url: `/label/getOne/${roleId}`,
    method: 'get'
  })
}

// 新增标签
export function setSysLabelSave(data) {
  return request({
    url: '/label/save',
    method: 'post',
    data
  })
}

// 修改标签
export function setSysLabelUpdate(data) {
  return request({
    url: '/label/update',
    method: 'post',
    data
  })
}

// 删除标签
export function delSysLabelDelete(id) {
  return request({
    url: '/label/delete',
    method: 'post',
    data: [id]
  })
}

// 获取分组列表
export function getOrganizeList() {
  return request({
    url: '/organize/list',
    method: 'get'
  })
}

// 创建分组
export function setOrganizeSave(name) {
  return request({
    url: '/organize/save',
    method: 'post',
    data: {
      name
    }
  })
}
