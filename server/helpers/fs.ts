import fs from 'fs/promises'

export const createDirectory = async (path) => {
  return fs
    .mkdir(path)
    .then(() => true)
    .catch(() => false)
}

export const isDirectory = async (path) => {
  const stats = await fs.stat(path).catch(() => undefined)
  return stats && stats.isDirectory()
}

export const isFile = async (path) => {
  const stats = await fs.stat(path).catch(() => null)
  return stats && stats.isFile()
}

export const isExists = async (path) => {
  const stats = await fs.stat(path).catch(() => null)
  return !!stats
}

export const unlink = (path) => {
  return fs
    .unlink(path)
    .then(() => true)
    .catch(() => false)
}
