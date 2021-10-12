# Table of Contents
1. [What am I looking at?](#what-am-i-looking-at?)
2. [How to run the repository](#how-to-run-the-repository)
3. [How does it work?](#how-does-it-work)
4. [The nitty-gritty](#the-nitty-gritty)
> 1. [Utility Functions](#utils)
> 2. [Apollo and GraphQL](#graphql)
> 3. [Services](#services)
> 4. [Types and classes](#types-and-classes)
> 5. [Components](#components)
> 6. [Auth Route](#auth)
> 7. [Account Route](#account)
> 8. [Groups Route](#groups)
> 9. [Recipes Route](#recipes)
> 10. [The Week](#the-week)
5. [Caveats on unit testing](#caveats-on-unit-testing)
6. [E2E Testing](#e2e-testing)
7. [Planned Changes](#planned-changes)
8. [Change Log](#change-log)

# What am I looking at?

It's an Angular project that uses Apollo to communicate with a GraphQL-powered backend and manage data. It's not an artistic or pretty project, mostly aimed at just being functional. The purpose of this is to have a singular place where a person or a household can centrally plan out their meals and recipes for the week.

## How to run the repository

1. git clone/fork the repository
2. npm install
3. ng serve

You can also run ng build to build it. Dunno why you'd want to do that. Maybe to deply your own copy? You should probably deploy your own copy of the backend too, if that's the case.

## How does it work?

The App starts at the app module with the Apollo module and lazy loads in additional modules depending on navigation. Most of the modules just go to one page and have little or no state. But /groups, /account, /recipes, /auth and /the-week all use the Apollo client. These all have route guards to prevent unauthenticated users from visiting them (except the /recipes route, some of the aforementioned route's children, and, oh yeah, /auth is only for unauthenticated users).

The store has been mostly replaced by Apollo since it caches results of the queries. The only exception is the user data. Between sessions, the information is stored in local storage (yes, a cookie would be much better, but I'm lazy, and nothing important at all is stored on this website). Then during the session, the information is recovered from local storage, including the refresh token.

As for the user experience, they begin sign up for an account on /auth. Then go to groups if you want to join a group (with the other members of your household). Or go to The Week to work on a shopping list (the personal one or for a group). The user edits it then can see it. It's not a very complicated application, but it does at least serve a purpose. Namely, that I don't have to compile a shopping list/meal plan for my household every week. I only invested hundreds of hours into this, so it should pay off in about ten years.

Oh yeah, you can send me a message that sends me an email if you're logged in by going to the /about page and scrolling to the bottom.

## The nitty-gritty

If you're not really interested in this, turn back now. However, if you ever want to develop an Angular GraphQL app, this might provide some insights, at least if you're not too experienced. I noticed a lack of resources, even on StackOverflow, on how to do some of these operations. So I may have gone with some worst practices, but I tried. Same goes with the Django GraphQL/Auth section.

I will only talk about the animations (briefly), utils, GraphQL, types vs. classes, and the following routes: /auth, /account, /groups, /recipes, /the-week. Nothing else is interesting, though feel free to ask me questions about anything I don't talk about here. I would like nothing more than to be able to help someone who's stuck in a rut.

Animations: you can find them in the shared/animations folder. This was done because I was reusing animations a bunch. They aren't terribly complicated nor good. Mostly just a little offset of position and fading of some sort.

### Utils

Utils are found in the utils folder. constants.ts is, obviously, some constants. These include a few time constants as well as measurement/unit-based ones for the unit conversion functions. date.ts has a function I didn't bother to use, telling whether a JavaScript DateTime is in the past or not and then a function to give the milliseconds (since 1970) that will be two hours from the present. This is so the app, if in continous use for more than 2 hours, can use the refresh token so the user is never logged out. If the app is closed then opened, the refresh token will automatically be used, even if it hasn't been 2 hours since the user logged in. This is performed in app.component.ts - the root component that will always load on any visit to the site.

Back to utils, the more complex and interesting ones are in units.ts. These functions are exclusively used when editing the shopping list in /the-week. There are five functions: combineMeasures, convertRatioToNumbers, simplifyUnits, changeQuantityToFraction, and convertToSmallerUnits.

* combineMeasures takes two QuantityAndUnit (refer to types below) and sees if both units are of the same type (metric solids, metric fluids, imperial solids or imperial fluids) then tries to combine them by multiplying them into the smallest common denominator, the smallest 'conventional' unit of the type, either milligrams, milliliters, ounces or teaspoons. To be honest, I didn't know off the top of my head a smaller measurement for imperial solids than ounces, and I didn't bother to research. As with most things related ot units.ts, I figured if I didn't know it off the top of my head, it's not common knowledge to someone who's trying to cook dinner. I just realized now that these aren't imperial but actually U.S. units. However, U.S. units are just a subtype of imperial units, so whatever.

* convertRatioToNumbers takes a string and tries to match it with the regex /^(\d+\s+)(\d+)\/(\d+)$/ or /^(\d+)\/(\d+)$/. If the former matches, it means it's something like '1 1/4'. The regex will parse it as 1 + (1/4) then 1.25. If it matches the latter pattern it's '1/4', which just evaluates to .25.

* simplifyUnits takes a QuantityAndUnit and sees if the quantity is over a certain threshold based on the unit. The idea is that 1000 ml will get converted to 1 liter. I tried to do this as commonsense as I could, that no one wants to think about, for example 2/5 of a pound of meat. So it has certain thresholds for each unit and then converts them. For pound it's 8 oz becomes .5 pound.

* changeQuantityToFraction is to round numbers around then make them into fractions (basically the reverse of convertRatioToNumbers) to make it more easily readable. So 1.37 oz becomes 1 1/2 oz. No one goes to the store to buy 1.68 pounds of turkey. Obviously, this isn't very precise, but if you need precision, make a note for yourself. Or just don't 'consolidate ingredients', which is what causes this to happen.

* convertToSmallerUnits is roughly the opposite of simplify units. It will take a larger quantity that's under a certain threshold then convert it to smaller units and make it larger. Therefore .125 pound becomes 2 oz, which I think is much more comprehensible.

### GraphQL

The Apollo Angular docs are somewhat helpful, but they're also not great. They don't give much information about how exactly caching works or how to configure your own cache. However, the basics and recipes were enough to help me do what I needed to do, including attaching headers to the requests. How to do proper error handling (especially for network errors) was a bit harder, and, again, not something I wanted to invest a great amount of time. Nor is there much information about testing, especially integration tests. One thing I discovered is that frequently in integration tests, you need to flush out any queries the component made. Dummy data is fine for this.

That said, almost all GraphQL/Apollo interaciton is handled inside of the services (located at shared/services). Most of the interactions are fairly mundane uses of queries/mutation. One thing is that the cache is updated correctly on updating recipes/the week, but it isn't for creating a new recipe, deleting one or updating most anything that's involved with the MeQuery (cf the backend if you're curious -- it's nice feature of the django-graphql-auth package).

On the abovementioned mutations, I had to update the cache manually to include the changed information. It's fairly tedious every time I had to do it, but you can read the various services. For most of the week and group services, it's necessary to update the user's groups as well as the groups the user doesn't belong to. I'm sure much of this could be simplified, but it works here. Spaghetti code abounds!

### Services

Other than GraphQL functions, there are a few interesting things my services do. The Auth Service has a handleError method to make a few common GraphQL/auth errors look prettier. The RecipesService has two particular methods: translateRecipe to ping a server that uses mh r2api package to translate a recipe and prepare it in JSON (I had to enable CORS on a project that I hadn't touched in awhile, so at least I learned how to do CORS for flask), prepareRecipe to change the r2api formatting into the (better, IMO) formatting for the frontend/backend.

### Types and classes

There are six classes:
1. Group
2. Ingredient
3. Meal
4. Recipe
5. Step
6. User

These mostly correspond with the corresponding GraphQL classes. However, because most of these are lacking methods, if I were to do this project again, I'd make all of them but User into types. User is fairly important for the internal management of auth in this project, but the rest don't really do anything but make life a bit harder and more difficult to parse. Or, I would rewrite the classes so they took in config objects into their constructors and parsed the configs for the correct properties.

One thing I want to gripe about is that, to use GraphQL, I needed to create a lot of types and interfaces that were used only once or just a few times so I could get type checking. It was fairly tedious and it made a lot of the classes more tedious than they needed to be if I wanted to use them.

### Components

Angular isn't particularly a component-based architecture. It's much less so than Vue, React or Svelte. That said, I found myself reusing some UI features fairly often, so I made them into components. A few of them have default versions that are just a default, less-customizable look, that I foudn myself using more often.

Most of these are for UI, to make my life easier. The only one that's particular is the modal. It requires a whole service to keep track of them, for opening and closing. Also, all (stateful) components that use a modal have to keep track of their scroll height so it can be passed into the modal when it pops up (to set the 'top' property so the modal doesn't have to be scrolled into view). The implementation of the modal (minus keeping track of the scroll height) was something I found online (I unfortunately lost the link). I want to gripe about Angular for a moment: why aren't there portals? Or at least easy-to-use ones? I don't think anything will get better than a Vue portal, but Angular made me implement a whole service for this. It's supposed to have all the features. Otherwise, what's the point in it being so opinionated?

### Auth

Auth isn't too terribly complicated. It can be used to register an account or sign in, both on the same page. Maybe if I was wiser, I would've made those into distinct routes, but I didn't. One thing I want to mention is my mode buttons, the ones to toggle between modes near the top. I really am proud of them, even if they aren't terribly complicated. They just look neat.

One thing to note is that all auth guards, if the user isn't logged in, sends the user to the /auth route with a return URL param, which is used by the router on finishing to sign in. If no return URL is designated, the default dropoff point is /the-week.

### Account

Account is where you handle account-related things, namely changing your email/username/password. Because I was too lazy to figure out how to keep the same JWT after changing the email/username (this would have to be done on the backend), I force the user to logout if either of those is changed.

Before any of that can happen, the user needs to have their email confirmed. An email can be sent to the account (one is sent upon account creation). The email contains both the token and a button. The button will direct to account with the param being the token. For verifying the email, when this route is reached, the email is automatically confirmed (if the user wants to input the token manually, this works fine too). If the token is for resetting the password, it inputs the token into the appropriate field so the user can choose a new password then and there.

One thing that would be possible is to let a user reset their password if they have forgotten it. I, however, forgot to implement this, and I'm too lazy now.

### Groups

Groups is where the user can see their own groups, either to disband them, leave them or accept someone's request to join the group. They can also cancel their own requests. Then they can browse all the groups they aren't in, search by username/group name, make a group or request access to another group.

### Recipes

The recipes page is divided visually into a left half and a right half. The left half has a list of all recipes as well as a create a recipe button and translate a recipe button (visible only if logged in). The right half is used to examine/edit/translate a recipe. Editing/creating a recipe is one of two times that reactive forms are used in this file. Everything else are template-driven.

Note: Recipes are global. Any logged in user can edit or delete any recipe that anyone can see. They can also make a recipe, and then everyone will be able to see it.

Note: A translated recipe is given a unique URL property that can never be changed. This is so the same recipe doesn't get translated repeatedly. This is done because I'm using my personal google API key to run the translation servers.

### The Week

It is very similar to recipes in structure. The main difference is that the user can only modify the week for themself or any group that they belong to, using the dropdown menu.

One thing to note is that the edit week form is a bit particular. One thing to note is that it uses a unique feature, meals (the shopping list on it is identical to the ingredients list on a recipe). A meal includes a choice of day (Monday-Sunday) and time (Breakfast, Lunch, Dinner or Other -- I realize this is a bit normative, but other can kinda cover other needs), an optional recipe and an optional text. The idea is that the user can decide to cook a recipe, list what they're planning to eat, or write accompanying notes to the recipe they plan to use.

In addition, there are the following buttons:
1. Delete the shopping list (to make the user's life easier)
2. Delete all meals (to start over from scratch a new week, hence a week's worth being the site's name)
3. Adding recipe ingredients to the shopping list -- this will take all meals with recipes attached to them and add the ingredients to the shopping list. The idea is that the user can do this without reading through each recipe and documenting what needs to be added.
4. Consolidate shopping list -- This is a really deceptive title for the button because it does a whole bunch of things. First off, it looks for multiples of the same ingredients in your shopping list and sees if it can combine them with the following process:
> 1. It converts all ratios (1/5) to numbers (0.2)
> 2. It converts everything it can to the smallest measure it can. 
> 3. It converts it to larger units if it's applicable (32 oz to 2 lbs)
> 4. It converts it to smaller units if it's applicable (0.2 liters becomes 200 ml)
> 5. It rounds units to the nearest quarter then converts it to ratios, so 0.5 pounds becomes 1/2 pounds. I did not check for plurals. But I'm too lazy to correct it now.

## Caveats on unit testing

Unit tests took me a full week to write, especially because Angular is very opinionated also about its testing framework. Almost everything has a correspond unit test, with a few exceptions:
* I did not test store actions. They are incredibly reductive.
* Class tests are boiler plate since they don't really have functions
* I didn't test the constants or date utils since they're not very complicated.
* I could not figure out how to test route parameters. This made it so if a component loaded something based on route parameters (namely /recipes, /the-week or email-based links for tokens in /account), I did not test it but just assigned the value if I could.
* Some of the service testing with GraphQL was incredibly reductive and repetitive so I just didn't do it. It would've been a lot more interesting if I could test cache/cache updates. However, I couldn't figure out how to actually test those things, nor was I willing to invest a lot of time into figuring it out.
* For some reasons on the /recipes/translate page, a bunch of tests that worked correctly would randomly give me errors based on the order in which they were carried out. I spent an hour or so trying to figure it out before moving on with my life. The tests are still there, just commented out.
* I did not test animations or enums.
* The home (/) route, the /privacy-policy route, the /recipe blank page and /the-week blank page and the footer are only tested to see if they load in. There isn't much else to test on them.

## E2E Testing

This is the first time I've written E2E testing, and it was remarkably easy. I used Cypress because Angular's Protractor with Angular 12 is now deprecated, and wow, was it easy. One note: I didn't use custom commandss though it would've been easier, in order for things to be as explicit as possible. I did all tests with my backend live on my local host, and I was able to test most things. The one exception being the /account endpoint funcitonality because that relies on tokens sent by email. The actual functionality of the functions is better elaborated in unit tests, so I thought it wouldn't be productive to test it specifically in e2e tests because there is very little user interaction.

To be honest, I didn't flesh out all cases for E2E testing, but I feel I covered enough, and I'm tired, really tired. At some point, I plan to update this, but it may be awhile.

## Planned changes
Note: None of these will probably get done. I'm pretty much finished with this project. These are ideas of what could be improved if I ever step back into the project.
* Add Angular Universal
* Add router transitions.
* Improve queries/how the page looks on cell phones
* Improve how components work
* Add ability to invite someone to group without them requesting access
* Add ability to delete account

## Changelong
* 7/31/2021: First upload
* 8/1/2021: Add rudimentary media queries
* 8/1/2021 (evening): Improve media queries, fixed guards to allow logged in users to reload pages.
* 8/1/2021 (night): Now the name and not the value is set manually on the-week edit form's textareas.
* 8/2/2021:
> * Added a way to see the shopping list by the whole week.
> * Fixed the shopping list consolidation on editing a shopping list so it no longer saved NaN values and so duplicate values (only happened when saving two quantities that weren't numbers) were removed.
> * The loading bar now shows when loading recipes for the first time.
> * Translate recipe now correctly saves the translated recipe's URL.
> * Upon consolidating ingredients in the week edit form, added compilation back into ratios on the-week edit form. E.G: .25 + .25 yields 1/2, 1.37 + 0.44 yields 1 3/4, 0.66 + 0.33 yields 1
> * Upon consolidating ingredients in the week edit form, ingredients under 0.2 of a quantity will be automatically converted to a larger amount and a smaller unit if possible.
* 8/8/2021: Added unit testing. Worked on the readme.
* 8/9/2021:
> 1. Due to feedback from my wife (real UX feedback, sweet!), adding shopping ingredients to your week's shopping list will now insert the new controls at index 0.
> 2. Changed the prepareShoppingItem() method of week-detail slightly. Also updated tests to go along with it.
> 3. Also, consolidateShoppingList() will no longer exit early if there are no duplicate ingredients (since that was its original purpose). It will still do unit conversion and changing quantities from ratios and back.
> 4. Added a new button to the-week edit form: Reset All Meals. This will replace your current week's meals with blank meals for lunch and dinner for the whole week. I didn't do breakfast or other because I always eat cereal for breakfast. Tell me if you want me to change it. I also added a corresponding test.
> 5. Added e2e tests
* 10/12/2021: Added CI/CD with Travis
