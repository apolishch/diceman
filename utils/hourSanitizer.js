const hourSanitizer = (hour) => {
  if (hour === '00') {
    return '24'
  }
  return hour
}

module.exports = {
  hourSanitizer: hourSanitizer
}
