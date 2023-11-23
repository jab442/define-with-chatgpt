// content.js
/*
function getSelectedText() {
    //let selectedText = window.getSelection().toString().trim();
    let selectedText="Say this: Hello, how are you?"
    return selectedText;
  }
  
  chrome.runtime.sendMessage({ text: getSelectedText() });
  */
 /*
function getSelectedText() {
    return window.getSelection().toString().trim();
}

// Listen for the context menu item click
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'sendText') {
        chrome.runtime.sendMessage({ text: getSelectedText() });
    }
});*/
// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "fetchResponse"});
    });
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "displayResponse") {
        document.getElementById('response').textContent = request.data;
      }
    });
  });
  