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
        for(let i = 0; i < periods.length - 1; i++) {
            const classEndedAt = info.schedule[periods[i]].end
            const classWillStartAt = info.schedule[periods[i + 1]].start
            
            if(mins >= classEndedAt && mins < classWillStartAt) {
                return classWillStartAt - mins;
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
