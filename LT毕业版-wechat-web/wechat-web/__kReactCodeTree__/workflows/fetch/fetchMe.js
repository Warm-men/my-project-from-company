module.exports = [
  {
    "text": "[执行] fetchCurrentCustomer",
    "symbol": "App",
    "filePattern": "src/app/router/index.jsx",
    "textPattern": "fetchCurrentCustomer"
  },
  {
    "text": "[执行] 一些逻辑需要的时候在写..",
  },
  {
    "text": "[执行] fetchMe",
    children: [
      {
        "text": "API 定义",
        "symbol": "fetchMe",
        "filePattern": "src/app/actions/current_customer.js",
        "textPattern": "fetchMe",
      },
      {
        "text": "[Query] 定义",
        "symbol": "currentCustomer",
        "filePattern": "src/app/queries/current_customer.js",
        "textPattern": "currentCustomer"
      },
      {
        text: '[Reducer]',
        children: [
          {
            "text": "app_reducer处理 设置 [productsFilters] ",
            "symbol": "reducer",
            "filePattern": "src/app/reducers/app_reducer.js",
            "textPattern": "handleSlots"
          },
          {
            "text": "customer_reducer处理 设置 [me]",
            "symbol": "reducer",
            "filePattern": "src/app/reducers/customer_reducer.js",
            "textPattern": "setCurrentCustomer"
          },
          {
            "text": "tote_cart_reducer处理 更新 [toteCart]",
            "symbol": "reducer",
            "filePattern": "src/app/reducers/tote_cart_reducer.js",
            "textPattern": "updateToteCart"
          }
        ]
      }
    ]
  }
]