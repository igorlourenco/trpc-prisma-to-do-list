// returns the current or a given date  in the format YYYY-MM-DD
export const getDate = (givenDate = new Date()): string => {
  const offset = givenDate.getTimezoneOffset();
  givenDate = new Date(givenDate.getTime() - offset * 60 * 1000);
  return givenDate.toISOString().split("T")[0];
};

export const getNewStatus = (status: string): string => {
  switch (status) {
    case "TO_DO":
      return "DOING";
    case "DOING":
      return "DONE";
    case "DONE":
      return "TO_DO";
    default:
      return "TO_DO";
  }
};
