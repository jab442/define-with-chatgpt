import { ENV } from './define-with-chat-gpt-key.js';

const apiKey = ENV.API_KEY;
console.log("Background script running");

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
    chrome.tabs.sendMessage(tab.id, { command: 'sendText' });
  }
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request: ", request.text);
  if (request.text) {
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Be cautious with your API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: request.text }],
        temperature: 0.5,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("API Response: ", data);
      if (data.choices && data.choices.length > 0) {
        chrome.tabs.sendMessage(sender.tab.id, { result: data.choices[0].message.content });
      } else {
        console.error("No data in API response");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});
