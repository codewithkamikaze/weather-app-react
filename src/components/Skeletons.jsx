export default function Skeleton() {
  return (
    <div className="grid fade-in">
      {/* Current Weather Skeleton */}
      <div className="card skeleton-card">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-big"></div>
        <div className="skeleton skeleton-text"></div>
      </div>

      {/* Forecast Skeleton */}
      <div className="card skeleton-card">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-row"></div>
        <div className="skeleton skeleton-row"></div>
        <div className="skeleton skeleton-row"></div>
      </div>
    </div>
  );
}
