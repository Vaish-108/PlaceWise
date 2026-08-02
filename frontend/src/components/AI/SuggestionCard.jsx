function SuggestionCard({ title, items = [], variant = "default", emptyText }) {
  const hasItems = items.length > 0;

  return (
    <article className={`suggestion-card suggestion-card--${variant}`}>
      <div className="suggestion-card__header">
        <h3>{title}</h3>
        <span className="suggestion-card__count">{items.length}</span>
      </div>

      {hasItems ? (
        <ul className="suggestion-card__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="suggestion-card__empty">{emptyText || "Nothing to show yet."}</p>
      )}
    </article>
  );
}

export default SuggestionCard;
