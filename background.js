import { ENV } from './define-with-chat-gpt-key.js';

//const apiKey = ENV.API_KEY;
let apiKey = '';
setApiKey();
function setApiKey(){
  chrome.storage.local.get('apiKey', (data) => {
    if (data.apiKey) {
      apiKey = data.apiKey.trim();
    }
  });
}
console.log("Background script running");
let lastResponse = '';
let model = "gpt-4-1106-preview";

// Listener for context menu selection
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendSelectedText",
    title: "Define with ChatGPT",
    contexts: ["selection"]
  });
});

// Listener for context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendSelectedText") {
    setApiKey();
    if (!apiKey) {
      chrome.windows.create({
        url: chrome.runtime.getURL("menu.html"),
        type: 'popup'
      });
      return;
    }
    let selectedText = info.selectionText;
    if (selectedText) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => document.body ? document.body.innerText : '',
      }, (injectionResults) => {
        if (chrome.runtime.lastError || !injectionResults || injectionResults.length === 0 || !injectionResults[0].result) {
          console.error('Error in script execution:', chrome.runtime.lastError?.message || 'No results returned');
          return;
        }

        let pageText = injectionResults[0].result;
        let content = `define: ${selectedText} in the context of: ${pageText}`;
        let tokenCount = Math.ceil(content.length / 4);
        content = (tokenCount <= 128000) ? content : `define: ${selectedText}`;

        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: content }],
            temperature: 0.5,
          })
        })
        .then(response => response.json())
        .then(data => {
          if(data.error){
            error(data.error.message);
            return;
          }
          lastResponse = data.choices[0].message.content;
          chrome.storage.local.set({ responseData: lastResponse }, function () {
            console.log('Data is set to ' + lastResponse);
            chrome.windows.create({
              url: chrome.runtime.getURL("popup.html"),
              type: 'popup',
              width: 1000,
              height: 800
            });
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    }
  }
});
function error(
  message = 'An error occurred. Please try again later.',
  title = 'Error'
) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/define-with-chat-gpt.png'),
    title,
    message
  });
}
