<script setup>
import { ref } from "vue";
import { XSLFormatting, addIndent } from "../scripts/xmlManipulate";

const props = defineProps({
  globalXmlProxy: Object,
});

const xmlText = ref(
  `<?xml version="1.0" encoding="UTF-8"?>\n<body>\n\n</body>`
);
const formatSuccess = ref(-1);

function formatXml() {
  try {
    formatSuccess.value = prettifyXml(xmlText.value);
  } catch (e) {
    console.log(e);
    console.log("invalid xml");
  }
}
addEventListener("xmlGraphUpdated", () => {
  xmlText.value = addIndent(
    new XMLSerializer().serializeToString(props.globalXmlProxy.get())
  );
});

function prettifyXml(xmlToFormat) {
  let xmlDoc = new DOMParser().parseFromString(xmlToFormat, "application/xml");
  if (xmlDoc.querySelector("parsererror")) {
    return 0; // malformed xml
  }
  let parsedDoc = XSLFormatting(xmlDoc);
  props.globalXmlProxy.set(parsedDoc);
  xmlToFormat = addIndent(new XMLSerializer().serializeToString(parsedDoc));
  return 1;
}

function computeStyle(isFormatSuccess) {
  if (isFormatSuccess == 1) {
    return { "border-width": "1px", "border-color": "green" };
  }
  if (isFormatSuccess == 0) {
    return { "border-width": "1px", "border-color": "red" };
  }
  return "";
}
</script>
<template>
  <form class="relative w-1/2 border-r-2">
    <textarea
      class="w-full h-full resize-none text-black"
      v-model="xmlText"
    ></textarea>
    <button
      type="button"
      class="absolute right-4 top-4 hover:bg-slate-200 active:bg-slate-400 shadow-md rounded-md p-2"
      :style="computeStyle(formatSuccess)"
      @click="
        () => {
          formatXml();
        }
      "
    >
      Format
    </button>
  </form>
</template>
