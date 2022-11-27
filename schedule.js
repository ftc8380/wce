const schedules = {
    "default": {
        "Period 1": "08:45 - 09:42",
        "Period 2": "09:48 - 10:45",
        "Period 3": "10:51 - 11:51",
        "Lunch": "11:57 - 12:27",
        "Period 4": "12:33 - 13:30",
        "Period 5": "13:36 - 14:33",
        "Period 6": "14:39 - 15:36",
        "Period 7": "15:42 - 16:39"
    },

    "modified": {
        "Period 1": "08:45 - 09:20",
        "Period 2": "09:26 - 10:01",
        "Period 3": "10:07 - 10:42",
        "Period 4": "10:48 - 11:23",
        "Lunch": "11:29 - 11:59",
        "Period 5": "12:05 - 12:40",
        "Period 6": "12:46 - 13:21",
        "Period 7": "13:27 - 14:02",
    },

    "finals": {
        "Period 1, 3, or 5": "08:45 - 10:45",
        "Lunch": "10:50 - 11:15",
        "Period 2, 4, or 6": "11:20 - 13:20",
    },

    "earthquake_drill": {
        "Period 1": "08:45 - 09:36",
        "Period 2": "09:42 - 10:32",
        "Earthquake Drill": "10:33 - 11:12",
        "Period 3": "11:18 - 12:09",
        "Lunch": "12:15 - 12:45",
        "Period 4": "12:51 - 13:42",
        "Period 5": "13:48 - 14:39",
        "Period 6": "14:45 - 15:36",
        "Period 7": "15:42 - 16:33"
    }

}

// On all other days, "default" schedule is used
const specialDates = {
    "2022-10-20": "earthquake_drill",
    "2022-11-07": "modified",
    "2022-11-28": "modified",
    "2022-12-05": "modified",
    "2023-01-09": "modified",
    "2023-01-18": "finals",
    "2023-01-19": "finals",
    "2023-01-20": "finals",
    "2023-01-30": "modified",
    "2023-02-13": "modified",
    "2023-02-27": "modified",
    "2023-04-10": "modified",
    "2023-06-05": "modified",
    "2023-06-12": "finals",
    "2023-06-13": "finals",
    "2023-06-14": "finals"
}