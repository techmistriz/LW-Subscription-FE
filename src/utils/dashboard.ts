export const getActivationLabel = (activationDate: string | Date) => {
  const targetDate =
    activationDate instanceof Date ? activationDate : new Date(activationDate);

  const now = new Date();

  if (targetDate <= now) {
    return "Active";
  }

  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      0,
    );
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return `Activates in ${parts.join(", ")}`;
};
