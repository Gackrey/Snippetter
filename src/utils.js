export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

export function setHeading(heading) {
  return heading[0].toUpperCase() + heading.substring(1) + " code snippet";
}
