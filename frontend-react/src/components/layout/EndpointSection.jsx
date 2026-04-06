export default function EndpointSection({ id, title, subtitle, children }) {
  return (
    <section className="endpoint-section" id={id}>
      <div className="section-head">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="endpoint-grid">{children}</div>
    </section>
  );
}
