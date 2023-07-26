export function useCount() {
  const count = useState('count', () => Math.round(Math.random() * 20))

  function inc() {
    count.value += 1
  }
  function dec() {
    count.value -= 1
  }
  function halfDivide() {
    count.value /= 2
  }
  function double() {
    count.value *= 2
  }

  return {
    count,
    inc,
    dec,
    halfDivide,
    double,
  }
}
