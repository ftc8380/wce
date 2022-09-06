const schedules = {
    "default": {
        "Period 1": "8:45 - 9:42",
        "Period 2": "9:48 - 10:45",
        "Period 3": "10:51 - 11:51",
        "Lunch": "11:57 - 12:27",
        "Period 4": "12:33 - 1:30",
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

    "pep_rally": {
        "Period 1": "08:45 - 09:30",
        "Period 2": "09:36 - 11:36",
        "Period 3": "11:42 - 12:27",
        "Lunch": "12:33 - 13:03",
        "Period 4": "13:09 - 13:54",
        "Period 5": "14:00 - 14:45",
        "Period 6": "14:51 - 15:36"
    }

}

// On all other days, "default" schedule is used
const specialDates = {
    "2022-09-12": "modified",
    "2022-09-19": "modified",
    "2022-09-26": "modified",
    "2022-10-03": "modified",
    "2022-10-17": "modified",
    "2022-11-07": "modified",
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

/* This turns period hh:mm - hh:mm into minutes since midnight
"Period 1": "8:45 - 9:42" --> "Period 1": {"start": 525, "end": 582} */
const scheduleTimes = Object.assign({}, schedules);
for(const dayOfWeek in schedules) {

    const daySchedule = schedules[dayOfWeek];
    for(const period in daySchedule) {

        const times = daySchedule[period].split(" - ");

        scheduleTimes[dayOfWeek][period] = {
            start: toMinutes(times[0]),
            end: toMinutes(times[1])
        };
    }
}

function getScheduleInfo(date) {
    const dayType = specialDates[yyyymmdd(date)] || "default";
    const daySchedule = scheduleTimes[dayType];

    return {
        "type": dayType,
        "schedule": daySchedule,
        "start": daySchedule[Object.keys(daySchedule)[0]].start,
        "end": daySchedule[Object.keys(daySchedule)[Object.keys(daySchedule).length - 1]].end
    }
}

// Find the current period, passing period if between periods
function getPeriodName(date) {
    const info = getScheduleInfo(date);
    const mins = minutesSinceMidnight(date);

    if(mins < info.start || mins >= info.end) {
        return "None";
    }

    for(const period in info.schedule) {
        const periodTimes = info.schedule[period];
        if(mins >= periodTimes.start && mins < periodTimes.end) {
            return period;
        }
    }

    return "Passing period";
}

function minsRemainingInPeriod(date) {
    const info = getScheduleInfo(date);
    const mins = minutesSinceMidnight(date);
    const periodName = getPeriodName(date);

    // If school starts in under an hour, return minutes until school starts
    if(periodName === "None") {
        return mins >= info.start - 60 && mins < info.start ? info.start - mins : 0;
    }

    // Time until next period starts (if passing period)
    if(periodName === "Passing period") {
        const periods = Object.keys(info.schedule);
        for(let i = 0; i < periods.length; i++) {
            if(mins >= info.schedule[periods[i]].end) {
                return info.schedule[periods[i + 1]].start - mins;
            }
        }
    }

    // In any other case, return time until period ends
    return info.schedule[periodName].end - mins;
}

function getCurrentPeriod(date) {
    return {
        period: getPeriodName(date),
        timeRemaining: minsRemainingInPeriod(date)
    };
}
