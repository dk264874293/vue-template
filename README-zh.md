

# 安装依赖
npm install

** 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题 **
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:uat

# 构建生产环境
npm run build:prod
```

## 项目结构
``` bash
#核心业务逻辑都在src文件架下

# 存放所有的需要调用的api以功能进行划分
api 

# 存放所有的静态文件如图片
assets

# 公用的模块 （只允许存放在多个业务中会用到的公用模块）
components

# 项目图标存放svg原始文件
icons

# 主布局模块（切勿随意改动会影响全局布局）
layout

# 路由相关配置
router

# 全局状态管理 （请勿随意添加全局状态）
store

# 全局样式管理（请勿随意修改）
styles

# 全局工具
utils

#主要业务模块请以业务模块以文件夹的形式命名
views

#入口文件
App,main 

# 路由守卫
permission

```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```


## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
