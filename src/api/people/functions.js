export function filterByDepartment(department, data) {
  switch (department) {
    case "All":
      return [...data.cast, ...data.crew]
    case "Acting":
      return data.cast
    default:
      return data.crew.filter((movie) => movie.department === department)
  }
}

export function sortBy(by, scope, data) {
  const isTv = scope === "tv_credits"
  const filteredData = isTv
    ? data.filter((credit) => credit.first_credit_air_date != "")
    : data.filter((credit) => credit.release_date != "")
  switch (by) {
    case "Best rated":
      return filteredData.sort((a, b) => b.vote_average - a.vote_average)
    case "Most votes":
      return filteredData.sort((a, b) => b.vote_count - a.vote_count)
    default:
      return filteredData.sort((a, b) =>
        isTv
          ? new Date(b.first_credit_air_date) -
            new Date(a.first_credit_air_date)
          : new Date(b.release_date) - new Date(a.release_date),
      )
  }
}

export function paginate(page, itemsPerPage, data) {
  return data.slice(page * itemsPerPage - itemsPerPage, page * itemsPerPage)
}
