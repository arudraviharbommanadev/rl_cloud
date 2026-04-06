import json


class QLearningAgent:
    def __init__(self, dataset_path="rl_dataset.json"):
        with open(dataset_path, "r") as f:
            self.samples = json.load(f)

    def _distance(self, left, right):
        return (
            abs(left["cpu_util"] - right["cpu_util"])
            + abs(left["mem_util"] - right["mem_util"])
            + abs(left["instances"] - right["instances"])
            + abs(left["request_rate"] - right["request_rate"])
        )

    def recommend(self, state):
        closest_sample = min(
            self.samples,
            key=lambda sample: self._distance(state, sample["state"])
        )
        return {
            "action": closest_sample["action"],
            "reward": closest_sample["reward"],
            "matched_state": closest_sample["state"]
        }
