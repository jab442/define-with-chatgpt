// content.js
function getSelectedText() {
    //let selectedText = window.getSelection().toString().trim();
    let selectedText="Say this: Hello, how are you?"
    return selectedText;
  }
  
  chrome.runtime.sendMessage({ text: getSelectedText() });
  