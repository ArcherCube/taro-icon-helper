# taro-icon-helper
在 taro 项目中以 React 组件形式使用 svg 作为 Icon。

## 特性
<ol>
<li>将多个 svg 生成为直接可用的 React 组件；</li>
<li>通过 css 控制图标尺寸、颜色；</li>
<li>支持自定义颜色、支持多色；</li>
<li>生成的组件带有 JSDoc 的预览效果，展示图标的类型、多色配置；</li>
</ol>

## 使用
### Step 1
安装
#### pnpm
```bash
pnpm add taro-icon-helper --save-dev
```

#### yarn
```bash
yarn add taro-icon-helper --dev
```

#### npm
```bash
npm install taro-icon-helper --save-dev
```

### Step 2
在项目下创建配置文件 icon-helper.json ，参考配置信息如下：
```json
{
  "sourceDir": "./src/assets/svg",
  "outputDir": "./src/components/icons",
  "className": "my-icon"
}
```
详见[配置参数说明](#配置参数说明)

### Step 3
开始生成组件
```bash
npm taro-icon-helper update
```
执行完毕后在 outputDir 中检查生成的图标

### Step 4
在项目中使用。例如，在 sourceDir 中存在 loading-outlined.svg、add-image-outlined.svg，则会生成出 LoadingOutlined 以及 AddImageOutlined 两个组件，使用方式如下：

```jsx harmony
import { AddImageOutlined, LoadingOutlined } from '@/components/icons';

export const Demo = () => {
  return (
    <>
      <LoadingOutlined className='text-24 text-black' />
      <AddImageOutlined className='text-18 text-white' />
      {/** 假如 AddImageOutlined 支持多色 */}
      <AddImageOutlined color={['#123456', '#654321']} className='text-12' />
    </>
  );
};
```
> 在 vscode 中，尝试将鼠标移动到组件名上，能看到图标的预览效果
> ![](https://github.com/ArcherCube/taro-icon-helper/blob/main/images/hint.png?raw=true)


> 具体的使用，包括源文件位置、配置文件、生成结果等，可参考[这里](https://github.com/ArcherCube/taro-icon-helper/tree/main/demo)


## 配置参数说明

### sourceDir
svg源文件的目录。
> svg文件需要以短横线风格命名，否则将影响生成的组件名。

### outputDir

生成的组件的目录。
> 生成的组件名为svg文件名的大驼峰。

### className
图标组件基础样式名。会同时作为图标字体样式名的前缀。

-------

## 支持平台

- 微信小程序
- 理论上其他平台也支持（未测试）

## FAQ

### 生成的代码没有进行格式化，项目配置的 eslint 报错？
一开始确实打算将 eslint 的修复直接加入生成过程来执行，但是考虑不是所有项目都会用到；而且即使真的需要用到，在生成组件后再进行格式化也只是加一条命令，例如，配置生成的路径为 `./src/icons`，在 package.json 中有：
```json
{
  "scripts": {
    "update:icon": "taro-icon-helper update"
  }
}
```
则可以改写为
```json
{
  "scripts": {
    "update:icon": "taro-icon-helper update && eslint --fix ./src/icons --ext .ts,.tsx"
  }
}
```

### 只能生成 typescript 吗？
目前来说确实是这样。后续会加入生成 js 的配置项。

### 为什么要做这个库？
在微信小程序使用图标，往往会碰到以下几个问题：
<ol>
<li>图标颜色的设置，尤其是当项目里有主题切换之类的功能时，我们一般不太愿意直接将 hex 或者 rgb 的值直接写到图标中，因为直接写值不好维护、封装成对象又得到处导入而且跟文字颜色的设置方式不一致；</li>
<li>图标放到项目之后，时间一长就忘记图标长啥样了，只通过名字不好判断是不是想要的那一个；</li>
<li>UI 更多时候更偏向于自己去设计 icon，而产物一般是 svg；小程序要使用 svg 其实不是很方便，必须要经过一些额外处理；上传到 iconfont 等平台后使用其生成的字体图标，又直接砍掉了图标的多色能力，而且 UI 还得先把图标进行轮廓化再进行上传；</li>
</ol>
为了能在小程序项目更简单、直接地使用图标，于是有了这个库。

## 写在最后
欢迎提出其他疑问或建议，一起优化这个工具。