export const clamp = (min: number, max: number, value: number) => {
  let output = value
  output = Math.min(output, max)
  output = Math.max(output, min)
  return output
}
