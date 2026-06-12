# Live preview: [homeschool-master-web.vercel.app](https://homeschool-master-web.vercel.app)
> [!NOTE]
> This is an in-progress build, not the final product. See Status below for what's currently functional.

## Status

This project is in active development and not yet launched publicly. As of
06/12/2026, the working features are user registration, login, logout, updating
your profile name, and changing your password while logged in. The
forgot-password reset flow is built, but email delivery is limited for now: the
app uses Resend's free tier, which only delivers to the owner's verified
address, so reset emails won't reach real users until the domain is verified and
the project moves to a paid tier ahead of launch. Email verification and email
change are in the same state for the same reason.

A few pages are informational only: home, pricing, and contact us. The contact
us page has a form, but it doesn't send email yet: clicking "Send message"
currently logs the form details to the console instead.

Once logged in, you can view the dashboard with several options to click into.

## What's next

- Student management and scheduling
- Lesson planning and curriculum tracking
- React Native mobile app distribution via TestFlight (iOS) and direct APK (Android)

## Authentication

The web app relies on the API's cookie-based session and never handles tokens
directly. On login, it posts credentials to `/api/v1/auth/login`; the API
responds with the user object and sets httpOnly `access_token` and
`refresh_token` cookies. Because the cookies are httpOnly, JavaScript cannot
read them: the browser attaches them automatically on every request, which the
shared axios instance enables with `withCredentials: true`. That same instance
also sends an `X-Key-Inflection: camel` header so responses come back in
camelCase.

Client state holds only the signed-in user, never a token. The Redux auth slice
stores the `user` object (or `null`); `setUser` populates it on login and
`clearUser` resets it on logout.

Session persistence across reloads is handled on app start. Redux state is lost
on refresh, but the cookies survive, so the app calls `/api/v1/auth/me` once on
mount and repopulates the user from the response. It renders nothing until that
check resolves.

Route protection is driven by whether a user is present in state. Dashboard
routes sit behind a protected-route guard, and the login, register, and
password reset pages redirect to the dashboard when a user is already signed in.

## Deployment

The Rails API is deployed to Heroku with PostgreSQL via the Heroku Postgres
add-on. The React web app is deployed to Vercel.

## Documentation

[Homeschool Master Docs](https://homeschool-master.github.io/homeschool-master-docs/)
