import { cache } from 'react';

export const serverContext = <T>(defaultValue: T): [() => T, (v: T) => void] => {
  const getRef = cache(() => ({ current: defaultValue }));

  const getValue = (): T => {
    if (typeof getRef().current === 'object' && getRef().current !== null && !Array.isArray(getRef().current)) {
      const target = getRef().current as unknown as object;

      // Return a proxied object for objects to handle missing properties
      return new Proxy(target, {
        get(target, property) {
          if (property in target) {
            return target[property as keyof typeof target];
          } else {
            return `{{${property.toString()}}}`; // Handle missing properties
          }
        },
      }) as unknown as T;
    } else {
      // Return the value directly for non-object types
      return getRef().current;
    }
  };

  const setValue = (value: T) => {
    getRef().current = value;
  };

  return [getValue, setValue];
};
