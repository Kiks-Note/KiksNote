import Countdown from "react-countdown";
import { useState, useEffect } from "react";

function Timer() {
  let minutes = 15;
  let seconds = 0;
  let generated = false;

  let countDownDate = new Date(new Date().getTime() + 15 * 60000).getTime();

  useEffect(() => {
    if (!generated) {
      var x = setInterval(function () {
        var now = new Date().getTime();

        var distance = countDownDate - now;

        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerHTML =
          minutes + "m " + seconds + "s ";

        if (distance < 0) {
          clearInterval(x);
          document.getElementById("timer").innerHTML = "Compteur terminé !";
          document.getElementsByClassName("DivQr")[0].style.display = "none";
        }
      }, 1000);
      generated = true;
    }
  }, []);
  return <span id="timer">{minutes + "m " + seconds + "s "}</span>;
}
export default Timer;
