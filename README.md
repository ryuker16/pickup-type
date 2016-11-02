
Pickup-type is an Angular 2/typescript conversion of the original Angular 1.5 version for Pick Up sports. Still a work in progress about 93% complete.

Current preview version here : http://52.11.14.57:4000/






--Install instructions for team members below --

main module is app/index.ts.

The app is pretty simple and commented with all the info on how things work.

You can ignore the yellow warnings about module cases, I believe it has something to do
with windows/linux line spacing. doesn't effect app.

Instructions(obviously run 'npm install --save' after downloading github Repos)

1. have mongo database running:

Install instructions for mongo db:

install mongodb and run 'C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe' after.
If it opens and closes immediately then you need to add a config file first:

make file in 'C:\Program Files\MongoDB\Server\3.4'

name it 'mongod.cfg' and add the below to your file;
--------------------
systemLog:
    destination: file
    path: C:\Program Files\MongoDB\Server\3.4\logs\mongod.log
storage:
    dbPath: C:\Program Files\MongoDB\Server\3.4\data
-------------------
2. backend(requires you have mongodb running)  - "npm run start"

https://github.com/ryuker16/pickup-backend

3. frontend - "npm run start"

https://github.com/ryuker16/pickup-type



TODO list:

add map marker overlay
create responsive menu/ui that doesn't look like crap
get search bar to search events
Event api is up(api/events) but I still need to make a better form.

minor issues: more interfaces and unit tests.
