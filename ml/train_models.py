"""
CODEC Keystroke ML Training Pipeline
=====================================
Trains 2 models on the keystrokes_dataset and saves them as joblib files:

  1. Typing Proficiency    -> Gradient Boosting Classifier (beginner/intermediate/expert)
  2. Speed Prediction      -> Random Forest Regressor (predict WPM from keystroke features)

Dataset: keystrokes_dataset/{s0,s1,s3}/ — 75 CSV files per user (3 users, 225 sessions)
Features per word: word_hold, avg_flight1-4, avg_word, word_length
Aggregated per session (file): mean, std, median, percentiles of all features

The proficiency labels are assigned using ABSOLUTE speed thresholds (not percentile-based)
to avoid the issue where everyone gets classified as "Expert".

The speed prediction model uses word_hold_mean normalized by word_length to estimate
characters-per-second, then derives WPM, ensuring no data leakage.

Usage: python ml/train_models.py
Output: ml/models/*.joblib + ml/models/metadata.json
"""

import os
import sys
import json
import glob
import numpy as np
import pandas as pd
import joblib
from collections import defaultdict

from sklearn.ensemble import GradientBoostingClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────
DATASET_DIR = os.path.join(os.path.dirname(__file__), '..', 'keystrokes_dataset')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
USER_DIRS = {'s0': 0, 's1': 1, 's3': 2}  # folder -> numeric label

# Absolute WPM thresholds for proficiency classification
# Based on real typing speed benchmarks:
#   Beginner:     < 20 WPM  (hunt-and-peck typists)
#   Intermediate: 20-35 WPM (casual typists)
#   Expert:       > 35 WPM  (touch typists)
WPM_BEGINNER_MAX = 20.0
WPM_INTERMEDIATE_MAX = 35.0


def load_csv_file(filepath):
    """Load a single CSV file and return DataFrame with cleaned data."""
    try:
        df = pd.read_csv(filepath)
        expected = ['word', 'word_hold', 'avg_flight1', 'avg_flight2',
                    'avg_flight3', 'avg_flight4', 'avg_word']
        if not all(c in df.columns for c in expected):
            return None

        for col in expected[1:]:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        df = df.dropna(subset=['word_hold', 'avg_word'])
        df = df[df['word_hold'] > 0]
        df = df[df['word_hold'] < 100000]

        df['word_length'] = df['word'].apply(lambda w: len(str(w)) if pd.notna(w) else 0)
        df = df[df['word_length'] > 0]

        return df
    except Exception as e:
        print(f"  Warning: failed to load {filepath}: {e}")
        return None


def extract_session_features(df):
    """
    Extract aggregated features from a session (one CSV file).
    Returns a feature dict with statistical summaries.
    """
    if df is None or len(df) < 5:
        return None

    features = {}
    numeric_cols = ['word_hold', 'avg_flight1', 'avg_flight2',
                    'avg_flight3', 'avg_flight4', 'avg_word', 'word_length']

    for col in numeric_cols:
        vals = df[col].values
        vals = vals[vals > 0]
        if len(vals) == 0:
            vals = np.array([0.0])

        features[f'{col}_mean'] = np.mean(vals)
        features[f'{col}_std'] = np.std(vals)
        features[f'{col}_median'] = np.median(vals)
        features[f'{col}_p25'] = np.percentile(vals, 25)
        features[f'{col}_p75'] = np.percentile(vals, 75)
        features[f'{col}_iqr'] = features[f'{col}_p75'] - features[f'{col}_p25']
        features[f'{col}_max'] = np.max(vals)
        features[f'{col}_min'] = np.min(vals)
        features[f'{col}_cv'] = np.std(vals) / np.mean(vals) if np.mean(vals) > 0 else 0

    # Derived features
    features['total_words'] = len(df)
    features['avg_hold_per_char'] = features['word_hold_mean'] / max(features['word_length_mean'], 1)
    features['flight_consistency'] = features['avg_flight1_std'] / max(features['avg_flight1_mean'], 1)
    features['speed_ratio'] = features['avg_word_mean'] / max(features['word_hold_mean'], 1)
    features['hold_flight_ratio'] = features['word_hold_mean'] / max(features['avg_flight1_mean'], 1)

    # Typing rhythm features
    holds = df['word_hold'].values
    if len(holds) > 2:
        features['hold_autocorr'] = np.corrcoef(holds[:-1], holds[1:])[0, 1] if np.std(holds) > 0 else 0
        features['hold_trend'] = np.polyfit(range(len(holds)), holds, 1)[0]
    else:
        features['hold_autocorr'] = 0
        features['hold_trend'] = 0

    # Speed estimate
    per_char_speeds = df['word_hold'].values / np.maximum(df['word_length'].values, 1)
    features['chars_per_sec'] = 1000.0 / np.mean(per_char_speeds) if np.mean(per_char_speeds) > 0 else 0
    features['estimated_wpm'] = features['chars_per_sec'] * 60 / 5

    return features


def load_all_sessions():
    """Load all sessions from the dataset, extract features, return DataFrame."""
    print("Loading keystroke dataset...")
    all_features = []
    user_labels = []
    session_files = []

    for folder, label in USER_DIRS.items():
        folder_path = os.path.join(DATASET_DIR, folder)
        if not os.path.exists(folder_path):
            print(f"  Warning: {folder_path} not found, skipping")
            continue

        csv_files = sorted(glob.glob(os.path.join(folder_path, '*.csv')))
        print(f"  {folder}: {len(csv_files)} files")

        for fpath in csv_files:
            df = load_csv_file(fpath)
            if df is not None and len(df) >= 5:
                feats = extract_session_features(df)
                if feats:
                    all_features.append(feats)
                    user_labels.append(label)
                    session_files.append(os.path.basename(fpath))

    features_df = pd.DataFrame(all_features)
    features_df['user_label'] = user_labels
    features_df['filename'] = session_files

    features_df = features_df.replace([np.inf, -np.inf], np.nan).fillna(0)

    print(f"  Total sessions loaded: {len(features_df)}")
    print(f"  Feature dimensions: {features_df.shape[1] - 2} features")
    return features_df


def get_feature_columns(df):
    """Get feature column names (exclude labels and metadata)."""
    exclude = ['user_label', 'filename', 'proficiency_label']
    return [c for c in df.columns if c not in exclude]


# ─────────────────────────────────────────────────────────────────────────────
# MODEL 1: Typing Proficiency (Gradient Boosting)
# ─────────────────────────────────────────────────────────────────────────────
def assign_proficiency_labels(df):
    """
    Assign proficiency labels based on ABSOLUTE WPM thresholds.

    Unlike the old percentile-based approach (which made 1/3 always Expert),
    this uses real-world typing speed benchmarks:

      Beginner:     estimated_wpm < 20
      Intermediate: 20 <= estimated_wpm < 35
      Expert:       estimated_wpm >= 35
    """
    wpm = df['estimated_wpm'].values

    labels = []
    for w in wpm:
        if w < WPM_BEGINNER_MAX:
            labels.append(0)  # Beginner
        elif w < WPM_INTERMEDIATE_MAX:
            labels.append(1)  # Intermediate
        else:
            labels.append(2)  # Expert

    return np.array(labels)


def train_proficiency_classifier(df, feature_cols):
    """Train Gradient Boosting to classify typing proficiency level."""
    print("\n=== Model 1: Typing Proficiency (Gradient Boosting) ===")

    df = df.copy()
    df['proficiency_label'] = assign_proficiency_labels(df)

    wpm_vals = df['estimated_wpm'].values
    print(f"  WPM range: {wpm_vals.min():.1f} - {wpm_vals.max():.1f}")
    print(f"  WPM mean: {wpm_vals.mean():.1f}, median: {np.median(wpm_vals):.1f}")

    X = df[feature_cols].values
    y = df['proficiency_label'].values

    label_names = ['Beginner', 'Intermediate', 'Expert']
    print(f"  Label distribution: {dict(zip(label_names, [int((y==i).sum()) for i in range(3)]))}")
    print(f"  Thresholds: Beginner < {WPM_BEGINNER_MAX}, Intermediate < {WPM_INTERMEDIATE_MAX}, Expert >= {WPM_INTERMEDIATE_MAX}")

    unique_classes = np.unique(y)
    if len(unique_classes) < 2:
        print(f"  WARNING: Only one class present ({label_names[unique_classes[0]]})")
        return None, None, {
            'train_acc': 0, 'test_acc': 0, 'cv_mean': 0, 'cv_std': 0,
            'labels': label_names,
            'label_distribution': {label_names[i]: int((y == i).sum()) for i in range(3)},
            'wpm_thresholds': {'beginner_max': WPM_BEGINNER_MAX, 'intermediate_max': WPM_INTERMEDIATE_MAX},
        }

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    min_class_count = min([(y == c).sum() for c in unique_classes])
    test_size = 0.2 if min_class_count >= 5 else 0.3

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=test_size, random_state=42, stratify=y
    )

    clf = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        min_samples_split=5,
        subsample=0.8,
        random_state=42
    )
    clf.fit(X_train, y_train)

    train_acc = accuracy_score(y_train, clf.predict(X_train))
    test_acc = accuracy_score(y_test, clf.predict(X_test))

    n_folds = min(5, min_class_count)
    if n_folds >= 2:
        cv_scores = cross_val_score(clf, X_scaled, y, cv=n_folds, scoring='accuracy')
    else:
        cv_scores = np.array([test_acc])

    print(f"  Train accuracy: {train_acc:.3f}")
    print(f"  Test accuracy:  {test_acc:.3f}")
    print(f"  CV accuracy:    {cv_scores.mean():.3f} +/- {cv_scores.std():.3f}")

    y_pred = clf.predict(X_test)
    present_labels = sorted(np.unique(np.concatenate([y_test, y_pred])))
    target_names = [label_names[i] for i in present_labels]
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, labels=present_labels, target_names=target_names, zero_division=0))

    return clf, scaler, {
        'train_acc': round(train_acc, 4),
        'test_acc': round(test_acc, 4),
        'cv_mean': round(cv_scores.mean(), 4),
        'cv_std': round(cv_scores.std(), 4),
        'labels': label_names,
        'label_distribution': {label_names[i]: int((y == i).sum()) for i in range(3)},
        'wpm_thresholds': {'beginner_max': WPM_BEGINNER_MAX, 'intermediate_max': WPM_INTERMEDIATE_MAX},
    }


# ─────────────────────────────────────────────────────────────────────────────
# MODEL 2: Speed Prediction (Random Forest Regressor)
# ─────────────────────────────────────────────────────────────────────────────
def train_speed_predictor(df, feature_cols):
    """
    Train Random Forest Regressor to predict typing speed (WPM).

    Removes estimated_wpm and chars_per_sec from input features to prevent
    data leakage. The model learns speed from raw keystroke timings.
    """
    print("\n=== Model 2: Speed Prediction (Random Forest Regressor) ===")

    pred_features = [c for c in feature_cols if c not in ['estimated_wpm', 'chars_per_sec']]

    X = df[pred_features].values
    y = df['estimated_wpm'].values
    y = np.clip(y, 0, 200)

    print(f"  Target WPM range: {y.min():.1f} - {y.max():.1f}")
    print(f"  Target WPM mean: {y.mean():.1f}, std: {y.std():.1f}")
    print(f"  Features used: {len(pred_features)}")

    scaler_X = StandardScaler()
    X_scaled = scaler_X.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    rfr = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1
    )
    rfr.fit(X_train, y_train)

    train_pred = rfr.predict(X_train)
    test_pred = rfr.predict(X_test)
    train_mae = mean_absolute_error(y_train, train_pred)
    test_mae = mean_absolute_error(y_test, test_pred)
    train_r2 = r2_score(y_train, train_pred)
    test_r2 = r2_score(y_test, test_pred)

    print(f"  Train MAE: {train_mae:.2f} WPM")
    print(f"  Test MAE:  {test_mae:.2f} WPM")
    print(f"  Train R2:  {train_r2:.3f}")
    print(f"  Test R2:   {test_r2:.3f}")

    importances = rfr.feature_importances_
    top_10 = np.argsort(importances)[-10:][::-1]
    print("  Top 10 features for speed prediction:")
    for idx in top_10:
        print(f"    {pred_features[idx]}: {importances[idx]:.4f}")

    return rfr, scaler_X, pred_features, {
        'train_mae': round(train_mae, 2),
        'test_mae': round(test_mae, 2),
        'train_r2': round(train_r2, 4),
        'test_r2': round(test_r2, 4),
        'wpm_range': [round(float(y.min()), 1), round(float(y.max()), 1)],
        'wpm_mean': round(float(y.mean()), 1),
    }


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  CODEC Keystroke ML Training Pipeline")
    print("=" * 60 + "\n")

    os.makedirs(MODEL_DIR, exist_ok=True)

    df = load_all_sessions()
    if len(df) < 10:
        print("ERROR: Not enough data to train models. Need at least 10 sessions.")
        sys.exit(1)

    feature_cols = get_feature_columns(df)
    print(f"\nFeature columns ({len(feature_cols)}): {feature_cols[:10]}...")

    # Model 1: Typing Proficiency
    m1_clf, m1_scaler, m1_metrics = train_proficiency_classifier(df, feature_cols)
    if m1_clf is not None:
        joblib.dump(m1_clf, os.path.join(MODEL_DIR, 'proficiency_gb.joblib'))
        joblib.dump(m1_scaler, os.path.join(MODEL_DIR, 'proficiency_scaler.joblib'))

    # Model 2: Speed Prediction
    m2_rfr, m2_scaler, m2_features, m2_metrics = train_speed_predictor(df, feature_cols)
    joblib.dump(m2_rfr, os.path.join(MODEL_DIR, 'speed_rfr.joblib'))
    joblib.dump(m2_scaler, os.path.join(MODEL_DIR, 'speed_scaler.joblib'))

    # Save metadata
    metadata = {
        'feature_columns': feature_cols,
        'speed_feature_columns': m2_features,
        'proficiency_labels': ['Beginner', 'Intermediate', 'Expert'],
        'wpm_thresholds': {
            'beginner_max': WPM_BEGINNER_MAX,
            'intermediate_max': WPM_INTERMEDIATE_MAX,
        },
        'models': {
            'proficiency': {
                'file': 'proficiency_gb.joblib',
                'scaler': 'proficiency_scaler.joblib',
                'type': 'GradientBoostingClassifier',
                'metrics': m1_metrics,
            },
            'speed_prediction': {
                'file': 'speed_rfr.joblib',
                'scaler': 'speed_scaler.joblib',
                'type': 'RandomForestRegressor',
                'metrics': m2_metrics,
            },
        },
        'dataset_info': {
            'total_sessions': len(df),
            'users': list(USER_DIRS.keys()),
            'files_per_user': 75,
        },
    }

    with open(os.path.join(MODEL_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print("\n" + "=" * 60)
    print("  Training Complete!")
    print("=" * 60)
    print(f"\nModels saved to: {MODEL_DIR}/")
    print("  - proficiency_gb.joblib   (Typing Proficiency)")
    print("  - speed_rfr.joblib        (Speed Prediction)")
    print("  - metadata.json           (Feature names + metrics)")


if __name__ == '__main__':
    main()
