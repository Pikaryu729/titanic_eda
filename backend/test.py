from data import get_filtered_survivors
import pandas as pd

data = pd.read_csv("data/data.csv")

print(get_filtered_survivors(data, filters={"Sex": "male"}))
