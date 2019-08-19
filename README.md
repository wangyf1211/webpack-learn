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
lib-flexible通过将代码复制粘贴的硬核方式引入index.html中

## 资源内联
代码层面：
+ 页面框架的初始化脚本
+ 上报相关打点
+ css内联避免页面闪动FOUC

请求层面：减少HTTP请求数
+ 小图片或者字体内联(使用url-loader)

那么如何配置资源内联呢？
### html内联
```
<head>${require('raw-loader!./meta.html')}</head>
```
### js内联
```
<script>${require(require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js'))}</script>
```
通过<code>raw-loader 0.5.1</code>

### css内联
1. style-loader
配置如下
```
{
  test:/\.css$/,
  use:[
    {
      loader:'style-loader',
      options:{
        insertAt:'top',
        singleton:true
      }
    },
    'css-loader'
  ]
}
```
2. html-inline-css-webpack-plugin

安装raw-loader@0.5.1
```
npm i raw-loader@0.5.1 -D
```
添加如下
```
  <script>
    ${require('raw-loader!babel-loader!../node_modules/lib-flexible/flexible.js').default}
  </script>
  ```
  以内联的方式引入<code>lib-flexible</code>


## 多页面打包基本思路
每个页面对应一个entry以及一个html-webpack-plugin，缺点每添加一次页面都要重新配置

### 通用方法
动态获取entry和设置html-webpack-plugin数量

利用<code>glob.sync</code>
```
entry:glob.sync(path.join(__dirname,'./src/*/index.js'))
```
glob类似通配符匹配

<code>npm i glob -D</code>
```
const glob = require('glob')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index]
    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = entryFile
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          removeComments: true
        }
      }))
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}
```

## sourcemap
通过sourcemap定位源代码，线上环境关闭，但是sourcemap可以配置在错误监控系统帮助定位问题

### sourcemap关键字
+ eval：使用eval包裹模块代码
+ source map：产生.map文件
+ cheap：不包含列信息
+ inline：将.map作为DataURI嵌入，不单独生成.map文件
+ module：包含loader的sourcemap