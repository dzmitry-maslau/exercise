const data = require("./test_data.json");

const filterData = (data, hour, value, key = "MasterExecution") => {
  // collecting data from the previous hours
  const previousHours = data.filter(
    (elem) => new Date(elem.timestamp).getUTCHours() < hour && elem.key === key
  );

  // checking the last value of the previous hours
  const lastValueOfPreviosHour = previousHours[previousHours.length - 1].value;

  const result = data
    .filter(
      (elem) =>
        new Date(elem.timestamp).getUTCHours() === hour && elem.key === key
    )
    .reduce((accum, current, idx, array) => {
      if (idx === 0 && lastValueOfPreviosHour === value) {
        // 1st if - checking first value in the beginning of the hour
        const currentTimestampDate = new Date(current.timestamp);
        const beginningOfHour = Date.UTC(
          currentTimestampDate.getFullYear(),
          currentTimestampDate.getMonth(),
          currentTimestampDate.getDate(),
          hour,
          0,
          0
        );
        return accum + (currentTimestampDate - beginningOfHour);
      } else if (
        // 2nd if - checking when value is changing
        current.value === value &&
        array[idx + 1] &&
        array[idx + 1].value !== value
      ) {
        return (
          accum +
          (new Date(array[idx + 1].timestamp) - new Date(current.timestamp))
        );
      } else if (idx === array.length - 1 && current.value === value) {
        // 3rd if - checking last value in the end of the hour
        const currentTimestampDate = new Date(current.timestamp);
        const endOfHour = Date.UTC(
          currentTimestampDate.getFullYear(),
          currentTimestampDate.getMonth(),
          currentTimestampDate.getDate(),
          hour + 1,
          0,
          0
        );
        return accum + (endOfHour - currentTimestampDate);
      } else {
        return accum;
      }
    }, 0);
  return `Machine was ${value} ${result / 1000} seconds`;
};

console.log(filterData(data, 15, "READY"));
