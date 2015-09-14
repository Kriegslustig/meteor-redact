Redact = Redact || {}

Redact.getUnixTime = function RedactGetUnixTime () {
  return Math.round((new Date).getTime() / 1000)
}
