<script setup>
import { ref } from "vue";

const props = defineProps({
  formattedXmlSetter: Function,
});

const xmlText = ref(
  `<?xml version="1.0" encoding="UTF-8"?>\n<body>\n\n</body>`
);
const formatSuccess = ref(-1);

function formatXml() {
  try {
    formatSuccess.value = prettifyXml(xmlText);
  } catch (e) {
    console.log("invalid xml");
  }
}

function prettifyXml(xmlToFormat, tab = "\t", nl = "\n") {
  // properly format xml without indent
  // from https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
  let xmlDoc = new DOMParser().parseFromString(
    xmlToFormat.value,
    "application/xml"
  );
  if (xmlDoc.querySelector("parsererror")) {
    return 0; // malformed xml
  }
  let xsltDoc = new DOMParser().parseFromString(
    [
      // describes how we want to modify the XML using XSL
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
      '    <xsl:value-of select="normalize-space(.)"/>',
      "  </xsl:template>",
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      "  </xsl:template>",
      "</xsl:stylesheet>",
    ].join("\n"),
    "application/xml"
  );

  let xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  props.formattedXmlSetter(resultDoc);

  // add indents
  // from https://jsfiddle.net/fbn5j7ya/
  let formatted = "",
    indent = "";
  const nodes = new XMLSerializer()
    .serializeToString(resultDoc)
    .slice(1, -1)
    .split(/>\s*</);
  if (nodes[0][0] == "?") formatted += "<" + nodes.shift() + ">" + nl;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node[0] == "/") indent = indent.slice(tab.length); // decrease indent
    formatted += indent + "<" + node + ">" + nl;
    if (
      node[0] != "/" &&
      node[node.length - 1] != "/" &&
      node.indexOf("</") == -1
    )
      indent += tab; // increase indent
  }
  xmlToFormat.value = formatted;
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
