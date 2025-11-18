const formattedDate = (dueDate, t) => {
  if (!dueDate) return t("tasks.no-due-date");

  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  // GELECEK ZAMAN İFADELERİ
  if (diffDays === 0) return t("tasks.today");
  if (diffDays === 1) return t("tasks.tomorrow");
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} ${t("tasks.days")}`;
  if (diffDays >= 7 && diffDays < 30)
    return `In ${Math.ceil(diffDays / 7)} ${t("tasks.weeks")}`;
  if (diffDays >= 30 && diffDays < 365)
    return `In ${Math.ceil(diffDays / 30)} ${t("tasks.months")}`;
  if (diffDays >= 365)
    return `In ${Math.ceil(diffDays / 365)} ${t("tasks.years")}`;

  // GEÇMİŞ ZAMAN İFADELERİ (Düzeltilen Kısım)
  if (diffDays === -1) return t("tasks.yesterday");

  const absDiffDays = Math.abs(diffDays);

  if (diffDays < -1 && diffDays > -7)
    // -2 ile -6 arası
    return `${absDiffDays} ${t("tasks.days")} ${t("tasks.ago")}`;

  if (diffDays <= -7 && diffDays > -30)
    // -7 ile -29 arası
    return `${Math.ceil(absDiffDays / 7)} ${t("tasks.weeks")} ${t(
      "tasks.ago"
    )}`;

  if (diffDays <= -30 && diffDays > -365)
    // -30 ile -364 arası
    return `${Math.ceil(absDiffDays / 30)} ${t("tasks.months")} ${t(
      "tasks.ago"
    )}`;

  return `${Math.ceil(absDiffDays / 365)} ${t("tasks.years")} ${t(
    "tasks.ago"
  )}`;
};

export default formattedDate;
