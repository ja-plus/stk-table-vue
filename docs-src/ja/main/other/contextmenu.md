# コンテキストメニュー

StkTableVueには組み込みのコンテキストメニューがないため、サードパーティライブラリを統合する必要があります。

ここでは、ネイティブコンテキストライブラリの [ja-contextmenu](https://www.npmjs.com/package/ja-contextmenu) を使用した例を示します。


## 依存関係のインストール

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
      label: 'menu1', // 名前
      icon: './assets/images/ico.png', // アイコンURL | HTMLElement
      class: 'customClass', // アイテムクラス、デフォルト: ''
      tip: 'tip1', // オプションの右側のプロンプトテキスト、デフォルト: ''
      show: true, // デフォルト: true
      disabled: false, // デフォルト: false
      onclick(e, payload) {
        // payloadはmenu.showメソッドを呼び出すときに渡されたパラメータです。
        console.log('menu1 click', payload);
        // return true; // メニューを閉じない
      },
    },
}
let menu = contextMenu.create(menuOption);

document.body.oncontextmenu = (e) => {
  let payload = 'payload data: callback when click items';
  menu.show(e, payload);
};
```


## デモ

<demo vue="other/contextmenu/ContextMenu.vue"></demo>
