import pandas as pd
from enums import SexEnum

titanic_data = pd.read_csv("data/data.csv")


passengers_count = len(titanic_data)

# sex data
def get_sex_data(titanic_data: pd.DataFrame) -> dict:
    counts = titanic_data["Sex"].value_counts()
    percent = titanic_data["Sex"].value_counts(normalize=True)

    return {
        "male_count": counts.get("male", 0),
        "female_count": counts.get("female", 0),
        "percent_male": percent.get("male", 0.0),
        "percent_female": percent.get("female", 0.0),
    }


#survived data
def get_survival_data(titanic_data: pd.DataFrame) -> dict:

    counts = titanic_data["Survived"].value_counts()
    percents = titanic_data["Survived"].value_counts(normalize=True)

    return {
        "survived_count": counts.get(1, 0),
        "died_count": counts.get(0, 0),
        "percent_survived": percents.get(1, 0.0),
        "percent_died": percents.get(0, 0.0),
    }


# passenger class data
def get_class_data(titanic_data: pd.DataFrame):
    counts = titanic_data["Pclass"].value_counts()
    percents = titanic_data["Pclass"].value_counts(normalize=True)

    return {
        # first class is index 0, 2nd index 1, etc..
        "first_class_count": counts.get(1, 0),
        "second_class_count": counts.get(2, 0),
        "third_class_count": counts.get(3, 0),
        "percent_first_class": percents.get(1, 0.0),
        "percent_second_class": percents.get(2, 0.0),
        "percent_third_class": percents.get(3, 0.0),
    }

def get_survived_by_sex_data(titanic_data: pd.DataFrame, sex: SexEnum) -> dict:
    passengers_by_gender = titanic_data[titanic_data["Sex"] == sex]
    return passengers_by_gender["Survived"].mean()

def get_filtered_survivors(titanic_data: pd.DataFrame, filters: dict):
    filtered_data = titanic_data.copy()
    for key, value in filters.items():
        filtered_data = filtered_data[filtered_data[key] == value]
    
    if filtered_data.empty:
        return {
            "total_passengers": 0,
            "survivors": 0,
            "survival_rate": 0.0,
            "filters_applied": filters
        }
    
    total_passengers = len(filtered_data)
    survivors = filtered_data[filtered_data["Survived"] == 1]
    survivor_count = len(survivors)
    survival_rate = round((survivor_count / total_passengers) * 100, 2) if total_passengers > 0 else 0.0
    
    return {
        "total_passengers": total_passengers,
        "survivor_count": survivor_count,
        "survival_rate": survival_rate,
        "filters_applied": filters
    }
    
