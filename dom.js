const h1 = document.getElementById("time");

setInterval(function() {
    const p = getCurrentPeriod();

    switch(p.period) {
        case "None":
            h1.innerHTML = "School is not in session";
        break;

        case "Passing period":
            h1.innerHTML = p.timeRemaining + " minutes left in passing period";
        break;

        default:
            h1.innerHTML = p.period + " ends in " + p.timeRemaining + " minutes";
        break;
    }

    if(p.period === "None" && p.timeRemaining !== 0) {
        h1.innerHTML = "School starts in " + p.timeRemaining + " minutes";
    }

}, 750);
