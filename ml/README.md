# 🧠 SENTINEL Machine Learning & Behavior Intelligence Pipeline

This module documents the mathematical modeling, training process, and inference pipeline powering SENTINEL's Privileged Access Misuse and Insider Threat Detection capabilities.

---

## 🔬 Core Modeling Paradigms

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Dimensional Anomaly   │     │  Sequential Correlation │     │  Contextual Validation  │
│    (Isolation Forest)   │  +  │      (Markov Chain)     │  -  │   (Graph Cross-Check)   │
└───────────┬─────────────┘     └───────────┬─────────────┘     └───────────┬─────────────┘
            │                               │                               │
            └───────────────────────────────┼───────────────────────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │ Dynamic Risk Score [0-100│
                               └─────────────────────────┘
```

---

## 📊 1. Feature Engineering Vector

For each administrative telemetry event $e_t$, the system constructs a 5-dimensional continuous/categorical feature vector:

$$\mathbf{x}_t = \begin{bmatrix} 
\text{HourOfDay} \in [0, 23.99] \\
\text{DayOfWeek} \in [0, 6] \\
\text{ResourceCriticality} \in [1, 4] \\
\text{TransactionAmount} \in \mathbb{R}^+ \\
\text{ActionType} \in \{1, 2, 3, 4\}
\end{bmatrix}$$

---

## 🌲 2. Model 1: Isolation Forest (Spatial Outlier Detection)

Isolation Forest isolates observations by randomly selecting a feature and then randomly selecting a split value between the maximum and minimum values of the selected feature.

* **Path Length Expectation**:
  $$c(n) = 2\left(\ln(n - 1) + 0.5772156649\right) - \frac{2(n - 1)}{n}$$

* **Anomaly Score Function**:
  $$s(x, n) = 2^{-\frac{\mathbb{E}(h(x))}{c(n)}}$$
  * When $\mathbb{E}(h(x)) \to 0$, $s \to 1$ $\implies$ **Definite Anomaly (e.g. 02:15 AM Login)**.
  * When $\mathbb{E}(h(x)) \to c(n)$, $s \to 0.5$ $\implies$ **Normal Operations**.

---

## ⛓️ 3. Model 2: Markovian Sequence Transition Penalty

Single actions may pass RBAC policies. When actions occur in close temporal proximity ($T \le 10 \text{ mins}$), the sequential likelihood is evaluated:

$$P(S) = P(a_1) \prod_{t=2}^{K} P(a_t \mid a_{t-1})$$

$$\Delta \text{Risk}_{\text{seq}} = \min\left(25, \; -10 \cdot \log_{10} P(S)\right)$$

If an administrator performs:
$$\text{Login} \xrightarrow{P=0.01} \text{Beneficiary Edit} \xrightarrow{P=0.03} \text{Limit Increase} \xrightarrow{P=0.05} \text{Large Payment}$$
The joint probability drops below $1.5 \times 10^{-5}$, incurring a $+25$ critical sequence penalty.

---

## 🛠️ Running the Python Training Benchmark

To execute the Python ML baseline simulation:

```bash
cd ml
python3 train_baseline_model.py
```

### Output Example:
```
================================================================
🛡️  SENTINEL — TRAINING BEHAVIORAL BASELINE MODELS
================================================================
Training dataset shape: (5000, 5) (5,000 normal administrative events)
✓ Isolation Forest Baseline Model successfully fitted.

================================================================
📊 BENCHMARKING REAL-TIME THREAT SCORING INFERENCE
================================================================
Step 1: Normal Morning Login
   ├─ IsoForest Score: +0.1421 (NORMAL)
   ├─ Cumulative Risk: 20.0/100 [🟢 NORMAL]

Step 2: Unusual 2:15 AM Login
   ├─ IsoForest Score: -0.1984 (ANOMALOUS)
   ├─ Cumulative Risk: 40.0/100 [🟡 MEDIUM]

Step 3: Rare Corporate Account Access
   ├─ IsoForest Score: -0.2312 (ANOMALOUS)
   ├─ Cumulative Risk: 55.0/100 [🟡 MEDIUM]

Step 4: Beneficiary Modified
   ├─ IsoForest Score: -0.2645 (ANOMALOUS)
   ├─ Cumulative Risk: 70.0/100 [🟠 HIGH]

Step 5: 5x Limit Increase
   ├─ IsoForest Score: -0.3120 (ANOMALOUS)
   ├─ Cumulative Risk: 80.0/100 [🟠 HIGH]

Step 6: Large ₹18.5L Wire Initiation
   ├─ IsoForest Score: -0.3891 (ANOMALOUS)
   ├─ Cumulative Risk: 92.0/100 [🔴 CRITICAL]
```
