# Caged with Reeves

Find actors who have shared the screen with both Nicolas Cage and Keanu Reeves — not necessarily in the same film, but at least once with each.

## How it works

1. Fetches all movie credits for Nicolas Cage and Keanu Reeves from the TMDB API
2. Collects every actor who appeared alongside each of them
3. Returns the intersection — actors who appear in both sets, sorted by popularity

## UI

- Nicolas Cage and Keanu Reeves are displayed at the top of the page
- Matching actors are shown in a grid below, ordered by TMDB popularity
- Hovering or clicking an actor reveals which movies connect them to each star, and which star they connect through
- Clicking a movie title opens that movie's page on themoviedb.org

## Tech stack

- React (via Vite)
- TMDB API

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root and add your TMDB API key:

```
VITE_TMDB_API_KEY=your_key_here
```

You can get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api).

3. Start the dev server:

```bash
npm run dev
```

## TMDB endpoints used

| Endpoint | Purpose |
|---|---|
| `GET /search/person?query=Nicolas+Cage` | Resolve actor name → person ID |
| `GET /person/{id}/movie_credits` | Get all movies an actor appeared in |
| `GET /movie/{id}/credits` | Get full cast of a specific film |

The intersection is computed client-side after fetching credits for both actors.

## Notes

- Only movies (not TV) are considered
- TMDB rate limits unauthenticated requests; the app uses an API key to stay within limits
- Results include the actor's profile photo, name, and a sample of the films connecting them to each star
