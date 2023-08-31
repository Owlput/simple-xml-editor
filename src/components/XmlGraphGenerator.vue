<script setup>
import TagNode from "./TagNode.vue";
const props = defineProps({
  document: XMLDocument,
});
</script>
<template>
  <div class="w-1/2">
    <TagNode :self-node="props.document.activeElement"></TagNode>
  </div>
</template>
