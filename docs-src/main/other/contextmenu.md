# 右键菜单

StkTableVue 没有内置右键菜单，需要引入第三方库。

这里以原生右键菜单 [ja-contextmenu](https://www.npmjs.com/package/ja-contextmenu) 来举例。


## 安装依赖

```bash
npm install ja-contextmenu
```

## 基本使用
```js
import ContextMenu from 'ja-contextmenu'; // types.d.ts supported
const contextMenu = new ContextMenu();
const menuOption = {
  items: [
    { 
      label: 'menu1', // name
      icon: './assets/images/ico.png', // icon url | HTMLElement
      class: 'customClass', // item class, default: ''
      tip: 'tip1', // Prompt text to the right of option, default: ''
      show: true, // default: true
      disabled: false, //  default: false
      onclick(e, payload) {
        // payload is the parameter passed in by calling the menu.show method.
        console.log('menu1 click', payload);
        // return true; // not close menu
      },
    },
}
let menu = contextMenu.create(menuOption);

document.body.oncontextmenu = (e) => {
  let payload = 'payload data: callback when click items';
  menu.show(e, payload);
};
```


## Demo

<demo vue="other/contextmenu/ContextMenu.vue"></demo>

### 右键菜单样式

- 可以通过自定义 CSS 来调整菜单样式
- 确保样式优先级正确，避免被其他样式覆盖
