# Wechat-Web

# [开发注意事项](https://github.com/letotecn/wechat-web/blob/master/devReadMe.md)

# 技术选型

* React(16.9.0)
* Redux
  * middleware:
    * redux-thunk: async middleware
    * api_middleware:  沿用美国之前的 middlware，封装了 http 请求， 包括一些 dispatch type 的封装(error success started complete...)
  * redux-persist(本地持久化)
  ```javascript
     /**
      *
      * @param {*string} key flag
      * @param {*number} version version number
      * @param {*string} storage default localStorage
      * @param {*boolen} DEBUG is debug ?
      * @param {*function} name reducer name
      * @param {*array} blacklist blacklist name
     */
      const PersistReducers = ({
        key = 'app',
        storageType,
        version = 1,
        DEBUG = false,
        name,
        blacklist = []
      }) =>
        persistReducer(
        {
          key: key,
          storage: storageType === 'session' ? storageSession : storage,
          version: version,
          debug: DEBUG,
          blacklist: blacklist
        },
        name
      )
  ```
* React-router
  * current version: v3, v4 跟 v3 差别较大，不考虑升 v4
* style:
  - scss
  - [classnames](https://github.com/JedWatson/classnames)
* test
  * [jest](https://jestjs.io/docs/en/getting-started) and [enzyme](https://airbnb.io/enzyme/)(dom render)
  * yarn coverage
    * 测试覆盖率，各组件很函数的覆盖情况
    * 除了 continers(基本要求 不爆红) 其他的像 lib Components 可以全覆盖(80%+)
* 辅助工具:
  * [recompose](https://github.com/acdlite/recompose): 配合React用的HOC，意义不大，可实用Hooks，尽量避免使用
  * [lodash](https://lodash.com/docs/4.17.11): 辅助函数库
  * [date-fns](https://date-fns.org/docs/Getting-Started): 时间处理库，用法为import { x } from 'date-fns'，减少打包体积 

# #ENV 使用

NODE_ENV:node.js 的环境变量，属于 node.js 模块，用来设置不同环境的配置；
process.env.NODE_ENV：默认值（development'，也可以自行设置）;

* 项目中使用到了三个 ENV
  * development;(开发环境)
  * production;(生产环境)
  * test;(测试环境)

# #DEV

* `启动`

  * clone 项目到本地，进入 wechat-web
  * npm install or yarn (需装上 node(version >= 11) 和 npm or yarn)
    * npm start or yarn start
    * https://localhost:3000

* `proxy`

  ```javascript
  "/api":{
         "target": "https://www.lt-jv.com",
         "secure": false,
         "changeOrigin": true,
         "preserveHeaderKeyCase": true,
         "hostRewrite": true,
         "autoRewrite": true,
         "protocolRewrite": "https",
         "cookieDomainRewrite": {
             " * ": "localhost"
         },
         "auth": "ltjv:pxltEZq9RNdiOqk"(需要验证)
    }

    "/wechat": {
         "target": "https://staging.letote.cn",
         "secure": false,
         "changeOrigin": true,
         "preserveHeaderKeyCase": true,
         "hostRewrite": true,
         "autoRewrite": true,
         "protocolRewrite": "https",
         "cookieDomainRewrite": {
             " * ": "localhost"
         }
     }

  * 可能出现的问题：由于使用HTTPS,所以需要以HTTPS形式启动，目前scripts/start.js(process.env.HTTPS = true)已启动;
  ```

# #Prettier

* 格式化目录："src/ \*_ / _ .{js,jsx,json}"
* --single-quote(单引号):true
* --no-semi(语句末尾分号):false

* 使用默认值
  * --no-bracket-spacing(对象括号间加空格):true
    _ --tab-width(缩进空格数):2
    _ --trailing-comma(多行时加逗号) :none \* --jsx-bracket-same-line(将标签的>放在末尾，而不是下一行) :none

# Unit Test

## react test tools

* mac: brew install watchman
* Jest Enzyme chi (react16 neend use resolve-url-loader enzyme-adapter-react-16 react-test-renderer)

## how to play unit test

[This is TDD tutorial](https://hackernoon.com/a-guide-to-tdd-a-react-redux-todolist-app-part-1-b8a200bb7091)

## how to run

* yarn test(npm run test)
* yarn coverage(You will see detail Test coverage in coverage folder)

# Shallow Rendering

```javascript
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import MyComponent from './MyComponent'
import Foo from './Foo'

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<MyComponent />)
    expect(wrapper.find(Foo)).to.have.length(3)
  })

  it('renders an `.icon-star`', () => {
    const wrapper = shallow(<MyComponent />)
    expect(wrapper.find('.icon-star')).to.have.length(1)
  })

  it('renders children when passed in', () => {
    const wrapper = shallow(
      <MyComponent>
        <div className="unique" />
      </MyComponent>
    )
    expect(wrapper.contains(<div className="unique" />)).to.equal(true)
  })

  it('simulates click events', () => {
    const onButtonClick = sinon.spy()
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />)
    wrapper.find('button').simulate('click')
    expect(onButtonClick).to.have.property('callCount', 1)
  })
})
```

#Full DOM Rendering

```javascript
import React from 'react'
import sinon from 'sinon'
import { expect } from 'chai'
import { mount } from 'enzyme'

import Foo from './Foo'

describe('<Foo />', () => {
  it('allows us to set props', () => {
    const wrapper = mount(<Foo bar="baz" />)
    expect(wrapper.props().bar).to.equal('baz')
    wrapper.setProps({ bar: 'foo' })
    expect(wrapper.props().bar).to.equal('foo')
  })

  it('simulates click events', () => {
    const onButtonClick = sinon.spy()
    const wrapper = mount(<Foo onButtonClick={onButtonClick} />)
    wrapper.find('button').simulate('click')
    expect(onButtonClick).to.have.property('callCount', 1)
  })

  it('calls componentDidMount', () => {
    sinon.spy(Foo.prototype, 'componentDidMount')
    const wrapper = mount(<Foo />)
    expect(Foo.prototype.componentDidMount).to.have.property('callCount', 1)
    Foo.prototype.componentDidMount.restore()
  })
})
```

## Static Rendered Markup

```javascript
import React from 'react'
import { expect } from 'chai'
import { render } from 'enzyme'

import Foo from './Foo'

describe('<Foo />', () => {
  it('renders three `.foo-bar`s', () => {
    const wrapper = render(<Foo />)
    expect(wrapper.find('.foo-bar').length).to.equal(3)
  })

  it('renders the title', () => {
    const wrapper = render(<Foo title="unique" />)
    expect(wrapper.text()).to.contain('unique')
  })
})
```

## and so on... eg

# Project structure

* components: public components
  * Higher-Order Components: components/HOC
* containers: pages
* lib: global library
* queries: graphQL api
* actions: redux action
* reducers: redux reducer
* store: redux store
* router: react router and global components and styles

* Layout.jsx: 全局的组件/等(eg: Tips, Alert, Hint)

## Styles and images

* Now the styles and images are placed under the current component folder

## White List

* The white list is placed under open routing
  * (eg: /open/...)

# Storage

## method

* set: setItem
* get: getItem
* remove: removeItem
* each: loop storage
* clearAll: clear all storage key

# Ab test

## 进入实验的变量命名规则

* 日期*平台*目的*价格*是否有 utm

```javascript
eg: D180809_ALL_NEW_499_UTM
```

* 平台： ALL H5 WECHAT
* 目的： NEW RENEW REFERRAL
* 价格： 499 149 79 ······
* 是否有 utm: ALL UTM


## commit guideline

* yarn commit(npm run commit) or git cz(把git commit的地方改成git cz生成符合格式的Commit Message)

* tutorial [Commitizen](https://www.jianshu.com/p/d264f88d13a4)
  - feat: a new feature
  - fix: a bug fix
  - docs: documentation only changes
  - style: changes that do not affect the meaning of the code(white-space, formatting, missing, semi-colons, and so on...)
  - refactor: a code change that neither fixes a bug or adds a feature
  - perf: a code change that imporves performance
  - test: adding missing tests
  - chore: changes to the build process or auxiliary tools and libraries such as documentation generation
