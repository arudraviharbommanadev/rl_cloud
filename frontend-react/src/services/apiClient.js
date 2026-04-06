export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  if (!response.ok) {
    throw new Error(payload?.detail || payload?.message || `Request failed with ${response.status}`);
  }

  return payload;
}

const NODE_BASE = import.meta.env.VITE_NODE_API_BASE || "/node-api";
const PYTHON_BASE = import.meta.env.VITE_PY_API_BASE || "/py-api";

export const api = {
  urls: {
    node: NODE_BASE,
    python: PYTHON_BASE
  },
  nodeDecide: (state) => requestJson(`${NODE_BASE}/api/decide`, { method: "POST", body: JSON.stringify(state) }),
  pyHealth: () => requestJson(`${PYTHON_BASE}/health`, { method: "GET" }),
  pyDecide: (state) => requestJson(`${PYTHON_BASE}/decide`, { method: "POST", body: JSON.stringify(state) })
};
