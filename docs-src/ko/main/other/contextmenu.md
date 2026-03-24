# 컨텍스트 메뉴

StkTableVue에는 내장 컨텍스트 메뉴가 없으므로 서드파티 라이브러리를 통합해야 합니다.

여기서는 네이티브 컨텍스트 라이브러리 [ja-contextmenu](https://www.npmjs.com/package/ja-contextmenu)를 사용한 예시를 보여줍니다.


## 의존성 설치

```bash
npm install ja-contextmenu
```

## 기본 사용
```js
import ContextMenu from 'ja-contextmenu'; // types.d.ts supported
const contextMenu = new ContextMenu();
const menuOption = {
  items: [
    { 
      label: 'menu1', // 이름
      icon: './assets/images/ico.png', // 아이콘 URL | HTMLElement
      class: 'customClass', // 아이템 클래스, 기본값: ''
      tip: 'tip1', // 선택적 우측 프롬프트 텍스트, 기본값: ''
      show: true, // 기본값: true
      disabled: false, // 기본값: false
      onclick(e, payload) {
        // payload는 menu.show 메서드를 호출할 때 전달된 매개변수입니다.
        console.log('menu1 click', payload);
        // return true; // 메뉴 닫지 않음
      },
    },
]
let menu = contextMenu.create(menuOption);

document.body.oncontextmenu = (e) => {
  let payload = 'payload data: callback when click items';
  menu.show(e, payload);
};
```


## 데모

<demo vue="other/contextmenu/ContextMenu.vue"></demo>
