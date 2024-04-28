eas build --platform android --profile production
ios-uploader -u  -p  -f ""
npm i
npm run web

npm rebuild node-sass
eas build --platform android --profile preview
works when ios folder not there