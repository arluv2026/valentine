const questions = [
    "Do you like me? ❤️",
    "Will you go on a date? 💕",
    "Are you thinking about me? 😘",
    "Can I be your Valentine? 🌹",
    "Do you love me? 💖"
];

let currentQuestion = 0;
let yesScale = 1;
let decoysCreated = false;

const questionEl = document.getElementById("question");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const card = document.getElementById("card");
const noAudio = document.getElementById("noAudio");
const yesAudio = document.getElementById("yesAudio");

// Function to play sound
function playSnd(a) { 
    a.currentTime = 0; 
    a.play().catch(e => console.log("Audio play blocked until user interacts.")); 
}

// Logic to move the button away from the cursor
function moveEl(el) {
    const yRect = yesBtn.getBoundingClientRect();
    let x, y, overlap;
    
    do {
        const padding = 50;
        x = Math.floor(Math.random() * (window.innerWidth - el.offsetWidth - padding)) + padding;
        y = Math.floor(Math.random() * (window.innerHeight - el.offsetHeight - padding)) + padding;
        
        // Prevent overlapping with the Yes button
        overlap = (x < yRect.right + 50 && x + el.offsetWidth > yRect.left - 50 && 
                   y < yRect.bottom + 50 && y + el.offsetHeight > yRect.top - 50);
    } while (overlap);

    el.style.left = x + "px";
    el.style.top = y + "px";
}

// Spawns decoys the first time the mouse touches a No button
function spawnDecoys() {
    if (decoysCreated) return;
    for (let i = 0; i < 4; i++) {
        const d = document.createElement("button");
        d.textContent = "No";
        d.className = "decoy-no";
        moveEl(d);
        
        // Play sound when trying to click (hover)
        d.addEventListener("mouseover", () => { 
            playSnd(noAudio); 
            moveEl(d); 
            yesScale += 0.1; 
            yesBtn.style.transform = `scale(${yesScale})`; 
        });
        
        // Play sound when actually clicked
        d.addEventListener("click", () => { 
            playSnd(noAudio); 
            moveEl(d); 
        });
        document.body.appendChild(d);
    }
    decoysCreated = true;
}

// Main No button logic
noBtn.addEventListener("mouseover", () => {
    playSnd(noAudio); // Plays sound when they "try" to click
    spawnDecoys();
    moveEl(noBtn);
    yesScale += 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;
});

noBtn.addEventListener("click", () => { 
    playSnd(noAudio); // Plays sound when they "actually" click
    moveEl(noBtn); 
});

// Yes button logic
yesBtn.addEventListener("click", () => {
    playSnd(yesAudio);
    currentQuestion++;

    if (currentQuestion < questions.length) {
        yesScale = 1;
        yesBtn.style.transform = `scale(1)`;
        questionEl.textContent = questions[currentQuestion];
    } else {
        noBtn.style.display = "none";
        document.querySelectorAll('.decoy-no').forEach(n => n.remove());
        
        card.innerHTML = `
            <h2 style="font-family: 'Pacifico';">Yay! It's a Date! 🥂</h2>
            <p style="color: white;">Redirecting to Instagram... 😉</p>
        `;

        setTimeout(() => {
            window.location.href = "https://www.instagram.com";
        }, 2500);
    }
});