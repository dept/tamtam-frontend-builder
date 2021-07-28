const replaceTags = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

module.exports = replaceTags
