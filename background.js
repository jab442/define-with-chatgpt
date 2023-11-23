//background.js
import { ENV } from './define-with-chat-gpt-key.js';

const apiKey = ENV.API_KEY;
console.log("Background script running");
let lastResponse = '';
// Listener for context menu selection
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sendSelectedText",
        title: "Send Selected Text",
        contexts: ["selection"]
    });
});

// Listener for context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendSelectedText") {
      let selectedText = info.selectionText;
      if (selectedText) {
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Be cautious with your API key
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `define: ${selectedText}` }],
            temperature: 0.5,
          })
        })
        .then(response => response.json())
        .then(data => {
          lastResponse = data.choices[0].message.content; // Store the response
          //chrome.tabs.sendMessage(tab.id, { result: lastResponse });
          // Set the data in storage
            chrome.storage.local.set({ responseData: lastResponse }, function() {
                console.log('Data is set to ' + lastResponse);
                chrome.windows.create({
                    url:  chrome.runtime.getURL("popup.html"),
                    type: 'popup',
                    width: 400,
                    height: 300
                });
            });
            
            // Create the popup window

        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    }
  });
  