export const SaveUserInfo = (state,UserInfo) => {
  if(UserInfo){
    state.UserInfo = UserInfo.user
    state.UserToken = UserInfo.token
    localStorage.setItem('userInfo',JSON.stringify(UserInfo.user))
    localStorage.setItem('userToken',UserInfo.token)
  }else if(UserInfo === null) {
    localStorage.setItem('userInfo','')
    localStorage.setItem('userToken','')
    state.UserInfo = ''
    state.UserToken = ''
  }
}

export const SaveJurisdiction = (state,UserJurisdiction) => {

}

