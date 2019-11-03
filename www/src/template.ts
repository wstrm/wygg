export const html = (
  strings: TemplateStringsArray,
  ...expressions: any[]
): string => {
  let result = "";

  expressions.forEach((exp, i) => {
    const str = strings[i];

    // Arrays are concatenated.
    if (Array.isArray(exp)) {
      exp = exp.join("");
    }

    // Functions are simply ignored.
    if (typeof exp === "function") {
      exp = "";
    }

    result += str;
    result += exp;
  });

  result += strings[strings.length - 1];
  return result;
};
