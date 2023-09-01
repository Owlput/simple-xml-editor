export function getXPath(node) {
    if (!node) {
      return "";
    }
  
    if (node.nodeType === Node.ELEMENT_NODE) {
      let nth = 0;
      let arr = Array.from(node.parentNode.children);
      const index = arr.indexOf(node);
      for (let i = 0; i <= index; i++) {
        if (arr[i].nodeName === node.nodeName) nth += 1;
      }
  
      return getXPath(node.parentNode) + `/${node.tagName.toLowerCase()}[${nth}]`;
    }
  
    return getXPath(node.parentNode);
  }
  
  // properly format xml without indent
  // from https://stackoverflow.com/questions/376373/pretty-printing-xml-with-javascript
  export function XSLFormatting(document) {
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
    return xsltProcessor.transformToDocument(document);
  }
  
  // add indents
  // from https://jsfiddle.net/fbn5j7ya/
  export function addIndent(xmlText, tab = "\t", nl = "\n") {
    let formatted = "",
      indent = "";
    const nodes = xmlText.slice(1, -1).split(/>\s*</);
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
    return formatted;
  }
  
  export function replaceChild(document,childPath,oldChild,newChild){
    let path_arr = childPath.split("/");
      path_arr.pop();
      let parent_node = document.evaluate(
        path_arr.join("/"),
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      parent_node.replaceChild(newChild, oldChild);
  }