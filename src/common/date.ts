export const today = () => new Date().toISOString().slice(0, 10);
export const monthRange = (date = today()) => {
  const [year, month] = date.slice(0, 7).split("-").map(Number);
  return { start: `${year}-${String(month).padStart(2, "0")}-01`, end: new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10), label: `${String(month).padStart(2, "0")}/${year}` };
};
