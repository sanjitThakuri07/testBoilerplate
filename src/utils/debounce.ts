// throttle: If you keep typing for 1 second, the newCallback will only execute 4 times if specified delay is 250ms
// debounce: If you keep typing for 1 second, the newCallback will 1 time only i.e  after specified delay is 250ms from the moment you stopped typing
export default function debounce(callback: (arg: any) => void, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  // whenever newly returned callback is called, it clears previous timeout and sets new timeout with same callback and dalay.
  return function newCallback(arg?: any) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    timerId = setTimeout(() => callback(arg), delay);
  };
}
