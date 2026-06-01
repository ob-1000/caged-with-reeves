const TMDB_URL = 'https://www.themoviedb.org/movie'

export default function MoviePanel({ actor, cage, reeves, onClose }) {
  return (
    <div className="movie-panel">
      <button className="panel-close" onClick={onClose}>✕</button>
      <h2 className="panel-actor">{actor.name}</h2>
      <div className="panel-columns">
        <div className="panel-column">
          <h3>With {cage.name}</h3>
          <ul>
            {[...actor.cageMovies].sort((a, b) => a.title.localeCompare(b.title)).map(m => (
              <li key={m.id}>
                <a href={`${TMDB_URL}/${m.id}`} target="_blank" rel="noreferrer">
                  {m.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-column">
          <h3>With {reeves.name}</h3>
          <ul>
            {[...actor.reevesMovies].sort((a, b) => a.title.localeCompare(b.title)).map(m => (
              <li key={m.id}>
                <a href={`${TMDB_URL}/${m.id}`} target="_blank" rel="noreferrer">
                  {m.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
