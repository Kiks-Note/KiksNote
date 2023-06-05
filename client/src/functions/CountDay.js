function countDays(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // Nombre de millisecondes dans une journée

  // Convertir les dates en objets de type Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculer la différence en jours
  const diffInDays = Math.round(Math.abs((start - end) / oneDay));

  return diffInDays;
}
export default countDays;