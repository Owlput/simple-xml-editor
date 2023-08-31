<script setup>
import { ref } from "vue";
import XmlGraphGenerator from "./XmlGraphGenerator.vue";
import XmlTextEdit from "./XmlTextEdit.vue";
const formattedXml = ref(
  new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?>\n<body>\n\n</body>`,
    "text/xml"
  )
);
function formattedXmlSetter(document) {
  formattedXml.value = document;
}
</script>
<template>
  <main class="w-full h-full flex flex-row">
    <XmlTextEdit :formatted-xml-setter="formattedXmlSetter" />
    <XmlGraphGenerator :document="formattedXml" />
  </main>
</template>
