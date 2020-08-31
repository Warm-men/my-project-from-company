# Wechat开发注意事项

# 开发调试
* 开发环境
  * Node需要大于等于11的版本；
  * 如果遇到成功跑完项目，但是浏览器打开项目报错发送杂乱无章的数据，无法打开页面；
    * 打开谷歌浏览器的chrome://flags/；
    * 搜索localhost，找到Allow invalid certificates for resources loaded from localhost.
    * 将它改为Enabled;
  
* 切换环境
  * 目前有Dev和Staging环境，Dev主要是开发，Staging是上线前的环境，测试使用更多；
  * 切换步骤
    * config目录下的proxyConfig.js, proxy的'/api'改为https://wechat-dev.letote.cn，则为Dev环境；
    * config目录下的proxyConfig.js, proxy的'/api'改为https://wechat-staging1.letote.cn，则为Staging环境；
    * 切换时记得重新启动Webpack，npm run start；
    * 其他ProxyConfig，一般情况下不需要动，如需要的话：/hps(json配置文件)，/market(市场接口)，/sf(顺丰快递)

* 微信调试
  * 本地调试直接用Chrome既可完成，但微信开发工具无法使用本地调试，所以需要部署之后才能调试；
    * 部署个人分支步骤
      * 切一个自己的分支，如(dev-1412)；
      * 找到.circleci目录下的config.yml；
      * 修改workflows下的branches，将默认的master改为自己的分支(dev-1412)；
      * 修改完自己需要提交的代码，需要将config.yml也一起git commit上去；
      * 到github里面需要提PR(注意一定要提PR，只有提了才会部署自己的分支)；

    * 微信调试(需要部署)
      * 目前是直接通alert，console即可打印对应的信息；
      * 有第三方插件，vconsole-webpack-plugin、wxapp-webpack-plugin等，目前没有引入，但是需要的话Webpack还是有一些调试插件；
      * 如调试微信Api，可以直接在微信开发工具中看到一些官方console，但准确性有待考究；

# 打包体积
* Actions
  * 首页有引用Actions，导致很多没用的Actions在首页进行加载；
  * 如不公用或多处使用的Actions，可以写在app-actions-independent文件目录下，单独引用；
  * 或可以直接写在对应组件或界面中；

* Graphql-Query
  * 与Actions相同情况；
  * 如不公用或多处使用的Actions，可以单独引用，不要放到queries或可以直接写在对应组件或界面中；

* 所有第三方库
  * 一切第三方库需要与团队进行沟通才可以引用，避免加大项目体积；
  * 现有的recompose、classnames意义不大，不可再使用，尽可能清理；
  * 需要用到的库，考虑按需加载和打包体积，具体可参考date-fns，import { x } from 'date-fns'，不要直接import DateFns from 'date-fns'

* React-Lazy
  * 使用Lazy可以对加载的组件进行分包，在一些场景下如非会员首页的部分组件，在首页会员是不可能出现就可以Lazy处理；
  * 需要注意过度分包，因为多次下载Js，可能会反过来在网络上影响了速度；
  * 具体例子可以看HomePage；

* Webpack
  * Webpack目前是直接跑Create-React-App，因为大部分需要用的插件都已经添加好，然后对Webpack配置项进行了部分调整；
  * 建议尽可能更新最新的Webpack的大版本，对于打包体积应该有帮助；

# Service Worker
  * SW，在目前Webpack配置中有插件，也打包出来相对应的Js代码，应该可以使用；
    * 但项目中改了process.env.PUBLIC_URL(https://static.letote.cn/)，将Js、Css等文件分离开放到Cdn;
    * 注册SW时需要正常的域名(https://wechat.letote.cn)，所以目前没有使用到SW，修改好service-worker.js的注册Url应该就可以使用；
    * 必须要重点了解SW才能使用，因为如果没有处理好SW的Update等情况，可能存在网站不更新的情况；
    * 推荐找机会去完成SW的配置和使用，提高用户体验；

# 微信Api(SDK-1.3.2)
  * 微信分享
    * 目前用的1.3.2版本，1.4.0版本的分享等Api有改动，需不需要更新由团队决定；
    * 特殊情况的分享，项目中遇到过去某个路由下然后分享不对，如confirm-totes-success、referral；
    * 可以考虑使用window.location.href(replace)来跳转而不是路由，具体原因并没详细去挖掘；
    * 可以看confirm_totes/index.jsx和confirm_totes_success/referral_confirm.jsx的关系；
    * 建议有时间可以研究处理该情况，location跳转的用户体验稍微差点，毕竟大部分的分享如商品详情都可以正常分享；

  * Api使用与Debug
    * 要是用Api就必须进行微信的签名，只有签名成功才能调起微信的Api;
    * 目前签名已经处理好了，但是需要Debug签名的话，将wx_config.js里面的DEBUG改为true，会进行弹窗提示信息；
    * wx_config.js的WX_API_LIST是需要用到的Api列表，需要新的就增加即可；
    * 每一个Api微信都有Error，直接部署去Alert错误信息也可以调试；
    * 目前在Api调起失败是，递归三(3、three)次，都失败就不再执行；

# 路由返回
  * 项目中借助Router的setRouteLeaveHook，实现返回返回拦截和触发事件，具体看Layout.jsx的ControlRouterAction；
  * Web中路由改变都会重新挂载组件，所以容易出现闪烁和滚动位置不对；
    * 返回位置是用Router的Change监听，Path改变就存和取相对应的Scroll值，极端情况下在没有Render好可能会设置不成功，需要自己在正确时机再滚，具体例子在routers.jsx;
    * 避免闪烁和滚动的做法目前是用Reducer(浏览器存储等)来存储数据，返回不需要经过接口等，可以直接Render;
    * 因为存Reducer这种做法也会出现一些返回判断问题；
    * 目前微信基本以App为标准，目标建议做成返回不进行Render，不走生命周期等做法，具体案例(vue的keep-alive、react-keep)；

# 数据存储
  * 目前的Reducer使用了redux-persist，将customer和totes做了本地存储;
    * 如需要增加一些用户信息存储本地，可以在reducers/reducers.js里面进行添加和修改；
    * 团队考虑是否需要存储用户信息到本地，虽然可以加快用户信息显示，优化体验；
      * 用户信息安全问题；
      * 是否容易造成信息覆盖，导致不准确；

  * storage.js，是封装的浏览器存储的工具，默认是sessionStorage，也可以用localStorage，用法可看storage.js;
  * webSql和IndexDb等，建议不要在项目中使用，因为使用的是微信公众号，避免一些版本手机不兼容导致出现问题;

# 开发规范
  * Lib
    * 业务工具(用户、衣箱等状态判断)都在里面，后续如果出现新的业务工具也加入到Lib文件中，建议进行lib分类，目前业务工具和一些函数工具都在一个文件目录下；
  * 文件目录
    * 目前是新写的组件、界面，全部jsx、scss、img都放到app目录下的自己的文件夹中；
    * 部分以前的组件，因为最初文件结构问题，还有一些在assets；
    * 建议按目前的方式划分，因为如果相关联的文件分太开，在后续清理代码和文件时比较麻烦，也不好找；
  * 组件划分
    * 目前微信大规模的方式是相对应界面的组件放到该界面文件目录下(components)，公用的放到和conatiners同级的components；
    * App方面是全部组件放conatiners同级的components；
    * 公共组件如带有action，都加入common_actions和common_reducer方便统一管理；
    * 具体统一规范由团队决定；
  * 语言规范
    * 变量使用(可改.eslintrc来配置)
      * 不允许出现_开头的变量，长变量需要用驼峰，短的可以不用；
      * 注意Const的使用，在性能上更好，尽可能使用Const，不允许出现Var；
      * 函数先定义再使用，不能在一个先执行的函数里面调用一个还没创建function，即使项目不报错；
    * Class Components
      * Class组件的函数目前都是func = () => {}，对于性能来说不如func(){}，然后在constructor中bind，可以考虑后续改变；
      * Class组件的函数的命名，目前没有以_开头，可以后续考虑改变;
    * Function Components
      * 显示型的组件尽量加React.memo；
      * 使用Hooks的组件，需要按照React官方的规范，有必要可以加入Hooks的Eslint插件；
      * 建议后续都使用React-Hooks
        * 官方也在推广，乃至Vue3.0都废除Class方式，未来更新方面有保障；
        * 在一些业务场景的复用和代码逻辑精简上有不少帮助；
        * 所有在用Hooks导致的问题都是在理解上没有处理好，可以在官网找到[解决方式](https://zh-hans.reactjs.org/docs/hooks-faq.html)；

# 小程序交互
  * 小程序重点
    * URL带参(带参因为encode和decode，有可能出现多次对url进行encode，在decode的次数上需要把握好，目前比较乱，建议重构)；
    * 部分Api需要用户点击才调起；
    * 多次调起后，如果返回需要返回正常地方，路由需要计数；
    * 小程序传递数据大部分都借助路由和url传递；

  * 小程序分享
    * 目前小程序是用Web-View打开微信公众号网站，目前公众号与小程序的数据传递是借助小程序的postMessage
      * 默认的Helmet已经实现了postMessage，所以大部分可以借助传props给Helmet(lib的pagehelmet.js)；
      * 特定情况如需要拿到数据才post的可以自己执行(可参考carousel的product.jsx)；

  * 界面跳转
    * 为了加快和优化小程序打开第三方界面的体验
      * 在非会员首页是有做小程序环境就让小程序打开一个route，返回不会造成刷新这样的效果；(other_homepage_play的click)
      * 注意不是全部都需要这样的处理

  * 地址与免密
    * 目前小程序是用Web-View打开微信公众号网站，需要用到的原声功能，地址库和免密支付，都需要在原生界面进行点击等；
      * 目前做法
        * 点击时打开小程序路由(navigateToAddress)，并在url上带上参数；
        * 在小程序的该路由上对参数和各种情况进行处理；
        * 处理完后带上数据生成url，小程序goback或跳转index路由打开该url；
          * 处理时小程序代码会添加router这哈希值，用来记录打开的次数
          * 因为不知道谁的需求，需要用户在返回的时候正确返回上一页
        * 将url上的参数进行处理和显示(免密是跳转，地址库是goback，地址库可参考wx_address_v2/index)；

  * 登录
    * 目前做法
      * 打开小程序，判断cookie，然后进行登录；
      * 因为需要先登录公众号注册，再注册小程序，所以在登录404的时候会把wechat_mini_app_openid带到url上；
      * 公众号代码(默认登录逻辑)会在跳转登录的时候，将wechat_mini_app_openid带到后台一并注册；

  * 支付
    * 目前做法
      * 公众号将支付需要的参数信息通过跳转小程序路由wxPay时带上；
      * wxPay将带过来的信息，进行处理，成功后跳转到信息上的回调地址；
