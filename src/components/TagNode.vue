<script setup>
import { ref } from "vue";
const props = defineProps({
  selfNode: Node,
});
const collapse = ref(false);
</script>
<template>
  <div
    class="relative h-10 min-w-[6rem] w-fit m-1 bg-green-300 rounded-md p-2 text-left"
  >
    <button
      v-if="selfNode.childNodes.length"
      @click="
        () => {
          collapse = !collapse;
        }
      "
      :style="collapse ? 'transform: rotate(90deg);' : ''"
      class="hover:bg-green-400 active:bg-green-500 w-6 h-6 text-center my-auto rounded-sm"
    >
      >
    </button>
    <button
      @click="
        () => {
          console.log(selfNode);
        }
      "
      class="hover:bg-green-400 active:bg-green-500 w-6 h-6 text-center my-auto rounded-sm"
    >
      ?
    </button>
    {{
      props.selfNode?.nodeType === 1
        ? props.selfNode.nodeName
        : props.selfNode.nodeValue
    }}
  </div>
  <div
    v-if="collapse"
    v-for="(subNode, index) in props.selfNode?.childNodes"
    :key="subNode.nodeName + index.toString()"
    class="relative left-10"
  >
    <TagNode :self-node="subNode"></TagNode>
  </div>
</template>
