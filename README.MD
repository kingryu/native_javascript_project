# Native Javascript Project Sample
# 原生Javascript示例项目

node v10


## Usage scenario
It can be used for the development of some small and medium-sized general components and module functions, such as payment components with UI interface, advertising display components, rapid login registration components, risk control components, etc 
In order to facilitate the use of each page site, the jsonp used by the network request project can be changed to a familiar network library according to the use of the situation

## 本项目用途
可用于一些中、小型通用组件、模块功能开发，比如带UI界面的支付组件，广告展示组件, 快速登录注册组件，风控组件等
为方便其他框架站点，接入使用，使用原生js开发，体积较小，不影响其他框架JQuery React  Vue等使用  网络请求项目用的jsonp，可以根据使用情况改成自己熟悉的网络库


## 
 init
 
 project =  new NativeJsProject(env:env,passHost:'.test.com',isHttp:true,userDomain:'hj',callback:loginSuccess,container:container)
 project.show()

 
 use deviceManagement.changeView(pageName) change page

 add page in views folder
 
 
