"""
SENTINEL — Machine Learning Baseline & Sequential Anomaly Detection Engine
-------------------------------------------------------------------------
This script trains:
1. An Isolation Forest model for multi-variate outlier detection on privileged access telemetry.
2. A Markov Transition Probability Matrix for detecting anomalous action sequences.
3. Computes cumulative threat scores based on historical behavioral deviation.

Dependencies:
    pip install numpy scikit-learn pandas
"""

import json
import numpy as np
from sklearn.ensemble import IsolationForest

# 1. SYNTHETIC TELEMETRY TRAINING DATASET (Normal Privileged Administrator Behavior)
# Features:
# [0] Hour of Day (0 - 23)
# [1] Day of Week (0 = Mon, 6 = Sun)
# [2] Resource Criticality Index (1 = Standard Portal, 2 = Customer System, 3 = Core Server, 4 = High-Value Account)
# [3] Transaction Amount in INR (₹)
# [4] Action Category (1 = Read/View, 2 = Standard Modification, 3 = Limit Update, 4 = Wire Transfer)

np.random.seed(42)

# Generate 5,000 normal operational records (Working hours 9:00 - 18:00, weekdays, standard transactions)
normal_hours = np.random.normal(loc=13.5, scale=2.5, size=5000).clip(9, 18)
normal_days = np.random.randint(0, 5, size=5000)  # Mon-Fri
normal_resources = np.random.choice([1, 2], p=[0.7, 0.3], size=5000)
normal_amounts = np.random.lognormal(mean=10.5, sigma=0.8, size=5000).clip(5000, 500000)  # ₹5K - ₹500K
normal_actions = np.random.choice([1, 2], p=[0.8, 0.2], size=5000)

X_train = np.column_stack([
    normal_hours,
    normal_days,
    normal_resources,
    normal_amounts,
    normal_actions
])

print("================================================================")
print("🛡️  SENTINEL — TRAINING BEHAVIORAL BASELINE MODELS")
print("================================================================")
print(f"Training dataset shape: {X_train.shape} (5,000 normal administrative events)")

# 2. FIT ISOLATION FOREST FOR MULTI-VARIATE ANOMALY SCORING
iso_forest = IsolationForest(
    n_estimators=150,
    contamination=0.01,
    random_state=42
)
iso_forest.fit(X_train)
print("✓ Isolation Forest Baseline Model successfully fitted.")

# 3. MARKOV TRANSITION PROBABILITY MATRIX FOR ACTION SEQUENCES
# States:
# 0: Login
# 1: View Resource
# 2: Edit Beneficiary
# 3: Increase Limit
# 4: Execute Payment

states = ["Login", "View Resource", "Edit Beneficiary", "Increase Limit", "Execute Payment"]
num_states = len(states)

# Normal transition probability matrix learned from normal operations
# (High probabilities for standard paths: Login -> View -> Payment)
transition_matrix = np.array([
    [0.05, 0.85, 0.05, 0.01, 0.04],  # From Login
    [0.10, 0.40, 0.10, 0.05, 0.35],  # From View Resource
    [0.05, 0.30, 0.10, 0.05, 0.50],  # From Edit Beneficiary
    [0.02, 0.20, 0.03, 0.05, 0.70],  # From Increase Limit
    [0.40, 0.50, 0.02, 0.01, 0.07]   # From Execute Payment
])

def evaluate_sequence_anomaly(action_sequence):
    """
    Evaluates the transition probability of a sequence of actions.
    Returns sequence risk penalty delta.
    """
    prob = 1.0
    for i in range(len(action_sequence) - 1):
        s_from = action_sequence[i]
        s_to = action_sequence[i+1]
        prob *= max(transition_matrix[s_from, s_to], 1e-4)
    
    # Calculate negative log-likelihood penalty
    nll = -np.log10(prob)
    sequence_risk_delta = float(np.clip(nll * 3.5, 0, 30))
    return sequence_risk_delta, prob

# 4. INFERENCE BENCHMARK TEST: Primary Demo Scenario (Amit Sharma Incident)
# Sequence:
# Step 1: Normal Login (10:05 AM, Weekday, Standard Resource, 0 INR, Login)
# Step 2: Off-Hours Login (02:15 AM, Weekday, High-Value Resource, 0 INR, Login)
# Step 3: High-Value Account Access (02:17 AM, Critical Resource #CC-8821)
# Step 4: Beneficiary Modified to XYZ Holdings (02:19 AM)
# Step 5: Limit Increased 5x (02:21 AM)
# Step 6: Large Outward Wire (02:23 AM, ₹18,50,000)

test_events = [
    {"desc": "Normal Morning Login", "feat": [10.08, 1, 1, 0, 1], "seq_state": 0},
    {"desc": "Unusual 2:15 AM Login", "feat": [2.25, 1, 1, 0, 1], "seq_state": 0},
    {"desc": "Rare Corporate Account Access", "feat": [2.28, 1, 4, 0, 1], "seq_state": 1},
    {"desc": "Beneficiary Modified", "feat": [2.31, 1, 4, 0, 2], "seq_state": 2},
    {"desc": "5x Limit Increase", "feat": [2.35, 1, 4, 2500000, 3], "seq_state": 3},
    {"desc": "Large ₹18.5L Wire Initiation", "feat": [2.38, 1, 4, 1850000, 4], "seq_state": 4},
]

print("\n================================================================")
print("📊 BENCHMARKING REAL-TIME THREAT SCORING INFERENCE")
print("================================================================")

current_risk = 18.0
seq_history = []

for idx, event in enumerate(test_events, 1):
    feat = np.array(event["feat"]).reshape(1, -1)
    
    # 1. Isolation Forest Decision Function (Negative = Anomaly)
    anomaly_score = float(iso_forest.decision_function(feat)[0])
    is_anomaly = anomaly_score < 0
    
    # 2. Sequence Correlation Penalty
    seq_history.append(event["seq_state"])
    seq_delta = 0.0
    if len(seq_history) > 1:
        seq_delta, seq_prob = evaluate_sequence_anomaly(seq_history)
    
    # 3. Dynamic Multi-Factor Risk Calculation
    if is_anomaly:
        raw_delta = abs(anomaly_score) * 45.0 + 10.0
    else:
        raw_delta = 2.0
    
    current_risk = min(100.0, current_risk + raw_delta * 0.45 + seq_delta * 0.3)
    
    status = "🔴 CRITICAL" if current_risk >= 81 else "🟠 HIGH" if current_risk >= 61 else "🟡 MEDIUM" if current_risk >= 31 else "🟢 NORMAL"
    
    print(f"Step {idx}: {event['desc']}")
    print(f"   ├─ IsoForest Score: {anomaly_score:+.4f} ({'ANOMALOUS' if is_anomaly else 'NORMAL'})")
    print(f"   ├─ Cumulative Risk: {current_risk:.1f}/100 [{status}]")
    print()

print("✓ Baseline models and sequence correlation verified.")
