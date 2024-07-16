export const camelToSentenceCase = (value) => {
  return value.split("_").join(" ");
};

export const currentDataInISOFormat = () => {
  const currentDate = new Date();
  return new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};
