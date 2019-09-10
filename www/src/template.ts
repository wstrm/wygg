export const html = (strings: string[], ...expressions: any[]): string => {
  let result = "";

  expressions.forEach((exp, i) => {
    const str = strings[i];
    if (Array.isArray(exp)) {
      exp = exp.join("");
    }
    result += str;
    result += exp;
  });

  result += strings[strings.length - 1];

  return result;
};
