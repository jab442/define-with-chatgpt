// popup.js
chrome.storage.local.get(['responseData'], function(result) {
  if (result.responseData) {
    document.getElementById('content').textContent = result.responseData;
  }
});