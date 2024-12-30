// popup.js

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save-button");
    const apiKeyInput = document.getElementById("api-key");

    // Load the saved API key (if any) when the popup is opened
    chrome.storage.local.get("apiKey", (result) => {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
        }
    });

    // Save the API key when the button is clicked
    saveButton.addEventListener("click", () => {
        const apiKey = apiKeyInput.value;

        if (apiKey) {
            chrome.storage.local.set({ apiKey }, () => {
                alert("API key saved successfully!");
            });
        } else {
            alert("Please enter a valid API key.");
        }
    });
});
