import http from './http'

//获取所有用户
export const getAllUser = (data, method) => {
  return http.get('user/findAll', data, method).then(res => {
    return res.data
  })
}

//delete删除接口
export const Delete = (data, method, type) => {
  let url
  if (type === 'role') {
    url = 'token/role/delete'
  } else if (type === 'permission') {
    url = 'token/permission/delete'
  } else {
    url = 'user/delete'
  }
  return http.delete(url, data, method).then(res => {
    return res.data
  })
}

//get删除接口
export const getDelete = (data, method, type) => {
  let url
  if (type === 'oneClass') {
    url = 'classify1/delete'
  } else if (type === 'twoClass') {
    url = 'classify2/delete'
  } else if (type === 'product') {
    url = 'goods/deleteGoods'
  }
  return http.get(url, data, method).then(res => {
    return res.data
  })
}

//更新用户信息
export const UpdateUser = (data, method) => {
  return http.put('user/update', data, method).then(res => {
    return res.data
  })
}

//获取所有管理员
export const getAdmin = (data, method) => {
  return http.get('user/findAll', data, method).then(res => {
    return res.data
  })
}

//查找所有角色
export const getRole = (data, method) => {
  return http.get('token/role/findByPage', data, method).then(res => {
    return res.data
  })
}

//查找该管理员已拥有的角色
export const FindRoleById = (data, method) => {
  return http.get('user/findRoleById', data, method).then(res => {
    return res.data
  })
}

//给管理员添加角色
export const AddRoleToUser = (data, method) => {
  http.post('user/addRoleToUser', data, method)
}

//给管理员移除角色
export const DeleteRoleToUser = (data, method) => {
  http.delete('user/deleteRoleToUser', data, method)
}

//添加管理员
export const AddAdmin = (data, method) => {
  return http.post('user/saveAdmin', data, method).then(res => {
    return res.data
  })
}

//获取一级分类
export const getOneClass = (data, method) => {
  return http.get('classify1/findClassify1', data, method).then(res => {
    return res.data
  })
}

//修改一级分类
export const UpdateOneClass = (data, method) => {
  return http.put('classify1/update', data, method).then(res => {
    return res.data
  })
}

//添加一级分类
export const AddOneClass = (data, method) => {
  return http.post('classify1/add', data, method).then(res => {
    return res.data
  })
}

//修改二级分类
export const UpdateTwoClass = (data, method) => {
  return http.put('classify2/update', data, method).then(res => {
    return res.data
  })
}

//添加二级分类
export const AddTwoClass = (data, method) => {
  return http.post('classify2/add', data, method).then(res => {
    return res.data
  })
}

//根据一级分类ID获取二级分类详情
export const FindChildClassById = (data, method) => {
  return http.get('classify1/findChildById', data, method).then(res => {
    return res.data
  })
}

//获取所有商品
export const getAllProduct = (data, method) => {
  return http.get('goods/findByPage', data, method).then(res => {
    return res.data
  })
}

//查找所有权限
export const getPermission = (data, method) => {
  return http.get('token/permission/findByPage', data, method).then(res => {
    return res.data
  })
}

//查看该角色已有权限
export const findPermissionById = (data, method) => {
  return http.get('token/role/findById', data, method).then(res => {
    return res.data
  })
}

//给角色添加权限
export const addPermissionByRoleId = (data, method) => {
  http.post('token/role/addPermissionByRoleId', data, method)
}

//给角色移除权限
export const deletePermissionToRole = (data, method) => {
  http.delete('token/role/deletePermissionToRole', data, method)
}

//添加角色
export const AddRole = (data, method) => {
  return http.post('token/role/save', data, method).then(res => {
    return res.data
  })
}

//添加权限
export const AddPermision = (data,method) => {
  return http.post('token/permission/save',data,method).then(res => {
    return res.data
  })
}
