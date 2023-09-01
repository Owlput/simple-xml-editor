<script setup>
import { computed, ref } from "vue";
import DoubleClickEditor from "./DoubleClickEditor.vue";
const props = defineProps({
  selfNode: Node,
  documentProxy: Object,
  parentToggleUpdate: Function,
});
const childUpdate = ref(1); // poor performance when large children count
const collapse = ref(false);
const computedStyle = computed(() => {
  switch (props.selfNode.nodeType) {
    case 1:
      return {
        bg: "bg-green-300",
        btn: "hover:bg-green-400 active:bg-green-500",
      };
    case 3:
      return {
        bg: "bg-yellow-300",
        btn: "hover:bg-yellow-400 active:bg-yellow-500",
      };
  }
});
function toggleUpdate() {
  childUpdate.value += 1;
  dispatchEvent(new CustomEvent("xmlGraphUpdated"));
}
function renameAction(nodeType,name){
  if (nodeType === 1){
    props.documentProxy.renameNode(props.selfNode, name);
  }
  if (nodeType === 3){
    props.documentProxy.updateTextNode(props.selfNode, name)
  }
  props.parentToggleUpdate()
}
</script>
<template>
  <div :class="'flex flex-row justify-center h-10 w-fit m-1 rounded-md p-2 ' + computedStyle.bg">
    <button
      v-if="selfNode.childNodes.length"
      @click="
        () => {
          collapse = !collapse;
        }
      "
      :style="collapse ? 'transform: rotate(90deg);' : ''"
      :class="'w-6 h-6 text-center my-auto rounded-sm ' + computedStyle.btn"
    >
      >
    </button>
    <button
      v-if="props.selfNode.nodeType !== 3"
      @click="
        () => {
          console.log(props.selfNode)
        }
      "
      :class="'w-6 h-6 text-center my-auto rounded-sm ' + computedStyle.btn"
    >
      ?
    </button>
    <DoubleClickEditor
      :content="
        props.selfNode.nodeType === 1
          ? props.selfNode.nodeName
          : props.selfNode.nodeValue
      "
      :value-update="
        (name) => {
          renameAction(props.selfNode.nodeType,name)
        }
      "
    />
  </div>
  <li class="relative list-none">
    <ol
      v-if="collapse"
      v-for="(subNode, index) in props.selfNode.childNodes"
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
</template>
