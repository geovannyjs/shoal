const pure = <T>(base: T = <T>{}):T => Object.assign(Object.create(null), base)

export {
  pure
}
