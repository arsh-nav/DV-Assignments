import pandas as pd
from sklearn.cluster import KMeans
import os

#go back to scratch to have the state, along with the number of tree and size (and trees without coordinates)

df = pd.read_csv("../../combined_file.csv")
df = df[df["common_name"] != "ok to plant vacant"]

result = df.groupby('state')['state'].count().reset_index(name='tree_abundance')

result.rename(columns={'state': 'NAME'}, inplace=True)

result.to_csv('../datasets/dd3.csv', index=False)