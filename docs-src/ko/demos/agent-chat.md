# Agent 대화 가상 리스트

각 Agent 메시지를 `StkTable`의 행으로 표시하고 `virtual`과 `autoRowHeight`를 활성화해 화면에 보이는 행만 렌더링합니다. 사용자 버블, 사고, 검색, 터미널, 답변은 내용에 따라 자연스러운 높이를 사용합니다. OpenAI Chat Completions 호환 형식으로 익명 Qwen, DeepSeek 또는 사용자 지정 엔드포인트를 선택할 수 있습니다.

기본 Qwen 엔드포인트는 OVHcloud AI Endpoints입니다. 익명 요청은 가입이나 API Key가 필요 없지만 IP별 요청 제한이 있습니다. 공개 엔드포인트의 모델과 한도는 변경될 수 있습니다.

목록은 기본적으로 맨 아래를 따라가며, 위로 스크롤하면 추적을 멈추고 맨 아래로 돌아오면 다시 시작합니다. 표시 영역 높이는 반응형이며 너비가 바뀌면 측정된 행 높이를 지우고 가상 레이아웃을 다시 계산합니다.

하단 입력 영역에서 첨부 파일이나 이미지를 추가하고 SVG 드롭다운으로 모델을 전환할 수 있습니다. 목록의 마지막 ‘모델 관리’에서 새 모델을 설정할 수 있고, ‘사고’ 메뉴에서 사고 단계를 켜거나 끌 수 있습니다. 요청 중에는 대화에 대기 상태가 동적으로 표시되며, 인터페이스 오류도 메시지로 추가됩니다.

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
