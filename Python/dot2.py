import pandas as pd
from sklearn.cluster import KMeans
import os

folder_path = "../datasets/map_data"
csv_files = os.listdir(folder_path)
result_df = pd.DataFrame(columns=['tree_type', 'latitude', 'longitude', 'size'])

for csv in csv_files:
    file_path = os.path.join(folder_path, csv)
    df = pd.read_csv(file_path)
    tree_types = df['common_name'].unique()

    for tree_type in tree_types:
        tree_df = df[df['common_name'] == tree_type][['latitude_coordinate', 'longitude_coordinate']]

        if not tree_df.empty:
            if len(tree_df.index) > 10:
                kmeans = KMeans(n_clusters=10)
                tree_df['cluster'] = kmeans.fit_predict(tree_df)

                cluster_centers = tree_df.groupby('cluster').agg(
                    {'latitude_coordinate': 'mean', 'longitude_coordinate': 'mean'})
                cluster_sizes = tree_df['cluster'].value_counts().reset_index()
                cluster_sizes.columns = ['cluster', 'size']

                result_df = pd.concat(
                    [result_df, pd.DataFrame({'tree_type': tree_type, 'latitude': cluster_centers['latitude_coordinate'],
                                      'longitude': cluster_centers['longitude_coordinate'],
                                      'size': cluster_sizes['size']})])
            else:
                result_df = pd.concat([result_df, tree_df.rename(columns={'latitude_coordinate': 'latitude', 'longitude_coordinate': 'longitude'})])

result_df.to_csv("../datasets/dd2.csv", mode='w', index=False)