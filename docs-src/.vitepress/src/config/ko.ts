import { defineConfig } from "vitepress";

export const koConfig = defineConfig({
    title: "StkTableVue",
    description: "Vue高性能 가상 테이블",
    lang: "ko",
    themeConfig: {
        darkModeSwitchLabel: "테마",
        docFooter: { prev: "이전", next: "다음" },
        lastUpdatedText: "마지막 업데이트",
        outline: {
            level: [2, 6],
            label: "목차",
        },
        returnToTopLabel: "맨 위로 이동",
        sidebarMenuLabel: "메뉴",
        nav: [
            { text: '홈', link: '/ko/' },
            { text: '문서', link: '/ko/main/start/start' },
            { text: '데모', link: '/ko/demos/huge-data' },
            { text: '스폰서', link: '/ko/main/other/sponsor' }
        ],
        sidebar: {
            '/ko/main': {
                base: '/ko/main',
                items: [
                    {
                        text: '개발 가이드',
                        items: [
                            { text: '소개', link: '/start/introduce' },
                            { text: '빠른 시작', link: '/start/start' },
                            { text: 'Vue 2에서 사용하기', link: '/start/vue2-usage' },
                        ]
                    }, {
                        text: '기능',
                        items: [
                            {
                                text: '기본 기능',
                                collapsed: false,
                                items: [
                                    { text: '기본', link: '/table/basic/basic' },
                                    { text: '테마 (라이트/다크)', link: '/table/basic/theme' },
                                    { text: '크기', link: '/table/basic/size' },
                                    { text: '테두리', link: '/table/basic/bordered' },
                                    { text: '정렬', link: '/table/basic/align' },
                                    { text: '열 너비', link: '/table/basic/column-width' },
                                    { text: '행 높이', link: '/table/basic/row-height' },
                                    { text: '줄무늬', link: '/table/basic/stripe' },
                                    { text: '고정 열', link: '/table/basic/fixed' },
                                    { text: '텍스트 생략', link: '/table/basic/overflow' },
                                    { text: '정렬', link: '/table/basic/sort' },
                                    { text: '행/셀 선택/호버', link: '/table/basic/row-cell-mouse-event' },
                                    { text: '체크박스', link: '/table/basic/checkbox' },
                                    { text: '셀 병합', link: '/table/basic/merge-cells' },
                                    { text: '헤더리스', link: '/table/basic/headless' },
                                    { text: '행 확장', link: '/table/basic/expand-row' },
                                    { text: '트리', link: '/table/basic/tree' },
                                    { text: '멀티 레벨 헤더', link: '/table/basic/multi-header' },
                                    { text: '시퀀스 열', link: '/table/basic/seq' },
                                    { text: '빈 데이터', link: '/table/basic/empty' },
                                    { text: '행/열 고유 키', link: '/table/basic/key' },
                                    { text: '스크롤바', link: '/table/basic/scrollbar' },
                                    { text: 'table-layout: fixed', link: '/table/basic/fixed-mode' },
                                    { text: '행 단위 스크롤', link: '/table/basic/scroll-row-by-row' },
                                    { text: '푸터 (✨NEW)', link: '/table/basic/footer' },
                                ]
                            },
                            {
                                text: '고급 기능',
                                collapsed: false,
                                items: [
                                    { text: '행/셀 강조', link: '/table/advanced/highlight' },
                                    { text: '가상 리스트 (대량 데이터)', link: '/table/advanced/virtual' },
                                    { text: '가변 행 높이 가상 리스트', link: '/table/advanced/auto-height-virtual' },
                                    { text: '영역 선택', link: '/table/advanced/area-selection' },
                                    { text: '행 드래그 선택', link: '/table/advanced/row-drag-selection' },
                                    { text: '열 너비 변경', link: '/table/advanced/column-resize' },
                                    { text: '열 드래그 정렬', link: '/table/advanced/header-drag' },
                                    { text: '행 드래그 정렬', link: '/table/advanced/row-drag' },
                                    { text: '커스텀 셀', link: '/table/advanced/custom-cell' },
                                    { text: '커스텀 정렬', link: '/table/advanced/custom-sort' },
                                    { text: 'Vue 2 스크롤 최적화', link: '/table/advanced/vue2-scroll-optimize' },
                                ]
                            },
                            {
                                text: 'API',
                                collapsed: false,
                                items: [
                                    { text: 'Table Props 테이블 설정', link: '/api/table-props' },
                                    { text: 'StkTableColumn 열 설정', link: '/api/stk-table-column' },
                                    { text: 'Emits 이벤트', link: '/api/emits' },
                                    { text: 'Expose 메서드', link: '/api/expose' },
                                    { text: 'Slots 슬롯', link: '/api/slots' },
                                ]
                            },
                            {
                                text: '기타',
                                collapsed: false,
                                items: [
                                    { text: '컨텍스트 메뉴', link: '/other/contextmenu' },
                                    { text: '실험적 기능', link: '/other/experimental' },
                                    { text: '추가 최적화', link: '/other/optimize' },
                                    { text: '팁', link: '/other/tips' },
                                    { text: 'Q&A', link: '/other/qa' },
                                    { text: '변경 로그', link: '/other/change' },
                                    { text: '스폰서', link: '/other/sponsor' },
                                ]
                            }
                        ]
                    }
                ]
            },
            '/ko/demos': {
                base: '/ko/demos',
                items: [
                    { text: '대량 데이터', link: '/huge-data' },
                    { text: '가상 리스트', link: '/virtual-list' },
                    { text: '매트릭스', link: '/matrix' },
                    { text: '셀 편집', link: '/cell-edit' },
                    { text: '패널 트리', link: '/panel-tree' },
                    { text: '지연 로딩', link: '/lazy-load' },
                ]
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' },
        ],
        footer: {
            message: 'MIT 라이선스에 따라 공개되었습니다',
            copyright: 'Copyright © 2024-present japlus'
        }
    },
})
