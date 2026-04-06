class Environment:
    def get_reward(self, state, action):
        cpu = state["cpu_util"]
        memory = state["mem_util"]
        instances = state["instances"]

        load = (cpu + memory) / 2
        reward = 0

        if load > 0.75:
            reward += 3 if action == "scale_up" else -3
        elif load < 0.30:
            reward += 3 if action == "scale_down" else -2
        else:
            reward += 2 if action == "hold" else -1

        reward -= instances * 0.3

        if cpu > 0.9 or memory > 0.9:
            reward -= 4

        return reward