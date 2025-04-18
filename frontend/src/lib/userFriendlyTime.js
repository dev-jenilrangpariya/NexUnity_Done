export function formatUserFriendlyTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = date.toLocaleDateString(undefined, options);

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const timeDifference = now - date;

  if (timeDifference < 60000) { // Less than a minute
    return 'Just now';
  } else if (timeDifference < 3600000) { // Less than an hour
    const minutesAgo = Math.floor(timeDifference / 60000);
    return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < 86400000) { // Less than a day
    const hoursAgo = Math.floor(timeDifference / 3600000);
    return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < 604800000) { // Less than a week
    const daysAgo = Math.floor(timeDifference / 86400000);
    return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < 2592000000) { // Less than a month
    const weeksAgo = Math.floor(timeDifference / 604800000);
    return `${weeksAgo} ${weeksAgo === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < 31536000000) { // Less than a year
    const monthsAgo = Math.floor(timeDifference / 2592000000);
    return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
  } else {
    return `on ${dateStr} at ${timeStr}`;
  }
}

