// Refreshable, asynchronous timer that counts down from the given number of milliseconds before using the given callback function

const Timer = (callback, time) => {
  let timer;

  const restartTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(callback, time);
  };

  return restartTimer;
};

export default Timer;
