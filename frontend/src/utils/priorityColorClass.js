const priorityColorClass = (priority) => {
  switch (priority) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    default:
      return "gray";
  }
};

export default priorityColorClass;
