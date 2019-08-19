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
```

## autoPrefixer自动补全前缀
四种浏览器内核

| 内核    | 浏览器  | 前缀    |
| ------- | ------- | ------- |
| Trident | IE      | ms-     |
| Geko    | Firefox | moz-    |
| Webkit  | Chrome  | webkit- |
| Presto  | Opera   | o-      |

通过autoprefixer结合postcss-loader使用
<code>npm i autoprefixer postcss-loader -D</code>

配置如下：
```
module:{
  rules:[
    test:/\.css$/,
    use:[
      MiniCssExactPlugin.loader,
      'css-loader',
      {
        loader:'postcss-loader',
        options:{
          plugins:()=>[
            require('autoprefixer')({
              browsers: ['last 2 version', '>1%', 'iOS 7']
            })
          ]
        }
      }
    ]
  ]
}
```

得到提示消息**Replace Autoprefixer browsers option to Browserslist config.
  Use browserslist key in package.json or .browserslistrc file.**

根据提示信息，将browsers去掉添加browserslist字段到package.json或者添加.browserslistrc浏览器支持配置文件就ok了

## 移动端适配px2rem-loader+lib-flexible
安装包

<code>npm i px2rem-loader -D</code>

<code>npm i lib-flexible -S</code>
配置如下:
```
module:{
  rules:[
    {
      test:/\.css$/,
      use:[
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader:'px2rem-loader',
          options:{
            remUnit:75,
            remPrecision:8
          }
        }
      ]
    }
  ]
}
```