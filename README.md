🧠 AI Nexus Core - Intelligent News Summarization 📰

AI Nexus Core is a futuristic, highly interactive web application that leverages Microsoft Azure Cognitive Services to transcribe speech, intelligently summarize massive text blocks, translate summaries into multiple languages, and read them aloud using premium neural voices.

The application features a stunning 3D glassmorphism UI with neon glowing effects, built entirely with vanilla web technologies.

✨ Features

🎤 Voice Dictation (STT): Dictate articles directly into the text area using Azure Speech-to-Text.

⚡ Extractive Summarization: Utilize Azure Language Services to semantically analyze and extract the most critical sentences from large articles.

🌍 Multilingual Localization: Instantly translate the generated summary into English, Hindi, Spanish, French, or Chinese.

🔊 Neural Text-to-Speech (TTS): Listen to the summarized and translated text via Azure's highly realistic Neural voices (with a built-in browser TTS fallback).

🔒 Secure Local Configuration: API keys are never hardcoded. Users enter their keys via a secure UI panel, which saves them locally in the browser's localStorage.

🎨 3D Cyberpunk Aesthetic: An immersive interface featuring floating elements, a moving perspective grid, and responsive animations.

🚀 Deployment (GitHub Pages)

This project is a 100% frontend application and requires no backend server. It is designed to be hosted directly on GitHub Pages.

How to Deploy:

Upload this code to your GitHub repository.

Go to your repository Settings > Pages.

Under Build and deployment, set the source to Deploy from a branch.

Select the main branch and the /root folder, then click Save.

Your site will automatically go live at https://<your-username>.github.io/<repository-name>/.

⚙️ Configuration (Azure Setup)

To use the AI features on the live website, you will need active Microsoft Azure Cognitive Services endpoints and keys. When you open the web app, click the "Azure API Configuration" panel at the top to enter your credentials:

Azure Language Resource: Required for the Summarization feature.

You need the Endpoint URL and the API Key.

Azure Speech Service: Required for Voice Dictation (STT) and Neural Audio Reading (TTS).

You need the Region (e.g., koreacentral, eastus) and the API Key.

Azure Translator: Required for multi-language translation.

You need the Region and the API Key.

Note: Your keys are stored purely in your browser's Local Storage and are never sent anywhere except directly to Microsoft Azure APIs.

🛡️ License

© 2026 AI Nexus Core. All Rights Reserved.

This project and its source code are strictly proprietary. Unauthorized copying, modification, distribution, or use of this project, via any medium, is strictly prohibited. You may not alter the code or claim it as your own.