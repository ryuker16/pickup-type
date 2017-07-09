
Pickup-type is an Angular 2/typescript conversion of the original Angular 1.5 version
to Angular2 for Pick Up sports. Still a work in progress about 87% complete.

Version: 0.8.8

Live Alpha preview version here : http://picksupsports.com/,  http://52.27.228.148:4000/

Some features are disabled like removing/hiding events not 1 week away, Meetup API auto-updating or passed events.

Ionic2 version coming soon so we can get the iOS/Android version out/

Purpose:
Social Sports app designed to facilitate quick pick up games: users can make sport game
and see ones pulled from various event APIs. The goal is a super simply way to find
pick up games or create sport activities. Authentication is handled via facebook and setting up
user profiles on our Node Server.

Currently focusing marketing efforts on Nashville market for test purposes.

While social sport apps have been created before, all have failed due to a lack of users
however utilizing multiple event api to source games gives many new events weekly for sport/outdoor fans
thus bypassing the lack of user posted events entirely

TODO:
* Mobile UI menu drop down scroll fix or replace with proper app drawer
* Convert to mobile App via Ionic2
* Add ability to post event to user's facebook page, share via email or
* Add Captcha to form and validators
* Add ability to add event to ical or google calendars


Future features:
* Connect to a sport live events API for users who only want to find events to watch live
* Add other cities than Nashville
* More social media features
* Add Live events sections for those who prefer to watch.
* Kid Sports section?

--Structure of App--
 src folder - index.ts loads our AppModule containing all components

 src/app folder - contains all components and AppModule files. Suggest starting index.ts
 and continuing on to the parent component MenuComponent in src/app/components/menu to read more
 on how the app functions. Everything is now 100% commented well.

 dist - contains production build. "npm run build" to output a production build.

 conf - webpack, karma, browser sync, configuration files.

--Install instructions for team members below --

download repo and install :
Remember to modify he angular2-google-maps module per your email instructions to have
mouse over popups working.

"npm run start" or "gulp serve" if you have gulp CLI installed

https://github.com/ryuker16/pickup-type

express repo contains backend API code.
