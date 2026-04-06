import { useMemo, useState } from "react";
import EndpointCard from "../common/EndpointCard";
import FormField from "../common/FormField";
import PrimaryButton from "../common/PrimaryButton";

const initialState = {
  cpu: 50,
  memory: 40,
  instances: 2,
  request_rate: 100
};

const presets = {
  low: { cpu: 20, memory: 15, instances: 1, request_rate: 50, label: "Low Load" },
  medium: { cpu: 50, memory: 40, instances: 2, request_rate: 150, label: "Medium Load" },
  high: { cpu: 85, memory: 90, instances: 3, request_rate: 500, label: "High Load" }
};

function actionCopy(action) {
  if (action === "scale_up") return { label: "Scale Up", cue: "Traffic pressure is rising. Add capacity." };
  if (action === "scale_down") return { label: "Scale Down", cue: "Load is light. Reduce capacity safely." };
  return { label: "Hold Steady", cue: "Current setup is balanced. Keep it unchanged." };
}

function getActionColor(action) {
  if (action === "scale_up") return "#ba3a2a";
  if (action === "scale_down") return "#05668d";
  return "#1d9a6c";
}

function validateForm(state) {
  const errors = [];
  if (state.cpu < 0 || state.cpu > 100) errors.push("CPU must be between 0 and 100");
  if (state.memory < 0 || state.memory > 100) errors.push("Memory must be between 0 and 100");
  if (![1, 2, 3].includes(state.instances)) errors.push("Instances must be 1, 2, or 3");
  if (state.request_rate < 0) errors.push("Request Rate must be >= 0");
  return errors;
}

export default function DecideEndpoint({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [result, setResult] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const ui = useMemo(() => actionCopy(result?.action), [result]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
    setValidationErrors([]);
  };

  const applyPreset = (presetKey) => {
    const preset = presets[presetKey];
    setForm(preset);
    setResult(null);
    setError("");
    setValidationErrors([]);
  };

  const resetForm = () => {
    setForm(initialState);
    setResult(null);
    setError("");
    setValidationErrors([]);
    setShowDebug(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    
    const errors = validateForm(form);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setLoading(true);
    setError("");

    try {
      const data = await onSubmit(form);
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not compute a decision.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard
      title="Capacity Decision"
      description="Provide current load signals to get the next scaling recommendation."
    >
      <form className="stack" onSubmit={submit}>
        {/* Preset Buttons */}
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn preset-low"
            onClick={() => applyPreset("low")}
            title="Auto-fill with low load values"
          >
            Low Load
          </button>
          <button
            type="button"
            className="preset-btn preset-medium"
            onClick={() => applyPreset("medium")}
            title="Auto-fill with medium load values"
          >
            Medium Load
          </button>
          <button
            type="button"
            className="preset-btn preset-high"
            onClick={() => applyPreset("high")}
            title="Auto-fill with high load values"
          >
            High Load
          </button>
        </div>

        {/* Input Fields */}
        <div className="fields-grid">
          <FormField
            label="CPU Usage (%)"
            name="cpu"
            value={form.cpu}
            onChange={onChange}
            type="number"
            min="0"
            max="100"
            hint="0–100"
          />
          <FormField
            label="Memory Usage (%)"
            name="memory"
            value={form.memory}
            onChange={onChange}
            type="number"
            min="0"
            max="100"
            hint="0–100"
          />
          <FormField
            label="Running Instances"
            name="instances"
            value={form.instances}
            onChange={onChange}
            type="select"
            options={[
              { value: 1, label: "1 Instance" },
              { value: 2, label: "2 Instances" },
              { value: 3, label: "3 Instances" }
            ]}
          />
          <FormField
            label="Request Rate (req/s)"
            name="request_rate"
            value={form.request_rate}
            onChange={onChange}
            type="number"
            min="0"
            hint="0–1000+"
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            {validationErrors.map((err, idx) => (
              <p key={idx} className="error-item">
                ✗ {err}
              </p>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="action-row">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Analyzing Load..." : "Simulate Scaling"}
          </PrimaryButton>
          <button type="button" className="secondary-btn" onClick={resetForm} disabled={loading}>
            Reset
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="response loading">
          <div className="spinner" />
          <span>Reviewing system behavior...</span>
        </div>
      )}

      {/* Error State */}
      {error && <div className="response error">{error}</div>}

      {/* Idle State */}
      {!loading && !error && !result && (
        <div className="response idle">Your recommendation, reward, and closest trained sample will appear here.</div>
      )}

      {/* Result State */}
      {!loading && !error && result && (
        <div className="insight-card" aria-live="polite">
          {/* Action Result */}
          <div className="result-section">
            <div className="result-action" style={{ borderLeftColor: getActionColor(result.action) }}>
              <p className="insight-kicker">Recommended Action</p>
              <h4 className={`action-label action-${result.action}`}>{ui.label}</h4>
              <p className="action-cue">{ui.cue}</p>
            </div>

            {/* Reward Display */}
            <div className="result-reward">
              <p className="insight-kicker">Reward</p>
              <div className="reward-value">{result.reward !== undefined ? result.reward.toFixed(4) : "N/A"}</div>
            </div>
          </div>

          {/* Visual Diagram */}
          <div className={`scale-diagram ${result.action || "no_change"}`}>
            <span className="node" />
            <span className="arrow">
              {result.action === "scale_up" ? "▲" : result.action === "scale_down" ? "▼" : "●"}
            </span>
            <span className="node highlighted" />
          </div>

          {/* Debug Section (Collapsible) */}
          <div className="debug-section">
            <button
              type="button"
              className="debug-toggle"
              onClick={() => setShowDebug(!showDebug)}
              aria-expanded={showDebug}
            >
              <span>{showDebug ? "▼" : "▶"}</span>
              <span>Normalized State (Debug)</span>
            </button>
            {showDebug && (
              <div className="debug-content">
                <pre>{JSON.stringify({
                  normalized_state: result.normalized_state,
                  matched_state: result.matched_state
                }, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </EndpointCard>
  );
}
