// popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.result) {
      document.getElementById('result').textContent = request.result;
    }
  });
  
  // Send a message to the content script to trigger getting the selected text.
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { trigger: "getResult" });
  });
  