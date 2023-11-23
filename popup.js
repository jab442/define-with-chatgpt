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
  