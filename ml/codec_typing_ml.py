"""
CODEC Typing ML Analysis Pipeline
===================================
Models run on user's typing session data:
  1. Weak Key Classifier     (Random Forest — trained per-session on aggregated key stats)
  2. WPM Growth Predictor    (Polynomial Regression — predicts future WPM trajectory)
  3. Typing Proficiency       (Gradient Boosting — pre-trained on keystroke dataset)
  4. Speed Prediction         (Random Forest Regressor — pre-trained on keystroke dataset)

Reads JSON session data from stdin, outputs analysis report JSON to stdout.
"""

import sys
import json
import numpy as np
import pandas as pd
from collections import defaultdict

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import PolynomialFeatures
    from sklearn.linear_model import LinearRegression
    from sklearn.preprocessing import StandardScaler
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


def parse_sessions(raw_sessions):
    """Parse raw session data into structured format."""
    sessions = []
    for s in raw_sessions:
        sessions.append({
            'date': s.get('date', ''),
            'mode': s.get('mode', 'words'),
            'durationSecs': s.get('durationSecs', 0),
            'wpm': s.get('wpm', 0),
            'accuracy': s.get('accuracy', 0),
            'keypresses': s.get('keypresses', []),
            'backspaces': s.get('backspaces', []),
        })
    return sessions


def model1_weak_key_classifier(sessions):
    """
    Model 1: Random Forest Weak Key Classifier
    Classifies each key as Strong / Average / Weak based on typing metrics.
    """
    key_stats = defaultdict(lambda: {
        'latencies': [], 'errors': 0, 'total': 0,
        'hold_durations': [], 'backspace_count': 0
    })

    for session in sessions:
        for kp in session['keypresses']:
            key = kp.get('key', '').lower()
            if not key or len(key) != 1:
                continue
            stats = key_stats[key]
            stats['total'] += 1
            if kp.get('interKeyMs', 0) > 0:
                stats['latencies'].append(kp['interKeyMs'])
            if not kp.get('isCorrect', True):
                stats['errors'] += 1
            if kp.get('holdMs', 0) > 0:
                stats['hold_durations'].append(kp['holdMs'])

        for bs in session['backspaces']:
            error_key = bs.get('errorKey', '').lower()
            if error_key and len(error_key) == 1:
                key_stats[error_key]['backspace_count'] += 1

    if not key_stats:
        return {'weakKeys': [], 'strongKeys': [], 'averageKeys': []}

    # Build feature matrix
    keys = []
    features = []
    for key, stats in key_stats.items():
        if stats['total'] < 3:
            continue
        avg_latency = np.mean(stats['latencies']) if stats['latencies'] else 500
        error_rate = stats['errors'] / stats['total']
        hold_var = np.var(stats['hold_durations']) if len(stats['hold_durations']) > 1 else 0
        bs_rate = stats['backspace_count'] / stats['total']
        keys.append(key)
        features.append([avg_latency, error_rate, hold_var, bs_rate, stats['total']])

    if len(keys) < 3:
        return {'weakKeys': [], 'strongKeys': [], 'averageKeys': list(key_stats.keys())}

    X = np.array(features)

    if HAS_SKLEARN and len(keys) >= 5:
        latency_scores = X[:, 0]
        error_scores = X[:, 1]
        combined = latency_scores * 0.5 + error_scores * 100 * 0.5

        labels = []
        p33 = np.percentile(combined, 33)
        p66 = np.percentile(combined, 66)
        for score in combined:
            if score <= p33:
                labels.append(0)  # Strong
            elif score <= p66:
                labels.append(1)  # Average
            else:
                labels.append(2)  # Weak

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        clf.fit(X, labels)
        predictions = clf.predict(X)
    else:
        latencies = X[:, 0]
        error_rates = X[:, 1]
        combined = latencies / np.max(latencies) * 0.5 + error_rates * 0.5
        predictions = []
        for score in combined:
            if score < 0.33:
                predictions.append(0)
            elif score < 0.66:
                predictions.append(1)
            else:
                predictions.append(2)

    label_names = ['Strong', 'Average', 'Weak']
    result = {'weakKeys': [], 'strongKeys': [], 'averageKeys': []}

    for i, key in enumerate(keys):
        label = label_names[predictions[i]]
        entry = {
            'key': key,
            'avgLatencyMs': round(float(features[i][0]), 1),
            'errorRate': round(float(features[i][1]), 3),
            'totalPresses': int(features[i][4]),
        }
        if label == 'Weak':
            result['weakKeys'].append(entry)
        elif label == 'Strong':
            result['strongKeys'].append(entry)
        else:
            result['averageKeys'].append(entry)

    result['weakKeys'].sort(key=lambda x: x['errorRate'], reverse=True)
    result['strongKeys'].sort(key=lambda x: x['avgLatencyMs'])

    return result


def model2_wpm_predictor(sessions):
    """
    Model 2: Average WPM Growth Predictor
    Predicts future WPM trajectory based on simple average improvement rate.
    Replaces older ML approach for more stable updates.
    """
    if len(sessions) < 3:
        return {
            'currentWpm': 0,
            'predictedWpm30': 0, 'predictedWpm60': 0, 'predictedWpm90': 0,
            'daysTo60Wpm': None,
            'trajectory': [],
            'improvementRate': 0,
        }

    wpms = [s['wpm'] for s in sessions if s['wpm'] and s['wpm'] > 0]
    if len(wpms) < 3:
        return {
            'currentWpm': wpms[-1] if wpms else 0,
            'predictedWpm30': 0, 'predictedWpm60': 0, 'predictedWpm90': 0,
            'daysTo60Wpm': None,
            'trajectory': [],
            'totalSessions': len(wpms),
            'improvementRate': 0,
        }

    # Focus on the most recent sessions to capture current trend
    # Use up to the last 70 sessions to find the average WPM improvement
    recent_wpms = wpms[-70:] if len(wpms) > 70 else wpms
    
    if len(recent_wpms) >= 5:
        # Windowed average for the early and late parts of the recent sessions
        window_size = max(3, len(recent_wpms) // 4)
        early_avg = np.mean(recent_wpms[:window_size])
        late_avg = np.mean(recent_wpms[-window_size:])
        session_gap = max(1, len(recent_wpms) - window_size)
        improvement_rate = (late_avg - early_avg) / session_gap
    else:
        improvement_rate = (recent_wpms[-1] - recent_wpms[0]) / max(len(recent_wpms) - 1, 1)

    current_wpm = float(wpms[-1])
    
    trajectory = []
    start_wpm = wpms[0]
    overall_gap = max(1, len(wpms) - 1)
    overall_improvement = (current_wpm - start_wpm) / overall_gap
    
    for i in range(len(wpms)):
        predicted_at_i = start_wpm + (overall_improvement * i)
        trajectory.append({
            'session': i + 1,
            'actual': round(float(wpms[i]), 1),
            'predicted': round(float(max(0, predicted_at_i)), 1),
        })

    max_predicted = min(current_wpm * 3, 200)

    pred_30 = max(0, min(current_wpm + improvement_rate * 30, max_predicted))
    pred_60 = max(0, min(current_wpm + improvement_rate * 60, max_predicted))
    pred_90 = max(0, min(current_wpm + improvement_rate * 90, max_predicted))

    days_to_60 = None
    if current_wpm < 60 and improvement_rate > 0:
        days_to_60 = int(np.ceil((60 - current_wpm) / improvement_rate))
        days_to_60 = min(days_to_60, 999)

    return {
        'currentWpm': round(float(current_wpm), 1),
        'predictedWpm30': round(pred_30, 1),
        'predictedWpm60': round(pred_60, 1),
        'predictedWpm90': round(pred_90, 1),
        'daysTo60Wpm': days_to_60,
        'trajectory': trajectory,
        'totalSessions': len(wpms),
        'improvementRate': round(float(improvement_rate), 3),
    }


# ─────────────────────────────────────────────────────────────────────────────
# PRE-TRAINED DATASET MODELS (trained on keystrokes_dataset)
# ─────────────────────────────────────────────────────────────────────────────
import os

try:
    import joblib
    HAS_JOBLIB = True
except ImportError:
    HAS_JOBLIB = False

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')


def _load_metadata():
    """Load model metadata (feature columns, metrics, etc.)."""
    meta_path = os.path.join(MODEL_DIR, 'metadata.json')
    if os.path.exists(meta_path):
        with open(meta_path, 'r') as f:
            return json.load(f)
    return None


def _extract_word_features_from_sessions(sessions):
    """
    Convert app session data (keypresses) into word-level features
    matching the training dataset format.
    """
    all_words = []

    for session in sessions:
        keypresses = session.get('keypresses', [])
        if len(keypresses) < 5:
            continue

        current_word = []
        for kp in keypresses:
            key = kp.get('key', '')
            if key == ' ' or key == 'Space':
                if current_word:
                    all_words.append(current_word)
                    current_word = []
            else:
                current_word.append(kp)
        if current_word:
            all_words.append(current_word)

    word_features = []
    for word_kps in all_words:
        if len(word_kps) < 1:
            continue

        word_text = ''.join(kp.get('key', '') for kp in word_kps).upper()
        timestamps = [kp.get('timestampMs', 0) for kp in word_kps]
        hold_times = [kp.get('holdMs', 0) for kp in word_kps]
        inter_keys = [kp.get('interKeyMs', 0) for kp in word_kps]

        if len(timestamps) >= 2:
            word_hold = timestamps[-1] - timestamps[0] + hold_times[-1] if hold_times[-1] > 0 else timestamps[-1] - timestamps[0]
        else:
            word_hold = hold_times[0] if hold_times else 0

        if word_hold <= 0:
            word_hold = sum(max(ik, 0) for ik in inter_keys) + sum(max(h, 0) for h in hold_times)

        flights = [ik for ik in inter_keys[1:] if ik > 0]
        avg_flight1 = np.mean(flights) if flights else 0
        avg_flight2 = np.median(flights) if flights else 0
        avg_flight3 = np.mean(flights) if flights else 0
        avg_flight4 = (avg_flight1 + avg_flight2) if flights else 0

        avg_word = word_hold / len(word_kps) if len(word_kps) > 0 else 0

        word_features.append({
            'word': word_text,
            'word_hold': max(word_hold, 0),
            'avg_flight1': max(avg_flight1, 0),
            'avg_flight2': max(avg_flight2, 0),
            'avg_flight3': max(avg_flight3, 0),
            'avg_flight4': max(avg_flight4, 0),
            'avg_word': max(avg_word, 0),
        })

    return pd.DataFrame(word_features) if word_features else None


def _extract_session_features(df):
    """
    Extract aggregated features from word-level data.
    Must match the feature extraction from train_models.py exactly.
    """
    if df is None or len(df) < 5:
        return None

    df = df.copy()
    df['word_length'] = df['word'].apply(lambda w: len(str(w)) if pd.notna(w) else 0)
    df = df[df['word_length'] > 0]

    if len(df) < 5:
        return None

    features = {}
    numeric_cols = ['word_hold', 'avg_flight1', 'avg_flight2',
                    'avg_flight3', 'avg_flight4', 'avg_word', 'word_length']

    for col in numeric_cols:
        vals = df[col].values.astype(float)
        vals = vals[vals > 0] if col != 'word_length' else vals
        if len(vals) == 0:
            vals = np.array([0.0])

        features[f'{col}_mean'] = float(np.mean(vals))
        features[f'{col}_std'] = float(np.std(vals))
        features[f'{col}_median'] = float(np.median(vals))
        features[f'{col}_p25'] = float(np.percentile(vals, 25))
        features[f'{col}_p75'] = float(np.percentile(vals, 75))
        features[f'{col}_iqr'] = features[f'{col}_p75'] - features[f'{col}_p25']
        features[f'{col}_max'] = float(np.max(vals))
        features[f'{col}_min'] = float(np.min(vals))
        features[f'{col}_cv'] = float(np.std(vals) / np.mean(vals)) if np.mean(vals) > 0 else 0.0

    features['total_words'] = len(df)
    features['avg_hold_per_char'] = features['word_hold_mean'] / max(features['word_length_mean'], 1)
    features['flight_consistency'] = features['avg_flight1_std'] / max(features['avg_flight1_mean'], 1)
    features['speed_ratio'] = features['avg_word_mean'] / max(features['word_hold_mean'], 1)
    features['hold_flight_ratio'] = features['word_hold_mean'] / max(features['avg_flight1_mean'], 1)

    holds = df['word_hold'].values.astype(float)
    if len(holds) > 2:
        std_val = float(np.std(holds))
        features['hold_autocorr'] = float(np.corrcoef(holds[:-1], holds[1:])[0, 1]) if std_val > 0 else 0.0
        features['hold_trend'] = float(np.polyfit(range(len(holds)), holds, 1)[0])
    else:
        features['hold_autocorr'] = 0.0
        features['hold_trend'] = 0.0

    per_char_speeds = df['word_hold'].values.astype(float) / np.maximum(df['word_length'].values.astype(float), 1)
    mean_speed = float(np.mean(per_char_speeds))
    features['chars_per_sec'] = 1000.0 / mean_speed if mean_speed > 0 else 0.0
    features['estimated_wpm'] = features['chars_per_sec'] * 60 / 5

    for k, v in features.items():
        if not np.isfinite(v):
            features[k] = 0.0

    return features


def model_pretrained_analysis(sessions):
    """
    Run 2 pre-trained models (from keystrokes_dataset) on user session data.

    Returns analysis report with:
      - proficiency: Beginner/Intermediate/Expert classification
      - speedPrediction: predicted WPM from keystroke features
    """
    if not HAS_JOBLIB or not HAS_SKLEARN:
        return {'error': 'Required packages not installed (joblib, sklearn)'}

    metadata = _load_metadata()
    if metadata is None:
        return {'error': 'Pre-trained models not found. Run train_models.py first.'}

    word_df = _extract_word_features_from_sessions(sessions)
    if word_df is None or len(word_df) < 5:
        return {'error': 'Not enough typing data. Type at least 5 words.'}

    session_feats = _extract_session_features(word_df)
    if session_feats is None:
        return {'error': 'Failed to extract features from session data.'}

    feature_cols = metadata['feature_columns']
    speed_feature_cols = metadata['speed_feature_columns']

    X_full = np.array([[session_feats.get(c, 0.0) for c in feature_cols]])
    X_speed = np.array([[session_feats.get(c, 0.0) for c in speed_feature_cols]])

    result = {}

    # ── Model 1: Typing Proficiency ──
    try:
        clf = joblib.load(os.path.join(MODEL_DIR, 'proficiency_gb.joblib'))
        scaler = joblib.load(os.path.join(MODEL_DIR, 'proficiency_scaler.joblib'))
        X_scaled = scaler.transform(X_full)
        proba = clf.predict_proba(X_scaled)[0]
        pred_class = int(clf.predict(X_scaled)[0])
        labels = metadata.get('proficiency_labels', ['Beginner', 'Intermediate', 'Expert'])

        # Override level AND bar scores with WPM-based thresholds.
        # <30 WPM = Beginner, 30-60 = Intermediate, 60+ = Expert.
        # Bar scores show progress within the current tier; other tiers = 0.
        est_wpm = session_feats.get('estimated_wpm', 0)
        if est_wpm >= 60:
            wpm_level = 'Expert'
            wpm_scores = {
                'Beginner': 0.0,
                'Intermediate': 0.0,
                'Expert': round(min(100.0, (est_wpm - 60) / 60 * 100), 1),
            }
        elif est_wpm >= 30:
            wpm_level = 'Intermediate'
            wpm_scores = {
                'Beginner': 0.0,
                'Intermediate': round((est_wpm - 30) / 30 * 100, 1),
                'Expert': 0.0,
            }
        else:
            wpm_level = 'Beginner'
            wpm_scores = {
                'Beginner': round(max(0.0, est_wpm / 30 * 100), 1),
                'Intermediate': 0.0,
                'Expert': 0.0,
            }

        result['proficiency'] = {
            'level': wpm_level,
            'confidence': round(wpm_scores[wpm_level], 1),
            'scores': wpm_scores,
            'modelAccuracy': metadata['models']['proficiency']['metrics']['cv_mean'],
        }
    except Exception as e:
        result['proficiency'] = {'error': str(e)}

    # ── Model 2: Speed Prediction ──
    try:
        rfr = joblib.load(os.path.join(MODEL_DIR, 'speed_rfr.joblib'))
        scaler = joblib.load(os.path.join(MODEL_DIR, 'speed_scaler.joblib'))
        X_scaled = scaler.transform(X_speed)
        predicted_wpm = float(rfr.predict(X_scaled)[0])
        actual_wpm = session_feats.get('estimated_wpm', 0)

        result['speedPrediction'] = {
            'predictedWpm': round(max(0, predicted_wpm), 1),
            'actualEstimatedWpm': round(actual_wpm, 1),
            'difference': round(abs(predicted_wpm - actual_wpm), 1),
            'wpmRange': metadata['models']['speed_prediction']['metrics']['wpm_range'],
            'modelMAE': metadata['models']['speed_prediction']['metrics']['test_mae'],
        }
    except Exception as e:
        result['speedPrediction'] = {'error': str(e)}

    # Summary insights
    result['featureSummary'] = {
        'wordsAnalyzed': int(session_feats.get('total_words', 0)),
        'avgWordHoldMs': round(session_feats.get('word_hold_mean', 0), 1),
        'avgFlightMs': round(session_feats.get('avg_flight1_mean', 0), 1),
        'estimatedWpm': round(session_feats.get('estimated_wpm', 0), 1),
        'holdConsistency': round(1 - min(session_feats.get('word_hold_cv', 1), 1), 2),
        'rhythmScore': round(max(0, 1 - session_feats.get('flight_consistency', 1)) * 100, 1),
    }

    return result


def main():
    """Read session data from stdin, run all models, output JSON to stdout."""
    try:
        raw_input = sys.stdin.read()
        raw_sessions = json.loads(raw_input)
    except (json.JSONDecodeError, Exception) as e:
        print(json.dumps({'error': f'Failed to parse input: {str(e)}'}))
        sys.exit(1)

    sessions = parse_sessions(raw_sessions)

    if len(sessions) < 3:
        print(json.dumps({'error': 'Need at least 3 sessions for analysis'}))
        sys.exit(1)

    report = {
        'keyAnalysis': model1_weak_key_classifier(sessions),
        'wpmPrediction': model2_wpm_predictor(sessions),
        'datasetAnalysis': model_pretrained_analysis(sessions),
        'sessionCount': len(sessions),
        'currentWpm': sessions[0]['wpm'] if sessions else 0,
    }

    print(json.dumps(report))


if __name__ == '__main__':
    main()
