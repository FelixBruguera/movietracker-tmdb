export function chunkInserts(queries, chunkSize) {
  const chunks = []
  for (let i = 0; i <= queries.length; i += chunkSize) {
    chunks.push(queries.slice(i, i + chunkSize))
  }
  return chunks
}
