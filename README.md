# Live preview: [www.myhomeschoolmaster.com](https://www.myhomeschoolmaster.com)
> [!NOTE]
> This is an in-progress build, not the final product. See Status below for what's currently functional.

## Status

This project is in active development and not yet launched publicly. The working features are user registration, login, logout, a post-signup onboarding wizard, full student management, updating your profile name (including middle name), and changing your password while logged in. The forgot-password reset flow is built, but email delivery is limited for now: the app uses Resend's free tier, which only delivers to the owner's verified address, so reset emails won't reach real users until the domain is verified and the project moves to a paid tier ahead of launch. Email verification and email change are in the same state for the same reason.

A few pages are informational only: home, pricing, and contact us. The contact us page has a form, but it doesn't send email yet: clicking "Send message" currently logs the form details to the console instead.

Once logged in, you can view the dashboard with several options to click into.

## Getting Started

Prerequisites: Node.js (v20+) and npm.

Install dependencies:

```
npm install
```

Create a `.env.local` file in the project root (it is git-ignored, so each environment sets its own) with the API base URL:

```
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```
npm run dev
```

Vite serves the app at `http://localhost:5173` with hot reload.

The frontend talks to the Rails API, so the API must be running too. Start it from the homeschool-master-api repo (`rails s`, which serves on port 3000) before signing in, or any authenticated request will fail.

### Scripts

- `npm run dev` — start the Vite dev server with hot reload
- `npm run build` — type-check and build the production bundle
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint

## What's next

- Student management and scheduling
- Lesson planning and curriculum tracking
- React Native mobile app distribution via TestFlight (iOS) and direct APK (Android)

## Authentication

The web app relies on the API's cookie-based session and never handles tokens directly. On login, it posts credentials to `/api/v1/auth/login`; the API responds with the user object and sets httpOnly `access_token` and `refresh_token` cookies. Because the cookies are httpOnly, JavaScript cannot read them: the browser attaches them automatically on each request to the API, which the shared axios instance enables with `withCredentials: true`. That same instance also sends an `X-Key-Inflection: camel` header so responses come back in camelCase.

Client state holds only the signed-in user, never a token. The Redux auth slice stores the `user` object (or `null`); `setUser` populates it on login and `clearUser` resets it on logout.

Session persistence across reloads is handled on app start. Redux state is lost on refresh, but the cookies survive, so the app calls `/api/v1/auth/me` once on mount and repopulates the user from the response. It renders nothing until that check resolves.

Route protection is driven by whether a user is present in state. Dashboard routes sit behind a protected-route guard, and the login, register, and password reset pages redirect to the dashboard when a user is already signed in.

## API conventions

**Client code is camelCase everywhere, including request bodies.** Never write a
snake_case key in a type, a payload or a query param: `startTime`, not
`start_time`.

Keys are converted at the boundary, in both directions:

- **Responses** come back camelCase because the shared axios instance in
  `src/services/api.ts` sends `X-Key-Inflection: camel`. The API's
  `Api::V1::BaseController` camelizes its response keys when it sees that
  header.
- **Requests** are converted the other way by the API itself:
  `ApplicationController` runs `deep_transform_keys!(&:underscore)` on every
  incoming request, so `startTime` arrives as `start_time`. That one is
  unconditional and does not depend on the header.

So the wire format is unchanged by writing camelCase: Rails still receives the
column names it expects, and the client never has to think in two cases.

snake_case does appear in comments that describe what Rails receives, in
`services/calendarEvents.ts` and `services/apiError.ts`. That is deliberate:
those comments document the server side of the boundary, and they are not an
exception to the rule for code.

## Traps that have bitten this codebase

Three mistakes have been made here more than once. Each is easy to make, none
of them looks wrong in review, and all three are invisible until someone opens
the app at the wrong width or follows the wrong link.

### Explanatory content inside a collapsible

A panel that collapses at mobile width takes its contents with it. Put the one
sentence that explains an empty or filtered view inside that panel and it
disappears exactly when it is needed most: a teacher on a phone sees an empty
list and nothing saying why.

**Avoid it by** keeping anything that explains state outside the collapsible.
The filter fields can collapse; the line saying "nothing matches these filters"
cannot. This applies to empty states, scope notices, override warnings and the
status of a draft.

### A display rule beating the browser's `[hidden]`

`hidden` on an element is a UA stylesheet rule, so any author rule that sets
`display` beats it. A component that toggles `hidden` while its class sets
`display: flex` stays visible, and its contents stay in the tab order, which is
the part that is easy to miss.

**Avoid it by** pairing every `display` rule on a hideable element with its own
`&[hidden] { display: none; }`. It has been needed on the calendar filters, the
event list panel and the nav overflow menu, and it will be needed again by
anything that reaches for a mixin setting `display`.

### Links left pointing at a moved route

When a page moves, links to it do not follow. They keep resolving, so nothing
errors: the link just lands somewhere that is no longer the thing it names.
Assignments moving out of `/grades` left three empty state actions pointing at
the page the teacher was already looking at.

**Avoid it by** grepping for the old path across the repo when a route moves,
including paths built as constants and template strings, and by opening the
pages that link to it rather than trusting the route file. Constants like
`ASSIGNMENTS_PATH` are the ones that go stale quietly, because the name still
reads correctly while the value no longer does.

## Deployment

The Rails API is deployed to Heroku with PostgreSQL via the Heroku Postgres add-on. The React web app is deployed to Vercel.

## Documentation

[Homeschool Master Docs](https://homeschool-master.github.io/homeschool-master-docs/)
