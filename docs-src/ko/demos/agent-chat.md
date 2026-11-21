# Agent 대화 가상 리스트

각 Agent 메시지를 `StkTable`의 행으로 표시하고 `virtual`로 보이는 영역만 렌더링하며, `autoRowHeight`로 버블·사고·터미널·답변이 내용에 맞게 늘어납니다. 입력은 OpenAI Chat Completions 호환이며 익명 Qwen, DeepSeek, 사용자 지정 엔드포인트를 전환할 수 있습니다. 익명 라인은 IP 요청 제한이 있으므로 프로덕션에서는 자체 서버 프록시를 사용하세요.

목록은 기본적으로 맨 아래를 따라가며 위로 스크롤하면 멈춥니다. 내장 커스텀 스크롤바를 사용해 가상 스크롤이 드래그 중 플레이스홀더 DOM을 다시 써도 섬이 포인터를 따라갑니다.

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
