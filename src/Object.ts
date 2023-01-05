const pure = (base?: object):object => base ? Object.assign(Object.create(null), base) : Object.create(null)

export {
  pure
}
