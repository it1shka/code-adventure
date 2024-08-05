export const clamp = (min: number, max: number, value: number) => {
  let output = value
  output = Math.min(output, max)
  output = Math.max(output, min)
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
