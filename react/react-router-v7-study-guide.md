# React Router v7 — Complete Study Guide

> Framework Mode · `@react-router/fs-routes` · Flat Routes Convention

---

## Table of Contents

1. [Setup](#1-setup)
2. [File Naming Conventions](#2-file-naming-conventions)
   - [Basic Routes](#21-basic-routes)
   - [Dot Delimiters](#22-dot-delimiters)
   - [Dynamic Segments `$`](#23-dynamic-segments-)
   - [Nested Routes (Layout + URL)](#24-nested-routes-layout--url)
   - [Nested URL, No Layout Nesting `trailing_`](#25-nested-url-no-layout-nesting-trailing_)
   - [Nested Layout, No URL Segment `_leading`](#26-nested-layout-no-url-segment-_leading)
   - [Optional Segments `()`](#27-optional-segments-)
   - [Splat Routes `$`](#28-splat-routes-)
   - [Catch-all / 404 Route](#29-catch-all--404-route)
   - [Escaping Special Characters `[]`](#210-escaping-special-characters-)
   - [Folder-based Organization](#211-folder-based-organization)
3. [Convention Cheat Sheet](#3-convention-cheat-sheet)
4. [Route Module API](#4-route-module-api)
   - [`default` — The Component](#41-default--the-component)
   - [`loader` — Server Data](#42-loader--server-data)
   - [`clientLoader` — Browser Data](#43-clientloader--browser-data)
   - [`action` — Server Mutation](#44-action--server-mutation)
   - [`clientAction` — Browser Mutation](#45-clientaction--browser-mutation)
   - [`middleware` — Server Pipeline](#46-middleware--server-pipeline)
   - [`clientMiddleware` — Client Pipeline](#47-clientmiddleware--client-pipeline)
   - [`ErrorBoundary` — Error UI](#48-errorboundary--error-ui)
   - [`HydrateFallback` — SSR Loading State](#49-hydratefallback--ssr-loading-state)
   - [`links` — Inject `<link>` Tags](#410-links--inject-link-tags)
   - [`meta` — Inject `<meta>` Tags](#411-meta--inject-meta-tags)
   - [`headers` — HTTP Response Headers](#412-headers--http-response-headers)
   - [`handle` — Custom Route Metadata](#413-handle--custom-route-metadata)
   - [`shouldRevalidate` — Revalidation Control](#414-shouldrevalidate--revalidation-control)
5. [Route Module API Cheat Sheet](#5-route-module-api-cheat-sheet)
6. [Full Route File Skeleton](#6-full-route-file-skeleton)
7. [Real-World Patterns](#7-real-world-patterns)

---

## 1. Setup

Install the file-route package:

```bash
npm i @react-router/fs-routes
```

Wire it up in `app/routes.ts`:

```ts
// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
```

**Options:**

```ts
export default flatRoutes({
  rootDirectory: "pages",           // default: "routes" (relative to app/)
  ignoredRouteFiles: ["home.tsx"],  // globs to exclude from route discovery
}) satisfies RouteConfig;
```

**Mixing file-routes with manual routes:**

```ts
import { flatRoutes } from "@react-router/fs-routes";
import { route } from "@react-router/dev/routes";

export default [
  ...await flatRoutes(),
  route("special", "./routes/special.tsx"),  // manual override
];
```

---

## 2. File Naming Conventions

All route files live in `app/routes/` by default. Supports `.js`, `.jsx`, `.ts`, `.tsx`.

---

### 2.1 Basic Routes

Filename maps directly to URL pathname.

```
app/
├── routes/
│   ├── _index.tsx     →  /
│   ├── about.tsx      →  /about
│   └── contact.tsx    →  /contact
└── root.tsx
```

> `_index.tsx` is special — it's the index route for the root, not `/index`.

All routes render inside `<Outlet />` of `app/root.tsx`.

---

### 2.2 Dot Delimiters

A `.` in the filename becomes a `/` in the URL.

```
app/routes/
├── _index.tsx                  →  /
├── concerts.trending.tsx       →  /concerts/trending
├── concerts.salt-lake-city.tsx →  /concerts/salt-lake-city
└── concerts.san-diego.tsx      →  /concerts/san-diego
```

> Dots also create **nesting relationships** — see section 2.4.

---

### 2.3 Dynamic Segments `$`

Prefix a segment with `$` to capture a URL parameter.

```
app/routes/
├── concerts.$city.tsx           →  /concerts/:city
├── users.$id.tsx                →  /users/:id
└── blog.$year.$month.$slug.tsx  →  /blog/:year/:month/:slug
```

Access via `params` in loader/action/component:

```tsx
export async function loader({ params }) {
  // /concerts/chicago → params.city === "chicago"
  return db.getConcerts({ city: params.city });
}
```

**Priority rule:** Static segments always beat dynamic ones.
`concerts.trending.tsx` matches `/concerts/trending` before `concerts.$city.tsx`.

---

### 2.4 Nested Routes (Layout + URL)

When a filename prefix matches another route file, it becomes a **child route** rendered inside the parent's `<Outlet />`.

```
app/routes/
├── concerts.tsx           →  LAYOUT (parent)
├── concerts._index.tsx    →  /concerts
├── concerts.trending.tsx  →  /concerts/trending
└── concerts.$city.tsx     →  /concerts/:city
```

| URL | Matched Route | Rendered Inside |
|---|---|---|
| `/concerts` | `concerts._index.tsx` | `concerts.tsx` |
| `/concerts/trending` | `concerts.trending.tsx` | `concerts.tsx` |
| `/concerts/chicago` | `concerts.$city.tsx` | `concerts.tsx` |

The parent **must** render `<Outlet />`:

```tsx
// concerts.tsx
import { Outlet } from "react-router";

export default function ConcertsLayout() {
  return (
    <div>
      <nav>Concerts Nav</nav>
      <Outlet />  {/* children render here */}
    </div>
  );
}
```

Component hierarchy for `/concerts/chicago`:

```
<Root>            ← root.tsx
  <Concerts>      ← concerts.tsx (layout)
    <City />      ← concerts.$city.tsx
  </Concerts>
</Root>
```

> **Always add an `_index` route** to layouts so visiting `/concerts` directly renders something instead of a blank `<Outlet />`.

---

### 2.5 Nested URL, No Layout Nesting `trailing_`

Add a `_` **after** the parent segment name to create the URL structure but skip the layout nesting.

```
app/routes/
├── concerts.tsx        →  layout
├── concerts.$city.tsx  →  /concerts/:city  (inside concerts.tsx)
└── concerts_.mine.tsx  →  /concerts/mine   (skips concerts.tsx, uses root)
```

| URL | Matched Route | Layout |
|---|---|---|
| `/concerts/chicago` | `concerts.$city.tsx` | `concerts.tsx` |
| `/concerts/mine` | `concerts_.mine.tsx` | `root.tsx` ← no concerts layout |

> Mnemonic: The trailing `_` "writes the route out of the parent's will."

---

### 2.6 Nested Layout, No URL Segment `_leading`

Add a `_` **before** a prefix to create a shared layout without adding a URL segment. These are called **Pathless Routes**.

```
app/routes/
├── _auth.tsx           →  layout (invisible in URL)
├── _auth.login.tsx     →  /login
└── _auth.register.tsx  →  /register
```

| URL | Matched Route | Layout |
|---|---|---|
| `/login` | `_auth.login.tsx` | `_auth.tsx` |
| `/register` | `_auth.register.tsx` | `_auth.tsx` |

```tsx
// _auth.tsx — shared layout for auth pages
export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </div>
  );
}
```

> Mnemonic: The leading `_` is "a blanket hiding the filename from the URL."

**Common use cases:**
- Auth pages (login, register, forgot-password)
- Marketing pages vs. app pages
- Admin panel with its own shell

---

### 2.7 Optional Segments `()`

Wrap any segment in `()` to make it optional.

```
app/routes/
├── ($lang)._index.tsx       →  /  OR  /en  OR  /fr
├── ($lang).categories.tsx   →  /categories  OR  /en/categories
└── ($lang).$productId.tsx   →  /en/shirt  OR  /fr/shirt
```

| URL | Matched Route |
|---|---|
| `/` | `($lang)._index.tsx` |
| `/en` | `($lang)._index.tsx` |
| `/categories` | `($lang).categories.tsx` |
| `/en/categories` | `($lang).categories.tsx` |
| `/en/cool-shirt` | `($lang).$productId.tsx` |
| `/cool-shirt` | `($lang)._index.tsx` ← **gotcha!** |

> ⚠️ **Gotcha:** `/cool-shirt` matches `($lang)._index.tsx`, NOT `($lang).$productId.tsx`.
> Optional params match eagerly. Fix: check `params.lang` in the loader and redirect if it's not a valid language code.

```tsx
export async function loader({ params, request }) {
  const VALID_LANGS = ["en", "fr", "zh"];
  if (params.lang && !VALID_LANGS.includes(params.lang)) {
    // params.lang is actually a productId slug
    throw redirect(`/en/${params.lang}`);
  }
  return { lang: params.lang ?? "en" };
}
```

---

### 2.8 Splat Routes `$.`

A `$` at the end of a filename matches **everything remaining** in the URL, including slashes.

```
app/routes/
├── _index.tsx              →  /
├── about.tsx               →  /about
├── files.$.tsx             →  /files/*
└── $.tsx                   →  /* (catch-all, see 2.9)
```

| URL | Matched Route |
|---|---|
| `/files/docs/api.pdf` | `files.$.tsx` |
| `/files/a/b/c/d` | `files.$.tsx` |

Access the captured path via `params["*"]`:

```tsx
export async function loader({ params }) {
  const filePath = params["*"];
  // /files/docs/api/v2.pdf → "docs/api/v2.pdf"
  return getFile(filePath);
}
```

---

### 2.9 Catch-all / 404 Route

A file named exactly `$.tsx` at the root of routes catches all unmatched URLs.

```
app/routes/
├── _index.tsx     →  /
├── about.tsx      →  /about
└── $.tsx          →  anything else
```

> Default response is 200 — you **must** manually return a 404:

```tsx
// routes/$.tsx
import { data } from "react-router";

export async function loader() {
  throw data(null, { status: 404 });
}

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}
```

---

### 2.10 Escaping Special Characters `[]`

Use `[]` to include literal special characters (`.`, `$`, `_`) in your URL that would otherwise be interpreted as conventions.

| Filename | URL |
|---|---|
| `sitemap[.]xml.tsx` | `/sitemap.xml` |
| `[sitemap.xml].tsx` | `/sitemap.xml` |
| `reports.$id[.pdf].ts` | `/reports/123.pdf` |
| `dolla-bills-[$].tsx` | `/dolla-bills-$` |
| `weird-url.[_index].tsx` | `/weird-url/_index` |
| `[[so-weird]].tsx` | `/[so-weird]` |

Most useful for **resource routes** that serve files with extensions (`.xml`, `.pdf`, `.json`).

---

### 2.11 Folder-based Organization

Routes can be folders with a `route.tsx` file inside. Other files in the folder are **not** routes — use them for co-located components, utilities, and assets.

**Flat file form:**
```
app/routes/
├── concerts.$city.tsx
└── _auth.tsx
```

**Folder form (identical routing behavior):**
```
app/routes/
├── concerts.$city/
│   ├── route.tsx           ← the route module
│   ├── city-map.tsx        ← co-located component (NOT a route)
│   ├── get-concerts.server.ts
│   └── hero.jpg
└── _auth/
    ├── route.tsx
    ├── header.tsx
    └── footer.tsx
```

These are exactly equivalent:
```
app/routes/concerts.$city.tsx
app/routes/concerts.$city/route.tsx
```

> ✅ Prefer folder form for complex routes. Keeps feature code together instead of scattered across `components/`, `hooks/`, `utils/`.

---

## 3. Convention Cheat Sheet

| Pattern | Syntax | Example File | URL |
|---|---|---|---|
| Index route | `_index` | `_index.tsx` | `/` |
| Static segment | plain name | `about.tsx` | `/about` |
| URL slash | `.` | `concerts.trending.tsx` | `/concerts/trending` |
| Dynamic param | `$name` | `users.$id.tsx` | `/users/:id` |
| Nested layout | `parent.tsx` + `parent.child.tsx` | `app.tsx` + `app.dashboard.tsx` | child renders in parent's `<Outlet>` |
| URL nesting, skip layout | `trailing_` | `concerts_.mine.tsx` | `/concerts/mine` (no concerts layout) |
| Shared layout, no URL | `_leading` | `_auth.login.tsx` | `/login` (uses `_auth.tsx` layout) |
| Optional segment | `(param)` | `($lang).tsx` | `/:lang?` |
| Splat / wildcard | `$.` | `files.$.tsx` | `/files/*` |
| Catch-all 404 | `$` | `$.tsx` | `/*` |
| Escape convention | `[char]` | `sitemap[.]xml.tsx` | `/sitemap.xml` |
| Folder route | `folder/route.tsx` | `users.$id/route.tsx` | same as `users.$id.tsx` |

---

## 4. Route Module API

Every file in `app/routes/` is a **route module**. You opt into features by exporting specific named functions. None are required except `default` if you want to render UI.

---

### 4.1 `default` — The Component

The page UI. React Router renders this when the route matches.

```tsx
import type { Route } from "./+types/concerts.$city";

export default function CityPage({
  loaderData,   // typed: return type of your loader
  actionData,   // typed: return type of your action
  params,       // { city: string }
  matches,      // all matched routes in the current tree
}: Route.ComponentProps) {
  return (
    <main>
      <h1>Concerts in {params.city}</h1>
      <ul>
        {loaderData.concerts.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </main>
  );
}
```

> Props are auto-typed from your route's generated types in `.react-router/types/`.
> You can also use hooks (`useLoaderData()`, `useParams()`) but props are preferred for type safety.

---

### 4.2 `loader` — Server Data

Runs **on the server** before the route renders. Returns data that becomes `loaderData`.

```tsx
import type { Route } from "./+types/concerts.$city";
import { redirect, data } from "react-router";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  // params   → dynamic URL segments
  // request  → the full Web Request (headers, URL, cookies, etc.)
  // context  → values injected by middleware

  if (!params.city) throw redirect("/concerts");

  const concerts = await db.getConcerts({ city: params.city });

  if (!concerts.length) {
    throw data({ message: "No concerts found" }, { status: 404 });
  }

  return { concerts };
}
```

**Key behaviors:**
- Runs in parallel with sibling route loaders during navigation
- Throwing `redirect()` aborts and navigates immediately
- Throwing `data({}, { status: 404 })` renders `ErrorBoundary`
- Return value is serialized to JSON — no class instances

---

### 4.3 `clientLoader` — Browser Data

Runs **only in the browser**. Useful for cache-first strategies, localStorage, or skipping server round-trips.

```tsx
import type { Route } from "./+types/my-route";

export async function clientLoader({
  serverLoader,
  params,
  request,
}: Route.ClientLoaderArgs) {
  // Check cache first
  const cached = sessionStorage.getItem(`city-${params.city}`);
  if (cached) return JSON.parse(cached);

  // Fall back to server
  const data = await serverLoader();
  sessionStorage.setItem(`city-${params.city}`, JSON.stringify(data));
  return data;
}

// Run on first page load (SSR hydration), not just client nav
clientLoader.hydrate = true as const;
```

**When to use:**
- Cache-first patterns (avoid re-fetching on back/forward)
- Merge server data with localStorage/IndexedDB data
- Augment server data with client-only info (user preferences, etc.)
- Works great alongside TanStack Query for cache invalidation

---

### 4.4 `action` — Server Mutation

Handles `POST`, `PUT`, `PATCH`, `DELETE` submissions from `<Form>`, `useFetcher`, or `useSubmit`. **Automatically revalidates all loaders on the page** after completion.

```tsx
import type { Route } from "./+types/concerts._index";
import { Form, redirect } from "react-router";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  // Parse and validate
  const title = formData.get("title") as string;
  if (!title) return { error: "Title is required" };

  // Mutate
  const concert = await db.createConcert({ title, city: params.city });

  // Redirect or return actionData
  return redirect(`/concerts/${concert.id}`);
}

export default function NewConcert({ actionData }: Route.ComponentProps) {
  return (
    <Form method="post">
      <input name="title" />
      <button type="submit">Add Concert</button>
      {actionData?.error && <p className="error">{actionData.error}</p>}
    </Form>
  );
}
```

**Key behaviors:**
- Only handles non-GET requests
- All loaders revalidate automatically after action — no manual cache busting
- Can `throw redirect()` to navigate after success
- Return `actionData` for form errors without navigating

---

### 4.5 `clientAction` — Browser Mutation

Runs **only in the browser**. Intercepts before/after the server action.

```tsx
import type { Route } from "./+types/my-route";

export async function clientAction({
  serverAction,
  request,
}: Route.ClientActionArgs) {
  // Optimistically update UI or invalidate client caches
  queryClient.invalidateQueries({ queryKey: ["concerts"] });

  // Delegate to server action
  const result = await serverAction();
  return result;
}
```

**Use cases:**
- Optimistic UI updates before server confirms
- Invalidate TanStack Query / SWR caches
- Analytics tracking on mutations

---

### 4.6 `middleware` — Server Pipeline

Runs **on the server** before (and after) loaders/actions. Chains with parent route middleware. Exported as an **array**.

```tsx
import { redirect } from "react-router";
import type { Route } from "./+types/app";

// Logging middleware
async function logMiddleware({ request }: Route.unstable_MiddlewareArgs, next) {
  const start = Date.now();
  console.log(`→ ${request.method} ${request.url}`);
  const response = await next();
  console.log(`← ${response.status} (${Date.now() - start}ms)`);
  return response;
}

// Auth middleware
async function authMiddleware({ request, context }: Route.unstable_MiddlewareArgs, next) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) throw redirect("/login");

  // Inject user into context for loaders to access
  const user = await db.getUser(userId);
  context.set(userContext, user);

  return await next();
}

export const middleware = [logMiddleware, authMiddleware];
```

**Accessing context in loaders:**

```tsx
export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);  // injected by middleware
  return { user };
}
```

**Execution order** (parent → child → back up):
```
root middleware before
  app middleware before
    loader runs
  app middleware after
root middleware after
```

---

### 4.7 `clientMiddleware` — Client Pipeline

Same as `middleware` but runs in the **browser** during client-side navigations. No Response returned.

```tsx
async function analyticsMiddleware({ request }: Route.unstable_ClientMiddlewareArgs, next) {
  analytics.trackPageView(request.url);
  await next();  // no return needed
}

export const clientMiddleware = [analyticsMiddleware];
```

---

### 4.8 `ErrorBoundary` — Error UI

Renders instead of the route component when loader/action/component throws. Catches errors from **this route only** (parent boundaries catch child errors).

```tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  // HTTP errors thrown via `throw data({}, { status: 404 })`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-page">
        <h1>{error.status} — {error.statusText}</h1>
        {error.status === 404 && <p>This page doesn't exist.</p>}
        {error.status === 403 && <p>You don't have access.</p>}
        {error.status === 500 && <p>Server error. Try again later.</p>}
      </div>
    );
  }

  // Unexpected JS errors
  if (error instanceof Error) {
    return (
      <div className="error-page">
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
        {import.meta.env.DEV && <pre>{error.stack}</pre>}
      </div>
    );
  }

  return <h1>Unknown error</h1>;
}
```

**Scope:** The closest `ErrorBoundary` in the route tree catches the error. Add one to `root.tsx` as the final safety net.

---

### 4.9 `HydrateFallback` — SSR Loading State

Shows while a `clientLoader` with `hydrate = true` is running on **first page load**. Replaced by `default` once the client loader completes.

```tsx
export async function clientLoader() {
  const settings = await loadFromIndexedDB("settings");  // slow
  return settings;
}
clientLoader.hydrate = true as const;  // required for HydrateFallback to work

export function HydrateFallback() {
  return (
    <div className="loading-screen">
      <Spinner />
      <p>Loading your data…</p>
    </div>
  );
}

export default function Page({ loaderData }) {
  return <Dashboard settings={loaderData} />;
}
```

**Flow:**
1. Server sends HTML with `HydrateFallback`
2. Browser executes `clientLoader`
3. `HydrateFallback` is replaced by `default` component

---

### 4.10 `links` — Inject `<link>` Tags

Adds `<link>` elements to `<head>` **only while this route is active**. Removed on navigation away.

```tsx
export function links() {
  return [
    // Route-specific stylesheet (unloads when leaving)
    { rel: "stylesheet", href: "/styles/dashboard.css" },

    // Preload critical image
    { rel: "preload", href: "/hero.webp", as: "image" },

    // Prefetch the next likely navigation
    { rel: "prefetch", href: "/api/data.json", as: "fetch" },

    // Route favicon
    { rel: "icon", href: "/favicon-dark.ico", type: "image/x-icon" },
  ];
}
```

All route `links()` are aggregated by the `<Links />` component in `root.tsx`:

```tsx
import { Links } from "react-router";

export default function Root() {
  return (
    <html>
      <head>
        <Links />  {/* renders all active routes' links */}
      </head>
      <body>...</body>
    </html>
  );
}
```

---

### 4.11 `meta` — Inject `<meta>` Tags

Controls `<title>`, Open Graph, and other meta tags. **Last matched route wins** — replaces, not merges.

```tsx
import type { Route } from "./+types/concerts.$city";

export function meta({ data, params, matches }: Route.MetaArgs) {
  const cityName = data?.city?.name ?? params.city;

  return [
    { title: `Concerts in ${cityName} | MyApp` },
    { property: "og:title", content: `${cityName} Shows` },
    { property: "og:image", content: `/og/cities/${params.city}.jpg` },
    { name: "description", content: `Browse upcoming concerts in ${cityName}` },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
```

**Inheriting parent meta:**

```tsx
export function meta({ matches }: Route.MetaArgs) {
  // Find parent's meta and extend it
  const parentMeta = matches.flatMap(m => m.meta ?? []);
  return [
    ...parentMeta,
    { title: "This Page Title" },  // override title
  ];
}
```

> Since React 19, you can also inline `<title>` and `<meta>` directly in JSX — often simpler for dynamic cases.

---

### 4.12 `headers` — HTTP Response Headers

Sets HTTP headers on the server response for this route.

```tsx
export function headers({ loaderHeaders, parentHeaders, actionHeaders, errorHeaders }) {
  return {
    // Cache for 5 min on client, 1 hour on CDN
    "Cache-Control": "max-age=300, s-maxage=3600",

    // CORS (for API/resource routes)
    "Access-Control-Allow-Origin": "*",

    // Security
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",

    // Forward a loader header
    "Vary": loaderHeaders.get("Vary") ?? "Accept",
  };
}
```

**Common use case — resource routes (API endpoints):**

```tsx
// routes/api.concerts[.]json.ts
export function headers() {
  return { "Content-Type": "application/json" };
}

export async function loader() {
  const concerts = await db.getConcerts();
  return Response.json(concerts);
}
```

---

### 4.13 `handle` — Custom Route Metadata

Attach arbitrary data to a route match, accessible via `useMatches()` anywhere in the tree. The classic use case is breadcrumbs.

```tsx
// routes/concerts.$city.tsx
export const handle = {
  breadcrumb: (match: UIMatch) => `Concerts in ${match.params.city}`,
  analyticsPage: "concert-city",
  requiresAuth: true,
};
```

**Consuming in a layout component:**

```tsx
import { useMatches } from "react-router";

function Breadcrumbs() {
  const matches = useMatches();
  const crumbs = matches.filter(m => m.handle?.breadcrumb);

  return (
    <nav aria-label="breadcrumb">
      {crumbs.map((match, i) => (
        <span key={match.id}>
          {i > 0 && " / "}
          {match.handle.breadcrumb(match)}
        </span>
      ))}
    </nav>
  );
}
```

**Other handle patterns:**

```tsx
// Scroll restoration per route
export const handle = { scrollMode: "top" };

// Permission flags for layout to check
export const handle = { permission: "admin" };

// Animation transitions
export const handle = { transition: "slide-left" };
```

---

### 4.14 `shouldRevalidate` — Revalidation Control

By default, **all loaders revalidate after every navigation and action**. Use this to skip unnecessary re-fetches.

```tsx
import type { ShouldRevalidateFunctionArgs } from "react-router";

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  currentParams,
  nextParams,
  formMethod,
  formAction,
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs): boolean {

  // Only revalidate if navigating to a different city
  if (currentParams.city !== nextParams.city) return true;

  // Skip revalidation for GET navigations (no mutation happened)
  if (!formMethod || formMethod === "GET") return false;

  // Use default behavior otherwise
  return defaultShouldRevalidate;
}
```

**Common patterns:**

```tsx
// Never revalidate (static data)
export function shouldRevalidate() { return false; }

// Only revalidate when the relevant param changes
export function shouldRevalidate({ currentParams, nextParams }) {
  return currentParams.id !== nextParams.id;
}

// Only revalidate after mutations, not navigations
export function shouldRevalidate({ formMethod }) {
  return !!formMethod && formMethod !== "GET";
}
```

---

## 5. Route Module API Cheat Sheet

| Export | Type | Runs on | Purpose |
|---|---|---|---|
| `default` | Component | Client | The page UI |
| `loader` | async function | Server | Fetch data before render |
| `clientLoader` | async function | Browser | Cache-first / client data |
| `action` | async function | Server | Handle form/mutation submissions |
| `clientAction` | async function | Browser | Intercept mutations client-side |
| `middleware` | function[] | Server | Auth, logging, context injection |
| `clientMiddleware` | function[] | Browser | Client nav pipeline |
| `ErrorBoundary` | Component | Client | Error UI for this route |
| `HydrateFallback` | Component | Client | Loading UI during SSR hydration |
| `links` | function → array | Server+Client | Route-scoped `<link>` tags |
| `meta` | function → array | Server+Client | `<title>` and `<meta>` tags |
| `headers` | function → object | Server | HTTP response headers |
| `handle` | any | Client | Custom data for `useMatches()` |
| `shouldRevalidate` | function → boolean | Client | Control loader re-fetching |

---

## 6. Full Route File Skeleton

A complete route file showing every possible export:

```tsx
// app/routes/app.$id/route.tsx
import type { Route } from "./+types/app.$id";
import { redirect, data } from "react-router";
import { isRouteErrorResponse, useRouteError } from "react-router";

// ─── Server Middleware ────────────────────────────────────────────────────────
export const middleware = [
  async ({ request, context }: Route.unstable_MiddlewareArgs, next) => {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.userId) throw redirect("/login");
    context.set(userContext, await db.getUser(session.userId));
    return await next();
  },
];

// ─── Client Middleware ────────────────────────────────────────────────────────
export const clientMiddleware = [
  async ({ request }: Route.unstable_ClientMiddlewareArgs, next) => {
    analytics.track("page_view", { url: request.url });
    await next();
  },
];

// ─── Server Loader ────────────────────────────────────────────────────────────
export async function loader({ params, context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const item = await db.getItem(params.id);
  if (!item) throw data(null, { status: 404 });
  return { item, user };
}

// ─── Client Loader ────────────────────────────────────────────────────────────
export async function clientLoader({ serverLoader, params }: Route.ClientLoaderArgs) {
  const cached = sessionStorage.getItem(`item-${params.id}`);
  if (cached) return JSON.parse(cached);
  const result = await serverLoader();
  sessionStorage.setItem(`item-${params.id}`, JSON.stringify(result));
  return result;
}
clientLoader.hydrate = true as const;

// ─── Server Action ────────────────────────────────────────────────────────────
export async function action({ request, params }: Route.ActionArgs) {
  const form = await request.formData();
  const title = form.get("title") as string;
  if (!title) return { errors: { title: "Required" } };
  await db.updateItem(params.id, { title });
  return { ok: true };
}

// ─── Client Action ────────────────────────────────────────────────────────────
export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  queryClient.invalidateQueries({ queryKey: ["items"] });
  return await serverAction();
}

// ─── HTTP Headers ─────────────────────────────────────────────────────────────
export function headers() {
  return { "Cache-Control": "max-age=60, s-maxage=300" };
}

// ─── <link> tags ──────────────────────────────────────────────────────────────
export function links() {
  return [
    { rel: "stylesheet", href: "/styles/item.css" },
    { rel: "preload", href: "/icons/edit.svg", as: "image" },
  ];
}

// ─── <meta> tags ──────────────────────────────────────────────────────────────
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data?.item?.title ?? "Item" },
    { name: "description", content: `Details for ${data?.item?.title}` },
  ];
}

// ─── Custom Metadata ──────────────────────────────────────────────────────────
export const handle = {
  breadcrumb: (match: UIMatch<typeof loader>) => match.data.item.title,
};

// ─── Revalidation Control ─────────────────────────────────────────────────────
export function shouldRevalidate({ currentParams, nextParams }) {
  return currentParams.id !== nextParams.id;
}

// ─── Hydration Loading State ──────────────────────────────────────────────────
export function HydrateFallback() {
  return <div className="skeleton" aria-busy="true" />;
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <h1>Item not found</h1>;
  }
  return <h1>Something went wrong</h1>;
}

// ─── Default Component ────────────────────────────────────────────────────────
export default function ItemPage({ loaderData, actionData }: Route.ComponentProps) {
  const { item, user } = loaderData;

  return (
    <main>
      <h1>{item.title}</h1>
      <form method="post">
        <input name="title" defaultValue={item.title} />
        <button type="submit">Save</button>
      </form>
      {actionData?.errors?.title && <p className="error">{actionData.errors.title}</p>}
      {actionData?.ok && <p className="success">Saved!</p>}
    </main>
  );
}
```

---

## 7. Real-World Patterns

### Auth-protected app with public landing

```
app/routes/
├── _index.tsx                    →  /           (public landing)
├── _marketing.tsx                →  layout for marketing pages
├── _marketing.about.tsx          →  /about
├── _marketing.pricing.tsx        →  /pricing
├── _auth.tsx                     →  layout for auth pages
├── _auth.login.tsx               →  /login
├── _auth.register.tsx            →  /register
├── app.tsx                       →  AUTHENTICATED layout (has middleware)
├── app._index.tsx                →  /app        (dashboard)
├── app.settings.tsx              →  /app/settings layout
├── app.settings._index.tsx       →  /app/settings
├── app.settings.profile.tsx      →  /app/settings/profile
└── app.settings.billing.tsx      →  /app/settings/billing
```

### i18n with optional lang prefix

```
app/routes/
├── ($lang)._index.tsx            →  /  or  /en  or  /fr
├── ($lang).products._index.tsx   →  /products  or  /en/products
├── ($lang).products.$slug.tsx    →  /en/cool-thing
└── ($lang).about.tsx             →  /about  or  /fr/about
```

### API / resource routes

```
app/routes/
├── api.concerts[.]json.ts        →  /api/concerts.json
├── api.concerts.$id[.]json.ts    →  /api/concerts/123.json
├── sitemap[.]xml.ts              →  /sitemap.xml
└── og.$slug[.]png.ts             →  /og/my-post.png
```

### Data flow summary

```
Request
  ↓
middleware[]        (server — auth, logging, context)
  ↓
loader()            (server — fetch data)
  ↓
clientLoader()      (browser — cache/merge/augment)
  ↓
default Component   (render with loaderData)

Form submit
  ↓
clientAction()      (browser — optimistic update)
  ↓
action()            (server — validate & mutate)
  ↓
auto-revalidate     (all loaders re-run)
  ↓
shouldRevalidate()  (opt-out per route)
```

---

*React Router v7 · Framework Mode · `@react-router/fs-routes` · flatRoutes convention*
