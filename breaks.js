function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6;
}

function getFederalHolidays(year) {
    // New Year's, Juneteenth, Independence Day, Veteran's Day, and Christmas fall on the same day every year
    const fixed = ["01-01", "06-19", "07-04", "11-11", "12-25"];

    /* Formatting: "number dayofweek month" or "last dayofweek month"
                            MLK day             Presidents day        Memorial day          Labor day               Thanksgiving */
    const floating = ["3rd monday january", "3rd monday february", "last monday may", "1st monday september", "4th thursday november"];

    const yyyymmddArr = fixed.map(x => year.toString() + "-" + x);

    for(const x of floating) {
        const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        let [num, day, month] = x.split(" ");
        day = weekdays.indexOf(day);
        month = months.indexOf(month);

        // If we're looking for the last Monday or Tuesday or whatever of the month, just find the first Monday or Tuesday or whatever of the next month and go back a week
        const lastDayneeded = num === "last";
        if(lastDayneeded) {
            num = 1;
            month++;
        } else {
            num = parseInt(num);
        }

        const d = new Date(year, month, 1);

        // Traverse days in this month, count number of Mondays or Tuesdays or whatever we're looking for
        // i.e. if we're looking for the 3rd Monday, we'll count the first three Mondays and then read out the calendar date
        let i = 0;
        while(d.getMonth() === month) {
            if(d.getDay() === day) {
                i++;
                if(i === num) {

                    // Again, go back a week if looking for last day
                    if(lastDayneeded) {
                        d.setDate(d.getDate() - 7);
                    }

                    yyyymmddArr.push(yyyymmdd(d));
                    break;
                }
            }
            d.setDate(d.getDate() + 1);
            
        }
    }

    return yyyymmddArr;

}

//                 Thanksgiving break            Winter break               Spring break               Summer vacation
const breaks = ["2022-11-21 - 2022-11-25", "2022-12-19 - 2023-01-02", "2023-03-27 - 2023-03-31", "2023-06-15 - 2023-08-18"];
const holidays = getFederalHolidays((new Date()).getFullYear());

function isThereSchool(date) {
    if(isWeekend(date)) {
        return false;
    }

    const iso = yyyymmdd(date);
    if(holidays.includes(iso)) {
        return false;
    }

    // Checks if we're in a break
    for(const x of breaks) {
        const [breakStart, breakEnd] = x.split(" - ");

        const timestamp = date.getTime();
        const start = new Date(breakStart).getTime();
        const end = new Date(breakEnd).getTime();

        if(timestamp >= start && timestamp <= end) {
            return false;
        }
    }

    return true;

}