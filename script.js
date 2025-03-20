const moodBtn = document.querySelectorAll(".mood-btn");
const currentMood = document.getElementById("selected-mood");
const moodHistory = document.querySelector(".mood-history");

// Load previous mood from LocalStorage
document.addEventListener("DOMContentLoaded", () => {
    const lastMood = JSON.parse(localStorage.getItem("currentMood"));
    let cdate;
    if (lastMood) {
        currentMood.innerHTML = `<span>${lastMood.m}</span><br><small>${lastMood.d}</small>`;
        currentMood.classList.add("design");
    }

    const storedHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    storedHistory.forEach(({m, d}) => addMoodToHistory(m, d));

    const calendarHistory = JSON.parse(localStorage.getItem("moodCalendar")) || [];
    calendarHistory.forEach(({date, mood}) => addMoodToCalendar(mood, date));
});





// Handle mood selection
moodBtn.forEach(button => {
    button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
        const date = new Date().toLocaleString(); 
        const mdate = new Date().toLocaleDateString('en-GB');

        currentMood.innerHTML = `<span>${mood}</span><br><small>${date}</small>`;
        currentMood.classList.add("design");

        // Save to LocalStorage
        localStorage.setItem("currentMood", JSON.stringify({m: mood, d: date}));

        
        // Store in history
        saveMoodToHistory(mood, date)

        //store to Mood Calender
        updateCalenderStorage(mood, mdate);
        
    })
})


// Display mood in history/past mood
function addMoodToHistory(mood, date) {
    const moodDiv = document.createElement("div");
    moodHistory.style.maxHeight = "480px";
    moodHistory.style.overflowY = "auto";
    moodDiv.innerHTML = `<span>${mood}</span><small><i>${date}</i></small>`;
    moodDiv.style.minHeight = "50px";
    moodHistory.appendChild(moodDiv);
    moodDiv.classList.add("card");
    //console.log(moodDiv);
}

// Save mood to history local storage
function saveMoodToHistory(mood, date){
    const moodCard = JSON.parse(localStorage.getItem("moodHistory")) || [];
    moodCard.push({m: mood, d: date});
    localStorage.setItem("moodHistory", JSON.stringify(moodCard));

    addMoodToHistory(mood, date); //display the mood in past mood
}

function clearMoodHistory() {
    const cards = moodHistory.querySelectorAll(".card");
    cards.forEach(card => card.parentNode.removeChild(card));
    localStorage.removeItem("moodHistory");
    
}


const moodCalendar = document.querySelector("#mood-calendar"); 

function updateCalenderStorage(mood ,mdate) {
    const storageKey = "moodCalendar";
    let records = JSON.parse(localStorage.getItem(storageKey)) || [];
    const m = mood;

    //const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (typeof mood !== "object" || mood === null) {
        mood = { mood: mood };
    }

    let existingRecord = records.find(record => record.date === mdate);

    if (existingRecord) {
        // Modify the existing record if today's date already exists
        Object.assign(existingRecord, mood);
    } else {
        // Push new object if the date changes
        let newRecord = { date: mdate,...mood };
        records.push(newRecord);
    }

    // Save updated records to localStorage
    localStorage.setItem(storageKey, JSON.stringify(records));

    //update mood calendar
    if(existingRecord) {
        const datecards = document.querySelectorAll(".datecard");
        datecards[datecards.length -1].innerHTML = `<span>${m}</span><small><i>${mdate}</i></small>`;
    }
    
}

function addMoodToCalendar (mood, date) {
    const moodDiv = document.createElement("div");
    moodCalendar.style.maxHeight = "480px";
    moodCalendar.style.overflowY = "auto";
    moodDiv.innerHTML = `<span>${mood}</span><small><i>${date}</i></small>`;
    moodDiv.style.minHeight = "50px";
    moodCalendar.appendChild(moodDiv);
    moodDiv.classList.add("datecard");
}







