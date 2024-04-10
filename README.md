eas build --platform android --profile production

npm i
npm run web

npm rebuild node-sass
eas build --platform android --profile preview

TODO

- Add larger text quote sections
- Add indentation in articles
- Add lists in articles
- Add athletes of the week scroll across for each person
- Make new block separator lighter
- Add images on the side option
- Add some SPS branding
- Then make games: starting with cross word
- Add game results
-
- Instead of random articles appearing have an order for each issue and sections in the recent (probably not)
- - News, Student Life, Arts, Athletics: each one is a block
- - Athletics page is sports games and scores maybe athlete of the week and maybe articles
- - Incase you missed it, from previous issue
- - have meeting with someone on how to do it, look at the new york times front page as example: opinions, news, art idk

have athletics page with upcoming and previous games and use to copy articles using api
https://athletics.sps.edu/

Priority:

- Add quotes in articles as option
- Add indentation in articles
- Meeting about formatting front page and also athletics
- Work on the front page format and athletics
- In data base have each one be an issue, maybe create a custom gpt to convert these into issues
