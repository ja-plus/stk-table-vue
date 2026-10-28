# Agent 会話の仮想リスト

各 Agent メッセージを `StkTable` の行として表示し、`virtual` と `autoRowHeight` を有効にして表示範囲だけを描画します。ユーザーの吹き出し、思考、検索、ターミナル、回答は内容に応じて自然な高さになります。入力は OpenAI Chat Completions 互換形式で、匿名 Qwen、DeepSeek、カスタムエンドポイントを切り替えられます。

既定の Qwen エンドポイントは OVHcloud AI Endpoints です。匿名利用は登録や API Key 不要ですが、IP ごとのレート制限があります。公開エンドポイントの利用可能モデルや制限は変わる場合があります。

リストは通常、末尾に追従します。上へスクロールすると追従を一時停止し、末尾に戻ると再開します。表示領域の高さはレスポンシブで、幅が変わると実測行高をクリアして仮想レイアウトを再計算します。

下部の入力欄から添付ファイルや画像を追加でき、SVG のドロップダウンでモデルを切り替えられます。最後の「モデル管理」から新しいモデルを設定でき、「思考」メニューで思考ステップのオン・オフも切り替えられます。リクエスト中は会話内に待機状態を動的に表示し、エラーもメッセージとして追加します。

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
