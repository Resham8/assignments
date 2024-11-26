function formatTime() {
  const twelve = new Date();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const timeFormatter = new Intl.DateTimeFormat("en-US", options);
  console.clear();
  console.log(timeFormatter.format(twelve));

  // setTimeout(formatTime, 1000);
}

setInterval(formatTime, 1000);