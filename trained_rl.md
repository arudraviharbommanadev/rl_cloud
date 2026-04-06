# 📄 Cloud Resource Allocation using Reinforcement Learning

## (Final Documentation – With Deterministic Policy using ε = 0)

---

# 1. 📌 Overview

This project implements a **Reinforcement Learning (RL)-based cloud auto-scaling system** that recommends:

* ⬆️ Scale Up
* ⬇️ Scale Down
* ➖ Hold

The system is trained using historical workload data and provides **consistent, deterministic decisions** during inference.

---

# 2. 🧠 Training Process

## 2.1 Dataset

* File: `rl_dataset.json`
* Contains:

  * State (normalized system metrics)
  * Action
  * Reward

## 2.2 Algorithm

* **Q-Learning (Tabular)**
* Uses Bellman update rule:

[
Q(s,a) = Q(s,a) + \alpha \left[ r + \gamma \max Q(s',a') - Q(s,a) \right]
]

## 2.3 Training Characteristics

* Sequential dataset traversal
* Multiple episodes (e.g., 200–500)
* Learning through reward feedback

---

# 3. ⚙️ RL Policy

## 3.1 Epsilon-Greedy Policy

During training:

* Explore with probability ε
* Exploit with probability (1 − ε)

### Parameters:

| Parameter         | Value |
| ----------------- | ----- |
| epsilon (initial) | 1.0   |
| epsilon_decay     | 0.995 |
| epsilon_min       | 0.01  |
| alpha             | 0.1   |
| gamma             | 0.9   |

---

## 3.2 Deterministic Policy (Final System)

After training:

```python
agent.epsilon = 0
```

### Meaning:

* ❌ No exploration
* ✅ Always choose best learned action

---

## 3.3 Effect of ε = 0

| Before (ε > 0)                 | After (ε = 0)            |
| ------------------------------ | ------------------------ |
| Random actions possible        | No randomness            |
| Same input → different outputs | Same input → same output |
| Exploration present            | Pure exploitation        |
| Unstable decisions             | Stable decisions         |

---

# 4. 🔁 Episodes

## Definition:

* 1 Episode = one full pass over dataset

## Usage:

* Training repeats dataset multiple times

## Recommended:

* 200–500 episodes

## Purpose:

* Improve Q-value convergence
* Reduce randomness
* Learn stable policy

---

# 5. 📊 Reward Function

## Objective:

Balance:

* Performance (avoid overload)
* Cost (minimize instances)

## Logic:

* High load → reward scale_up
* Low load → reward scale_down
* Balanced → reward hold

## Penalties:

* High instances → cost penalty
* High CPU/memory → SLA violation penalty

---

# 6. 🔄 Input Adjustment (Normalization)

## User Input (Frontend/API)

```json
{
  "cpu": 0–100,
  "memory": 0–100,
  "instances": 1–3,
  "request_rate": 0–1000
}
```

## Transformed Input (Model)

```json
{
  "cpu_util": small float,
  "mem_util": small float,
  "instances": 0–1,
  "request_rate": small float
}
```

## Instance Mapping:

| Instances | Normalized |
| --------- | ---------- |
| 1         | 0.0        |
| 2         | 0.5        |
| 3         | 1.0        |

---

# 7. 📁 JSON Dataset Role

`rl_dataset.json` serves as:

* Training data
* Experience memory
* State-action reference

---

# 8. 🤖 Learning Behavior

## 8.1 During Training

* Exploration dominant (ε starts at 1.0)
* Gradual learning of Q-values

## 8.2 After Training

* ε set to 0
* Agent uses only learned Q-values

---

## 8.3 Learning Verification

Learning is confirmed if:

* Q-table has many states
* Actions vary across different inputs
* Same input produces same output (after ε = 0)
* Rewards improve over episodes

---

# 9. 🚀 Decision Flow

1. User provides system metrics
2. Inputs are normalized
3. Agent selects best action (ε = 0)
4. Environment computes reward
5. Output returned

---

# 10. 🎯 Deterministic Decision System

With ε = 0:

* System behaves like a **policy-based controller**
* Fully consistent outputs
* Suitable for:

  * Deployment
  * Demonstration
  * Evaluation

---

# 11. ⚠️ Limitations

* Q-table does not generalize to unseen states
* Dataset-driven learning (no real-time environment)
* No delayed scaling simulation

---

# 12. 🔥 Future Improvements

* Deep Q Network (DQN)
* Continuous state generalization
* Real-time cloud simulation
* Adaptive reward tuning

---

# 13. ✅ Conclusion

By setting:

```python
agent.epsilon = 0
```

the system transitions from a **learning agent** to a **decision-making system**.

This ensures:

* Stable recommendations
* Consistent outputs
* Reliable behavior

making the system suitable for real-world demonstration and evaluation.

---
####
Highlight to change UI