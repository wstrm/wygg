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
    } else {
      // Functions and objects are simply ignored.
      switch (typeof exp) {
        case "function":
        case "object":
          exp = "";
          break;
      }
    }

    result += str;
    result += exp;
  });

  result += strings[strings.length - 1];
  return result;
};
