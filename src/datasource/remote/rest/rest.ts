import { fetchRetry } from "~/datasource/remote/helper";

const baseUrl = process.env.REACT_APP_QUIZ_PLAYER_URL;

let _token = "";

export function setRestToken(newToken: string): void {
  _token = newToken;
}

export const rest = {
  post: (endpoint: string, params: Object, header?: Record<string, any>): Promise<any> => {
    const options = {
      method: "POST",
      body: JSON.stringify({ ...params, token: _token }),
      headers: {
        "Content-Type": "application/json",
        ...header,
      },
    };

    return fetchRetry(baseUrl + endpoint, options)
      .then((r) => r.json())
      .then((resp) => JSON.parse(resp));
  },

  get: (endpoint: string, params: Object, header?: Record<string, any>) => {
    return fetchRetry(`${baseUrl + endpoint}`, {
      method: "GET",
      headers: {
        ...header,
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());
  },
};
