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

    document.getElementById("startBtn").addEventListener("click", startRaffle, false);
    document.getElementById("drawBtn").addEventListener("click", drawNumber, false);
    document.getElementById("resetBtn").addEventListener("click", resetRaffle, false);

    function startRaffle() {
      var min = parseInt(document.getElementById("minNum").value, 10);
      var max = parseInt(document.getElementById("maxNum").value, 10);

      if (isNaN(min) || isNaN(max) || min >= max) {
        alert("Please enter a valid range (min < max).");
        return;
      }

      numbers = [];
      for (var n = min; n <= max; n++) numbers.push(n);

      drawn = [];
      spinning = false;

      for (var i = 0; i < reels.length; i++) {
        var r = reels[i];
        r.style.transition = "none";
        r.style.transform = "translateY(0)";
        r.innerHTML = '<div class="reel-item">X</div>';
      }
      drawnBox.textContent = "";
      try { spinSound.pause(); spinSound.currentTime = 0; } catch (e) {}
    }

    function drawNumber() {
      if (spinning) return;

      if (numbers.length === 0) {
        for (var i = 0; i < reels.length; i++) {
          reels[i].innerHTML = '<div class="reel-item">All!</div>';
        }
        return;
      }

      spinning = true;

      // Pick a number
      var index = Math.floor(Math.random() * numbers.length);
      var chosen = numbers.splice(index, 1)[0];
      drawn.push(chosen);

      // Build reel content (dummy items + final chosen)
      for (var rIndex = 0; rIndex < reels.length; rIndex++) {
        var reel = reels[rIndex];
        reel.style.transition = "none";
        reel.style.transform = "translateY(0)";
        reel.innerHTML = "";

        var frag = document.createDocumentFragment();

        for (var k = 0; k < 10; k++) {
          var num = Math.floor(Math.random() * 90);
          var div = document.createElement("div");
          div.className = "reel-item";
          div.textContent = num;
          frag.appendChild(div);
        }

        var resultDiv = document.createElement("div");
        resultDiv.className = "reel-item";
        resultDiv.textContent = chosen;
        frag.appendChild(resultDiv);

        reel.appendChild(frag);
      }

      // Start sound while spinning
      try { spinSound.currentTime = 0; spinSound.play(); } catch (e) {}

      // Animate reels with slight stagger
      for (var j = 0; j < reels.length; j++) {
        (function (reel, i) {
          var delay = i * 500; // 0ms, 500ms, 1000ms
          setTimeout(function () {
            var itemCount = reel.children.length;
            var finalOffset = -((itemCount - 1) * 360);
            reel.style.transition = "transform 4110ms cubic-bezier(.17,.67,.83,.67)";
            reel.style.transform = "translateY(" + finalOffset + "px)";

            if (i === reels.length - 1) {
              // Only attach to the last reel to end the spin
              var onEnd = function (ev) {
                if (ev.propertyName !== "transform") return;
                reel.removeEventListener("transitionend", onEnd);
                spinning = false;
                try { spinSound.pause(); } catch (e) {}
                drawnBox.textContent = "Drawn: " + drawn.join(", ");
              };
              reel.addEventListener("transitionend", onEnd, false);
            }
          }, delay);
        })(reels[j], j);
      }
    }

    function resetRaffle() {
      numbers = [];
      drawn = [];
      spinning = false;

      for (var i = 0; i < reels.length; i++) {
        var r = reels[i];
        r.style.transition = "none";
        r.style.transform = "translateY(0)";
        r.innerHTML = '<div class="reel-item">X</div>';
      }
      drawnBox.textContent = "";
      try { spinSound.pause(); spinSound.currentTime = 0; } catch (e) {}
    }
  })();