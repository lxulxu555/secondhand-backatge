const menuList = [
  {
    title : '用户管理',
    key : '/user',
    icon : 'el-icon-user-solid',
  },
  {
    title : '管理员管理',
    key : '/admin',
    icon : 'el-icon-s-tools',
  },
  {
    title : '商品',
    key : '/products',
    icon : 'el-icon-s-goods',
    children : [
      {
        title : '品类管理',
        key : '/category',
        icon : 'bars',
      },
      {
        title : '商品管理',
        key : '/product',
        icon : 'tool',
      }
    ]
  },
  {
    title : '角色管理',
    key : '/role',
    icon : 'el-icon-lock',
  },
  {
    title : '权限管理',
    key : '/jurisdiction',
    icon : 'el-icon-key'
  }
]

export default menuList
