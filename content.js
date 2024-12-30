// content.js
const problemDataMap = new Map();
window.addEventListener("xhrDataFetched", (event) => {
    const data = event.detail;
    console.log("Inside Content.js")
    console.log(typeof (data.response));
    console.log(JSON.parse(data.response).data.hints);
    const ifQuestion = data.url.split("/");
    const qid = ifQuestion[ifQuestion.length - 1];


    if (/problems/.test(data.url) && /^\d+$/.test(qid)) {

        problemDataMap.set(qid, JSON.parse(data.response));
        console.log(`Stored data for problem ID ${qid}:`, data.response);
    } else {
        console.log("Invalid problem ID or not related to a problem.");
    }
})
window.addEventListener("load", () => {
    insertInjectionScript();
    addButtons();


});
// console.log({ ...localStorage });


// Observer for DOM changes
const observer = new MutationObserver(() => {
    // insertInjectionScript();
    insertInjectionScript();
    console.log("Page changes detected");
    if (handleURLchange() && onProblemPage()) {
        chatHistory = [];
        console.log("URL changed, and on the problem page. Adding AI button and removing chatbox");
        const chatBox = document.querySelector("#AIChatBox");
        if (chatBox) {
            chatBox.remove();
        }
        // chatHistory=[]
        addButtons();
        // insertInjectionScript();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
function insertInjectionScript() {
    const newScript = document.createElement("script");
    newScript.src = chrome.runtime.getURL("inject.js");


    newScript.onload = () => newScript.remove();


    document.documentElement.insertBefore(newScript, document.documentElement.firstChild);
}

// Utility Functions
function onProblemPage() {
    return window.location.pathname.includes("/problems/");
}

let previousURL = window.location.href;
function handleURLchange() {
    const currentURL = window.location.href;
    if (previousURL !== currentURL) {
        previousURL = currentURL;
        console.log(currentURL);
        console.log("URL changed");
        return true;
    }
    console.log("URL remains the same");
    return false;
}


function addButtons() {
    console.log("Adding AI button");
    const parent = document.querySelector(".coding_leftside_scroll__CMpky.pb-5");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    const buttonAlready = document.querySelector("#AIbuttonAddedForChatting");
    if (buttonAlready) {
        buttonAlready.remove();
    }

    const AIButton = document.createElement("button");
    AIButton.id = "AIbuttonAddedForChatting";
    AIButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_dark_button__r0EJI py-2 px-4";
    AIButton.innerText = "AI Help";
    AIButton.style.backgroundColor = "#005478";
    AIButton.style.color = "white";
    AIButton.style.marginLeft = "20px";
    AIButton.style.marginBottom = "20px";

    parent.appendChild(AIButton);

    AIButton.addEventListener("click", () => {
        AIButton.remove();

        const ChatBox = document.createElement("div");
        ChatBox.id = "AIChatBox";
        ChatBox.style.width = "95%";
        ChatBox.style.marginLeft = "2.5%";
        ChatBox.style.height = "400px";
        ChatBox.style.border = "1px solid #ccc";
        ChatBox.style.borderRadius = "8px";
        ChatBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        ChatBox.style.backgroundColor = "#fff";
        ChatBox.style.display = "flex";
        ChatBox.style.flexDirection = "column";
        ChatBox.style.marginTop = "20px";

        ChatBox.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; background-color: #005478; color: white; padding: 10px; font-weight: bold; border-radius: 8px 8px 0 0;">
                    <span>AI Chatbox</span>
                    <button id="CloseChatBox" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">&times;</button>
                </div>
                <div style="flex: 1; padding: 10px; overflow-y: auto;" id="AIChatBody">
                    <div style="margin-bottom: 10px; text-align: left;">
                        <span style="background-color: #DCF6FE; padding: 8px 12px; border-radius: 12px; display: inline-block;">Hello! How can I help you?</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; padding: 10px; border-top: 1px solid #ccc;">
                    <input type="text" placeholder="Type a message..." id="AIChatInput" style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 20px; outline: none;">
                    <button id="AISendButton" style="background-color: #005478; color: white; border: none; padding: 10px 15px; margin-left: 10px; border-radius: 20px; cursor: pointer;">Send</button>
                    <button id="ClearChatButton" style="background-color: #FF5722; color: white; border: none; padding: 10px 15px; margin-left: 10px; border-radius: 20px; cursor: pointer;">Clear</button>
                </div>
                `;

        parent.appendChild(ChatBox);

        const closeButton = ChatBox.querySelector("#CloseChatBox");
        closeButton.addEventListener("click", () => {
            ChatBox.remove();
            parent.appendChild(AIButton);
        });

        const sendButton = ChatBox.querySelector("#AISendButton");
        const clearButton = ChatBox.querySelector("#ClearChatButton");
        const chatBody = ChatBox.querySelector("#AIChatBody");
        const chatInput = ChatBox.querySelector("#AIChatInput");

        sendButton.addEventListener("click", sendMessage);
        chatInput.addEventListener("keydown", (keyPressed) => {
            if (keyPressed.key === "Enter") {
                keyPressed.preventDefault();
                sendMessage();
            }
        });

        clearButton.addEventListener("click", () => {
            clearChatHistory();
            chatBody.innerHTML = `
                    <div style="margin-bottom: 10px; text-align: left;">
                        <span style="background-color: #DCF6FE; padding: 8px 12px; border-radius: 12px; display: inline-block;">Chat history cleared. Start a new conversation!</span>
                    </div>
                    `;
        });

        let chatHistory = [];

        // Clear chat history function
        function clearChatHistory() {
            chatHistory = [];
            localStorage.removeItem("chatHistory_" + extractProblemDetails());
            console.log("Chat history cleared");
        }

        loadChatHistory();

        // let chatHistory = [];

        // Function to update and display chat history
        function updateChatHistory(userMessage, aiMessage) {
            // Push user and AI messages into chatHistory array in the required format
            chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
            chatHistory.push({ role: "model", parts: [{ text: aiMessage }] });

            // Store updated chatHistory in localStorage with problem ID
            localStorage.setItem("chatHistory_" + extractProblemDetails(), JSON.stringify(chatHistory));
        }

        // Function to load previous chat history from localStorage
        function loadChatHistory() {
            const storedHistory = localStorage.getItem("chatHistory_" + extractProblemDetails());
            if (storedHistory) {
                chatHistory = JSON.parse(storedHistory);
                const chatBody = document.querySelector("#AIChatBody");

                // Display all messages from chatHistory
                chatHistory.forEach(messageObj => {
                    const messageText = messageObj.parts[0].text;
                    if (messageObj.role === "user") {
                        const userDiv = document.createElement("div");
                        userDiv.style.textAlign = "left";
                        userDiv.style.marginBottom = "10px";
                        userDiv.innerHTML = `<span style="background-color: #005478; color: white; padding: 8px 12px; border-radius: 12px; display: inline-block;">${messageText}</span>`;
                        chatBody.appendChild(userDiv);
                    } else if (messageObj.role === "model") {
                        const aiDiv = document.createElement("div");
                        aiDiv.style.textAlign = "left";
                        aiDiv.style.marginBottom = "10px";
                        aiDiv.innerHTML = `<span style="background-color: #DCF6FE; padding: 8px 12px; border-radius: 12px; display: inline-block;">${messageText}</span>`;
                        chatBody.appendChild(aiDiv);
                    }
                });
                chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
            }
        }


        const promptBegin = ` This is a System prompt , youa re just supposed to take context from this chat, ALL the questions below will have same context with this prompt only, the question description, solution, hint, editorial code will be provided int his and you will take context from this only and answer all the questions and then anser the following chats accoridingly, the 1st message sent by me will be attatched to this pompt after the words: this is my 1st message,You are a highly skilled coding assistant designed to help users with programming-related tasks. Your goal is to provide accurate, concise, and helpful responses to coding queries, including debugging, explaining concepts, writing code snippets, optimizing algorithms, and helping with software development best practices.

Prompt for AI Chatbot:
"You are a friendly and approachable programming mentor AI, here to assist users with coding, software development, and technical problem-solving. Follow these guidelines:

Be Relevant and Professional: Only respond to questions or topics related to programming, software development, coding concepts, debugging, and best practices. Politely decline unrelated queries by encouraging the user to focus on technical topics.

Be Concise and Helpful: Provide clear and straightforward explanations, examples, or code snippets to address user queries. Ensure the responses are practical, easy to understand, and tailored to the user's level of expertise.

Code Quality and Best Practices: Any code you provide should be functional, well-commented, and adhere to modern programming standards. Highlight key concepts or techniques where relevant.

Encourage Learning and Growth: Foster a positive learning environment by explaining concepts in a beginner-friendly manner when needed. Offer guidance on best practices, debugging techniques, and logical problem-solving.

Maintain a Friendly Tone: Engage the user in a warm, supportive manner, like a mentor eager to help. If the query is vague or ambiguous, ask clarifying questions to understand their needs better.

Decline Off-Topic Queries: For unrelated questions, respond politely with something like:
'I’m here to assist with programming-related queries. Let me know how I can help with your code!'

Stay focused, professional, and friendly to ensure users feel supported and motivated in their programming journey."
The following is the user code: `;

        async function sendMessage() {
            const xhrHintsAndSolution = problemDataMap.get(extractProblemDetails());
            const userMessage = chatInput.value.trim();
            if (userMessage) {

                // Display the user message
                const userDiv = document.createElement("div");
                userDiv.style.textAlign = "left";
                userDiv.style.marginBottom = "10px";
                userDiv.innerHTML = `<span style="background-color: #005478; color: white; padding: 8px 12px; border-radius: 12px; display: inline-block;">${userMessage}</span>`;
                chatBody.appendChild(userDiv);
                chatInput.value = "";
                chatBody.scrollTop = chatBody.scrollHeight;

                // Add problem context to the first user message
                if (chatHistory.length === 0) {
                    const userPrompt = promptBegin + `
                Problem Description:${JSON.stringify(xhrHintsAndSolution.data.body)}
                Hints:${JSON.stringify(xhrHintsAndSolution.data.hints)}
                Editorial_Code:${JSON.stringify(xhrHintsAndSolution.data.editorial_code)}
                Sample Inputs:${JSON.stringify(xhrHintsAndSolution.data.samples.input)}
                Sample Outputs:${JSON.stringify(xhrHintsAndSolution.data.samples.output)}
                Constraints:${JSON.stringify(xhrHintsAndSolution.data.constraints)}`;

                    // Push the first user message with context
                    chatHistory.push({ role: "user", parts: [{ text: userPrompt + `this is my 1st message` + userMessage }] });
                } else {
                    // Add user message to history
                    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
                }
                console.log("Hello This is from send chat")
                console.log(chatHistory);
                // Retrieve API key from localStorage
                chrome.storage.local.get("apiKey", async (result) => {
                    const apiKey = result.apiKey;
                    if (!apiKey) {
                        const errorDiv = document.createElement("div");
                        errorDiv.style.textAlign = "left";
                        errorDiv.style.marginBottom = "10px";
                        errorDiv.innerHTML = `<span style="background-color: #FFCDD2; padding: 8px 12px; border-radius: 12px; display: inline-block; color: #B71C1C;">Error: API key not found. Please set your API key in the extension settings.</span>`;
                        chatBody.appendChild(errorDiv);
                        chatBody.scrollTop = chatBody.scrollHeight;
                        return;
                    }

                    try {
                        const userCode = getCodeKey();

                        // Prepare the request body with content structured in the required format
                        const requestBody = {
                            "contents": chatHistory // Send only user and model roles
                        };
                        console.log(requestBody)
                        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(requestBody)
                        });

                        const data = await response.json();

                        // Log the response to inspect its structure
                        console.log("API Response:", data);

                        // Check if response structure contains the expected data
                        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                            const aiMessage = data.candidates[0].content.parts[0].text;

                            // Display AI response and update chat history
                            const aiDiv = document.createElement("div");
                            aiDiv.style.textAlign = "left";
                            aiDiv.style.marginBottom = "10px";
                            aiDiv.innerHTML = `<span style="background-color: #DCF6FE; padding: 8px 12px; border-radius: 12px; display: inline-block;">${aiMessage}</span>`;
                            chatBody.appendChild(aiDiv);
                            chatBody.scrollTop = chatBody.scrollHeight;

                            // Push the AI message to the chat history and update localStorage
                            updateChatHistory(userMessage, aiMessage);
                        } else {
                            console.error("Invalid response structure:", data);
                            const errorDiv = document.createElement("div");
                            errorDiv.style.textAlign = "left";
                            errorDiv.style.marginBottom = "10px";
                            errorDiv.innerHTML = `<span style="background-color: #FFCDD2; padding: 8px 12px; border-radius: 12px; display: inline-block; color: #B71C1C;">Error: Invalid response structure from the AI model.</span>`;
                            chatBody.appendChild(errorDiv);
                            chatBody.scrollTop = chatBody.scrollHeight;
                        }
                    } catch (error) {
                        console.error("Error fetching AI response:", error);
                        const errorDiv = document.createElement("div");
                        errorDiv.style.textAlign = "left";
                        errorDiv.style.marginBottom = "10px";
                        errorDiv.innerHTML = `<span style="background-color: #FFCDD2; padding: 8px 12px; border-radius: 12px; display: inline-block; color: #B71C1C;">Error: Could not fetch AI response. Please try again later.</span>`;
                        chatBody.appendChild(errorDiv);
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }
                });
            }
        }

        // Load chat history when the page is loaded or refreshed
        loadChatHistory();




    });
    extractProblemDetails();
    // printProblemNumber();
}

function extractProblemDetails() {
    const urlName = window.location.pathname;
    const splitSlash = urlName.split('/');
    const problemNameAndNumber = splitSlash[splitSlash.length - 1];
    const parts = problemNameAndNumber.split('-');
    const problemNumber = parts.pop();
    const problemName = parts.join(' ');

    console.log(`Problem Name: ${problemName}`);
    console.log(`Problem Number: ${problemNumber}`);
    return problemNumber;
}

function getCodeKey() {
    // const pooraLocalStorage = { ...localStorage };
    for (let i = 0; i < localStorage.length; i++) {
        // Get the key at index i
        const keys = localStorage.key(i);
        const problemId = keys.split('_')[2]
        if (problemId == extractProblemDetails()) {
            return localStorage.getItem(keys);
        }

    }
    return "";
}

//color 2B394F
// 
// 

