export default function ErrorMessage({ error, runSearch, city, loading }) {
  return (
    <>
      {error && (
        <div className="error fade-in">
          ❌ {error}
          <div>
            <button
              onClick={() => runSearch(city)}
              disabled={loading || !city.trim()}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
