---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Stk Table Vue"
  text: "高性能仮想テーブル"
  tagline: リアルタイム大容量データ対応、Canvas 不要！スムーズな体験を実現！
  image:
    src: /assets/logo.svg
    alt: Stk Table Vue
  actions:
    - theme: brand
      text: クイックスタート
      link: /ja/main/start/start
    - theme: alt
      text: デモ
      link: /ja/demos/huge-data
    - theme: alt
      text: GitHub⭐
      link: https://github.com/ja-plus/stk-table-vue

features:
  - icon: 🛠️
    title: 行/セルハイライト
    details: 行とセルをハイライトするメソッドを封装。リアルタイムデータ更新に最適。
  - icon: 💡
    title: 軽量で使いやすい
    details: position:sticky ベースの固定ヘッダーと固定列で、仮想リストの高さ制御がより便利に。
  - icon: ⚡️
    title: 高パフォーマンス
    details: 横方向、縦方向、可変高さの仮想リストに対応。
  - icon: 🔩
    title: 柔軟性
    details: DOMベースで、柔軟なカスタムセル設定が可能。スロット散らかり解消。
  - icon: 🔑
    title: 完全型付けAPI
    details: 柔軟なAPIと完全なTypeScript型定義。
  - icon:
      src: /assets/vue-logo.svg
    title: Vue 2.7対応
    details: Vue SFC + TSソースコードで、Vue 2プロジェクト에서도導入 가능。
---
