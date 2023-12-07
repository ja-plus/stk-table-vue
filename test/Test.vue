<template>
  <div :class="{ active }" @click="active = !active">
    <component :is="dyComp()"></component>
  </div>
</template>
<script lang="jsx" setup>
import { defineComponent, ref } from 'vue';
const active = ref();
function dyComp(name) {
  return defineComponent({
    setup() {
      return () => <span>hello world{name}</span>;
    },
  });
}
</script>
