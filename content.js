//alert("content")
// content.js
function getSelectedText() {
    let selectedText = window.getSelection().toString().trim();
    return selectedText;
  }
  
  chrome.runtime.sendMessage({ text: getSelectedText() });
  