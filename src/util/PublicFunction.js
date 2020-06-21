import {MessageBox, Message} from 'element-ui'
import {Delete,getDelete} from '../api/index'

export const deleteMessage = (id, type) => {
  return MessageBox.confirm(`此操作将删除, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let result
    if (!type) {
      result = Delete({ids: id}, 'delete', type)
    }else if(type === 'role'){
      result = Delete({roleIds: id}, 'delete', type)
    }else if(type === 'permission'){
      result = Delete({permissionIds : id},'delete',type)
    }
    else {
      result = getDelete({id:id}, 'get', type)
    }
    return result
  }).catch(() => {
    Message({
      type: 'info',
      message: '已取消删除'
    });
  });
}
