export const clamp = (min: number, max: number, value: number) => {
  let output = value
  output = Math.min(output, max)
  output = Math.max(output, min)
  return output
}

export const repeat = <T>(item: T, times: number) => {
  const output = new Array(times)
  for (let i = 0; i < times; i++) {
    output[i] = item
  }
  return output
}

export const repeatArray = <T>(array: T[], times: number) => {
  const output = []
  for (let i = 0; i < times; i++) {
    output.push(...array)
  }
  return output
}

export const errorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return JSON.stringify(error)
}

export const all = <T>(array: T[], check: (elem: T) => boolean) => {
  for (const elem of array) {
    if (!check(elem)) {
      return false
    }
  }
  return true
}

export const sleep = (time: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}
