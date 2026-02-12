
let totalSeconds = 0;
let remainingSeconds = 0;
let intervalId = null;
let endTime = null;
let isPaused = false;
let pausedTimeRemaining = 0;

const setupView = document.querySelector('.setup-view');
const timerView = document.querySelector('.timer-view');
const display = document.getElementById('display');
const status = document.getElementById('status');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const pauseBtn = document.getElementById('pauseBtn');

// Function to create a colored favicon
function setFavicon(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Convert to data URL and set as favicon
    const favicon = document.getElementById('favicon');
    favicon.href = canvas.toDataURL('image/png');
}

// Set initial green favicon
setFavicon('#4CAF50'); // Green

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    if (!isPaused && endTime) {
        const now = Date.now();
        remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        
        display.textContent = formatTime(remainingSeconds);
        document.title = `${formatTime(remainingSeconds)} - Timer`;

        // Update favicon color based on time remaining
        if (remainingSeconds > 60) {
            setFavicon('#4CAF50'); // Green - more than 1 minute
        } else if (remainingSeconds > 15) {
            setFavicon('#FF9800'); // Amber - 1 minute to 16 seconds
        } else if (remainingSeconds > 0) {
            setFavicon('#F44336'); // Red - 15 seconds or less
        } else {
            setFavicon('#9E9E9E'); // Gray - finished
        }

        if (remainingSeconds === 0) {
            stopTimer();
            status.textContent = '⏰ Time\'s up!';
            pauseBtn.disabled = true;
            display.style.color = '#ffeb3b';
        }
    } else if (isPaused) {
        display.textContent = formatTime(pausedTimeRemaining);
        document.title = `${formatTime(pausedTimeRemaining)} (Paused) - Timer`;
    }
}

function startTimer() {
    const mins = parseInt(minutesInput.value) || 0;
    const secs = parseInt(secondsInput.value) || 0;
    totalSeconds = mins * 60 + secs;

    if (totalSeconds === 0) {
        alert('Please set a time greater than 0');
        return;
    }

    remainingSeconds = totalSeconds;
    endTime = Date.now() + (totalSeconds * 1000);
    isPaused = false;

    setupView.classList.remove('active');
    timerView.classList.add('active');

    display.textContent = formatTime(remainingSeconds);
    display.style.color = 'black';
    status.textContent = 'Running...';
    pauseBtn.textContent = 'Pause';
    pauseBtn.disabled = false;

    setFavicon('#4CAF50'); // Start with green
    intervalId = setInterval(updateDisplay, 1000);
    updateDisplay();
}

function togglePause() {
    if (isPaused) {
        // Resume
        isPaused = false;
        endTime = Date.now() + (pausedTimeRemaining * 1000);
        pauseBtn.textContent = 'Pause';
        status.textContent = 'Running...';
    } else {
        // Pause
        isPaused = true;
        pausedTimeRemaining = remainingSeconds;
        pauseBtn.textContent = 'Resume';
        status.textContent = '⏸️ Paused';
    }
    updateDisplay();
}

function stopTimer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function resetTimer() {
    stopTimer();
    setupView.classList.add('active');
    timerView.classList.remove('active');
    document.title = 'Classroom Timer';
    endTime = null;
    isPaused = false;
    pausedTimeRemaining = 0;
    setFavicon('#4CAF50'); // Reset to green
}

function addTime(seconds) {
    if (isPaused) {
        pausedTimeRemaining += seconds;
        updateDisplay();
    } else if (endTime) {
        endTime += seconds * 1000;
        updateDisplay();
    }
}

function setQuickTime(mins, secs) {
    minutesInput.value = mins;
    secondsInput.value = secs;
}

// Allow Enter key to start timer
minutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startTimer();
});
secondsInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startTimer();
});

// Prevent accidental page close while timer is running
window.addEventListener('beforeunload', (e) => {
    if (intervalId && remainingSeconds > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
