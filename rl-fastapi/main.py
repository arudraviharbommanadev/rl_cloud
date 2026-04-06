from fastapi import FastAPI
from pydantic import BaseModel

from agent import QLearningAgent
from scaler import Scaler

app = FastAPI()

agent = QLearningAgent()
scaler = Scaler("rl_dataset.json")


class State(BaseModel):
    cpu: float
    memory: float
    instances: int
    request_rate: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/decide")
def decide(state: State):
    raw_state = state.dict()
    norm_state = scaler.transform(raw_state)
    recommendation = agent.recommend(norm_state)

    return {
        "normalized_state": norm_state,
        "action": recommendation["action"],
        "reward": recommendation["reward"],
        "matched_state": recommendation["matched_state"]
    }
