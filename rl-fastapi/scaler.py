import json

class Scaler:
    def __init__(self, path):
        with open(path, 'r') as f:
            data = json.load(f)

        self.cpu_max = max(d['state']['cpu_util'] for d in data)
        self.mem_max = max(d['state']['mem_util'] for d in data)
        self.req_max = max(d['state']['request_rate'] for d in data)

    def transform(self, state):
        return {
            # convert % → match tiny scale
            "cpu_util": (state["cpu"] / 100) * self.cpu_max,
            "mem_util": (state["memory"] / 100) * self.mem_max,

            # instances mapping (important)
            "instances": (state["instances"] - 1) / 2,

            # scale request rate proportionally
            "request_rate": (state["request_rate"] / 1000) * self.req_max
        }