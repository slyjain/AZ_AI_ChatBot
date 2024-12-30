# AZ_AI_ChatBot
# AI Chat Assistant Chrome Extension

## Overview
This Chrome extension integrates an AI-powered chatbot seamlessly into a coding platform. It provides contextual assistance by extracting problem-specific data and facilitating interactive conversations with the AI model, leveraging the latest advancements in AI language technology.

The extension operates with two primary components:
- **Content.js**: Manages the dynamic injection of scripts, handles user interactions, observes page changes, and creates a visually appealing chatbot interface.
- **Inject.js**: Intercepts and processes network requests to fetch relevant problem-related data, which serves as the foundation for AI-driven contextual responses.

---

## Features

### Intelligent Chat Assistant
- **Problem Contextual Assistance**: Extracts problem descriptions, hints, sample inputs/outputs, and constraints to provide tailored AI responses.
- **Persistent Chat History**: Stores and retrieves chat history based on the problem, ensuring users can revisit previous conversations.
- **Clear Chat Option**: Allows users to reset the conversation and start fresh while maintaining context-specific interactions.

### Seamless Integration
- **Dynamic Script Injection**: Ensures the extension functions without interfering with the platform's core functionality.
- **Page Change Detection**: Adapts to dynamic routing and ensures the chatbot remains relevant to the current page.

### Customizable Chat Interface
- **AI Help Button**: Initiates the chatbot with a user-friendly interface.
- **Minimalist Design**: Clean and responsive UI with easy-to-use controls.
- **Theming**: Utilizes consistent color schemes to match the platform's aesthetics.

### Backend Interception
- **Request Interception**: Captures network requests and extracts valuable context data.
- **Efficient Storage**: Uses a Map to associate problem IDs with corresponding data, ensuring fast and reliable access.

---

## How It Works

### Inject.js
The `inject.js` script is embedded into the webpage to:
1. **Intercept Fetch/XHR Requests**:
   - Listens for specific network calls related to problem data.
   - Dispatches a custom event with the extracted details for further processing.
2. **Emit Custom Events**:
   - Passes the fetched data to `content.js` via events for streamlined integration.

### Content.js
The `content.js` script serves as the brain of the extension:
1. **Script Injection**:
   - Dynamically injects `inject.js` into the webpage.
   - Removes the script post-execution to maintain a clean DOM.
2. **Event Handling**:
   - Captures and processes data dispatched by `inject.js`.
   - Associates problem IDs with fetched data for contextual AI assistance.
3. **UI Management**:
   - Observes DOM changes to dynamically add or update the AI help button.
   - Creates a chatbot interface with features like message sending, clearing history, and conversation scrolling.
4. **Persistent Storage**:
   - Saves and retrieves chat history in `localStorage`, uniquely tied to the problem ID.
5. **API Integration**:
   - Sends user queries to the AI model via API calls.
   - Displays AI-generated responses in real-time.

---

## Setup Instructions

### Prerequisites
- Google Chrome or a Chromium-based browser.
- An API key for the AI language model (e.g., Gemini).

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
## Add API Key
1. Open the `manifest.json` file or extension settings.
2. Insert your AI API key into the designated storage location.

## Load the Extension
1. Open `chrome://extensions/` in your browser.
2. Enable "Developer mode" in the top-right corner.
3. Click on "Load unpacked" and select the project directory.

## Verify Installation
1. Navigate to the target coding platform.
2. Check for the "AI Help" button on problem pages.

---

## Usage
1. Click on the **AI Help** button to open the chatbot.
2. Interact with the AI for problem-specific assistance.
3. Use the clear chat button to reset conversations as needed.
4. Navigate to a new problem to trigger context updates automatically.

---

## Features Showcase

### Screenshots
- **AI Help Button**: A floating button added dynamically to the problem page.
- **Chat Interface**: A clean, responsive chat window with user-friendly controls.

### Videos
- **Dynamic Page Interaction**: Demonstrates the extension's ability to adapt to page changes.
- **Contextual AI Responses**: Showcases AI-generated answers tailored to problem descriptions.

*Insert images and video links here.*

---

## Technical Highlights

### Advanced Techniques
- **Mutation Observers**: Detect DOM changes to dynamically inject UI components.
- **Efficient Data Management**: Maps and `localStorage` ensure fast, context-specific interactions.
- **Robust Event Handling**: Seamlessly bridges `inject.js` and `content.js` through custom events.
- **API Optimization**: Structures requests to maximize AI response relevance.

### Code Quality
- **Modular, Reusable Functions**: Designed for maintainability.
- **Well-Commented Code**: Ensures clarity and extensibility.
- **Error Handling**: Robust operation under various scenarios.

---

## Future Enhancements
- **Customizable Settings**: Allow users to adjust chat preferences (e.g., themes, text size).
- **Multi-Language Support**: Enable assistance in different programming languages.
- **Improved Persistence**: Sync chat history across devices.
- **Enhanced UI**: Incorporate animations and accessibility features.

---

## Contribution
We welcome contributions to enhance this project! Feel free to:
1. Fork the repository.
2. Submit issues or feature requests.
3. Create pull requests with improvements.

---

## Acknowledgments
This project was developed as part of a hackathon. Special thanks to our mentors and peers for their guidance and support.
