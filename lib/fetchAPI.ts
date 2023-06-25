// Disabled because we know better
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import fetch from "isomorphic-unfetch";
import { parse as parseContentType } from "content-type";
import redirectTo from "./redirectTo";

const host =
  // when browser, use the port currently in use
  // NOTE: this will still break server-side calls.
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_CUSTOM_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      "http://localhost:3000"
    : "";

const API_URL = `${host}/api`;

const isServer = typeof window === "undefined";
const agents = new Map();

class FetchError extends Error {
  public constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, FetchError);
  }

  // eslint-disable-next-line
  [key: string]: any;
}

async function performFetch(path: string, opts: any = {}) {
  // accept path to be a full url or a relative path
  const url = path[0] === "/" ? API_URL + path : path;
  let agent;

  if (isServer) {
    const { parse } = require("url");
    const { protocol } = parse(url);
    if (protocol) {
      agent = getAgent(protocol);
    }
  }

  let res;
  let data;
  let err: any;

  try {
    res = await fetch(url, { ...opts, agent });
    if (opts.throwOnHTTPError && (res.status < 200 || res.status >= 300)) {
      const { type } = parseContentType(
        res.headers.get("Content-Type") || "text/plain"
      );
      if (type === "application/json") {
        data = await res.json();

        // Handle unauthenticated requests
        if (res.status === 401) {
          if (opts.redirectToLogin) {
            return redirectTo("/api/auth/login");
          }
          data.error = {
            code: "not_authorized",
            message: "Not authorized",
          };
        }

        if (data.code && data.message) {
          data.error = data;
        }

        err = new FetchError(
          data.error
            ? data.error.message || data.error.code
            : `Unexpected Error (${opts.method} ${url})`
        );

        err.res = res;
        err.status = res.status;
        err.code = data.error.code;
        err.message = data.error.message;
        err.extra = data.extra;
      } else {
        // handle it below as network error
        let text = "";
        try {
          text = await res.text();
        } catch (berr) {
          console.error(berr);
        }
        const cerr = new FetchError(
          `Unexpected response content-type (${
            opts.method || "GET"
          } ${url}): ${type}(${res.status}) ${text}`
        );
        cerr.res = res;
        cerr.status = res.status;

        throw cerr;
      }
    } else if (res.status === 204) {
      // Since 204 means no content we return null
      data = null;
    } else if ((res.headers.get("Content-Type") || "").startsWith("text/")) {
      data = await res.text();
    } else {
      data = await res.json();
    }
  } catch (e) {
    err = e;
  }

  if (!err) {
    return data;
  }

  // this is never called as err.status doesn't seem to be set 🤔
  if (err.status < 500) {
    throw err;
  }
  err.stack = `${err.stack ? err.stack : ""} ### Fetched URL: ${url}`;
  if (opts.body) {
    err.stack = `${
      err.stack ? err.stack : ""
    } ### Request Body: ${JSON.stringify(opts.body)}`;
  }

  if (opts.throwOnHTTPError) {
    throw err;
  }
}

const getAgent = (protocol: string) => {
  if (!agents.has(protocol)) {
    const http = require("http");
    const https = require("https");
    const mod = protocol === "https:" ? https : http;
    const opts = {
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 100,
    };
    const agent = new mod.Agent(opts);
    agents.set(protocol, agent);
  }

  return agents.get(protocol);
};

export default function fetchAPI(
  url: string,
  opts: any = {
    throwOnHTTPError: true,
  }
) {
  // Set the accept header to JSON if not set
  opts.headers = opts.headers || {};
  opts.headers["Accept"] = opts.headers["Accept"] || "application/json";
  opts.headers["Content-Type"] =
    opts.headers["Content-Type"] || "application/json";

  if (isPlainObject(opts.body)) {
    opts.body = JSON.stringify(opts.body);
  }

  return performFetch(url, {
    throwOnHTTPError: true,
    ...opts,
  });
}

// roughly adapted from
// https://stackoverflow.com/a/5878101
function isPlainObject(obj: any) {
  if (typeof obj === "object" && obj !== null) {
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
  }
  return false;
}
