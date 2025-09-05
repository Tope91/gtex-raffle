(function () {
  var numbers = [];
  var drawn = [];
  var spinning = false;

  var reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
  ];
  var drawnBox = document.getElementById("drawnNumbers");
  var spinSound = document.getElementById("spinSound");
  var dingSound = document.getElementById("dingSound");

  document.getElementById("startBtn").addEventListener("click", startRaffle, false);
  document.getElementById("drawBtn").addEventListener("click", drawNumber, false);
  document.getElementById("resetBtn").addEventListener("click", resetRaffle, false);

  const ITEM_HEIGHT = 360;   // height of each reel item
  const SPIN_LOOPS = 60;     // make spin distance very long
  const LOOPS_IN_REEL = 80;  // enough items to scroll smoothly
  const SPIN_DURATION = 20;  // long enough so reels keep moving
  const STOP_DELAY = 0.8;    // delay between reel stops
  const SNAP_DURATION = 0.6; // smooth snap to number

  // --- Build reels with repeated digits ---
  function initReels() {
    let items = "";
    for (let loop = 0; loop < LOOPS_IN_REEL; loop++) {
      for (let d = 0; d < 10; d++) {
        items += '<div class="reel-item">' + d + "</div>";
      }
    }
    reels.forEach(r => {
      r.innerHTML = items;
      r.style.transition = "none";
      r.style.transform = "translateY(0)";
    });
  }
  initReels();

  function startRaffle() {
    let min = parseInt(document.getElementById("minNum").value, 10);
    let max = parseInt(document.getElementById("maxNum").value, 10);

    if (isNaN(min) || isNaN(max) || min >= max) {
      alert("Please enter a valid range (min < max).");
      return;
    }

    numbers = [];
    for (let n = min; n <= max; n++) numbers.push(n);

    drawn = [];
    spinning = false;
    drawnBox.textContent = "";
    initReels();
    stopSound();
  }

  function drawNumber() {
    if (spinning) return;
    if (numbers.length === 0) {
      alert("No more numbers to draw.");
      return;
    }

    spinning = true;
    let index = Math.floor(Math.random() * numbers.length);
    let number = numbers.splice(index, 1)[0];
    drawn.push(number);

    // Always show 3 digits (zero-padded)
    let numStr = number.toString().padStart(3, "0");
    let digits = numStr.split("");

    playSoundLoop();

    // STEP 1: start all reels spinning with a long animation
    reels.forEach((reel, i) => {
      let spinDistance = (SPIN_LOOPS * 10) * ITEM_HEIGHT;

      reel.style.transition = "none";
      reel.style.transform = "translateY(0)";

      setTimeout(function () {
        reel.style.transition = "transform " + SPIN_DURATION + "s linear";
        reel.style.transform = "translateY(-" + spinDistance + "px)";
      }, 50);
    });

    // STEP 2: stop reels one by one
    reels.forEach((reel, i) => {
      let finalDigit = parseInt(digits[i], 10);

      setTimeout(function () {
        // cancel current spin and snap smoothly
        reel.style.transition = "transform " + SNAP_DURATION + "s ease-out";
        reel.style.transform = "translateY(-" + (finalDigit * ITEM_HEIGHT) + "px)";

        playDing();

        if (i === reels.length - 1) {
          spinning = false;
          drawnBox.textContent = "Drawn Numbers: " + drawn.join(", ");
          stopSound();
        }
      }, 2000 + (i * STOP_DELAY * 1000)); 
      // first stop at 2s, then stagger
    });
  }

  function resetRaffle() {
    numbers = [];
    drawn = [];
    spinning = false;
    drawnBox.textContent = "";
    initReels();
    stopSound();
  }

  function playSoundLoop() {
    try {
      spinSound.loop = true;
      spinSound.currentTime = 0;
      spinSound.play();
    } catch (e) {}
  }

  function stopSound() {
    try {
      spinSound.loop = false;
      spinSound.pause();
      spinSound.currentTime = 0;
    } catch (e) {}
  }

  function playDing() {
    try {
      dingSound.currentTime = 0;
      dingSound.play();
    } catch (e) {}
  }
})();
