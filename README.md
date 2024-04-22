eas build --platform android --profile production

npm i
npm run web

npm rebuild node-sass
eas build --platform android --profile preview
