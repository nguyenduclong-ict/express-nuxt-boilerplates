export function extendsObject<
  T extends {},
  U extends { [x: string]: (this: T) => unknown },
  V extends { [x: string]: (this: T & U) => unknown },
  X extends { [x: string]: (this: T & U & V) => unknown },
  Y extends { [x: string]: (this: T & U & X) => unknown }
>(source: T, u?: U, v?: V, x?: X, y?: Y) {
  return Object.assign(source, u, v, x, y)
}
