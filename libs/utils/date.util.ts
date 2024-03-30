export function convertYyyymmddToDate(dateString: string): Date {
  const [year, month, day] = dateString
    .split('-')
    .map((num) => parseInt(num, 10));
  const dateUTC = new Date(Date.UTC(year, month - 1, day));
  return dateUTC;
}
