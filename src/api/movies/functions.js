export function filterCredits(credits) {
  const response = {}
  response.cast = credits.cast.slice(0, 20)
  response.directors = credits.crew.filter(
    (person) => person.job === "Director",
  )
  response.crew = credits.crew.slice(0, 10)
  return response
}
