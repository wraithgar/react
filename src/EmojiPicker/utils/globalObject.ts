// eslint-disable-next-line import/no-mutable-exports
let globalObject

try {
  globalObject = window
} catch (e) {
  globalObject = {}
}

export default globalObject
