

module.exports = [
  {
    "text": "[定位] JEAN_SIZES 配置",
    "symbol": "JEAN_SIZES",
    "filePattern": "src/app/containers/onboarding/size.js",
    "textPattern": "JEAN_SIZES"
  },
  {
    text: '使用场景',
    children: [
      {
        "text": "<SizeButtons />",
        "symbol": "ClothingSizes",
        "filePattern": "src/app/containers/onboarding/size/components/clothing_sizes.jsx",
        "textPattern": "SizeButtons"
      },
      {
        "text": "<SizeJeanContainer />",
        "symbol": "SizeJeanContainer",
        "filePattern": "src/app/containers/onboarding/size/jean/index.jsx",
        "textPattern": "SizeJeanContainer"
      }
    ]
  }
]