module.exports = [

  {
    "text": "[定位] 组件定义 HighlightWords",
    "symbol": "HighlightWords",
    "filePattern": "src/app/components/highlight_words/index.jsx",
    "textPattern": "HighlightWords"
  },
  {
    text: '使用场景',
    children: [
      {
        "text": "商品详情",
        children: [
          {
            text: '组件调用',
            children: [
              {
                "text": "<DescriptionAndSizing product={product} />",
                "symbol": "ProductWrapper",
                "filePattern": "src/app/containers/product/product.jsx",
                "textPattern": "DescriptionAndSizing"
              },
              {
                "text": "<ProductDetails product={product} />",
                "symbol": "DescriptionAndSizing",
                "filePattern": "src/app/containers/product/description_and_sizing.jsx",
                "textPattern": "ProductDetails"
              },
              {
                "text": "<HighlightWords />",
                "filePattern": "src/app/containers/product/product_detail.jsx",
                "textPattern": "HighlightWords"
              }
            ]
          },
          {
            "text": "[API] fetchProduct",
            "symbol": "ProductContainer",
            "filePattern": "src/app/containers/product/product_container.jsx",
            "textPattern": "fetchProduct"
          },
          {
            "text": "数据解析",
            "filePattern": "src/app/containers/product/product_detail.jsx",
            "textPattern": "highlightIndex"
          },
        ]
      }
    ]
  }
]