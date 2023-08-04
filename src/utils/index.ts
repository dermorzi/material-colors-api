export function renameProperties<T extends object>(
  name: string,
  replace: string,
  obj: T
): T {
  const renamed: { [key: string]: unknown } = {};

  for (const key of Object.keys(obj)) {
    if (key.includes(name)) {
      renamed[key.replace(name, replace)] = obj[key as keyof T];
      continue;
    }

    const capitalizedName = name
      .split("")
      .map((c, i) => (i === 0 ? c.toUpperCase() : c))
      .join("");

    if (key.includes(capitalizedName)) {
      const capitalizedReplace = replace
        .split("")
        .map((c, i) => (i === 0 ? c.toUpperCase() : c))
        .join("");
      renamed[key.replace(capitalizedName, capitalizedReplace)] =
        obj[key as keyof T];
      continue;
    }

    renamed[key] = obj[key as keyof T];
  }

  return renamed as T;
}

export function capitilize(str: string): string {
  return str.split('')
    .map((c, i, a) => (i === 0 || a[i - 1] === ' ' ? c.toUpperCase() : c))
    .join('');
}