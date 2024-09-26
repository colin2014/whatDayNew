function updateClock() {
    const now = new Date();

    // Get hours, minutes, seconds for the live clock
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zeros to minutes and seconds if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Format time as HH:MM:SS
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const timeElement = document.getElementById('time');
    
    if (timeElement) {
        timeElement.textContent = timeString;
        console.log("Time updated to:", timeString);
    } else {
        console.error("Time element not found.");
    }

    // Format date as Weekday, Month Day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const dateString = `${dayName}, ${monthName} ${day}`;

    const dateElement = document.getElementById('date');
    
    if (dateElement) {
        dateElement.textContent = dateString;
        console.log("Date element updated successfully.");
    } else {
        console.error("Date element not found.");
    }

    // Determine the current lesson based on the current time
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    let lesson = "Invalid Time";

    if (currentTime >= timeToSeconds(0, 0, 0) && currentTime < timeToSeconds(8, 30, 0)) {
        lesson = "Arriving to School";
    } else if (currentTime >= timeToSeconds(8, 30, 0) && currentTime < timeToSeconds(9, 55, 0)) {
        lesson = "Lesson 1";
    } else if (currentTime >= timeToSeconds(9, 55, 0) && currentTime < timeToSeconds(10, 10, 0)) {
        lesson = "Break";
    } else if (currentTime >= timeToSeconds(10, 10, 0) && currentTime < timeToSeconds(11, 30, 0)) {
        lesson = "Lesson 2";
    } else if (currentTime >= timeToSeconds(11, 30, 0) && currentTime < timeToSeconds(12, 45, 0)) {
        lesson = "Lesson 3";
    } else if (currentTime >= timeToSeconds(12, 45, 0) && currentTime < timeToSeconds(12, 55, 0)) {
        lesson = "MS Lunch and HS Advisory";
    } else if (currentTime >= timeToSeconds(12, 55, 0) && currentTime < timeToSeconds(13, 45, 0)) {
        lesson = "Upper School Lunch";
    } else if (currentTime >= timeToSeconds(13, 45, 0) && currentTime < timeToSeconds(13, 50, 0)) {
        lesson = "MS go to advisory and HS Lunch";
    } else if (currentTime >= timeToSeconds(13, 50, 0) && currentTime < timeToSeconds(14, 5, 0)) {
        lesson = "HS Lunch and MS Advisory";
    } else if (currentTime >= timeToSeconds(14, 5, 0) && currentTime < timeToSeconds(15, 30, 0)) {
        lesson = "Lesson 4";
    } else if (currentTime >= timeToSeconds(15, 30, 0) && currentTime <= timeToSeconds(23, 59, 59)) {
        lesson = "After School";
    }

    const lessonElement = document.getElementById('lesson');
    
    if (lessonElement) {
        lessonElement.textContent = lesson;
        console.log("Lesson element updated successfully.");
    } else {
        console.error("Lesson element not found.");
    }

    // Format date for CSV lookup as dd/mm/yyyy
    const formattedDate = `${day < 10 ? '0' + day : day}/${(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}/${year}`;
    console.log("Formatted date for CSV lookup:", formattedDate);

    // Load the CSV and determine the status
    fetch('days.csv')
        .then(response => {
            console.log("CSV fetch response status:", response.status);
            return response.text();
        })
        .then(csvData => {
            console.log("CSV Data:", csvData);
            const status = getStatusFromCSV(csvData, formattedDate);
            document.getElementById('status').textContent = `Day: ${status}`;
        })
        .catch(error => console.error('Error loading CSV:', error));
}

function timeToSeconds(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
}

function getStatusFromCSV(csvData, currentDate) {
    const rows = csvData.split('\n');
    for (let row of rows) {
        const [day, date, status] = row.split(',');
        if (date && date.trim() === currentDate.trim()) {
            return status.trim();
        }
    }
    return 'No Status Available';
}

// Function to toggle full screen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

// Add event listener to the full-screen image button
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullScreen);

// Initial call to display the clock immediately
updateClock();

// Update the clock every second
setInterval(updateClock, 1000);