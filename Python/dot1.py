import pandas as pd
from sklearn.cluster import KMeans
import os

#refine dd.csv to have clusters, which will save a lot of computation power of the browser
#We go from ~500k points to ~5k, which is way more reasonable
folder_path = "../datasets/map_data"
csv_files = os.listdir(folder_path)
first_iteration = True
for csv in csv_files:
    file_path = os.path.join(folder_path, csv)
    df = pd.read_csv(file_path)
    coordinates = df[['latitude_coordinate', 'longitude_coordinate']]
    kmeans = KMeans(n_clusters=100)
    df['cluster'] = kmeans.fit_predict(coordinates)
    cluster_centers = pd.DataFrame(kmeans.cluster_centers_, columns=['latitude', 'longitude'])
    cluster_sizes = df['cluster'].value_counts().reset_index()
    cluster_sizes.columns = ['cluster', 'size']
    result = pd.concat([cluster_centers, cluster_sizes], axis=1)
    print(csv+" ok")
    if first_iteration:
        result.to_csv("../datasets/dd1.csv", mode='w', index=False)
        first_iteration = False
    else:
        result.to_csv("../datasets/dd1.csv", mode='a', index=False, header=False)

