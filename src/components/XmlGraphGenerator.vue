<script setup>
import { ref } from "vue";
import TagNode from "./TagNode.vue";
const props = defineProps({
  document: Object,
  documentProxy: Object
});
const childUpdate = ref(1); // poor performance when large children count
const collapse = ref(false);
function toggleUpdate(){
  childUpdate.value +=1
  dispatchEvent(new CustomEvent("xmlGraphUpdated"))
}
</script>
<template>
  <div class="w-1/2">

    <div :class="'h-10 w-fit m-1 rounded-md p-2 text-left bg-red-300'">
    <button
      v-if="props.document.activeElement.childNodes.length"
      @click="
        () => {
          collapse = !collapse;
        }
      "
      :style="collapse ? 'transform: rotate(90deg);' : ''"
      :class="'w-6 h-6 text-center my-auto rounded-sm hover:bg-red-400 active:bg-red-500'"
    >
      >
    </button>
    {{ props.document.activeElement.nodeName }}
  </div>
  <li class="relative list-none">
    <ol
      v-if="collapse"
      v-for="(subNode, index) in props.document.activeElement.childNodes"
      :key="subNode.nodeName + index + childUpdate"
      class="relative left-10"
    >
      <TagNode
        :self-node="subNode"
        :document-proxy="props.documentProxy"
        :parent-toggle-update="toggleUpdate"
      ></TagNode>
    </ol>
  </li>
  </div>
</template>
