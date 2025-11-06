export function formatHeatmap(data) {
  const result = {}
  data.forEach((item) => (result[parseInt(item.value)] = item.total))
  return result
}

export function formatMonthlyHeatmap(data) {
  const result = {}
  data.forEach((item) => (result[parseInt(item.value) - 1] = item.total))
  return result
}
