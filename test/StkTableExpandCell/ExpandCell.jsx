import { computed, defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  props: ['col', 'row'],
  setup(props) {
    const cellWrapper = ref(null);
    const cellStyle = ref({
      maxHeight: '40px',
      overflow: 'hidden',
      position: 'relative',
    });
    const buttonExpandStyle = reactive({
      float: 'right',
    });
    const buttonFoldStyle = reactive({
      position: 'absolute',
      right: 0,
      bottom: 0,
    });
    function toggleCell() {
      if (cellStyle.value.maxHeight) {
        cellStyle.value.maxHeight = null;
      } else {
        cellStyle.value.maxHeight = '40px';
      }
    }
    const showButton = ref(false);
    const isFold = computed(() => Boolean(cellStyle.value.maxHeight));
    onMounted(() => {
      showButton.value = cellWrapper.value.scrollHeight > cellWrapper.value.clientHeight;
    });
    return () => (
      <div ref={cellWrapper} style={cellStyle.value}>
        {props.row[props.col?.dataIndex]}
        <button
          v-show={showButton.value}
          style={isFold.value ? buttonFoldStyle : buttonExpandStyle}
          onClick={toggleCell}
        >
          {isFold.value ? '展开▼' : '收起▲'}
        </button>
      </div>
    );
  },
});
