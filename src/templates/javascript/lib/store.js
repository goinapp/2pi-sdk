const data  = {}
const store = {
  get(key) {
    return data[key]
  },

  set(key, value) {
    data[key] = value
  }
}

module.exports = store
