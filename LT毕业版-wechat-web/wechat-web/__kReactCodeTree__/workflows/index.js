
module.exports = [
  {
    "text": "Example",
    "requirePath": "shareOrder.js"
  },
  {
    "text": "商品加入新衣箱流程",
    "requirePath": "./addProduct.js"
  },
  {
    "text": "商品详情高亮",
    "requirePath": "./ui/highlight_words.js"
  },
  {
    "text": "牛仔裤配置",
    "requirePath": "./config/jeans.js"
  },
  {
    "text": "Example2-HomeBanner业务",
    "children": [
      {
        "symbol": "HomepageRouter",
        "text": "请求banner数据",
        "textPattern": "getHomepageBanner",
        "filePattern": "src/app/containers/homepage/homepage.jsx",
        "children": [
          {
            "text": "HomepageRouter - src/app/containers/homepage/homepage.jsx"
          }
        ]
      },
      {
        "symbol": "reducer",
        "text": "处理返回请求",
        "textPattern": "newBanners",
        "filePattern": "src/app/reducers/homepage_reducer.js",
        "children": [
          {
            "text": "reducer - src/app/reducers/homepage_reducer.js"
          }
        ]
      },
      {
        "symbol": "HomepageRouter.render",
        "text": "渲染Banner组件",
        "textPattern": "HomepageBanner",
        "filePattern": "src/app/containers/homepage/homepage.jsx",
        "children": [
          {
            "text": "render() - src/app/containers/homepage/homepage.jsx"
          }
        ]
      },
      {
        "symbol": "HomepageBanenr",
        "text": "解析bannerList数据",
        "textPattern": "bannerList",
        "filePattern": "src/app/containers/homepage/components/homepage_banner.jsx",
        "children": [
          {
            "text": "HomepageBanenr - src/app/containers/homepage/components/homepage_banner.jsx"
          }
        ]
      },
      {
        "symbol": "HomepageBanenr",
        "text": "节点描述",
        "textPattern": "Swiper",
        "filePattern": "src/app/containers/homepage/components/homepage_banner.jsx"
      }
    ]
  }
]