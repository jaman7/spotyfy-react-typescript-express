import { useEffect, useState } from 'react';

export const getCookie = (name: string): string => {
  let cookieValue = '';
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1)) as string;
        break;
      }
    }
  }
  return cookieValue;
};

export const setCookie = (name: string, value: string, options = {}): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}${Object.keys(options).reduce((acc, key) => {
    return acc + `;${key.replace(/([A-Z])/g, $1 => '-' + $1.toLowerCase())}=${options[key]}`;
  }, '')}`;
};

export const uniqBy = (arr: any[], predicate: any): any[] => {
  if (!Array.isArray(arr)) {
    return [];
  }
  const cb = typeof predicate === 'function' ? predicate : o => o[predicate];
  const pickedObjects = arr
    .filter(item => item)
    .reduce((map, item) => {
      const key = cb(item);
      if (!key) {
        return map;
      }
      return map.has(key) ? map : map.set(key, item);
    }, new Map())
    .values();
  return [...pickedObjects];
};

export function toCamelCase(text: string): string {
  const tmpText = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return tmpText.substring(0, 1).toLowerCase() + tmpText.substring(1);
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
