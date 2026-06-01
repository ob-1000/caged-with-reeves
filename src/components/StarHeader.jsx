const IMG_BASE = 'https://image.tmdb.org/t/p/w342'

export default function StarHeader({ cage, reeves }) {
  return (
    <div className="star-header">
      <div className="star">
        <img src={`${IMG_BASE}${cage.profile_path}`} alt={cage.name} />
        <span>{cage.name}</span>
      </div>
      <span className="star-divider">+</span>
      <div className="star">
        <img src={`${IMG_BASE}${reeves.profile_path}`} alt={reeves.name} />
        <span>{reeves.name}</span>
      </div>
    </div>
  )
}
