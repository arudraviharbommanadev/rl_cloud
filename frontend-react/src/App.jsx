import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import EndpointSection from "./components/layout/EndpointSection";
import DecideEndpoint from "./components/endpoints/DecideEndpoint";
import { api } from "./services/apiClient";

export default function App() {
  return (
    <div className="app-shell">
      <div className="backdrop" aria-hidden="true" />
      <main className="content-wrap">
        <Navbar />
        <Hero />

        <EndpointSection
          id="decide"
          title="Decide"
          subtitle="Understand the next best scaling move from current traffic signals and the closest trained sample."
        >
          <DecideEndpoint onSubmit={api.nodeDecide} />
        </EndpointSection>
      </main>
      <a
        className="know-more-link"
        href="/about.html"
        target="_blank"
        rel="noreferrer"
      >
        Know More
      </a>
    </div>
  );
}
