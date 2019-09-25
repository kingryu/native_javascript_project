import {getQueryStringByName} from '../util/index.js'
let id = getQueryStringByName('id')
export default {
  userDomain:'hj',
  passHost:".test.com",//请求后端接口域名
  platform: 'pc', //平台类型pc 或h5
  language:'zh-CN',
  hideHeader:!!getQueryStringByName('hideHeader'),
  challengeEventId:id,
  isReplace:!!id,
  returnUrl:getQueryStringByName('return_url'),
  platform:'web'
}