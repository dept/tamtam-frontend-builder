const batchTasks = async (tasks, limit) => {
  let results = []

  for (let start = 0; start < tasks.length; start += limit) {
    const end = start + limit > tasks.length ? tasks.length : start + limit

    const slicedResults = await Promise.all(tasks.slice(start, end).map(task => task()))

    results = [...results, ...slicedResults]
  }

  return results
}

module.exports = batchTasks
