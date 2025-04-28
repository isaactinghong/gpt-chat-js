# gpt-chat-js

## TODO

- [x] add GPT Vision support
- [x] add GPT Whisper support
- [x] add GPT Dall-E support
- [x] add GPT Text-to-speech support
- [ ] add conversation start date

## How to start gpt-chat-js

- react native

```shell
npm install # if you have not installed the dependencies
# bun install
npx expo start --web
# bunx expo start --web
```

## What is gpt-chat-js

gpt-chat-js is a cross-platform chat application (React Native + PWA) that provides a modern interface for interacting with OpenAI's GPT models, including GPT-4o, Vision, Whisper, DALL·E, and Text-to-Speech. It is designed for both web and mobile, supporting advanced AI features and a user-friendly chat experience.

**Key Features:**
- **Multi-modal AI chat:** Supports text, image (Vision), voice (Whisper), and image generation (DALL·E) interactions with OpenAI models.
- **Side menu navigation:** Slide-in menu for managing multiple chat conversations, switching models (default: 'gpt-4o-mini'), and accessing settings.
- **API key & system message management:** Securely input and save your OpenAI API key and customize system prompts.
- **Rich chat window:**
  - Displays chat history with support for text and image messages.
  - Images are shown as thumbnails; click to view full size.
  - Top bar shows conversation title and provides actions: start new chat, export/copy/delete conversation, generate images (DALL·E), and text-to-speech.
- **Message input:**
  - Attach multiple images to a message (Vision support).
  - Record and transcribe voice messages (Whisper integration).
  - Send text, images, or voice in a single message.
- **Export & copy:** Export or copy entire conversations for sharing or backup.
- **PWA & mobile ready:** Works as a Progressive Web App and as a React Native app.
- **Customizable:** Easily switch models, system messages, and manage settings.

**Supported OpenAI Features:**
- GPT-4o and other GPT models for chat
- GPT Vision (image understanding)
- Whisper (speech-to-text)
- DALL·E 3 (image generation)
- Text-to-Speech (voice generation)

This project is ideal for users who want a full-featured, multi-modal AI chat experience with OpenAI, accessible from both web and mobile platforms.

## Deployment pwa to netlify with webpack export

```shell
#netlify switch
npm version patch
git push --tags
git push --all

npx expo export:web
# bunx expo export:web
netlify deploy --dir web-build --prod

```

## Useful resources

- OpenAI Node API Library [https://github.com/openai/openai-node]
- OpenAI Guide for Vision API [https://platform.openai.com/docs/guides/vision?lang=node]
