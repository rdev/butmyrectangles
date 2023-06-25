import Router from "next/router";

interface RedirectOptions {
  as?: string;
  res?: any;
  status?: number;
  message?: string;
}

export default function redirectTo(
  destination: string,
  { as, res, status, message }: RedirectOptions = {},
  replace = false
) {
  if (!destination) {
    return;
  }
  if (res) {
    res.statusCode = status || 302;
    res.setHeader("location", as || destination);
    res.end();
    return;
  }
  if (destination.match(/^https?:\/\//)) {
    // @ts-expect-error stfu
    return (window.location = destination);
  }
  if (destination[0] === "/" && destination[1] !== "/") {
    const query = {} as any;
    if (message) {
      query.message = message;
    }

    return Router[replace ? "replace" : "push"](
      {
        pathname: destination,
        query,
      },
      as
    );
  }
  // @ts-expect-error stfu
  window.location = `${window.location.protocol}//${window.location.host}${destination}`;
  return;
}
