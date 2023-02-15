import bcrypt from 'bcrypt'

let salt = bcrypt.genSaltSync()

export const hashPassword = (password: string) => bcrypt.hash(password, salt)

export const comparePassword = (password: string, encrypted: string) => {
  return bcrypt.compare(password, encrypted)
}
