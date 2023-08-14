// throttle: If you keep typing for 1 second, the newCallback will only execute 4 times if specified delay is 250ms
// debounce: If you keep typing for 1 second, the newCallback will 1 time only i.e  after specified delay is 250ms from the moment you stopped typing

export default function throttle(callback: (arg: any) => void, executeOnceWithin: number) {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  const handleCallback = (arg: any) => {
    callback(arg);
    if (typeof timerId === "number") clearTimeout(timerId);
    timerId = undefined; // setting timerId to falsy in order to track timer that timer with this timerId is now no longer active
  };

  return function newCallback(arg?: any) {
    if (timerId) return;
    timerId = setTimeout(() => handleCallback(arg), executeOnceWithin);
  };
}
