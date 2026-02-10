# Context Menu

StkTableVue does not have a built-in context menu, so you need to integrate a third-party library.

Here's an example using the native context menu library [ja-contextmenu](https://www.npmjs.com/package/ja-contextmenu).


## Install Dependencies

```bash
npm install ja-contextmenu
```

## Basic Usage
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
