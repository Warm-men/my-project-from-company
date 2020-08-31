

const fetchMe = require('./fetch/fetchMe')
const fetchBrowseProduct = require('./fetch/fetchBrowseProduct')


let data = []

const modalFlows = [
  {
    text: '顶层入口',
    children: [
      {
        "text": "商品详情页底部",
        "symbol": "ProductWrapper",
        "filePattern": "src/app/containers/product/product.jsx",
        "textPattern": "NewToteSwapModalContainer"
      }
    ]
  },
  {
    "text": "标题文字状态",
    "symbol": "NewToteSwapModal",
    "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/index.jsx",
    "textPattern": "getTitleText"
  },
  {
    "text": "滑动数组状态",
    "symbol": "NewToteSwapModal",
    "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/index.jsx",
    "textPattern": "getSwiperProducts"
  },
  {
    "text": "处理点击选项",
    "symbol": "NewToteSwapModal",
    "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/index.jsx",
    "textPattern": "handleSelectProduct"
  },
  {
    "text": "处理点击按钮提交",
    "symbol": "NewToteSwapModal",
    "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/index.jsx",
    "textPattern": "handleReplaceProduct"
  }
]


data = data.concat([
  {
    text: '[fetchData]-[toteCart] 通过FetchMe拿到购物车 ',
    children: [
      {
        text: 'Case:正常会员',
        children: fetchMe
      },
      {
        "text": "Case: onBoarding",
        "symbol": "ProductWrapper",
        "filePattern": "src/app/containers/product/product.jsx",
        "textPattern": "fetchLatestRentalTote"
      }
    ]
  },


  {
    text: '业务场景',
    children: [
      {
        text: 'CASE: 商品详情页',
        children: [
          {
            "text": "[定位到路由入口]",
            "symbol": "ProductContainer",
            "filePattern": "src/app/containers/product/product_container.jsx",
            "textPattern": "ProductWrapper"
          },
          {
            "text": "[定位到核心UI组件]",
            "symbol": "ProductWrapper",
            "filePattern": "src/app/containers/product/product.jsx",
            "textPattern": "ProductWrapper"
          },
          {
            "text": "[定位到 '替换这件' 按钮点击逻辑]",
            "symbol": "NewToteSwapModal",
            "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/index.jsx",
            "textPattern": "handleReplaceForToteCart"
          },
          {
            "text": "[定位到 商品详情页 换入X码按钮点击逻辑]",
            "symbol": "AddToToteCartHandlerHOC",
            "filePattern": "src/app/containers/product/hoc/addto_totecart.js",
            "textPattern": "handleAddToCart"
          },
          {
            "text": "[定位到 替换弹窗 点击商品处理逻辑]",
            "symbol": "Products",
            "filePattern": "src/app/containers/tote_swap/new_tote_swap_modal/components/swap_product_list.js",
            "textPattern": "_didSelectedItem"
          }
        ],
      },
      {
        text: 'CASE: 商品 Perfect Closet',
        children: [
          {
            "text": "[定位到路由入口]",
            "symbol": "ProductsByCloset",
            "filePattern": "src/app/containers/products/products_perfect_closet.jsx",
            "textPattern": "Products"
          },
          {
            "text": "[定位到核心UI组件]",
            "symbol": "ProductsScrollListComponent",
            "filePattern": "src/app/containers/products/products_scroll_list/products_scroll_list.jsx",
            "textPattern": "ProductsScrollListComponent"
          }
        ]
      },
      {
        text: 'CASE: 商品 Customize Closet',
        children: [
          {
            "text": "[定位到路由入口]",
            "symbol": "ProductsByCloset",
            "filePattern": "src/app/containers/products/products_closet.jsx",
            "textPattern": "Products"
          },
          {
            "text": "[定位到核心UI组件]",
            "symbol": "ProductsScrollListComponent",
            "filePattern": "src/app/containers/products/products_scroll_list/products_scroll_list.jsx",
            "textPattern": "ProductsScrollListComponent"
          }
        ]
      },

    ]
  },

  {
    text: '业务逻辑',
    children: [
      {
        text: '[说明] 核心业务逻辑封装在 AddToToteCartHandlerHOC 高阶组件中，为子组件提供统一的UI/处理逻辑'
      },
      {
        "text": "[定位到核心逻辑HOC]",
        "symbol": "AddToToteCartHandlerHOC",
        "filePattern": "src/app/containers/product/hoc/addto_totecart.js",
        "textPattern": "AddToToteCartHandlerHOC"
      }
    ]
  }

])

module.exports = data;