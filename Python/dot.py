import pandas as pd
import os

# Create a csv with all the relevant data for each state to not be too heavy to be used

# Finding the nationnal top 10 trees with coordinates
df = pd.read_csv("../../combined_file.csv")
df = df[["common_name", "latitude_coordinate", "longitude_coordinate"]]
df = df[df["common_name"] != "ok to plant vacant"]
df = df.dropna(subset=['latitude_coordinate', 'longitude_coordinate'])
top10_df = df.groupby(["common_name"])["common_name"].count().sort_values(ascending=False).head(10)
top10 = top10_df.index.to_list()

# We use the states files to have less used space when clustering... We then consider that two state can't have a common cluster

folder_path = "../../archive"
all_files = os.listdir(folder_path)

# Filter out non-CSV files
csv_files = [f for f in all_files if f.endswith('.csv')]

for csv in csv_files:
    file_path = os.path.join(folder_path, csv)
    try:
        # Try reading the file using default UTF-8 encoding
        df = pd.read_csv(file_path)
        df = df[["common_name", "latitude_coordinate", "longitude_coordinate"]]
        df = df[df["common_name"] != "ok to plant vacant"]
        df = df.dropna(subset=['latitude_coordinate', 'longitude_coordinate'])
        df.loc[~df['common_name'].isin(top10), 'common_name'] = ""
        if len(df.index) > 0:
            df.to_csv("../datasets/map_data/" + csv, index=False)


    except UnicodeDecodeError:
        try:
            # If UTF-8 fails, try reading the file using UTF-16 encoding with tab separator
            df = pd.read_csv(file_path, sep='\t', encoding='utf-16')
            df = df[["common_name", "latitude_coordinate", "longitude_coordinate"]]
            df = df[df["common_name"] != "ok to plant vacant"]
            df = df.dropna(subset=['latitude_coordinate', 'longitude_coordinate'])
            df.loc[~df['common_name'].isin(top10), 'common_name'] = ""
            df.to_csv("../datasets/map_data/" + csv, index=False)
            if len(df.index) > 0:
                df.to_csv("../datasets/map_data/" + csv, index=False)

        except Exception as e:
            print(f"Could not read file {csv} because of error: {e}")
    except Exception as e:
        print(f"Could not read file {csv} because of error: {e}")
