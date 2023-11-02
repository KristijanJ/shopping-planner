// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends any[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timer: number = 0;

  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
