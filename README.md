## 文件指纹
文件指纹就是指输出文件名后面带着的字符

分为三种：
1. hash 对应图片字体
2. contenthash 对应css
3. chunkhash 对应js

## 文件压缩
| 文件类型 | 压缩插件                                 |
| -------- | ---------------------------------------- |
| JS       | UglifyJsPlugin                           |
| CSS      | OptimizeCssAssetsPlugin及预处理器cssnano |
| HTML     | HtmlWebpackPlugin                        |

1. **UglifyJsPlugin**在webpack4中默认配置

2. **OptimizeCssAssetsPlugin**配置如下
```
plugins:[
  new OptimizeCssAssetsPlugin({
    assetNameRegExp:/\.css$\,
    cssProcessor:require('cssnano')
  })
]
```
3. **HtmlWebpackPlugin**配置
```
plugins:[
  new HtmlWebpackPlugin({
    template:'./src/index.html',
    //默认为index，此处可以不配置
    filename:'index.html',
    chunks:['search'],
    inject:true,
  })
]
