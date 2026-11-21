# Agent 会話の仮想リスト

各 Agent メッセージを `StkTable` の行として表示し、`virtual` で表示範囲だけを描画、`autoRowHeight` で吹き出し・思考・ターミナル・回答を内容に合わせた高さにします。入力は OpenAI Chat Completions 互換で、匿名 Qwen・DeepSeek・カスタムエンドポイントを切り替えられます。匿名ルートは IP 制限があるため、本番では自前のサーバープロキシを経由してください。

リストは通常末尾に追従し、上へスクロールすると一時停止します。組み込みのカスタムスクロールバーにより、仮想スクロールがドラッグ中にプレースホルダ DOM を書き換えてもサムがポインタに追従します。

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
