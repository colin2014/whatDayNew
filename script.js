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

    const dateString = `${dayName}, ${monthName} ${day}, ${year}`;
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

    // Change background color gradually
    changeBackgroundColorGradually(hours, minutes, seconds);
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

function updateWeather() {
    const apiKey = '5947720cea20299fcc0f340002ab9d3e';
    const city = 'EGHAM';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const currentWeather = data.list[0];
            const nextHourWeather = data.list[1];
            
            const currentWeatherDescription = `${currentWeather.weather[0].description}, ${Math.round(currentWeather.main.temp - 273.15)}°C`;
            const currentWeatherIcon = currentWeather.weather[0].icon;
            document.getElementById('weather').textContent = currentWeatherDescription;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`;
            
            const nextHourWeatherDescription = `In 1 hour: ${nextHourWeather.weather[0].description}, ${Math.round(nextHourWeather.main.temp - 273.15)}°C`;
            const nextHourWeatherIcon = nextHourWeather.weather[0].icon;
            document.getElementById('next-hour-weather').textContent = nextHourWeatherDescription;
            document.getElementById('next-hour-weather-icon').src = `http://openweathermap.org/img/wn/${nextHourWeatherIcon}@2x.png`;
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function changeBackgroundColorGradually(hours, minutes, seconds) {
    const body = document.body;

    // Define color stops for different times of the day
    const morningColor = { start: [255, 221, 193], end: [255, 231, 170] };
    const afternoonColor = { start: [255, 231, 170], end: [255, 200, 55] };
    const eveningColor = { start: [255, 200, 55], end: [255, 106, 0] };
    const nightColor = { start: [44, 62, 80], end: [76, 161, 175] };

    let startColor, endColor;

    if (hours >= 6 && hours < 12) {
        startColor = morningColor.start;
        endColor = morningColor.end;
    } else if (hours >= 12 && hours < 18) {
        startColor = afternoonColor.start;
        endColor = afternoonColor.end;
    } else if (hours >= 18 && hours < 20) {
        startColor = eveningColor.start;
        endColor = eveningColor.end;
    } else {
        startColor = nightColor.start;
        endColor = nightColor.end;
    }

    // Calculate the interpolation factor
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const currentFraction = totalSeconds % 3600 / 3600;

    // Interpolate colors
    const interpolatedStartColor = startColor.map((start, index) => Math.round(start + (endColor[index] - start) * currentFraction));
    const interpolatedEndColor = endColor.map((start, index) => Math.round(start + (startColor[index] - start) * currentFraction));

    // Set the background color
    body.style.background = `linear-gradient(135deg, rgb(${interpolatedStartColor.join(',')}) 0%, rgb(${interpolatedEndColor.join(',')}) 100%)`;
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
