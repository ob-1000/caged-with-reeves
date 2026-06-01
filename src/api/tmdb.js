const BASE_URL = 'https://api.themoviedb.org/3'

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  'Content-Type': 'application/json',
}

async function tmdbFetch(path, attempt = 0) {
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  if (res.status === 429) {
    if (attempt >= 4) throw new Error(`TMDB rate limit exceeded: ${path}`)
    const delay = Math.pow(2, attempt) * 1000
    await new Promise(r => setTimeout(r, delay))
    return tmdbFetch(path, attempt + 1)
  }
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`)
  return res.json()
}

export async function getPerson(name) {
  const data = await tmdbFetch(`/search/person?query=${encodeURIComponent(name)}`)
  const p = data.results[0]
  return { id: p.id, name: p.name, profile_path: p.profile_path }
}

async function getMovieCredits(personId) {
  const data = await tmdbFetch(`/person/${personId}/movie_credits`)
  return data.cast.map(m => ({ id: m.id, title: m.title }))
}

async function getMovieCast(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}/credits`)
  return data.cast
}

async function buildCoStarSet(personId, personName, onProgress) {
  const movies = await getMovieCredits(personId)
  const CHUNK_SIZE = 8
  const CHUNK_DELAY = 400
  const totalChunks = Math.ceil(movies.length / CHUNK_SIZE)
  const allCasts = []

  for (let i = 0; i < movies.length; i += CHUNK_SIZE) {
    const chunk = movies.slice(i, i + CHUNK_SIZE)
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1
    const results = await Promise.all(
      chunk.map(movie => getMovieCast(movie.id).then(cast => ({ movie, cast })))
    )
    allCasts.push(...results)
    if (onProgress) onProgress(`Searching ${personName}'s films... (${chunkNum} of ${totalChunks})`)
    if (i + CHUNK_SIZE < movies.length) await new Promise(r => setTimeout(r, CHUNK_DELAY))
  }

  const coStars = new Map()
  for (const { movie, cast } of allCasts) {
    for (const actor of cast) {
      if (actor.id === personId) continue
      if (coStars.has(actor.id)) {
        coStars.get(actor.id).movies.push({ id: movie.id, title: movie.title })
      } else {
        coStars.set(actor.id, {
          id: actor.id,
          name: actor.name,
          profile_path: actor.profile_path,
          popularity: actor.popularity,
          movies: [{ id: movie.id, title: movie.title }],
        })
      }
    }
  }
  return coStars
}

export async function findSharedActors(onProgress) {
  const [cage, reeves] = await Promise.all([
    getPerson('Nicolas Cage'),
    getPerson('Keanu Reeves'),
  ])

  const [cageCoStars, reevesCoStars] = await Promise.all([
    buildCoStarSet(cage.id, cage.name, onProgress),
    buildCoStarSet(reeves.id, reeves.name, onProgress),
  ])

  const shared = []
  for (const [id, actor] of cageCoStars) {
    if (id === reeves.id) continue
    if (!reevesCoStars.has(id)) continue
    shared.push({
      id: actor.id,
      name: actor.name,
      profile_path: actor.profile_path,
      popularity: actor.popularity,
      cageMovies: actor.movies,
      reevesMovies: reevesCoStars.get(id).movies,
    })
  }

  return {
    cage,
    reeves,
    actors: shared.sort((a, b) => b.popularity - a.popularity),
  }
}
