import { useState, useEffect } from "react";

function Timer() {
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    let countDownDate = new Date(new Date().getTime() + minutes * 60000).getTime();
    let intervalId;
    if (!generated) {
      intervalId = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }, 1000);
      setGenerated(true);
    }
    if (minutes === 0 && seconds === 0) {
      clearInterval(intervalId);
      document.getElementById("timer").innerHTML = "Compteur terminé !";
      document.getElementsByClassName("DivQr")[0].style.display = "none";
    }
    return () => clearInterval(intervalId);
  }, [generated, minutes, seconds]);

  return <span id="timer">{minutes + "m " + seconds + "s "}</span>;
}

export default Timer;
