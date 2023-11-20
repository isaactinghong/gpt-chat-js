# gpt-chat-js

## TODO

- [x] add GPT Vision support
- [x] add GPT Whisper support
- [ ] add GPT Dall-E support
- [ ] add GPT Text-to-speech support

## How to start gpt-chat-js

- react native

```shell
npm install # if you have not installed the dependencies
npx expo start --web
```

## What is gpt-chat-js

This application creates the chat interface for users to chat with gpt (gpt-4)

- the interface consists of a side menu and a chat window
- when user clicks top left menu icon, the side menu will slide in from the left

  - the side menu will display the list of chat conversations
  - the bottom of side menu display the followings:
    - input field for user to enter the gpt model name
      - default is 'gpt-4-vision-preview'
    - input field for user to enter system message
    - settings button for user to click to open the settings window
      - user can input the api key in the settings window and click the save button to save the api key
    - version number of the application

- the chat window will display the chat conversation selected from the side menu
- the chat conversation is a list of chat messages
- each chat message contains a text message, and may contain images
  - images are displayed as thumbnails listed at the bottom of the chat message in a wrapped row
  - user can click on the thumbnail to view the full image
- top navigation bar will display the title of the chat conversation
- at the right of the top navigation bar, there are action buttons:
  - `+` button: user can click on this button to start a new chat conversation
  - `...` button: user can click on this button to view the menu of the chat conversation
    - `Export` menu item: user can click on this menu item to export the chat conversation
- at the bottom of the chat window, there is a text input field for user to type text message
  - user can click on the `Attach` icon button to add an image to the chat message
    - when image is added, the image will be displayed as a thumbnail at the top of the text input field
    - user can click on the thumbnail to highlight the image
      - user can click on the `X` icon button to remove the image from the chat message
    - multiple images can be added to a single chat message to be sent
  - user can click on the `Send` icon button to send the chat message

<!-- ## Workbox CLI to generate a complete service worker

```shell
npx workbox-cli generateSW workbox-config.js
``` -->

## Deployment pwa to netlify with webpack export

```shell

npx expo export:web
netlify deploy --dir web-build --prod

```

## Useful resources

- OpenAI Node API Library [https://github.com/openai/openai-node]
- OpenAI Guide for Vision API [https://platform.openai.com/docs/guides/vision?lang=node]
