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
  switch (by) {
    case "Best rated":
      return data.sort((a, b) => b.vote_average - a.vote_average)
    case "Most votes":
      return data.sort((a, b) => b.vote_count - a.vote_count)
    default:
      return data.sort((a, b) =>
        scope === "tv_credits"
          ? new Date(b.first_credit_air_date) -
            new Date(a.first_credit_air_date)
          : new Date(b.release_date) - new Date(a.release_date),
      )
  }
}

export function paginate(page, itemsPerPage, data) {
  return data.slice(page * itemsPerPage - itemsPerPage, page * itemsPerPage)
}
