const contentType = "Content-Type";
const jsonMime = "application/json";

// APIError is used as an helper to create a Error with a code property.
//
// This class should _not_ be used outside of this service. TypeScript has no
// standard way of narrowing errors with the `cause` clause, i.e. no type-safety
// inside the `cause` clause.
//
// Solution: Just check if the `code` property exists using standard JavaScript,
// like:
//    if ('code' in error && error.code == 404) {
//      doSomething(error.code);
//    }
class APIError extends Error {
  code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code || 0;
  }
}

export function encodeURL(...url: string): string {
  let u = "";

  if (url.length > 1) {
    u = "/" + url.join("/");
  } else {
    u = url[0];
  }

  return encodeURI(u);
}

export class Network {
  private static extract(response: Response): string {
    let result = null;

    if (response.headers.get(contentType) === jsonMime) {
      result = response.json();
    } else {
      result = response.text(); // Unparsable data, use raw data instead.
    }

    if (response.ok) {
      return result;
    }

    throw new APIError(response.statusText, response.status);
  }

  public static async request<T>(
    method: string,
    url: string | Array<string>,
    data?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<T> {
    let headers = {};
    let body: string | undefined = undefined;

    if (data) {
      headers = {
        contentType: jsonMime
      };
      body = JSON.stringify(data);
    }

    const response = await fetch(
      Array.isArray(url) ? encodeURL(...url) : encodeURL(url),
      {
        method: method,
        mode: "no-cors",
        headers: headers,
        body: body
      }
    );

    return Network.extract(response);
  }
}
