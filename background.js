import { ENV } from './define-with-chat-gpt-key.js';

const apiKey = ENV.API_KEY;
console.log("background");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("request"+request.text);
    if (request.text) {
      //fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${apiKey}`// Be cautious with your API key; don't expose it in client-side scripts.
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          //prompt: request.text,
          //max_tokens: 150
          messages:[{role:"user",content:request.text}],
          temperature:0.5,
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Data: " + data + " choices" + data.choices[0].message.content);
        chrome.tabs.sendMessage(sender.tab.id, { result: data.choices[0].message.content });
        //alert("Data: " + data)
        
      })
      .catch(error => {
        console.error('Error:', error)
        //alert("Error: " + error )
      });
    }
  });
  