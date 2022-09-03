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

// hh:mm to minutes since midnight
function toMinutes(time) {
    const [hours, minutes] = time.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
}

// Actual minutes since midnight
function minutesSinceMidnight() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Pad with zeros if needed
function yyyymmdd() {
    const now = new Date();
    return now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
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

// Find when class ends
const whatKindOfDay = specialDates[yyyymmdd()] || "default";
const daySchedule = scheduleTimes[whatKindOfDay];

const schoolDayStart = Object.values(daySchedule)[0].start;
const schoolDayEnd = Object.values(daySchedule)[Object.keys(daySchedule).length - 1].end;

// Find the current period, passing period if between periods
function getPeriodName(mins) {

    if(mins < schoolDayStart || mins >= schoolDayEnd) {
        return "None";
    }

    for(const period in daySchedule) {
        const periodTimes = daySchedule[period];
        if(mins >= periodTimes.start && mins < periodTimes.end) {
            return period;
        }
    }

    return "Passing period";
}

function minsRemainingInPeriod(mins) {
    const periodName = getPeriodName(mins);

    // If school starts in under an hour
    if(periodName === "None") {
        return mins >= schoolDayStart - 60 && mins < schoolDayStart ? schoolDayStart - mins : 0;
    }

    // Time until next period starts (if passing period)
    if(periodName === "Passing period") {
        const periods = Object.keys(daySchedule);
        for(let i = 0; i < periods.length; i++) {
            if(mins >= daySchedule[periods[i]].end) {
                return daySchedule[periods[i + 1]].start - mins;
            }
        }
    }

    // In any other case, return time until period ends
    const periodTimes = daySchedule[periodName];
    return periodTimes.end - mins;
}

function getCurrentPeriod() {
    const mins = minutesSinceMidnight();
    return {
        period: getPeriodName(mins),
        timeRemaining: minsRemainingInPeriod(mins)
    };
}
