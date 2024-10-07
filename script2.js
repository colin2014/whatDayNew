function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Format time as HH:MM:SS
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = timeString;

    // Format date as Weekday, Month Day, Year
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
    document.getElementById('date').textContent = dateString;

    // Determine the current lesson
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

    document.getElementById('lesson').textContent = lesson;

    // Format date for CSV lookup as dd/mm/yyyy
    const formattedDate = `${day < 10 ? '0' + day : day}/${(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1)}/${year}`;
    console.log(`Looking for date in CSV: ${formattedDate}`);

    // Load the CSV and determine the status
    fetch('days.csv')
        .then(response => response.text())
        .then(csvData => {
            const status = getStatusFromCSV(csvData, formattedDate);
            document.getElementById('status').textContent = `Day: ${status}`;
        })
        .catch(error => console.error('Error loading CSV:', error));
    
    // Update weather
    updateWeather();
}

function timeToSeconds(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
}

function getStatusFromCSV(csvData, currentDate) {
    const rows = csvData.split('\n');
    for (let row of rows) {
        const [day, date, status] = row.split(',');
        if (date.trim() === currentDate.trim()) {
            return status.trim();
        }
    }
    return 'No Status Available';
}

// function updateWeather() {
//     const apiKey = '5947720cea20299fcc0f340002ab9d3e';
//     const city = 'EGHAM';
//     const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             const currentWeather = data.list[0];
//             const nextHourWeather = data.list[1];
            
//             const currentWeatherDescription = `${currentWeather.weather[0].description}, ${Math.round(currentWeather.main.temp - 273.15)}°C`;
//             const currentWeatherIcon = currentWeather.weather[0].icon;
//             document.getElementById('weather').textContent = currentWeatherDescription;
//             document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`;
            
//             const nextHourWeatherDescription = `In 1 hour: ${nextHourWeather.weather[0].description}, ${Math.round(nextHourWeather.main.temp - 273.15)}°C`;
//             const nextHourWeatherIcon = nextHourWeather.weather[0].icon;
//             document.getElementById('next-hour-weather').textContent = nextHourWeatherDescription;
//             document.getElementById('next-hour-weather-icon').src = `http://openweathermap.org/img/wn/${nextHourWeatherIcon}@2x.png`;
//         })
//         .catch(error => console.error('Error fetching weather data:', error));
// }

// function setRainbowBackground() {
//     const body = document.body;
//     body.style.background = "linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 20%, #FFFFBA 40%, #BAFFC9 60%, #BAE1FF 80%)";
// }

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

// Initialize countdown at 60 seconds
let countdown = 60;

// Initialize refresh counter from localStorage (or 0 if it's not set yet)
let refreshCount = localStorage.getItem('refreshCount') ? parseInt(localStorage.getItem('refreshCount')) : 0;

// Function to update the clock and countdown timer
function updateClockAndTimer() {
    console.log("Updating clock and timer");  // Debug log

    // Update the clock and lesson info
    try {
        updateClock();
    } catch (error) {
        console.error("Error in updateClock function: ", error);
    }
    
    // Update the countdown timer
    const timerElement = document.getElementById('small-timer');
    if (timerElement) {
        timerElement.textContent = countdown;
        countdown--;
    } else {
        console.error('Error: small-timer element not found');
    }

    // If countdown reaches 0, refresh the page and update the counter
    if (countdown < 0) {
        countdown = 120;  // Reset countdown

        // Increment refresh counter
        refreshCount++;
        localStorage.setItem('refreshCount', refreshCount);

        console.log("Refreshing the page, refresh count: ", refreshCount);

        // Refresh the page
        location.reload();
    }

    // Update the refresh count display
    const refreshElement = document.getElementById('refresh-count');
    if (refreshElement) {
        refreshElement.textContent = `${refreshCount}`;
    } else {
        console.error('Error: refresh-count element not found');
    }
}

// Initial call to display the clock, countdown, and refresh count immediately
updateClockAndTimer();

// Update the clock and timer every second
setInterval(updateClockAndTimer, 1000);
// // Set rainbow background immediately
// setRainbowBackground();

