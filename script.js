// Write me a web clock program using HTML,JS, and CSS

const clock = document.getElementById("clock");
const analogClock = document.getElementById("analogClock");
const toggleButton = document.getElementById("toggleButton");
const menu = document.getElementById("menu");
const menuButton = document.getElementById("menuButton");
const dateDisplay = document.getElementById("date");
const styleButton = document.getElementById("styleButton");

// Get clock hands
const hourHand = document.querySelector(".hour-hand");
const minuteHand = document.querySelector(".minute-hand");
const secondHand = document.querySelector(".second-hand");

const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
let fontIndex = 0;
let fallen = false;
let broken = false;
let typedText = "";
let colorInterval;  // Variable to store the interval for background color change
// Make it so that when you're on the analogue clock, the background gradually changes to random colors
let isAnalogClockVisible = false;  // Track if analog clock is visible

// Function to update the digital clock
function updateClock() {
    if (fallen) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    clock.innerHTML = "";
    [...`${hours}:${minutes}:${seconds}`].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.classList.add("digit");
        span.dataset.index = index;
        clock.appendChild(span);
    });
}

// Function to update the analog clock hands
function updateAnalogClock() {
    if (broken) return;

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours * 30) + (minutes * 0.5);
    const minuteDeg = (minutes * 6) + (seconds * 0.1);
    const secondDeg = seconds * 6;

    // Prevent reverse rotation by ensuring smooth transition
    if (!broken) {
        secondHand.style.transition = seconds === 0 ? "none" : "transform 0.1s linear";
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
}

// Function to update the date in DD/MM/YYYY format
// Add a date to the upper right of the page
// Make it so the date is in DD/MM/YYYY
function updateDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    dateDisplay.textContent = `${day}/${month}/${year}`;
}

// Function to make numbers fall
function fallClock() {
    fallen = true;

    document.querySelectorAll("#clock span").forEach((digit) => {
        digit.classList.add("falling");
        digit.style.animationDelay = `${digit.dataset.index * 0.1}s`;
    });
}

// Function to fix everything
function fixClock() {
    fallen = false;
    broken = false;

    // Remove falling effect from digital clock digits
    document.querySelectorAll("#clock span").forEach((digit) => {
        digit.classList.remove("falling");
        digit.style.animation = "none";
        void digit.offsetWidth; // Force reflow before applying new animation
        digit.classList.add("floating");
    });

    setTimeout(() => {
        document.querySelectorAll("#clock span").forEach((digit) => {
            digit.classList.remove("floating");
        });
        updateClock();
    }, 1500);

    // Fix analog clock hands
    document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.remove("droop", "sway"); // Ensure both animations are removed
        hand.style.animation = "none"; // Stop any ongoing animation
        void hand.offsetWidth; // Force reflow to fully reset styles
        hand.style.transition = "transform 1.5s ease-in-out"; // Smooth transition

        // Recalculate correct rotation
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hourDeg = (hours * 30) + (minutes * 0.5);
        const minuteDeg = (minutes * 6) + (seconds * 0.1);
        const secondDeg = seconds * 6;

        if (hand.classList.contains("hour-hand")) {
            hand.style.transform = `rotate(${hourDeg}deg)`;
        } else if (hand.classList.contains("minute-hand")) {
            hand.style.transform = `rotate(${minuteDeg}deg)`;
        } else if (hand.classList.contains("second-hand")) {
            hand.style.transform = `rotate(${secondDeg}deg)`;
        }
    });
}


// Function to break the analog clock (hands smoothly move to bottom & sway)
function breakAnalogClock() {
    if (broken) return;
    broken = true;

    document.querySelectorAll('.hand').forEach(hand => {
        let computedStyle = window.getComputedStyle(hand);
        let transformValue = computedStyle.getPropertyValue('transform');

        // Extract current rotation angle
        let matrix = new DOMMatrix(transformValue);
        let angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);

        // Set the current rotation as a CSS variable
        hand.style.setProperty('--current-rotation', `${angle}deg`);

        // Remove existing transition and animation
        hand.style.transition = "none";
        hand.style.animation = "none";
        void hand.offsetWidth; // Force reflow

        // Manually set the rotation to the bottom
        hand.style.transform = `rotate(180deg)`;
        hand.style.transition = "transform 1.5s ease-in-out";

        // After transition, apply the sway effect
        setTimeout(() => {
            hand.classList.add("droop");
        }, 1500);
    });
}



// Function to gradually change background color when the analog clock is active
function startColorTransition() {
    colorInterval = setInterval(() => {
        document.body.style.transition = 'background-color 2s ease-in-out';
        document.body.style.backgroundColor = getRandomColor();
    }, 3000);
}

// Function to stop the background color transition
function stopColorTransition() {
    clearInterval(colorInterval);
}

// Function to get a random color
// Make it so that if you click on the background, the background color is randomized
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Keyboard input for effects
// Make it so that if you type fall on your keyboard, the numbers get gravity and fall off the screen
// and make it so that if you type "break", the analogue clock's  hands fall down
// and typing "fix" will repair the analog clock
document.addEventListener("keydown", (event) => {
    typedText += event.key.toLowerCase();

    if (typedText.endsWith("fall")) {
        fallClock();
        typedText = "";
    } else if (typedText.endsWith("break")) {
        breakAnalogClock();
        typedText = "";
    } else if (typedText.endsWith("fix")) {
        fixClock();
        typedText = "";
    }
});

// Update clocks every second
setInterval(() => {
    if (!fallen) updateClock();
    if (!broken) updateAnalogClock();
}, 1000);

updateClock();
updateAnalogClock();
updateDate();

// Toggle clock mode
toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    clock.classList.toggle("hidden");
    analogClock.classList.toggle("hidden");

    // Start or stop the background color transition when switching clocks
    if (!analogClock.classList.contains("hidden")) {
        isAnalogClockVisible = true;
        startColorTransition();
    } else {
        isAnalogClockVisible = false;
        stopColorTransition();
    }
});

// Change font on button click
// Make one of the placeholder buttons cycle through different fonts for the numbers
// The button's text should be "Style" and the font of the button should be according to the font being used
// The font should also change the font of the date
styleButton.addEventListener("click", () => {
    fontIndex = (fontIndex + 1) % fonts.length;
    const newFont = fonts[fontIndex];

    clock.style.fontFamily = newFont;
    dateDisplay.style.fontFamily = newFont;
    styleButton.style.fontFamily = newFont;
});

// Toggle the menu
menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("show");
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menu.classList.remove("show");
    }
});

// Ensure clicking the background always changes its color
document.body.addEventListener("click", (event) => {
    if (!event.target.closest(".menu") && event.target !== menuButton) {
        document.body.style.backgroundColor = getRandomColor();
    }
});


// Make it so that the "Placeholder 2" button is the set alarm button
// If pressed, it pops up a menu where you can input time in a HH:MM format and a message for the alarm to display 

const alarmButton = document.getElementById("alarmButton");
const alarmPopup = document.getElementById("alarmPopup");
const closePopup = document.getElementById("closePopup");
const setAlarmButton = document.getElementById("setAlarm");
const alarmTimeInput = document.getElementById("alarmTime");
const alarmMessageInput = document.getElementById("alarmMessage");
const alarmNotification = document.getElementById("alarmNotification");
const alarmText = document.getElementById("alarmText");
const dismissAlarm = document.getElementById("dismissAlarm");

let alarmTime = null;
let alarmMessage = "";

// Show the alarm setting popup
alarmButton.addEventListener("click", () => {
    alarmPopup.classList.remove("hidden");
});

// Close the popup
closePopup.addEventListener("click", () => {
    alarmPopup.classList.add("hidden");
});

// Set the alarm
setAlarmButton.addEventListener("click", () => {
    alarmTime = alarmTimeInput.value;
    alarmMessage = alarmMessageInput.value || "Alarm!";
    alarmPopup.classList.add("hidden");
});

// Check the alarm every second
setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (alarmTime === currentTime) {
        alarmNotification.classList.remove("hidden");
        alarmText.textContent = alarmMessage;
    }
}, 1000);

// Dismiss alarm
dismissAlarm.addEventListener("click", () => {
    alarmNotification.classList.add("hidden");
    alarmTime = null;
});
