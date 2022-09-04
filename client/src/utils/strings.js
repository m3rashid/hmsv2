export const toSentenceCase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const showGender = (gender) => {
  return gender === "m" ? "Male" : gender === "f" ? "Female" : "Others";
};
