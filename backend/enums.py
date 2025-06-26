from enum import Enum

class SexEnum(str, Enum):
    male = "male"
    female = "female"

class PClassEnum(str, Enum):
    first = 1
    second = 2
    third = 3