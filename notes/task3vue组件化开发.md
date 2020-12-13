# 1. 组件化开发

## 1.1 开源组件库
常用的Vue组件库
- Element-UI
- iView

## 1.2 CDD  (Component-Driven Development)  组件驱动开发
- CDD 概念
    - 自下而上
    - 从组件级别开始，到页面级结束

- CDD 的好处
    - 组件在最大程度被重用
    - 并行开发
    - 可视化测试

## 1.3 处理组件的边界情况
[参考文献](https://cn.vuejs.org/v2/guide/components-edge-cases.html)

$root

$parent / $children

$refs
``` js
this.$refs[formName].validate((valid)=>{
    if(valid){
        console.log("submit!");
    }else{
        console.log("error submit!");
        return false;
    }
})
```

依赖注入 provide / inject

$attrs / $listeners
- $attrs 
    - 把父组件中非 prop 属性绑定到内部组件
- $listeners
    - 把父组件中的 DOM 对象的原生事件绑定到内部组件


## 1.4 快速原型开发
[参考文献](https://cli.vuejs.org/zh/guide/prototyping.html)

- VueCLI 中提供了一个插件可以进行原型快速开发
- 需要先额外安装一个全局的扩展
    - npm i -g @vue/cli-service-global
- 使用 vue serve 快速查看组件的运行效果

### 1.4.1 vue serve
- vue serve 如果不指定参数默认会在当前目录下的入口文件
    - main.js、index.js、App.vue、app.vue
- 可以指定要加载的组件
    - vue server ./src/login.vue

### 1.4.2 Element-UI
安装 Element-UI
- 初始化 package.json
    - npm init -y
- 安装 ElementUI
    - vue add element
- 加载 ElmentUI，使用 vue.use() 安装插件

## 1.5 组件开发
### 1.5.1 组件分类
- 第三方组件
- 基础组件
- 业务组件

### 1.5.1 步骤条组件

### 1.5.2 表单组件

#### 1.5.2.1 整体结构
- Form
- FormItem
- Input
- Button

#### 1.5.2.2 表单验证
Input 组件验证
- Input 组件中触发自定义事件 validate
- FormItem 渲染完成注册自定义事件 validate

## 1.6 Monorepo

两种项目的组织方式
- Multirepo (Multiple Repository)
    - 每一个包对应一个项目
- Monorepo (monolithic Repository)
    - 一个项目仓库中管理多个模块/包

目录结构
- packages
    - button
        - _test_
        - dist
        - src
            - index
            - package.json
    - form
    - formitem
    - input
    - steps

## 1.7 Storybook
[参考文献](https://storybook.js.org/)
- 可视化的组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件
- 支持的框架
    - React、React Native、Vue、Angular
    - Ember、HTML、Svelte、Mithril、Riot


Stroybook 安装
- 自动安装
    - npx -p @storybook/cli sb init -type vue
    - yarn add vue
    - vue yarn add vue-loader vue-template-compiler -dev
- 手动安装


## 1.8 基于模板生成包的结构

## 1.9 Lerna + yarn workspaces

### 1.9.1 yarn workspaces
项目依赖
``` js
src
├── package.json
└── packages
  ├──button
  │  └── package.json   依赖 lodash 4
  ├──form
  │  └── package.json   依赖 lodash 4
  ├──formitem
  │  └── package.json   依赖 async-valiator
  ├──input
  │  └── package.json   依赖 lodash 3
  └──steps
     └── package.json   
```

开启 yarn 的工作区
- 项目跟目录的 package.json
``` js
{
    "private": true,
    "workspaces": [
        "./packages/*"
    ]
}
```

yarn workspaces 使用
- 给工作区根目录安装开发依赖
    - yarn add jest -D -W
- 给指定工作区安装依赖
    - yarn workspace lg-button add  lodash@4
- 给所有的工作区安装依赖
    - yarn install




### 1.9.2 Lerna
Lerna 介绍
- Lerna 是一个优化使用 git 和 npm 管理多包仓库的工作流工具
- 用于管理具有多个包的 JavaScript 项目
- 它可以一键把代码提交到 git 和 npm 仓库

Lerna 使用
- 全局安装
    - yarn global add lerna
- 初始化
    - lerna init 
- 发布
    - lerna publish


## 1.10 组件测试
[组件单元测试好处](https://cn.vuejs.org/v2/cookbook/unit-testing-vue-components.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E6%B5%8B%E8%AF%95%EF%BC%9F)
- 提供描述组件行为的文档
- 节省手动测试的时间
- 减少研发新特性时产生的 bug
- 改进设计
- 促进重构

安装依赖
- [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/)
- [Jest](https://github.com/facebook/jest)
- [vue-jest](https://github.com/vuejs/vue-jest)
- [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest)
- 安装
    - yarn add jest @vue/test-utils vue-jest bable-jest -D -W

配置测试脚本
- package.json
``` js
{
    "scripts":{
        "test": "jest"
    }
}
```

Jest 配置文件
- jest.config.js
``` js
module.exports = {
    "testMatch": ["**/__test__/**/*.[jt]s?(x)"],
    "moduleFileExtensions": [
        "js",
        "json",
        // 处理 *.vue 文件
        "vue"
    ],
    "transform":{
        // 用 vue-jest 处理 *.vue 文件
        ".*\\.(vue)$": "vue-ject",
        // 用 bable-ject 处理 js
        ".*\\.(js)$": "bable-ject"
    }
}
```

Babel 配置文件
- bable.config.js
``` js
module.exports = {
    presets: [
        "@babel/preset-env"
    ]
}
```

Bable 桥接
- yarn add babel-core@bridge -D -W

## 1.11 Vue 组件的单元测试
[Jest常见API](https://jestjs.io/docs/en/api)
- 全局函数
    - describe(name,fn)     把相关测试组合在一起
    - test(name,fn)         测试方法
    - expect(value)         断言
- 匹配器
    - toBe(value)           判断值是否相等
    - toEqual(obj)          判断对象是否相等
    - toContain(value)      判断数组或者字符串是否包含
- 快照
    - toMatchSnapshot()

[Vue Test Utils 常用API](https://vue-test-utils.vuejs.org/zh/api/)
- mount()
    - 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper.
- Wrapper
    - vm            wrapper 包裹的组件实例
    - props()       返回vue实例选项中的 props 对象
    - html()        组件生成的 HTML 标签
    - find()        通过选择器返回匹配到的组件中的 DOM 元素
    - trigger()     触发 DOM 原生事件，自定义事件 wrapper.vm.$emit()


## 1.12 Rollup打包
Rollup
- Rollup 是一个模块打包器
- Rollup 支持 Tree-shaking
- 打包的结果比 Webpack 要小
- 开发框架/组件库的时候使用 Rollup 更合适

安装依赖
- Rollup
- rollup-plugin-terser
- rollup-plugin-vue@5.1.9
- vue-template-compiler

``` js
import {terser} from "rollup-plugin-terser";
import vue from "rollup-plugin-vue";
module.exports = [{
    input: "index.js",
    output: [{
        file: "dist/index.js",
        format: "es"
    }],
    plugins: [
        vue({
            css: true,
            compileTemplate: true
        }),
        terser()
    ]
}]
```

Roolup 打包
设置环境遍历
清理
基于模板生成组件基本结构