# Tweeter Project

Tweeter is a simple, single-page Twitter clone.


## Screenshots

!["Screenshot of composing a tweet"](https://github.com/jong86/tweeter/blob/feature/login/docs/composing.png)
!["Screenshot of login panel"](https://github.com/jong86/tweeter/blob/feature/login/docs/login.png)
!["Screenshot of tweets on mobile-size display"](https://github.com/jong86/tweeter/blob/feature/login/docs/tweets-display.png)


## Getting Started

1. Clone repository.
2. Install dependencies using the `npm install` command.
3. Make a file called `.env` in project root folder, with a variable named `COOKIE_KEY` (random string) and `MONGODB_URI` (your local database location)
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.


## Dependencies

- Express
- Node 5.10.x or above
- Body-parser
- Cookie-session
- Dotenv
- Chance
- md5
- Moment
- Mongodb