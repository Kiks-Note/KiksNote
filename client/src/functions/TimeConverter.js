function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp._seconds * 1000);
  return a;
}

export default timeConverter;
