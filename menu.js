document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');

    chrome.storage.local.get('apiKey', (data) => {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving apiKey:', chrome.runtime.lastError);
            return;
        }

        if (data.apiKey) {
            apiKeyInput.value = data.apiKey;
            console.log('Loaded saved API key:', data.apiKey);
        }
    });

    apiKeyInput.addEventListener('change', () => {
        const newApiKey = apiKeyInput.value.trim();
        chrome.storage.local.set({ apiKey: newApiKey }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error saving apiKey:', chrome.runtime.lastError);
                return;
            }
            console.log('API key updated in storage:', newApiKey);
        });
    });
});
