export default function EndpointCard({ title, endpoint, description, children }) {
  return (
    <article className="endpoint-card">
      <div className="endpoint-head">
        {endpoint ? <p className="endpoint-method">{endpoint}</p> : null}
        <h3>{title}</h3>
      </div>
      <p className="endpoint-description">{description}</p>
      <div className="endpoint-body">{children}</div>
    </article>
  );
}
