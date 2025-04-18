export function formatUserFriendlyCount(count) {
  if (count < 1000) {
    // Display the count as is for numbers less than 1000
    return count.toString();
  } else if (count < 1000000) {
    // Format numbers in thousands (e.g., 1.2k)
    const formattedCount = (count / 1000).toFixed(1);
    return `${formattedCount}k`;
  } else if (count < 1000000000) {
    // Format numbers in millions (e.g., 1.2M)
    const formattedCount = (count / 1000000).toFixed(1);
    return `${formattedCount}M`;
  } else {
    // Format numbers in billions or higher (e.g., 1.2B)
    const formattedCount = (count / 1000000000).toFixed(1);
    return `${formattedCount}B`;
  }
}