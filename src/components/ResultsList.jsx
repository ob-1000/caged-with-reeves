import ActorCard from './ActorCard'

export default function ResultsList({ actors, selected, onSelect }) {
  return (
    <div className="results-list">
      {actors.map(actor => (
        <ActorCard
          key={actor.id}
          actor={actor}
          isSelected={actor.id === selected}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
