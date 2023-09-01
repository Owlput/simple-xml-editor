<script setup>
import { ref } from "vue";
import XmlGraphGenerator from "./XmlGraphGenerator.vue";
import XmlTextEdit from "./XmlTextEdit.vue";
import { getXPath, replaceChild } from "../scripts/xmlManipulate";
let globalXML = ref(
  new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?>\n<body>\n\n</body>`,
    "text/xml"
  )
);

const xmlProxy = {
  renameNode(node, name) {
    let path = getXPath(node);
    let target_node = globalXML.value.evaluate(
      path,
      globalXML.value,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let new_node = globalXML.value.createElement(name);
    target_node.childNodes.forEach((child) => {
      new_node.appendChild(child.cloneNode(true));
    });
    replaceChild(globalXML.value, path, target_node, new_node);
  },
  updateTextNode(node, content) {
    let path = getXPath(node) + "/text()";
    let target_node = globalXML.value.evaluate(
      path,
      globalXML.value,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    replaceChild(
      globalXML.value,
      path,
      target_node,
      globalXML.value.createTextNode(content)
    );
  },
  set(document) {
    globalXML.value = document;
  },
  get() {
    return globalXML.value;
  },
};
</script>
<template>
  <main class="w-full h-full flex flex-row">
    <XmlTextEdit :global-xml-proxy="xmlProxy" />
    <XmlGraphGenerator :document="globalXML" :document-proxy="xmlProxy" />
  </main>
</template>
