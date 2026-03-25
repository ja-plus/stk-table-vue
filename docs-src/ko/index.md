---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Stk Table Vue"
  text: "고성능 가상 테이블"
  tagline: "실시간 대용량 데이터 지원, Canvas 불필요! 부드러운 경험を実現!"
  image:
    src: /assets/logo.svg
    alt: Stk Table Vue
  actions:
    - theme: brand
      text: 빠른 시작
      link: /ko/main/start/start
    - theme: alt
      text: 데모
      link: /ko/demos/huge-data
    - theme: alt
      text: GitHub⭐
      link: https://github.com/ja-plus/stk-table-vue

features:
  - icon: 💡
    title: 가볍고 사용하기 쉬움
    details: position:sticky 기반 고정 헤더와 고정 열로, 가상 리스트 높이 제어가 더욱 편리.
  - icon: ⚡️
    title: 높은 성능
    details: 가로, 세로, 가변 높이의 가상 리스트 지원. 실시간 데이터 테이블, 시세 테이블, 동적 테이블에 적합.
  - icon: 🔩
    title: 유연성
    details: DOM 기반으로, 설정식 커스텀 셀 가능. 슬롯 복잡함 해소.
  - icon: 🛠️
    title: 행/셀 강조
    details: 행과 셀 강조 메서드 캡슐화. 데이터 업데이트 알림에 사용.
  - icon: 🔑
    title: 완전한 타입 정의 API
    details: 유연한 API 와 완전한 TypeScript 타입 정의.
  - icon:
      src: /assets/vue-logo.svg
    title: Vue 2.7 호환
    details: Vue SFC + TS 소스 코드, Vue 2 프로젝트에서 사용 가능.
---
