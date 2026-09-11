export const getSafeDateForPicker = (originalDate: Date) => {
  const safeDate = new Date(originalDate);
  safeDate.setHours(12, 0, 0, 0);
  return safeDate;
};