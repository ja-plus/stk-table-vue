import { defineConfig } from "vitepress";

export const jaConfig = defineConfig({
    title: "StkTableVue",
    description: "Vue向け高性能仮想テーブル",
    lang: "ja",
    themeConfig: {
        darkModeSwitchLabel: "テーマ",
        docFooter: { prev: "前へ", next: "次へ" },
        lastUpdatedText: "最終更新",
        outline: {
            level: [2, 6],
            label: "目次",
        },
        returnToTopLabel: "トップへ戻る",
        sidebarMenuLabel: "メニュー",
        nav: [
            { text: 'ホーム', link: '/ja/' },
            { text: 'ドキュメント', link: '/ja/main/start/start' },
            { text: 'デモ', link: '/ja/demos/huge-data' },
            { text: 'スポンサー', link: '/ja/main/other/sponsor' }
        ],
        sidebar: {
            '/ja/main': {
                base: '/ja/main',
                items: [
                    {
                        text: '開発ガイド',
                        items: [
                            { text: 'はじめに', link: '/start/introduce' },
                            { text: 'クイックスタート', link: '/start/start' },
                            { text: 'Vue 2での使用方法', link: '/start/vue2-usage' },
                        ]
                    }, {
                        text: '機能',
                        items: [
                            {
                                text: '基本機能',
                                collapsed: false,
                                items: [
                                    { text: '基本', link: '/table/basic/basic' },
                                    { text: 'テーマ（ライト/ダーク）', link: '/table/basic/theme' },
                                    { text: 'サイズ', link: '/table/basic/size' },
                                    { text: 'ボーダー', link: '/table/basic/bordered' },
                                    { text: '配置', link: '/table/basic/align' },
                                    { text: '列幅', link: '/table/basic/column-width' },
                                    { text: '行の高さ', link: '/table/basic/row-height' },
                                    { text: 'ゼブラ柄', link: '/table/basic/stripe' },
                                    { text: '固定列', link: '/table/basic/fixed' },
                                    { text: 'オーバーフロー省略', link: '/table/basic/overflow' },
                                    { text: 'ソート', link: '/table/basic/sort' },
                                    { text: '行・セルの選択/ホバー', link: '/table/basic/row-cell-mouse-event' },
                                    { text: 'チェックボックス', link: '/table/basic/checkbox' },
                                    { text: 'セルマージ', link: '/table/basic/merge-cells' },
                                    { text: 'ヘッダーレス', link: '/table/basic/headless' },
                                    { text: '行展開', link: '/table/basic/expand-row' },
                                    { text: 'ツリー', link: '/table/basic/tree' },
                                    { text: 'マルチレベルヘッダー', link: '/table/basic/multi-header' },
                                    { text: 'シーケンス列', link: '/table/basic/seq' },
                                    { text: '空データ', link: '/table/basic/empty' },
                                    { text: '行・列の一意キー', link: '/table/basic/key' },
                                    { text: 'スクロールバー', link: '/table/basic/scrollbar' },
                                    { text: 'table-layout: fixed', link: '/table/basic/fixed-mode' },
                                    { text: '行単位スクロール', link: '/table/basic/scroll-row-by-row' },
                                    { text: 'フッター（✨NEW）', link: '/table/basic/footer' },
                                ]
                            },
                            {
                                text: '高度な機能',
                                collapsed: false,
                                items: [
                                    { text: '行・セルをハイライト', link: '/table/advanced/highlight' },
                                    { text: '仮想リスト（大量データ）', link: '/table/advanced/virtual' },
                                    { text: '可変行高仮想リスト', link: '/table/advanced/auto-height-virtual' },
                                    { text: 'エリア選択', link: '/table/advanced/area-selection' },
                                    { text: '列幅変更', link: '/table/advanced/column-resize' },
                                    { text: '列ドラッグ並べ替え', link: '/table/advanced/header-drag' },
                                    { text: '行ドラッグ並べ替え', link: '/table/advanced/row-drag' },
                                    { text: 'カスタムセル', link: '/table/advanced/custom-cell' },
                                    { text: 'カスタムソート', link: '/table/advanced/custom-sort' },
                                    { text: 'Vue 2スクロール最適化', link: '/table/advanced/vue2-scroll-optimize' },
                                ]
                            },
                            {
                                text: 'API',
                                collapsed: false,
                                items: [
                                    { text: 'Table Props テーブル設定', link: '/api/table-props' },
                                    { text: 'StkTableColumn 列設定', link: '/api/stk-table-column' },
                                    { text: 'Emits イベント', link: '/api/emits' },
                                    { text: 'Expose メソッド', link: '/api/expose' },
                                    { text: 'Slots スロット', link: '/api/slots' },
                                ]
                            },
                            {
                                text: 'その他',
                                collapsed: false,
                                items: [
                                    { text: 'コンテキストメニュー', link: '/other/contextmenu' },
                                    { text: '実験的機能', link: '/other/experimental' },
                                    { text: '追加最適化', link: '/other/optimize' },
                                    { text: 'Tips', link: '/other/tips' },
                                    { text: 'Q&A', link: '/other/qa' },
                                    { text: '変更履歴', link: '/other/change' },
                                    { text: 'スポンサー', link: '/other/sponsor' },
                                ]
                            }
                        ]
                    }
                ]
            },
            '/ja/demos': {
                base: '/ja/demos',
                items: [
                    { text: '大量データ', link: '/huge-data' },
                    { text: '仮想リスト', link: '/virtual-list' },
                    { text: 'マトリックス', link: '/matrix' },
                    { text: 'セル編集', link: '/cell-edit' },
                    { text: 'パネルツリー', link: '/panel-tree' },
                    { text: '遅延ロード', link: '/lazy-load' },
                ]
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' },
        ],
        footer: {
            message: 'MITライセンスの下で公開されています',
            copyright: 'Copyright © 2024-present japlus'
        }
    },
})
