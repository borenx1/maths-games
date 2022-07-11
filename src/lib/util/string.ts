const secondFormatter = Intl.NumberFormat(undefined, {
  style: 'unit',
  unit: 'second',
  unitDisplay: 'long',
});
const minuteFormatter = Intl.NumberFormat(undefined, {
  style: 'unit',
  unit: 'minute',
  unitDisplay: 'long',
});

/**
 * Formats a time interval to a readable string showing the seconds.
 * @param timeSeconds The time interval in seconds.
 * @returns The formatted string: x second(s).
 */
export function formatTimeSecond(timeSeconds: number): string {
  return secondFormatter.format(timeSeconds);
}

/**
 * Formats a time interval to a readable string showing the seconds and minutes.
 * @param timeSeconds The time interval in seconds.
 * @returns The formatted string: x minute(s) y second(s).
 */
export function formatTimeMinuteSecond(timeSeconds: number, alwaysShowMinutes = false): string {
  const secondsString = formatTimeSecond(timeSeconds % 60);
  if (!alwaysShowMinutes && timeSeconds < 60) {
    return secondsString;
  }
  const minutes = Math.floor(timeSeconds / 60);
  const minutesString = minuteFormatter.format(minutes);
  return `${minutesString} ${secondsString}`;
}
