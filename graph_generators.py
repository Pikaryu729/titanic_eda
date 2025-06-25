import matplotlib.pyplot as plt
from data import get_class_data
import pandas as pd
from typing import Literal


class Grapher():

    def __init__(self, data_path: str = "data/data.csv"):
        self.data = pd.read_csv(data_path)

    def survival_by_sex_chart(self, sex: Literal["male", "female"]):
        if sex not in ["male", "female"]:
            return
        
        fig, ax = plt.subplots()
        passengers = self.data[self.data["Sex"] == sex]
        percent_survived = round(passengers["Survived"].mean().item(), 4)
        ax.pie([percent_survived, 1 - percent_survived], labels=["Survived", "Died"])
        ax.set_title(f"{sex.capitalize()} passenger survival rates")

        return fig, ax

    def survival_by_class_chart(self, p_class: Literal[1, 2, 3]):
        if p_class not in [1, 2, 3]:
            return

        fig, ax = plt.subplots()
        passengers = self.data[self.data["Pclass"] == p_class]

        percent_survived = round(passengers["Survived"].mean().item(), 4)
        ax.pie([percent_survived, 1 - percent_survived], labels=["Survived", "Died"])
        match p_class:
            case 1:
                ax.set_title("First class passenger survival rates")
            case 2:
                ax.set_title("Second class passenger survival rates")
            case 3:
                ax.set_title("Third class passenger survival rates")

        return fig, ax
    