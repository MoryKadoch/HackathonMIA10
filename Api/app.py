from flask import Flask, jsonify
import pyodbc

import numpy as np
import pandas as pd
import optuna
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt

from sklearn.cluster import KMeans
import seaborn as sns
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.mixture import GaussianMixture
from sklearn.cluster import DBSCAN

from sklearn.svm import SVR
from sklearn.pipeline import make_pipeline
from sklearn.neural_network import MLPRegressor
import joblib
import json

app = Flask(__name__)

conn_str = 'Driver={ODBC Driver 18 for SQL Server};Server=tcp:mia10.database.windows.net,1433;Database=mia10_db;Uid=user_reader;Pwd=7R&o&o4#~756^z;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
conn = pyodbc.connect(conn_str)

@app.route('/')
def hello():
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM your_table')
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            'column1': row.column1,
            'column2': row.column2,
        })

    return jsonify(result)

@app.route('/predict')
def predict():
    query = '''
    SELECT m.slug_game, m.event_title, m.medal_type, c.country_name, e.game_year
    FROM medals m
    JOIN events e ON LOWER(REPLACE(m.slug_game, '-', ' ')) = LOWER(e.game_name)
    JOIN country c ON m.athlete_country_id = c.country_id
    WHERE e.game_season = 'Summer'
    '''

    df = pd.read_sql(query, conn, index_col=None)

    countries_rio_2016 = df[df['slug_game'] == 'rio-2016']['country_name'].unique()
    df_filtered = df[df['country_name'].isin(countries_rio_2016)]

    grouped = df_filtered.groupby(['country_name', 'slug_game', 'medal_type']).size().unstack(fill_value=0)
    grouped.columns = [f'{col}_count' for col in grouped.columns]
    grouped.reset_index(inplace=True)

    encoder = OneHotEncoder(sparse_output=False)
    country_encoded = encoder.fit_transform(grouped[['country_name']])
    country_encoded_df = pd.DataFrame(country_encoded, columns=encoder.get_feature_names_out(['country_name']))

    grouped = pd.concat([grouped, country_encoded_df], axis=1)

    grouped['total_medals'] = grouped['BRONZE_count'] + grouped['GOLD_count'] + grouped['SILVER_count']
    grouped['gold_silver_diff'] = grouped['GOLD_count'] - grouped['SILVER_count']
    grouped['gold_bronze_diff'] = grouped['GOLD_count'] - grouped['BRONZE_count']

    def create_sequences(data, time_steps=3):
        Xs, ys = [], []
        for i in range(len(data) - time_steps):
            Xs.append(data.iloc[i:(i + time_steps), 2:].values)
            ys.append(data.iloc[i + time_steps, [3, 4, 2]].values)  # assuming [3, 4, 2] are the target columns
        return np.array(Xs, dtype=np.float32), np.array(ys, dtype=np.float32)

    time_steps = 3
    X_seq, y_seq = create_sequences(grouped, time_steps)

    # Chargement des modèles
    rf_model = joblib.load('models/randomForest_model.pkl')
    svr_gold_model = joblib.load('models/svr_gold_model.pkl')
    svr_silver_model = joblib.load('models/svr_silver_model.pkl')
    svr_bronze_model = joblib.load('models/svr_bronze_model.pkl')
    mlp_model = joblib.load('models/mlp_model.pkl')

    # Standardiser les données
    scaler = StandardScaler()
    X_seq_shape = X_seq.shape
    X_seq = scaler.fit_transform(X_seq.reshape(-1, X_seq.shape[-1])).reshape(X_seq_shape)
    X_seq = X_seq.reshape(X_seq.shape[0], -1)

    # Prédictions avec Random Forest
    predictions_df = predict_all_countries_next_edition(rf_model, scaler, grouped, encoder)
    total_predicted_medals = predictions_df[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum().sum()
    medal_target = 987
    normalization_factor = medal_target / total_predicted_medals
    predictions_df[['GOLD_count', 'SILVER_count', 'BRONZE_count']] *= normalization_factor
    predictions_df[['GOLD_count', 'SILVER_count', 'BRONZE_count']] = predictions_df[['GOLD_count', 'SILVER_count', 'BRONZE_count']].round().astype(int)
    predictions_df['total_medals'] = predictions_df[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum(axis=1)
    predictions_rf = predictions_df.sort_values(by=['total_medals', 'GOLD_count'], ascending=False)

    # Prédictions avec SVR
    svm_models = {'gold': svr_gold_model, 'silver': svr_silver_model, 'bronze': svr_bronze_model}
    predictions_df_svr = predict_all_countries_next_edition_svr(svm_models, scaler, grouped, encoder)

    total_predicted_medals_svr = predictions_df_svr[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum().sum()
    normalization_factor_svr = medal_target / total_predicted_medals_svr
    predictions_df_svr[['GOLD_count', 'SILVER_count', 'BRONZE_count']] *= normalization_factor_svr
    predictions_df_svr[['GOLD_count', 'SILVER_count', 'BRONZE_count']] = predictions_df_svr[['GOLD_count', 'SILVER_count', 'BRONZE_count']].round().astype(int)
    predictions_df_svr['total_medals'] = predictions_df_svr[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum(axis=1)
    predictions_svr = predictions_df_svr.sort_values(by=['total_medals', 'GOLD_count'], ascending=False)

    # Prédictions avec MLP
    predictions_df_mlp = predict_all_countries_next_edition(mlp_model, scaler, grouped, encoder)
    total_predicted_medals_mlp = predictions_df_mlp[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum().sum()
    normalization_factor_mlp = medal_target / total_predicted_medals_mlp
    predictions_df_mlp[['GOLD_count', 'SILVER_count', 'BRONZE_count']] *= normalization_factor_mlp
    predictions_df_mlp[['GOLD_count', 'SILVER_count', 'BRONZE_count']] = predictions_df_mlp[['GOLD_count', 'SILVER_count', 'BRONZE_count']].round().astype(int)
    predictions_df_mlp['total_medals'] = predictions_df_mlp[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum(axis=1)
    predictions_mlp = predictions_df_mlp.sort_values(by=['total_medals', 'GOLD_count'], ascending=False)

    # Calcul des prédictions de médailles
    models_ensemble = {
        'rf': rf_model,
        'svr_gold': svr_gold_model,
        'svr_silver': svr_silver_model,
        'svr_bronze': svr_bronze_model,
        'mlp': mlp_model
    }

    predictions_df_ensemble = predict_all_countries_next_edition_ensemble(models_ensemble, scaler, grouped, encoder)

    total_predicted_medals_ensemble = predictions_df_ensemble[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum().sum()
    normalization_factor_ensemble = medal_target / total_predicted_medals_ensemble
    predictions_df_ensemble[['GOLD_count', 'SILVER_count', 'BRONZE_count']] *= normalization_factor_ensemble
    predictions_df_ensemble[['GOLD_count', 'SILVER_count', 'BRONZE_count']] = predictions_df_ensemble[['GOLD_count', 'SILVER_count', 'BRONZE_count']].round().astype(int)
    predictions_df_ensemble['total_medals'] = predictions_df_ensemble[['GOLD_count', 'SILVER_count', 'BRONZE_count']].sum(axis=1)
    predictions_ensemble = predictions_df_ensemble.sort_values(by=['total_medals', 'GOLD_count'], ascending=False)

    data_forest = {
        'labels': predictions_rf["country_name"].tolist(),
        'datasets': [
            {
                'label': 'GOLD',
                'data': predictions_rf["GOLD_count"].tolist(),
                'backgroundColor': 'gold',
                'stack': 'Stack 0'
            },
            {
                'label': 'SILVER',
                'data': predictions_rf["SILVER_count"].tolist(),
                'backgroundColor': 'silver',
                'stack': 'Stack 1'
            },
            {
                'label': 'BRONZE',
                'data': predictions_rf["BRONZE_count"].tolist(),
                'backgroundColor': '#CD7F32',
                'stack': 'Stack 2'
            }
        ]
    }

    data_mlp = {
        'labels': predictions_mlp['country_name'].unique().tolist(),
        'datasets': [
            {
                'label': 'GOLD',
                'data': predictions_mlp["GOLD_count"].tolist(),
                'backgroundColor': 'gold',
                'stack': 'Stack 0'
            },
            {
                'label': 'SILVER',
                'data': predictions_mlp["SILVER_count"].tolist(),
                'backgroundColor': 'silver',
                'stack': 'Stack 1'
            },
            {
                'label': 'BRONZE',
                'data': predictions_mlp["BRONZE_count"].tolist(),
                'backgroundColor': '#CD7F32',
                'stack': 'Stack 2'
            }
        ]
    }

    data_svr = {
        'labels': predictions_svr['country_name'].unique().tolist(),
        'datasets': [
            {
                'label': 'GOLD',
                'data': predictions_svr["GOLD_count"].tolist(),
                'backgroundColor': 'gold',
                'stack': 'Stack 0'
            },
            {
                'label': 'SILVER',
                'data': predictions_svr["SILVER_count"].tolist(),
                'backgroundColor': 'silver',
                'stack': 'Stack 1'
            },
            {
                'label': 'BRONZE',
                'data': predictions_svr["BRONZE_count"].tolist(),
                'backgroundColor': '#CD7F32',
                'stack': 'Stack 2'
            }
        ]
    }

    data_ensemble = {
        'labels': predictions_ensemble['country_name'].unique().tolist(),
        'datasets': [
            {
                'label': 'GOLD',
                'data': predictions_ensemble["GOLD_count"].tolist(),
                'backgroundColor': 'gold',
                'stack': 'Stack 0'
            },
            {
                'label': 'SILVER',
                'data': predictions_ensemble["SILVER_count"].tolist(),
                'backgroundColor': 'silver',
                'stack': 'Stack 1'
            },
            {
                'label': 'BRONZE',
                'data': predictions_ensemble["BRONZE_count"].tolist(),
                'backgroundColor': '#CD7F32',
                'stack': 'Stack 2'
            }
        ]
    }

    data_json = {
        'data_rf': data_forest,
        'data_mlp': data_mlp,
        'data_svr': data_svr,
        'data_ensemble': data_ensemble
    }

    json_output = json.dumps(data_json)

    return json_output

@app.route('/clustering')
def clustering():
    queries = {
        'athletes': ('SELECT name, country_id, athlete_id FROM athletes', ['name', 'country_id', 'athlete_id']),
        'country': ('SELECT country_name, country_code, country_id FROM country', ['country_name', 'country_code', 'country_id']),
        'events': ('SELECT game_name, game_season, game_year, start_date_str, end_date_str, country_id FROM events', ['game_name', 'game_season', 'game_year', 'start_date_str', 'end_date_str', 'country_id']),
        'medals': ('SELECT discipline_title, slug_game, event_title, event_gender, medal_type, participant_type, athlete_country_id, athlete_id FROM medals', ['discipline_title', 'slug_game', 'event_title', 'event_gender', 'medal_type', 'participant_type', 'athlete_country_id', 'athlete_id']),
    }

    df_athletes = fetch_data(conn, *queries['athletes'])
    df_country = fetch_data(conn, *queries['country'])
    df_hosts = fetch_data(conn, *queries['events'])
    df_medals = fetch_data(conn, *queries['medals'])

    medals = df_medals.merge(df_country, left_on='athlete_country_id', right_on='country_id', how='left')
    performance_df = medals[['country_name', 'medal_type']].copy()
    medals_count = performance_df.pivot_table(index='country_name', columns='medal_type', aggfunc='size', fill_value=0)
    medals_count.columns = ['Bronze', 'Gold', 'Silver']
    medals_count['Total'] = medals_count.sum(axis=1)

    df = df_w_outlier = medals.merge(df_athletes, left_on='athlete_id', right_on='athlete_id', how='left')

    scaler = StandardScaler()
    medals_scaled = scaler.fit_transform(medals_count)

    kmeans = KMeans(n_clusters=3, random_state=0, n_init=10)
    medals_count['Cluster'] = kmeans.fit_predict(medals_scaled)

    # Outliers
    medal_counts = df_w_outlier.groupby('country_name').agg(
        total_medals=pd.NamedAgg(column='medal_type', aggfunc='count'),
        gold_medals=pd.NamedAgg(column='medal_type', aggfunc=lambda x: (x == 'GOLD').sum())
    ).reset_index()

    scaler = StandardScaler()
    medal_counts_scaled = scaler.fit_transform(medal_counts[['total_medals', 'gold_medals']])

    kmeans = KMeans(n_clusters=3, random_state=0, n_init=10)
    medal_counts['Cluster'] = kmeans.fit_predict(medal_counts_scaled)

    outlier_threshold = 2.5 
    outliers = medal_counts[medal_counts['total_medals'] > outlier_threshold * medal_counts['total_medals'].std()]

    medal_counts_no_outliers = medal_counts[~medal_counts['country_name'].isin(outliers['country_name'])]
    medal_counts_no_outliers_scaled = scaler.fit_transform(medal_counts_no_outliers[['total_medals', 'gold_medals']])

    kmeans_no_outliers = KMeans(n_clusters=3, random_state=0, n_init=10)
    medal_counts_no_outliers['Cluster'] = kmeans_no_outliers.fit_predict(medal_counts_no_outliers_scaled)

    # Summer & Winter
    df_medals['slug_game'] = df_medals['slug_game'].str.replace('-', ' ').str.title()
    df_combined = pd.merge(df_medals, df_hosts, left_on='slug_game', right_on='game_name')
    df_combined = df_combined.merge(df_country, on='country_id')

    summer_olympics = df_combined[df_combined['game_season'] == 'Summer']
    summer_clusters = perform_clustering(summer_olympics)

    winter_olympics = df_combined[df_combined['game_season'] == 'Winter']
    winter_clusters = perform_clustering(winter_olympics)
    

    # GMM
    medal_counts_gmm = df.groupby('country_name').agg(
        total_medals=pd.NamedAgg(column='medal_type', aggfunc='count'),
        gold_medals=pd.NamedAgg(column='medal_type', aggfunc=lambda x: (x == 'GOLD').sum()),
        silver_medals=pd.NamedAgg(column='medal_type', aggfunc=lambda x: (x == 'SILVER').sum()),
        bronze_medals=pd.NamedAgg(column='medal_type', aggfunc=lambda x: (x == 'BRONZE').sum())
    ).reset_index()

    X = medal_counts_gmm[['total_medals', 'gold_medals', 'silver_medals', 'bronze_medals']]
    gmm = GaussianMixture(n_components=3, random_state=42)
    medal_counts_gmm['Cluster'] = gmm.fit_predict(X)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    dbscan = DBSCAN(eps=0.5, min_samples=5)
    medal_counts_dbscan = medal_counts_gmm.copy()
    medal_counts_dbscan['Cluster'] = dbscan.fit_predict(X_scaled)

    cluster_colors = {
        -2: 'rgb(255, 206, 86)',
        -1: 'rgb(153, 102, 255)',
        0: 'rgb(255, 99, 132)',
        1: 'rgb(128, 0, 128)',
        2: 'rgb(75, 192, 192)'
    }

    scatter_data = {
        'kmeans': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['Total']), 'y': int(row['Gold']), 'country': index}
                        for index, row in medals_count[medals_count['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in medals_count['Cluster'].unique()
            ]
        },
        'kmeans_outliers': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['total_medals']), 'y': int(row['gold_medals']), 'country': index}
                        for index, row in medal_counts_no_outliers[medal_counts_no_outliers['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in medal_counts_no_outliers['Cluster'].unique()
            ]
        },
        'kmeans_summer': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['total_medals']), 'y': int(row['gold_medals']), 'country': index}
                        for index, row in summer_clusters[summer_clusters['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in summer_clusters['Cluster'].unique()
            ]
        },
        'kmeans_winter': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['total_medals']), 'y': int(row['gold_medals']), 'country': index}
                        for index, row in winter_clusters[winter_clusters['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in winter_clusters['Cluster'].unique()
            ]
        },
        'gmm': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['total_medals']), 'y': int(row['gold_medals']), 'country': index}
                        for index, row in medal_counts_gmm[medal_counts_gmm['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in medal_counts_gmm['Cluster'].unique()
            ]
        },
        'dbscan': {
            'datasets': [
                {
                    'label': f'Cluster {cluster}',
                    'data': [
                        {'x': int(row['total_medals']), 'y': int(row['gold_medals']), 'country': index}
                        for index, row in medal_counts_dbscan[medal_counts_dbscan['Cluster'] == cluster].iterrows()
                    ],
                    'backgroundColor': cluster_colors[cluster]
                }
                for cluster in medal_counts_dbscan['Cluster'].unique()
            ]
        }
    }

    scatter_json = json.dumps(scatter_data)

    return scatter_json

def predict_medals_next_edition(country, model, scaler, data, encoder, time_steps=3):
    # encodage du pays
    country_encoded = encoder.transform([[country]])
    country_encoded_df = pd.DataFrame(country_encoded, columns=encoder.get_feature_names_out(['country_name']))
    
    # Sélectionner les données du pays
    country_data = data[data['country_name'] == country].sort_values(by='slug_game').iloc[-time_steps:, 2:]
    country_data = pd.concat([country_data.reset_index(drop=True), country_encoded_df], axis=1)
    
    if country_data.shape[0] < time_steps:
        raise ValueError(f"Not enough data for {country} to create a prediction with {time_steps} time steps.")
    
    # Standardiser les données
    expected_features = scaler.n_features_in_
    current_features = country_data.shape[1]
    
    if current_features < expected_features:
        # ajout des 0 si nécessaire
        missing_features = expected_features - current_features
        country_data = np.hstack([country_data.values, np.zeros((country_data.shape[0], missing_features))])
    elif current_features > expected_features:
        # sup des colonnes si nécessaire
        country_data = country_data.iloc[:, :expected_features]

    country_data = scaler.transform(country_data)
    
    # aplatir les données
    country_data = country_data.reshape(1, -1)
    
    predicted_medals = model.predict(country_data)
    return pd.DataFrame(predicted_medals, columns=['GOLD_count', 'SILVER_count', 'BRONZE_count'])

def predict_all_countries_next_edition(model, scaler, data, encoder, time_steps=3):
    unique_countries = data['country_name'].unique()
    predictions = []

    for country in unique_countries:
        try:
            predicted_medals = predict_medals_next_edition(country, model, scaler, data, encoder, time_steps)
            predicted_medals['country_name'] = country
            predictions.append(predicted_medals)
        except ValueError as e:
            print(f"Skipping country {country}: {e}")

    predictions_df = pd.concat(predictions).reset_index(drop=True)
    return predictions_df

def predict_medals_next_edition_svr(country, models, scaler, data, encoder, time_steps=3):
    country_encoded = encoder.transform([[country]])
    country_encoded_df = pd.DataFrame(country_encoded, columns=encoder.get_feature_names_out(['country_name']))
    
    country_data = data[data['country_name'] == country].sort_values(by='slug_game').iloc[-time_steps:, 2:]
    country_data = pd.concat([country_data.reset_index(drop=True), country_encoded_df], axis=1)
    
    if country_data.shape[0] < time_steps:
        raise ValueError(f"Not enough data for {country} to create a prediction with {time_steps} time steps.")
    
    expected_features = scaler.n_features_in_
    current_features = country_data.shape[1]
    
    if current_features < expected_features:
        missing_features = expected_features - current_features
        country_data = np.hstack([country_data.values, np.zeros((country_data.shape[0], missing_features))])
    elif current_features > expected_features:
        country_data = country_data.iloc[:, :expected_features]

    country_data = scaler.transform(country_data)
    country_data = country_data.reshape(1, -1)
    
    predicted_gold = models['gold'].predict(country_data)
    predicted_silver = models['silver'].predict(country_data)
    predicted_bronze = models['bronze'].predict(country_data)
    
    predicted_medals = np.stack([predicted_gold, predicted_silver, predicted_bronze], axis=1)
    return pd.DataFrame(predicted_medals, columns=['GOLD_count', 'SILVER_count', 'BRONZE_count'])

def predict_all_countries_next_edition_svr(models, scaler, data, encoder, time_steps=3):
    unique_countries = data['country_name'].unique()
    predictions = []

    for country in unique_countries:
        try:
            predicted_medals = predict_medals_next_edition_svr(country, models, scaler, data, encoder, time_steps)
            predicted_medals['country_name'] = country
            predictions.append(predicted_medals)
        except ValueError as e:
            print(f"Skipping country {country}: {e}")

    predictions_df = pd.concat(predictions).reset_index(drop=True)
    return predictions_df

def predict_medals_next_edition_ensemble(country, models, scaler, data, encoder, time_steps=3):
    weights = {'rf': 0.5, 'svr': 0.25, 'mlp': 0.25}
    country_encoded = encoder.transform([[country]])
    country_encoded_df = pd.DataFrame(country_encoded, columns=encoder.get_feature_names_out(['country_name']))

    country_data = data[data['country_name'] == country].sort_values(by='slug_game').iloc[-time_steps:, 2:]
    country_data = pd.concat([country_data.reset_index(drop=True), country_encoded_df], axis=1)

    if country_data.shape[0] < time_steps:
        raise ValueError(f"Not enough data for {country} to create a prediction with {time_steps} time steps.")

    expected_features = scaler.n_features_in_
    current_features = country_data.shape[1]

    if current_features < expected_features:
        missing_features = expected_features - current_features
        country_data = np.hstack([country_data.values, np.zeros((country_data.shape[0], missing_features))])
    elif current_features > expected_features:
        country_data = country_data.iloc[:, :expected_features]

    country_data = scaler.transform(country_data)
    country_data = country_data.reshape(1, -1)

    predicted_rf = models['rf'].predict(country_data)
    predicted_svr_gold = models['svr_gold'].predict(country_data)
    predicted_svr_silver = models['svr_silver'].predict(country_data)
    predicted_svr_bronze = models['svr_bronze'].predict(country_data)
    predicted_svr = np.stack([predicted_svr_gold, predicted_svr_silver, predicted_svr_bronze], axis=1)
    predicted_mlp = models['mlp'].predict(country_data)

    predicted_ensemble = (weights['rf'] * predicted_rf + weights['svr'] * predicted_svr + weights['mlp'] * predicted_mlp)

    return pd.DataFrame(predicted_ensemble, columns=['GOLD_count', 'SILVER_count', 'BRONZE_count'])

def predict_all_countries_next_edition_ensemble(models, scaler, data, encoder, time_steps=3):
    unique_countries = data['country_name'].unique()
    predictions = []

    for country in unique_countries:
        try:
            predicted_medals = predict_medals_next_edition_ensemble(country, models, scaler, data, encoder, time_steps)
            predicted_medals['country_name'] = country
            predictions.append(predicted_medals)
        except ValueError as e:
            print(f"Skipping country {country}: {e}")

    predictions_df = pd.concat(predictions).reset_index(drop=True)
    return predictions_df

def fetch_data(conn, query, column_names):
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    df = pd.DataFrame.from_records(rows, columns=column_names)
    cursor.close()
    return df

def perform_clustering(data):
    medal_counts = data.groupby('country_name').agg(
        total_medals=pd.NamedAgg(column='medal_type', aggfunc='count'),
        gold_medals=pd.NamedAgg(column='medal_type', aggfunc=lambda x: (x == 'GOLD').sum())
    ).reset_index()

    scaler = StandardScaler()
    medal_counts_scaled = scaler.fit_transform(medal_counts[['total_medals', 'gold_medals']])

    kmeans = KMeans(n_clusters=3, random_state=0, n_init=10)
    medal_counts['Cluster'] = kmeans.fit_predict(medal_counts_scaled)

    return medal_counts

if __name__ == '__main__':
    app.run()