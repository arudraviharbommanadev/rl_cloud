export default function ResponsePanel({ loading, error, data }) {
  if (loading) return <div className="response loading">Working on it...</div>;
  if (error) return <div className="response error">{error}</div>;
  if (!data) return <div className="response idle">Run this endpoint to view a response.</div>;

  return (
    <pre className="response success" aria-live="polite">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
