import { useState } from "react";
import EndpointCard from "../common/EndpointCard";
import PrimaryButton from "../common/PrimaryButton";
import ResponsePanel from "../common/ResponsePanel";

export default function ActionEndpoint({ title, endpoint, description, buttonLabel, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const run = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await onSubmit();
      setData(result);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EndpointCard title={title} endpoint={endpoint} description={description}>
      <PrimaryButton type="button" onClick={run} disabled={loading}>
        {loading ? "Running..." : buttonLabel}
      </PrimaryButton>
      <ResponsePanel loading={loading} error={error} data={data} />
    </EndpointCard>
  );
}
