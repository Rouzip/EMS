import uuidv1 from 'uuid/v1'


/***
* 登录凭证cookie
*/
export const uid = uuidv1()


/***
* @param {
  user: string,
  password: string
}
* @result bool
* 判断密码是否正确
*/
export function chkPwd(body) {
  let userInfo = body
  console.log(userInfo)
  if (userInfo.user !== '1111' || userInfo.password !== '1111') {
    return false
  } else {
    return true
  }
}



/***
* @param ctx, next
* @result yes: next() no: bool(false)
* 通过验证密码，返回消息，是否允许登录
*/
export async function checkLogin(ctx, next) {
  let body = ctx.request.body
  let result = chkPwd(body)
  console.log(result)
  if (result) {
    ctx.cookies.set('uid', uid)
    ctx.response.body = {
      'message': 'yes'
    }
    next()
  } else {
    ctx.response.body = {
      'message': 'no'
    }
  }
}

/***
* @param ctx
* 删除cookie
*/
export async function logout(ctx) {
  ctx.cookies.set('uid', '/')
}