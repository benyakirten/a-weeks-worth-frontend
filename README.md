# What am I looking at?

It's an Angular project that uses Apollo to communicate with a GraphQL-powered backend and manage data. It's not an artistic or pretty project, mostly aimed at just being functional. The purpose of this is to have a singular place where a person or a household can centrally plan out their meals and recipes for the week.

## How do I get it up and working?

1. git clone/fork the repository
2. npm install
3. ng serve

You can also run ng build to build it. Dunno why you'd want to do that. Maybe to deply your own copy? You should probably deploy your own copy of the backend too, if that's the case.

## How does it work?

The App starts at the app module with the Apollo module and lazy loads in additional modules depending on navigation. Most of the modules just go to one page and have little or no state. But /groups, /account, /recipes, /auth and /the-week all use the Apollo client. These all have route guards to prevent unauthenticated users from visiting them (except the /recipes route and its children and /auth is only for unauthenticated users).

The store has been mostly replaced by Apollo since it caches results of the queries. The only exception is the user data. Between sessions, the information is stored in local storage (yes, a cookie would be much better, but I'm lazy, and nothing important at all is stored on this website). Then during the session, the information is recovered from local storage, including the refresh token.

Anyway, to get to how it works, sign up for an account on /auth. Then go to groups if you want to join a group (with the other members of your household). Or go to The Week to work on your shopping list (the personal one or for your groups). You edit it then you can see it. It's not a very complicated application, but it does at least serve a purpose. Namely, that I don't have to compile a shopping list/meal plan for my household every week. I only invested hundreds of hours into this, so it should pay off in about ten years.

Oh yeah, you can send me a message that sends me an email if you're logged in by going to the about page and scrolling to the bottom.

## Planned changes
* Write a better readme that details classes vs types, enums, animations, queries, services and my design decisions
* Add unit testing
* Add e2e testing
* Improve queries

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
> * Added compilation back into ratios on the-week edit form. E.G: .25 + .25 yields 1/2, 1.37 + 0.44 yields 1 3/4, 0.66 + 0.33 yields 1
