import { D as DEV } from "./vendor.js";
import * as devalue from "devalue";
import { Buffer } from "buffer";
import { parse, serialize } from "cookie";
import * as set_cookie_parser from "set-cookie-parser";
import { nonNullish, isNullish } from "@dfinity/utils";
import "dompurify";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
let base = "";
let assets = base;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
function set_assets(path) {
  assets = initial.assets = path;
}
const SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
const ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
const PAGE_METHODS = ["GET", "POST", "HEAD"];
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str, i) => {
    const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i });
    }
  });
  parts.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  );
}
class HttpError {
  /**
   * @param {number} status
   * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
   */
  constructor(status, body2) {
    this.status = status;
    if (typeof body2 === "string") {
      this.body = { message: body2 };
    } else if (body2) {
      this.body = body2;
    } else {
      this.body = { message: `Error: ${status}` };
    }
  }
  toString() {
    return JSON.stringify(this.body);
  }
}
class Redirect {
  /**
   * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
   * @param {string} location
   */
  constructor(status, location) {
    this.status = status;
    this.location = location;
  }
}
class SvelteKitError extends Error {
  /**
   * @param {number} status
   * @param {string} text
   * @param {string} message
   */
  constructor(status, text2, message) {
    super(message);
    this.status = status;
    this.text = text2;
  }
}
class ActionFailure {
  /**
   * @param {number} status
   * @param {T} data
   */
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}
function json(data, init2) {
  const body2 = JSON.stringify(data);
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    headers2.set("content-length", encoder$3.encode(body2).byteLength.toString());
  }
  if (!headers2.has("content-type")) {
    headers2.set("content-type", "application/json");
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
const encoder$3 = new TextEncoder();
function text(body2, init2) {
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    const encoded = encoder$3.encode(body2);
    headers2.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers: headers2
    });
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error) {
  return (
    /** @type {import('../runtime/control.js').Redirect | HttpError | SvelteKitError | Error} */
    error
  );
}
function get_status(error) {
  return error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500;
}
function get_message(error) {
  return error instanceof SvelteKitError ? error.text : "Internal Error";
}
let public_env = {};
let safe_public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
function set_safe_public_env(environment) {
  safe_public_env = environment;
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod || "HEAD" in mod)
    allowed.push("HEAD");
  return allowed;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, options2, error) {
  error = error instanceof HttpError ? error : coalesce_to_error(error);
  const status = get_status(error);
  const body2 = await handle_error_and_jsonify(event, options2, error);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body2, {
      status
    });
  }
  return static_error_page(options2, status, body2.message);
}
async function handle_error_and_jsonify(event, options2, error) {
  if (error instanceof HttpError) {
    return error.body;
  }
  const status = get_status(error);
  const message = get_message(error);
  return await options2.hooks.handleError({ error, event, status, message }) ?? { message };
}
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
function clarify_devalue_error(event, error) {
  if (error.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error.message} (data${error.path})`;
  }
  if (error.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error.message;
}
function stringify_uses(node) {
  const uses = [];
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.push(`"dependencies":${JSON.stringify(Array.from(node.uses.dependencies))}`);
  }
  if (node.uses && node.uses.search_params.size > 0) {
    uses.push(`"search_params":${JSON.stringify(Array.from(node.uses.search_params))}`);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.push(`"params":${JSON.stringify(Array.from(node.uses.params))}`);
  }
  if (node.uses?.parent)
    uses.push('"parent":1');
  if (node.uses?.route)
    uses.push('"route":1');
  if (node.uses?.url)
    uses.push('"url":1');
  return `"uses":{${uses.join(",")}}`;
}
async function render_endpoint(event, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler = mod[method] || mod.fallback;
  if (method === "HEAD" && mod.GET && !mod.HEAD) {
    handler = mod.GET;
  }
  if (!handler) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    let response = await handler(
      /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
      event
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering) {
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      response.headers.set("x-sveltekit-prerender", String(prerender));
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      return new Response(void 0, {
        status: e.status,
        headers: { location: e.location }
      });
    }
    throw e;
  }
}
function is_endpoint_request(event) {
  const { method, headers: headers2 } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true")
    return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
const internal = new URL("sveltekit-internal://");
function resolve(base2, path) {
  if (path[0] === "/" && path[1] === "/")
    return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
const tracked_url_properties = (
  /** @type {const} */
  [
    "href",
    "pathname",
    "search",
    "toString",
    "toJSON"
  ]
);
function make_trackable(url, callback, search_params_callback) {
  const tracked = new URL(url);
  Object.defineProperty(tracked, "searchParams", {
    value: new Proxy(tracked.searchParams, {
      get(obj, key2) {
        if (key2 === "get" || key2 === "getAll" || key2 === "has") {
          return (param) => {
            search_params_callback(param);
            return obj[key2](param);
          };
        }
        callback();
        const value = Reflect.get(obj, key2);
        return typeof value === "function" ? value.bind(obj) : value;
      }
    }),
    enumerable: true,
    configurable: true
  });
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
    tracked.searchParams[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url.searchParams, opts);
    };
  }
  {
    disable_hash(tracked);
  }
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
const DATA_SUFFIX = "/__data.json";
const HTML_DATA_SUFFIX = ".html__data.json";
function has_data_suffix(pathname) {
  return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
function add_data_suffix(pathname) {
  if (pathname.endsWith(".html"))
    return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix(pathname) {
  if (pathname.endsWith(HTML_DATA_SUFFIX)) {
    return pathname.slice(0, -HTML_DATA_SUFFIX.length) + ".html";
  }
  return pathname.slice(0, -DATA_SUFFIX.length);
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, options2, server) {
  const actions = server?.actions;
  if (!actions) {
    const no_actions_error = new SvelteKitError(
      405,
      "Method Not Allowed",
      "POST method not allowed. No actions exist for this page"
    );
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id
        )
      });
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, check_incorrect_fail_use(err))
      },
      {
        status: get_status(err)
      }
    );
  }
}
function check_incorrect_fail_use(error) {
  return error instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error;
}
function action_json_redirect(redirect) {
  return action_json({
    type: "redirect",
    status: redirect.status,
    location: redirect.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, server) {
  const actions = server?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        "POST method not allowed. No actions exist for this page"
      )
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e) {
    const err = normalize_error(e);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://kit.svelte.dev/docs/form-actions#named-actions"
    );
  }
}
async function call_action(event, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new SvelteKitError(404, "Not Found", `No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new SvelteKitError(
      415,
      "Unsupported Media Type",
      `Form actions expect form-encoded data — received ${event.request.headers.get(
        "content-type"
      )}`
    );
  }
  return action(event);
}
function validate_action_return(data) {
  if (data instanceof Redirect) {
    throw new Error("Cannot `return redirect(...)` — use `redirect(...)` instead");
  }
  if (data instanceof HttpError) {
    throw new Error("Cannot `return error(...)` — use `error(...)` or `return fail(...)` instead");
  }
}
function uneval_action_response(data, route_id) {
  return try_deserialize(data, devalue.uneval, route_id);
}
function stringify_action_response(data, route_id) {
  return try_deserialize(data, devalue.stringify, route_id);
}
function try_deserialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e) {
    const error = (
      /** @type {any} */
      e
    );
    if ("path" in error) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error.message}`;
      if (error.path !== "")
        message += ` (data.${error.path})`;
      throw new Error(message);
    }
    throw error;
  }
}
const INVALIDATED_PARAM = "x-sveltekit-invalidated";
const TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function b64_encode(buffer) {
  if (globalThis.Buffer) {
    return Buffer.from(buffer).toString("base64");
  }
  const little_endian = new Uint8Array(new Uint16Array([1]).buffer)[0] > 0;
  return btoa(
    new TextDecoder(little_endian ? "utf-16le" : "utf-16be").decode(
      new Uint16Array(new Uint8Array(buffer))
    )
  );
}
async function load_server_data({ event, state, node, parent }) {
  if (!node?.server)
    return null;
  let is_tracking = true;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false,
    search_params: /* @__PURE__ */ new Set()
  };
  const url = make_trackable(
    event.url,
    () => {
      if (is_tracking) {
        uses.url = true;
      }
    },
    (param) => {
      if (is_tracking) {
        uses.search_params.add(param);
      }
    }
  );
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await node.server.load?.call(null, {
    ...event,
    fetch: (info, init2) => {
      new URL(info instanceof Request ? info.url : info, event.url);
      return event.fetch(info, init2);
    },
    /** @param {string[]} deps */
    depends: (...deps) => {
      for (const dep of deps) {
        const { href } = new URL(dep, event.url);
        uses.dependencies.add(href);
      }
    },
    params: new Proxy(event.params, {
      get: (target, key2) => {
        if (is_tracking) {
          uses.params.add(key2);
        }
        return target[
          /** @type {string} */
          key2
        ];
      }
    }),
    parent: async () => {
      if (is_tracking) {
        uses.parent = true;
      }
      return parent();
    },
    route: new Proxy(event.route, {
      get: (target, key2) => {
        if (is_tracking) {
          uses.route = true;
        }
        return target[
          /** @type {'id'} */
          key2
        ];
      }
    }),
    url,
    untrack(fn) {
      is_tracking = false;
      try {
        return fn();
      } finally {
        is_tracking = true;
      }
    }
  });
  return {
    type: "data",
    data: result ?? null,
    uses,
    slash: node.server.trailingSlash
  };
}
async function load_data({
  event,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  if (!node?.universal?.load) {
    return server_data_node?.data ?? null;
  }
  const result = await node.universal.load.call(null, {
    url: event.url,
    params: event.params,
    data: server_data_node?.data ?? null,
    route: event.route,
    fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
    setHeaders: event.setHeaders,
    depends: () => {
    },
    parent,
    untrack: (fn) => fn()
  });
  return result ?? null;
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  const universal_fetch = async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    const proxy = new Proxy(response, {
      get(response2, key2, _receiver) {
        async function push_fetched(body2, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body2,
            response: response2,
            is_b64
          });
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            if (dependency) {
              dependency.body = new Uint8Array(buffer);
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(b64_encode(buffer), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body2 = await response2.text();
          if (!body2 || typeof body2 === "string") {
            await push_fetched(body2, false);
          }
          if (dependency) {
            dependency.body = body2;
          }
          return body2;
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            return JSON.parse(await text2());
          };
        }
        return Reflect.get(response2, key2, response2);
      }
    });
    if (csr) {
      const get2 = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get2.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" — it must be included by the \`filterSerializedResponseHeaders\` option: https://kit.svelte.dev/docs/hooks#server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += decoder.decode(value);
  }
  return result;
}
function noop() {
}
function is_promise(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && typeof /** @type {any} */
  value.then === "function";
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_slots(slots) {
  const result = {};
  for (const key2 in slots) {
    result[key2] = true;
  }
  return result;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern2.test(str)) {
    const i = pattern2.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function each(items, fn) {
  items = ensure_array_like(items);
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean)
    return "";
  const assignment = `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i)
        hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i)
        hash2 = hash2 * 33 ^ buffer[--i];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
const escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
const escape_html_attr_regex = new RegExp(
  // special characters
  `[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`,
  "g"
);
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
const replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
const pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering2 = false) {
  const headers2 = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers2[key2] = value;
    }
    if (key2 === "cache-control")
      cache_control = value;
    else if (key2 === "age")
      age = value;
    else if (key2 === "vary" && value.trim() === "*")
      varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers: headers2,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url=${escape_html_attr(fetched.url)}`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering2 && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
const s = JSON.stringify;
const encoder$2 = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode(data);
  for (let i = 0; i < array2.length; i += 16) {
    const w = array2.subarray(i, i + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i2 = 0; i2 < 64; i2++) {
      if (i2 < 16) {
        tmp = w[i2];
      } else {
        a = w[i2 + 1 & 15];
        b = w[i2 + 14 & 15];
        tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
const init = new Uint32Array(8);
const key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  let prime = 2;
  for (let i = 0; i < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i < 8) {
        init[i] = frac(prime ** (1 / 2));
      }
      key[i] = frac(prime ** (1 / 3));
      i++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i = 0; i < bytes.length; i += 4) {
    const a = bytes[i + 0];
    const b = bytes[i + 1];
    const c = bytes[i + 2];
    const d = bytes[i + 3];
    bytes[i + 0] = d;
    bytes[i + 1] = c;
    bytes[i + 2] = b;
    bytes[i + 3] = a;
  }
}
function encode(str) {
  const encoded = encoder$2.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i;
  for (i = 2; i < l; i += 3) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
    result += chars[bytes[i] & 63];
  }
  if (i === l + 1) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += chars[bytes[i - 2] >> 2];
    result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
    result += chars[(bytes[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
const array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
const quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
const crypto_pattern = /^(nonce|sha\d\d\d)-/;
class BaseProvider {
  /** @type {boolean} */
  #use_hashes;
  /** @type {boolean} */
  #script_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {import('types').CspDirectives} */
  #directives;
  /** @type {import('types').Csp.Source[]} */
  #script_src;
  /** @type {import('types').Csp.Source[]} */
  #script_src_elem;
  /** @type {import('types').Csp.Source[]} */
  #style_src;
  /** @type {import('types').Csp.Source[]} */
  #style_src_attr;
  /** @type {import('types').Csp.Source[]} */
  #style_src_elem;
  /** @type {string} */
  #nonce;
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    this.#use_hashes = use_hashes;
    this.#directives = directives;
    const d = this.#directives;
    this.#script_src = [];
    this.#script_src_elem = [];
    this.#style_src = [];
    this.#style_src_attr = [];
    this.#style_src_elem = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const script_src_elem = d["script-src-elem"];
    const effective_style_src = d["style-src"] || d["default-src"];
    const style_src_attr = d["style-src-attr"];
    const style_src_elem = d["style-src-elem"];
    this.#script_needs_csp = !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0 || !!script_src_elem && script_src_elem.filter((value) => value !== "unsafe-inline").length > 0;
    this.#style_needs_csp = !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0 || !!style_src_attr && style_src_attr.filter((value) => value !== "unsafe-inline").length > 0 || !!style_src_elem && style_src_elem.filter((value) => value !== "unsafe-inline").length > 0;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (this.#script_needs_csp) {
      const d = this.#directives;
      if (this.#use_hashes) {
        const hash2 = sha256(content);
        this.#script_src.push(`sha256-${hash2}`);
        if (d["script-src-elem"]?.length) {
          this.#script_src_elem.push(`sha256-${hash2}`);
        }
      } else {
        if (this.#script_src.length === 0) {
          this.#script_src.push(`nonce-${this.#nonce}`);
        }
        if (d["script-src-elem"]?.length) {
          this.#script_src_elem.push(`nonce-${this.#nonce}`);
        }
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (this.#style_needs_csp) {
      const empty_comment_hash = "9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d = this.#directives;
      if (this.#use_hashes) {
        const hash2 = sha256(content);
        this.#style_src.push(`sha256-${hash2}`);
        if (d["style-src-attr"]?.length) {
          this.#style_src_attr.push(`sha256-${hash2}`);
        }
        if (d["style-src-elem"]?.length) {
          if (hash2 !== empty_comment_hash && !d["style-src-elem"].includes(`sha256-${empty_comment_hash}`)) {
            this.#style_src_elem.push(`sha256-${empty_comment_hash}`);
          }
          this.#style_src_elem.push(`sha256-${hash2}`);
        }
      } else {
        if (this.#style_src.length === 0 && !d["style-src"]?.includes("unsafe-inline")) {
          this.#style_src.push(`nonce-${this.#nonce}`);
        }
        if (d["style-src-attr"]?.length) {
          this.#style_src_attr.push(`nonce-${this.#nonce}`);
        }
        if (d["style-src-elem"]?.length) {
          if (!d["style-src-elem"].includes(`sha256-${empty_comment_hash}`)) {
            this.#style_src_elem.push(`sha256-${empty_comment_hash}`);
          }
          this.#style_src_elem.push(`nonce-${this.#nonce}`);
        }
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#style_src_attr.length > 0) {
      directives["style-src-attr"] = [
        ...directives["style-src-attr"] || [],
        ...this.#style_src_attr
      ];
    }
    if (this.#style_src_elem.length > 0) {
      directives["style-src-elem"] = [
        ...directives["style-src-elem"] || [],
        ...this.#style_src_elem
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    if (this.#script_src_elem.length > 0) {
      directives["script-src-elem"] = [
        ...directives["script-src-elem"] || [],
        ...this.#script_src_elem
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
}
class CspProvider extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content=${escape_html_attr(content)}>`;
  }
}
class CspReportOnlyProvider extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
}
class Csp {
  /** @readonly */
  nonce = generate_nonce();
  /** @type {CspProvider} */
  csp_provider;
  /** @type {CspReportOnlyProvider} */
  report_only_provider;
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
}
function defer() {
  let fulfil;
  let reject;
  const promise = new Promise((f, r) => {
    fulfil = f;
    reject = r;
  });
  return { promise, fulfil, reject };
}
function create_async_iterator() {
  const deferred = [defer()];
  return {
    iterator: {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            const next = await deferred[0].promise;
            if (!next.done)
              deferred.shift();
            return next;
          }
        };
      }
    },
    push: (value) => {
      deferred[deferred.length - 1].fulfil({
        value,
        done: false
      });
      deferred.push(defer());
    },
    done: () => {
      deferred[deferred.length - 1].fulfil({ done: true });
    }
  };
}
const updated = {
  ...readable(false),
  check: () => false
};
const encoder$1 = new TextEncoder();
async function render_response({
  branch,
  fetched,
  options: options2,
  manifest,
  state,
  page_config,
  status,
  error = null,
  event,
  resolve_opts,
  action_result
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest._;
  const modulepreloads = new Set(client.imports);
  const stylesheets = new Set(client.stylesheets);
  const fonts = new Set(client.fonts);
  const link_header_preloads = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  if (!state.prerendering?.fallback) {
    const segments = event.url.pathname.slice(base.length).split("/").slice(2);
    base$1 = segments.map(() => "..").join("/") || ".";
    base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
    if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
      assets$1 = base$1;
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(branch.map(({ node }) => node.component())),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch.length; i += 1) {
      data2 = { ...data2, ...branch[i].data };
      props[`data_${i}`] = data2;
    }
    props.page = {
      error,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value,
      state: {}
    };
    override({ base: base$1, assets: assets$1 });
    {
      try {
        rendered = options2.root.render(props);
      } finally {
        reset();
      }
    }
    for (const { node } of branch) {
      for (const url of node.imports)
        modulepreloads.add(url);
      for (const url of node.stylesheets)
        stylesheets.add(url);
      for (const url of node.fonts)
        fonts.add(url);
      if (node.inline_styles) {
        Object.entries(await node.inline_styles()).forEach(([k, v]) => inline_styles.set(k, v));
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let head = "";
  let body2 = rendered.html;
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  if (inline_styles.size > 0) {
    const content = Array.from(inline_styles.values()).join("\n");
    const attributes = [];
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(content);
    head += `
	<style${attributes.join("")}>${content}</style>`;
  }
  for (const dep of stylesheets) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        const preload_atts = ['rel="preload"', 'as="style"'];
        link_header_preloads.add(`<${encodeURI(path)}>; ${preload_atts.join(";")}; nopush`);
      }
    }
    head += `
		<link href="${path}" ${attributes.join(" ")}>`;
  }
  for (const dep of fonts) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      const attributes = [
        'rel="preload"',
        'as="font"',
        `type="font/${ext}"`,
        `href="${path}"`,
        "crossorigin"
      ];
      head += `
		<link ${attributes.join(" ")}>`;
    }
  }
  const global = `__sveltekit_${options2.version_hash}`;
  const { data, chunks } = get_data(
    event,
    options2,
    branch.map((b) => b.server_data),
    csp,
    global
  );
  if (page_config.ssr && page_config.csr) {
    body2 += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    if (client.uses_env_dynamic_public && state.prerendering) {
      modulepreloads.add(`${options2.app_dir}/env.js`);
    }
    const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
      (path) => resolve_opts.preload({ type: "js", path })
    );
    for (const path of included_modulepreloads) {
      link_header_preloads.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
      if (options2.preload_strategy !== "modulepreload") {
        head += `
		<link rel="preload" as="script" crossorigin="anonymous" href="${path}">`;
      } else if (state.prerendering) {
        head += `
		<link rel="modulepreload" href="${path}">`;
      }
    }
    const blocks = [];
    const load_env_eagerly = client.uses_env_dynamic_public && state.prerendering;
    const properties = [`base: ${base_expression}`];
    if (assets) {
      properties.push(`assets: ${s(assets)}`);
    }
    if (client.uses_env_dynamic_public) {
      properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
    }
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      properties.push(`resolve: ({ id, data, error }) => {
							const { fulfil, reject } = deferred.get(id);
							deferred.delete(id);

							if (error) reject(error);
							else fulfil(data);
						}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["app", "element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      blocks.push(`const data = ${data};`);
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id
        );
      }
      if (error) {
        serialized.error = devalue.uneval(error);
      }
      const hydrate = [
        `node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
        "data",
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate.push(`status: ${status}`);
      }
      if (options2.embedded) {
        hydrate.push(`params: ${devalue.uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate.join(`,
${indent}	`)}
${indent}}`);
    }
    if (load_env_eagerly) {
      blocks.push(`import(${s(`${base$1}/${options2.app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						Promise.all([
							import(${s(prefixed(client.start))}),
							import(${s(prefixed(client.app))})
						]).then(([kit, app]) => {
							kit.start(${args.join(", ")});
						});
					});`);
    } else {
      blocks.push(`Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						kit.start(${args.join(", ")});
					});`);
    }
    if (options2.service_worker) {
      const opts = "";
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body2 += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers2 = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (state.prerendering.cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="${state.prerendering.cache}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers2.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers2.set("content-security-policy-report-only", report_only_header);
    }
    if (link_header_preloads.size) {
      headers2.set("link", Array.from(link_header_preloads).join(", "));
    }
  }
  head += rendered.head;
  const html = options2.templates.app({
    head,
    body: body2,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: safe_public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers2.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers: headers2
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder$1.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          controller.enqueue(encoder$1.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: headers2
    }
  );
}
function get_data(event, options2, nodes, csp, global) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  function replacer2(thing) {
    if (typeof thing?.then === "function") {
      const id = promise_id++;
      count += 1;
      thing.then(
        /** @param {any} data */
        (data) => ({ data })
      ).catch(
        /** @param {any} error */
        async (error) => ({
          error: await handle_error_and_jsonify(event, options2, error)
        })
      ).then(
        /**
         * @param {{data: any; error: any}} result
         */
        async ({ data, error }) => {
          count -= 1;
          let str;
          try {
            str = devalue.uneval({ id, data, error }, replacer2);
          } catch {
            error = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = devalue.uneval({ id, data, error }, replacer2);
          }
          push(
            `<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${global}.resolve(${str})<\/script>
`
          );
          if (count === 0)
            done();
        }
      );
      return `${global}.defer(${id})`;
    }
  }
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      return `{"type":"data","data":${devalue.uneval(node.data, replacer2)},${stringify_uses(node)}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `[${strings.join(",")}]`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
function get_option(nodes, option) {
  return nodes.reduce(
    (value, node) => {
      return (
        /** @type {Value} TypeScript's too dumb to understand this */
        node?.universal?.[option] ?? node?.server?.[option] ?? value
      );
    },
    /** @type {Value | undefined} */
    void 0
  );
}
async function respond_with_error({
  event,
  options: options2,
  manifest,
  state,
  status,
  error,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error.message
    );
  }
  const fetched = [];
  try {
    const branch = [];
    const default_layout = await manifest._.nodes[0]();
    const ssr = get_option([default_layout], "ssr") ?? true;
    const csr = get_option([default_layout], "csr") ?? true;
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        state,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({})
      });
      const server_data = await server_data_promise;
      const data = await load_data({
        event,
        fetched,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest,
      state,
      page_config: {
        ssr,
        csr
      },
      status,
      error: await handle_error_and_jsonify(event, options2, error),
      branch,
      fetched,
      event,
      resolve_opts
    });
  } catch (e) {
    if (e instanceof Redirect) {
      return redirect_response(e.status, e.location);
    }
    return static_error_page(
      options2,
      get_status(e),
      (await handle_error_and_jsonify(event, options2, e)).message
    );
  }
}
function once(fn) {
  let done = false;
  let result;
  return () => {
    if (done)
      return result;
    done = true;
    return result = fn();
  };
}
const encoder = new TextEncoder();
async function render_data(event, route, options2, manifest, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n, i) => {
      return once(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n == void 0 ? n : await manifest._.nodes[n]();
          return load_server_data({
            event: new_event,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j = 0; j < i; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            }
          });
        } catch (e) {
          aborted = true;
          throw e;
        }
      });
    });
    const promises = functions.map(async (fn, i) => {
      if (!invalidated[i]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i) => p.catch(async (error) => {
          if (error instanceof Redirect) {
            throw error;
          }
          length = Math.min(length, i + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, options2, error),
              status: error instanceof HttpError || error instanceof SvelteKitError ? error.status : void 0
            }
          );
        })
      )
    );
    const { data, chunks } = get_data_json(event, options2, nodes);
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e) {
    const error = normalize_error(e);
    if (error instanceof Redirect) {
      return redirect_json_response(error);
    } else {
      return json_response(await handle_error_and_jsonify(event, options2, error), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect) {
  return json_response({
    type: "redirect",
    location: redirect.location
  });
}
function get_data_json(event, options2, nodes) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  const reducers = {
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        count += 1;
        let key2 = "data";
        thing.catch(
          /** @param {any} e */
          async (e) => {
            key2 = "error";
            return handle_error_and_jsonify(
              event,
              options2,
              /** @type {any} */
              e
            );
          }
        ).then(
          /** @param {any} value */
          async (value) => {
            let str;
            try {
              str = devalue.stringify(value, reducers);
            } catch {
              const error = await handle_error_and_jsonify(
                event,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              key2 = "error";
              str = devalue.stringify(error, reducers);
            }
            count -= 1;
            push(`{"type":"chunk","id":${id},"${key2}":${str}}
`);
            if (count === 0)
              done();
          }
        );
        return id;
      }
    }
  };
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      if (node.type === "error" || node.type === "skip") {
        return JSON.stringify(node);
      }
      return `{"type":"data","data":${devalue.stringify(node.data, reducers)},${stringify_uses(
        node
      )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e
    ));
  }
}
function load_page_nodes(page2, manifest) {
  return Promise.all([
    // we use == here rather than === because [undefined] serializes as "[null]"
    ...page2.layouts.map((n) => n == void 0 ? n : manifest._.nodes[n]()),
    manifest._.nodes[page2.leaf]()
  ]);
}
const MAX_DEPTH = 10;
async function render_page(event, page2, options2, manifest, state, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest._.nodes[page2.leaf]();
    return handle_action_json_request(event, options2, node?.server);
  }
  try {
    const nodes = await load_page_nodes(page2, manifest);
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.at(-1)
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      action_result = await handle_action_request(event, leaf_node.server);
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        status = get_status(action_result.error);
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender_data = nodes.some((node) => node?.server?.load);
    const data_pathname = add_data_suffix(event.url.pathname);
    const should_prerender = get_option(nodes, "prerender") ?? false;
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const fetched = [];
    if (get_option(nodes, "ssr") === false && !(state.prerendering && should_prerender_data)) {
      if (DEV && action_result && !event.request.headers.has("x-sveltekit-action"))
        ;
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr: get_option(nodes, "csr") ?? true
        },
        status,
        error: null,
        event,
        options: options2,
        manifest,
        state,
        resolve_opts
      });
    }
    const branch = [];
    let load_error = null;
    const server_promises = nodes.map((node, i) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          return await load_server_data({
            event,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                const parent = await server_promises[j];
                if (parent)
                  Object.assign(data, parent.data);
              }
              return data;
            }
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    const csr = get_option(nodes, "csr") ?? true;
    const load_promises = nodes.map((node, i) => {
      if (load_error)
        throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i],
            state,
            csr
          });
        } catch (e) {
          load_error = /** @type {Error} */
          e;
          throw load_error;
        }
      });
    });
    for (const p of server_promises)
      p.catch(() => {
      });
    for (const p of load_promises)
      p.catch(() => {
      });
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch.push({ node, server_data, data });
        } catch (e) {
          const err = normalize_error(e);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body2 = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body2),
                body: body2
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = get_status(err);
          const error = await handle_error_and_jsonify(event, options2, err);
          while (i--) {
            if (page2.errors[i]) {
              const index = (
                /** @type {number} */
                page2.errors[i]
              );
              const node2 = await manifest._.nodes[index]();
              let j = i;
              while (!branch[j])
                j -= 1;
              return await render_response({
                event,
                options: options2,
                manifest,
                state,
                resolve_opts,
                page_config: { ssr: true, csr: true },
                status: status2,
                error,
                branch: compact(branch.slice(0, j + 1)).concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched
              });
            }
          }
          return static_error_page(options2, status2, error.message);
        }
      } else {
        branch.push(null);
      }
    }
    if (state.prerendering && should_prerender_data) {
      let { data, chunks } = get_data_json(
        event,
        options2,
        branch.map((node) => node?.server_data)
      );
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    const ssr = get_option(nodes, "ssr") ?? true;
    return await render_response({
      event,
      options: options2,
      manifest,
      state,
      resolve_opts,
      page_config: {
        csr: get_option(nodes, "csr") ?? true,
        ssr
      },
      status,
      error: null,
      branch: ssr === false ? [] : compact(branch),
      action_result,
      fetched
    });
  } catch (e) {
    return await respond_with_error({
      event,
      options: options2,
      manifest,
      state,
      status: 500,
      error: e,
      resolve_opts
    });
  }
}
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    let value = values[i - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i - buffered, i + 1).filter((s2) => s2).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest)
        result[param.name] = "";
      continue;
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i + 1];
      const next_value = values[i + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered)
    return;
  return result;
}
function validate_options(options2) {
  if (options2?.path === void 0) {
    throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
  }
}
function get_cookies(request, url, trailing_slash) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = parse(header, { decode: (value) => value });
  const normalized_url = normalize_path(url.pathname, trailing_slash);
  const new_cookies = {};
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} opts
     */
    get(name, opts) {
      const c = new_cookies[name];
      if (c && domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path)) {
        return c.value;
      }
      const decoder = opts?.decode || decodeURIComponent;
      const req_cookies = parse(header, { decode: decoder });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} opts
     */
    getAll(opts) {
      const decoder = opts?.decode || decodeURIComponent;
      const cookies2 = parse(header, { decode: decoder });
      for (const c of Object.values(new_cookies)) {
        if (domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path)) {
          cookies2[c.name] = c.value;
        }
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('./page/types.js').Cookie['options']} options
     */
    set(name, value, options2) {
      validate_options(options2);
      set_internal(name, value, { ...defaults, ...options2 });
    },
    /**
     * @param {string} name
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    delete(name, options2) {
      validate_options(options2);
      cookies.set(name, "", { ...options2, maxAge: 0 });
    },
    /**
     * @param {string} name
     * @param {string} value
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    serialize(name, value, options2) {
      validate_options(options2);
      let path = options2.path;
      if (!options2.domain || options2.domain === url.hostname) {
        path = resolve(normalized_url, path);
      }
      return serialize(name, value, { ...defaults, ...options2, path });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const key2 in new_cookies) {
      const cookie = new_cookies[key2];
      if (!domain_matches(destination.hostname, cookie.options.domain))
        continue;
      if (!path_matches(destination.pathname, cookie.options.path))
        continue;
      const encoder2 = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder2(cookie.value);
    }
    if (header2) {
      const parsed = parse(header2, { decode: (value) => value });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  function set_internal(name, value, options2) {
    let path = options2.path;
    if (!options2.domain || options2.domain === url.hostname) {
      path = resolve(normalized_url, path);
    }
    new_cookies[name] = { name, value, options: { ...options2, path } };
  }
  return { cookies, new_cookies, get_cookie_header, set_internal };
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers2, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers2.append("set-cookie", serialize(name, value, options2));
    if (options2.path.endsWith(".html")) {
      const path = add_data_suffix(options2.path);
      headers2.append("set-cookie", serialize(name, value, { ...options2, path }));
    }
  }
}
let read_implementation = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
function set_manifest(_) {
}
function create_fetch({ event, options: options2, manifest, state, get_cookie_header, set_internal }) {
  const server_fetch = async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        if (url.origin !== event.url.origin) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie)
              request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix = assets || base;
        const decoded = decodeURIComponent(url.pathname);
        const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest.assets.has(filename) || filename in manifest._.server_assets;
        const is_asset_html = manifest.assets.has(filename_html) || filename_html in manifest._.server_assets;
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else if (read_implementation) {
            const length = manifest._.server_assets[file];
            const type = manifest.mimeTypes[file.slice(file.lastIndexOf("."))];
            return new Response(read_implementation(file), {
              headers: {
                "Content-Length": "" + length,
                "Content-Type": type
              }
            });
          }
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await respond(request, options2, manifest, {
          ...state,
          depth: state.depth + 1
        });
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of set_cookie_parser.splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = set_cookie_parser.parseString(str, {
              decodeValues: false
            });
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name, value, {
              path,
              encode: (value2) => value2,
              .../** @type {import('cookie').CookieSerializeOptions} */
              options3
            });
          }
        }
        return response;
      }
    });
  };
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
function validator(expected) {
  function validate(module, file) {
    if (!module)
      return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2))
        continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
const valid_layout_exports = /* @__PURE__ */ new Set([
  "load",
  "prerender",
  "csr",
  "ssr",
  "trailingSlash",
  "config"
]);
const valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
const valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
const valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
const valid_server_exports = /* @__PURE__ */ new Set([
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "fallback",
  "prerender",
  "trailingSlash",
  "config",
  "entries"
]);
const validate_layout_exports = validator(valid_layout_exports);
const validate_page_exports = validator(valid_page_exports);
const validate_layout_server_exports = validator(valid_layout_server_exports);
const validate_page_server_exports = validator(valid_page_server_exports);
const validate_server_exports = validator(valid_server_exports);
let body;
let etag;
let headers;
function get_public_env(request) {
  body ??= `export const env=${JSON.stringify(public_env)}`;
  etag ??= `W/${Date.now()}`;
  headers ??= new Headers({
    "content-type": "application/javascript; charset=utf-8",
    etag
  });
  if (request.headers.get("if-none-match") === etag) {
    return new Response(void 0, { status: 304, headers });
  }
  return new Response(body, { headers });
}
function get_page_config(nodes) {
  let current = {};
  for (const node of nodes) {
    if (!node?.universal?.config && !node?.server?.config)
      continue;
    current = {
      ...current,
      ...node?.universal?.config,
      ...node?.server?.config
    };
  }
  return Object.keys(current).length ? current : void 0;
}
const default_transform = ({ html }) => html;
const default_filter = () => false;
const default_preload = ({ type }) => type === "js" || type === "css";
const page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
const allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
async function respond(request, options2, manifest, state) {
  const url = new URL(request.url);
  if (options2.csrf_check_origin) {
    const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") !== url.origin;
    if (forbidden) {
      const csrf_error = new HttpError(
        403,
        `Cross-site ${request.method} form submissions are forbidden`
      );
      if (request.headers.get("accept") === "application/json") {
        return json(csrf_error.body, { status: csrf_error.status });
      }
      return text(csrf_error.body.message, { status: csrf_error.status });
    }
  }
  let rerouted_path;
  try {
    rerouted_path = options2.hooks.reroute({ url: new URL(url) }) ?? url.pathname;
  } catch {
    return text("Internal Server Error", {
      status: 500
    });
  }
  let decoded;
  try {
    decoded = decode_pathname(rerouted_path);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  let route = null;
  let params = {};
  if (base && !state.prerendering?.fallback) {
    if (!decoded.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    decoded = decoded.slice(base.length) || "/";
  }
  if (decoded === `/${options2.app_dir}/env.js`) {
    return get_public_env(request);
  }
  if (decoded.startsWith(`/${options2.app_dir}`)) {
    const headers22 = new Headers();
    headers22.set("cache-control", "public, max-age=0, must-revalidate");
    return text("Not found", { status: 404, headers: headers22 });
  }
  const is_data_request = has_data_suffix(decoded);
  let invalidated_data_nodes;
  if (is_data_request) {
    decoded = strip_data_suffix(decoded) || "/";
    url.pathname = strip_data_suffix(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest._.matchers();
    for (const candidate of manifest._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.params, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  let trailing_slash = void 0;
  const headers2 = {};
  let cookies_to_add = {};
  const event = {
    // @ts-expect-error `cookies` and `fetch` need to be created after the `event` itself
    cookies: null,
    // @ts-expect-error
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-static"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params,
    platform: state.platform,
    request,
    route: { id: route?.id ?? null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers2) {
          throw new Error(`"${key2}" header is already set`);
        } else {
          headers2[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0
  };
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  try {
    if (route) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (route.page) {
        const nodes = await load_page_nodes(route.page, manifest);
        if (DEV)
          ;
        trailing_slash = get_option(nodes, "trailingSlash");
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash;
        if (DEV)
          ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash ?? "never");
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
      if (state.before_handle || state.emulator?.platform) {
        let config = {};
        let prerender = false;
        if (route.endpoint) {
          const node = await route.endpoint();
          config = node.config ?? config;
          prerender = node.prerender ?? prerender;
        } else if (route.page) {
          const nodes = await load_page_nodes(route.page, manifest);
          config = get_page_config(nodes) ?? config;
          prerender = get_option(nodes, "prerender") ?? false;
        }
        if (state.before_handle) {
          state.before_handle(event, config, prerender);
        }
        if (state.emulator?.platform) {
          event.platform = await state.emulator.platform({ config, prerender });
        }
      }
    } else if (state.emulator?.platform) {
      event.platform = await state.emulator.platform({
        config: {},
        prerender: !!state.prerendering?.fallback
      });
    }
    const { cookies, new_cookies, get_cookie_header, set_internal } = get_cookies(
      request,
      url,
      trailing_slash ?? "never"
    );
    cookies_to_add = new_cookies;
    event.cookies = cookies;
    event.fetch = create_fetch({
      event,
      options: options2,
      manifest,
      state,
      get_cookie_header,
      set_internal
    });
    if (state.prerendering && !state.prerendering.fallback)
      disable_search(url);
    const response = await options2.hooks.handle({
      event,
      resolve: (event2, opts) => resolve2(event2, opts).then((response2) => {
        for (const key2 in headers2) {
          const value = headers2[key2];
          response2.headers.set(
            key2,
            /** @type {string} */
            value
          );
        }
        add_cookies_to_headers(response2.headers, Object.values(cookies_to_add));
        if (state.prerendering && event2.route.id !== null) {
          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
        }
        return response2;
      })
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag2 = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag2) {
        const headers22 = new Headers({ etag: etag2 });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value)
            headers22.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers22
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e) {
    if (e instanceof Redirect) {
      const response = is_data_request ? redirect_json_response(e) : route?.page && is_action_json_request(event) ? action_json_redirect(e) : redirect_response(e.status, e.location);
      add_cookies_to_headers(response.headers, Object.values(cookies_to_add));
      return response;
    }
    return await handle_fatal_error(event, options2, e);
  }
  async function resolve2(event2, opts) {
    try {
      if (opts) {
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          options: options2,
          manifest,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts
        });
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response;
        if (is_data_request) {
          response = await render_data(
            event2,
            route,
            options2,
            manifest,
            state,
            invalidated_data_nodes,
            trailing_slash ?? "never"
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response = await render_endpoint(event2, await route.endpoint(), state);
        } else if (route.page) {
          if (page_methods.has(method)) {
            response = await render_page(event2, route.page, options2, manifest, state, resolve_opts);
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(response.headers)
            });
            response.headers.append("Vary", "Accept");
          }
        }
        return response;
      }
      if (state.error && event2.isSubRequest) {
        return await fetch(request, {
          headers: {
            "x-sveltekit-error": "true"
          }
        });
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        return await respond_with_error({
          event: event2,
          options: options2,
          manifest,
          state,
          status: 404,
          error: new SvelteKitError(404, "Not Found", `Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      return await fetch(request);
    } catch (e) {
      return await handle_fatal_error(event2, options2, e);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function afterUpdate() {
}
let prerendering = false;
function set_building() {
}
function set_prerendering() {
  prerendering = true;
}
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0)
    $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0)
    $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0)
    $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page2);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, form, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, form, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
const options = {
  app_dir: "_app",
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  templates: {
    app: ({ head, body: body2, assets: assets2, nonce, env }) => '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta content="width=device-width, initial-scale=1" name="viewport" />\n\n    <title>FootballGod</title>\n    <link href="https://footballgod.xyz" rel="canonical" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      name="description"\n    />\n    <meta content="FootballGod" property="og:title" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      property="og:description"\n    />\n    <meta content="website" property="og:type" />\n    <meta content="https://footballgod.xyz" property="og:url" />\n    <meta\n      content="https://footballgod.xyz/meta-share.jpg"\n      property="og:image"\n    />\n    <meta content="summary_large_image" name="twitter:card" />\n    <meta content="FootballGod" name="twitter:title" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      name="twitter:description"\n    />\n    <meta\n      content="https://footballgod.xyz/meta-share.jpg"\n      name="twitter:image"\n    />\n    <meta content="@beadle1989" name="twitter:creator" />\n\n    <link crossorigin="anonymous" href="/manifest.webmanifest" rel="manifest" />\n\n    <!-- Favicon -->\n    <link\n      rel="icon"\n      type="image/png"\n      sizes="32x32"\n      href="' + assets2 + '/favicons/favicon-32x32.png"\n    />\n    <link\n      rel="icon"\n      type="image/png"\n      sizes="16x16"\n      href="' + assets2 + '/favicons/favicon-16x16.png"\n    />\n    <link rel="shortcut icon" href="' + assets2 + '/favicons/favicon.ico" />\n\n    <!-- iOS meta tags & icons -->\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="#2CE3A6" />\n    <meta name="apple-mobile-web-app-title" content="FootballGod" />\n    <link\n      rel="apple-touch-icon"\n      href="' + assets2 + '/favicons/apple-touch-icon.png"\n    />\n    <link\n      rel="mask-icon"\n      href="' + assets2 + '/favicons/safari-pinned-tab.svg"\n      color="#2CE3A6"\n    />\n\n    <!-- MS -->\n    <meta name="msapplication-TileColor" content="#2CE3A6" />\n    <meta\n      name="msapplication-config"\n      content="' + assets2 + '/favicons/browserconfig.xml"\n    />\n\n    <meta content="#2CE3A6" name="theme-color" />\n    ' + head + '\n\n    <style>\n      html,\n      body {\n        height: 100%;\n        margin: 0;\n      }\n\n      @font-face {\n        font-display: swap;\n        font-family: "Poppins";\n        font-style: normal;\n        font-weight: 400;\n        src: url("' + assets2 + '/poppins-regular-webfont.woff2")\n          format("woff2");\n      }\n\n      @font-face {\n        font-display: swap;\n        font-family: "Manrope";\n        font-style: normal;\n        font-weight: 400;\n        src: url("' + assets2 + '/Manrope-Regular.woff2") format("woff2");\n      }\n      body {\n        font-family: "Poppins", sans-serif !important;\n        color: white !important;\n        background-color: #1a1a1d;\n        height: 100vh;\n        margin: 0;\n      }\n\n      #app-spinner {\n        --spinner-size: 30px;\n\n        width: var(--spinner-size);\n        height: var(--spinner-size);\n\n        animation: app-spinner-linear-rotate 2000ms linear infinite;\n\n        position: absolute;\n        top: calc(50% - (var(--spinner-size) / 2));\n        left: calc(50% - (var(--spinner-size) / 2));\n\n        --radius: 45px;\n        --circumference: calc(3.14159265359 * var(--radius) * 2);\n\n        --start: calc((1 - 0.05) * var(--circumference));\n        --end: calc((1 - 0.8) * var(--circumference));\n      }\n\n      #app-spinner circle {\n        stroke-dasharray: var(--circumference);\n        stroke-width: 10%;\n        transform-origin: 50% 50% 0;\n\n        transition-property: stroke;\n\n        animation-name: app-spinner-stroke-rotate-100;\n        animation-duration: 4000ms;\n        animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\n        animation-iteration-count: infinite;\n\n        fill: transparent;\n        stroke: currentColor;\n\n        transition: stroke-dashoffset 225ms linear;\n      }\n\n      @keyframes app-spinner-linear-rotate {\n        0% {\n          transform: rotate(0deg);\n        }\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n\n      @keyframes app-spinner-stroke-rotate-100 {\n        0% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(0);\n        }\n        12.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(0);\n        }\n        12.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(72.5deg);\n        }\n        25% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(72.5deg);\n        }\n\n        25.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(270deg);\n        }\n        37.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(270deg);\n        }\n        37.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(161.5deg);\n        }\n        50% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(161.5deg);\n        }\n\n        50.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(180deg);\n        }\n        62.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(180deg);\n        }\n        62.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(251.5deg);\n        }\n        75% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(251.5deg);\n        }\n\n        75.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(90deg);\n        }\n        87.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(90deg);\n        }\n        87.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(341.5deg);\n        }\n        100% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(341.5deg);\n        }\n      }\n    </style>\n  </head>\n  <body data-sveltekit-preload-data="hover">\n    <div style="display: contents">' + body2 + '</div>\n\n    <svg\n      id="app-spinner"\n      preserveAspectRatio="xMidYMid meet"\n      focusable="false"\n      aria-hidden="true"\n      data-tid="spinner"\n      viewBox="0 0 100 100"\n    >\n      <circle cx="50%" cy="50%" r="45" />\n    </svg>\n  </body>\n</html>\n',
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "16lf95m"
};
async function get_hooks() {
  return {};
}
function filter_private_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(private_prefix) && (public_prefix === "" || !k.startsWith(public_prefix))
    )
  );
}
function filter_public_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(public_prefix) && (private_prefix === "" || !k.startsWith(private_prefix))
    )
  );
}
const prerender_env_handler = {
  get({ type }, prop) {
    throw new Error(
      `Cannot read values from $env/dynamic/${type} while prerendering (attempted to read env.${prop.toString()}). Use $env/static/${type} instead`
    );
  }
};
class Server {
  /** @type {import('types').SSROptions} */
  #options;
  /** @type {import('@sveltejs/kit').SSRManifest} */
  #manifest;
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest) {
    this.#options = options;
    this.#manifest = manifest;
  }
  /**
   * @param {{
   *   env: Record<string, string>;
   *   read?: (file: string) => ReadableStream;
   * }} opts
   */
  async init({ env, read }) {
    const prefixes = {
      public_prefix: this.#options.env_public_prefix,
      private_prefix: this.#options.env_private_prefix
    };
    const private_env = filter_private_env(env, prefixes);
    const public_env2 = filter_public_env(env, prefixes);
    set_private_env(
      prerendering ? new Proxy({ type: "private" }, prerender_env_handler) : private_env
    );
    set_public_env(
      prerendering ? new Proxy({ type: "public" }, prerender_env_handler) : public_env2
    );
    set_safe_public_env(public_env2);
    if (read) {
      set_read_implementation(read);
    }
    if (!this.#options.hooks) {
      try {
        const module = await get_hooks();
        this.#options.hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ error }) => console.error(error)),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request)),
          reroute: module.reroute || (() => {
          })
        };
      } catch (error) {
        {
          throw error;
        }
      }
    }
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    return respond(request, this.#options, this.#manifest, {
      ...options2,
      error: false,
      depth: 0
    });
  }
}
const Layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
function get(key2, parse2 = JSON.parse) {
  try {
    return parse2(sessionStorage[key2]);
  } catch {
  }
}
const SNAPSHOT_KEY = "sveltekit:snapshot";
const SCROLL_KEY = "sveltekit:scroll";
get(SCROLL_KEY) ?? {};
get(SNAPSHOT_KEY) ?? {};
function goto(url, opts = {}) {
  {
    throw new Error("Cannot call goto(...) on the server");
  }
}
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});
const AUTH_MAX_TIME_TO_LIVE = BigInt(
  60 * 60 * 1e3 * 1e3 * 1e3 * 24 * 14
);
const AUTH_POPUP_WIDTH = 576;
const AUTH_POPUP_HEIGHT = 625;
const createAuthClient = () => AuthClient.create({
  idleOptions: {
    disableIdle: true,
    disableDefaultIdleCallback: true
  }
});
const popupCenter = ({
  width,
  height
}) => {
  {
    return void 0;
  }
};
let authClient;
const NNS_IC_ORG_ALTERNATIVE_ORIGIN = "https://footballgod.xyz";
const NNS_IC_APP_DERIVATION_ORIGIN = "https://43loz-3yaaa-aaaal-qbxrq-cai.icp0.io";
const isNnsAlternativeOrigin = () => {
  if (typeof window === "undefined")
    return false;
  return window.location.origin === NNS_IC_ORG_ALTERNATIVE_ORIGIN;
};
const initAuthStore = () => {
  const { subscribe: subscribe2, set, update } = writable({
    identity: void 0
  });
  return {
    subscribe: subscribe2,
    sync: async () => {
      authClient = authClient ?? await createAuthClient();
      const isAuthenticated = await authClient.isAuthenticated();
      set({
        identity: isAuthenticated ? authClient.getIdentity() : null
      });
    },
    signIn: ({ domain }) => (
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve2, reject) => {
        authClient = authClient ?? await createAuthClient();
        const identityProvider = domain;
        await authClient?.login({
          maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
          onSuccess: () => {
            update((state) => ({
              ...state,
              identity: authClient?.getIdentity()
            }));
            resolve2();
          },
          onError: reject,
          identityProvider,
          ...isNnsAlternativeOrigin() && {
            derivationOrigin: NNS_IC_APP_DERIVATION_ORIGIN
          },
          windowOpenerFeatures: popupCenter({
            width: AUTH_POPUP_WIDTH,
            height: AUTH_POPUP_HEIGHT
          })
        });
      })
    ),
    signOut: async () => {
      const client = authClient ?? await createAuthClient();
      await client.logout();
      authClient = null;
      update((state) => ({
        ...state,
        identity: null
      }));
      localStorage.removeItem("user_profile_data");
    }
  };
};
const authStore = initAuthStore();
const authSignedInStore = derived(
  authStore,
  ({ identity }) => identity !== null && identity !== void 0
);
const errorDetailToString = (err) => typeof err === "string" ? err : err instanceof Error ? err.message : "message" in err ? err.message : void 0;
const DEFAULT_ICON_SIZE = 20;
const core = {
  close: "Close",
  back: "Back",
  menu: "Open menu to access navigation options",
  collapse: "Collapse",
  expand: "Expand",
  copy: "Copy to clipboard"
};
const theme = {
  switch_theme: "Switch theme"
};
const progress = {
  completed: "Completed",
  in_progress: "In progress"
};
const en = {
  core,
  theme,
  progress
};
const i18n = readable({
  lang: "en",
  ...en
});
const css$9 = {
  code: ".backdrop.svelte-1mpql1{position:absolute;top:0;right:0;bottom:0;left:0;color:var(--backdrop-contrast);z-index:var(--backdrop-z-index);touch-action:manipulation;cursor:pointer}.backdrop.visible.svelte-1mpql1{background:var(--backdrop);-webkit-backdrop-filter:var(--backdrop-filter);backdrop-filter:var(--backdrop-filter)}.backdrop.disablePointerEvents.svelte-1mpql1{cursor:inherit;pointer-events:none}",
  map: '{"version":3,"file":"Backdrop.svelte","sources":["Backdrop.svelte"],"sourcesContent":["<script>import { fade } from \\"svelte/transition\\";\\nimport { createEventDispatcher } from \\"svelte\\";\\nimport { i18n } from \\"../stores/i18n\\";\\nimport { handleKeyPress } from \\"../utils/keyboard.utils\\";\\nexport let disablePointerEvents = false;\\nexport let invisible = false;\\nconst dispatch = createEventDispatcher();\\nconst close = () => dispatch(\\"nnsClose\\");\\nconst FADE_IN_DURATION = 75;\\nconst FADE_OUT_DURATION = 250;\\n<\/script>\\n\\n<div\\n  role=\\"button\\"\\n  tabindex=\\"-1\\"\\n  aria-label={$i18n.core.close}\\n  in:fade|global={{ duration: FADE_IN_DURATION }}\\n  out:fade|global={{ duration: FADE_OUT_DURATION }}\\n  class=\\"backdrop\\"\\n  class:visible={!invisible}\\n  on:click|stopPropagation={close}\\n  on:keypress={($event) => handleKeyPress({ $event, callback: close })}\\n  class:disablePointerEvents\\n  data-tid=\\"backdrop\\"\\n/>\\n\\n<style>.backdrop {\\n  position: absolute;\\n  top: 0;\\n  right: 0;\\n  bottom: 0;\\n  left: 0;\\n  color: var(--backdrop-contrast);\\n  z-index: var(--backdrop-z-index);\\n  touch-action: manipulation;\\n  cursor: pointer;\\n}\\n.backdrop.visible {\\n  background: var(--backdrop);\\n  -webkit-backdrop-filter: var(--backdrop-filter);\\n          backdrop-filter: var(--backdrop-filter);\\n}\\n.backdrop.disablePointerEvents {\\n  cursor: inherit;\\n  pointer-events: none;\\n}</style>\\n"],"names":[],"mappings":"AA0BO,uBAAU,CACf,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CACN,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,IAAI,mBAAmB,CAAC,CAC/B,OAAO,CAAE,IAAI,kBAAkB,CAAC,CAChC,YAAY,CAAE,YAAY,CAC1B,MAAM,CAAE,OACV,CACA,SAAS,sBAAS,CAChB,UAAU,CAAE,IAAI,UAAU,CAAC,CAC3B,uBAAuB,CAAE,IAAI,iBAAiB,CAAC,CACvC,eAAe,CAAE,IAAI,iBAAiB,CAChD,CACA,SAAS,mCAAsB,CAC7B,MAAM,CAAE,OAAO,CACf,cAAc,CAAE,IAClB"}'
};
const Backdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { disablePointerEvents = false } = $$props;
  let { invisible = false } = $$props;
  createEventDispatcher();
  if ($$props.disablePointerEvents === void 0 && $$bindings.disablePointerEvents && disablePointerEvents !== void 0)
    $$bindings.disablePointerEvents(disablePointerEvents);
  if ($$props.invisible === void 0 && $$bindings.invisible && invisible !== void 0)
    $$bindings.invisible(invisible);
  $$result.css.add(css$9);
  $$unsubscribe_i18n();
  return `<div role="button" tabindex="-1"${add_attribute("aria-label", $i18n.core.close, 0)} class="${[
    "backdrop svelte-1mpql1",
    (!invisible ? "visible" : "") + " " + (disablePointerEvents ? "disablePointerEvents" : "")
  ].join(" ").trim()}" data-tid="backdrop"></div>`;
});
const layoutBottomOffset = writable(0);
const initBusyStore = () => {
  const DEFAULT_STATE = [];
  const { subscribe: subscribe2, update, set } = writable(DEFAULT_STATE);
  return {
    subscribe: subscribe2,
    /**
     * Show the busy-screen if not visible
     */
    startBusy({ initiator: newInitiator, text: text2 }) {
      update((state) => [
        ...state.filter(({ initiator }) => newInitiator !== initiator),
        { initiator: newInitiator, text: text2 }
      ]);
    },
    /**
     * Hide the busy-screen if no other initiators are done
     */
    stopBusy(initiatorToRemove) {
      update((state) => state.filter(({ initiator }) => initiator !== initiatorToRemove));
    },
    resetForTesting() {
      set(DEFAULT_STATE);
    }
  };
};
const busyStore = initBusyStore();
const busy = derived(busyStore, ($busyStore) => $busyStore.length > 0);
const busyMessage = derived(busyStore, ($busyStore) => $busyStore.reverse().find(({ text: text2 }) => nonNullish(text2))?.text);
const css$8 = {
  code: ".medium.svelte-85668t{--spinner-size:30px}.small.svelte-85668t{--spinner-size:calc(var(--line-height-standard) * 1rem)}.tiny.svelte-85668t{--spinner-size:calc(var(--line-height-standard) * 0.5rem)}svg.svelte-85668t{width:var(--spinner-size);height:var(--spinner-size);animation:spinner-linear-rotate 2000ms linear infinite;position:absolute;top:calc(50% - var(--spinner-size) / 2);left:calc(50% - var(--spinner-size) / 2);--radius:45px;--circumference:calc(3.1415926536 * var(--radius) * 2);--start:calc((1 - 0.05) * var(--circumference));--end:calc((1 - 0.8) * var(--circumference))}svg.inline.svelte-85668t{display:inline-block;position:relative}circle.svelte-85668t{stroke-dasharray:var(--circumference);stroke-width:10%;transform-origin:50% 50% 0;transition-property:stroke;animation-name:spinner-stroke-rotate-100;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite;fill:transparent;stroke:currentColor;transition:stroke-dashoffset 225ms linear}@keyframes spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes spinner-stroke-rotate-100{0%{stroke-dashoffset:var(--start);transform:rotate(0)}12.5%{stroke-dashoffset:var(--end);transform:rotate(0)}12.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:var(--start);transform:rotate(270deg)}37.5%{stroke-dashoffset:var(--end);transform:rotate(270deg)}37.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:var(--start);transform:rotate(180deg)}62.5%{stroke-dashoffset:var(--end);transform:rotate(180deg)}62.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:var(--start);transform:rotate(90deg)}87.5%{stroke-dashoffset:var(--end);transform:rotate(90deg)}87.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(341.5deg)}}",
  map: '{"version":3,"file":"Spinner.svelte","sources":["Spinner.svelte"],"sourcesContent":["<!-- adapted source: https://github.com/angular/components/tree/master/src/material/progress-spinner -->\\n<script>export let inline = false;\\nexport let size = \\"medium\\";\\n<\/script>\\n\\n<svg\\n  class:inline\\n  class={size}\\n  preserveAspectRatio=\\"xMidYMid meet\\"\\n  focusable=\\"false\\"\\n  aria-hidden=\\"true\\"\\n  data-tid=\\"spinner\\"\\n  viewBox=\\"0 0 100 100\\"><circle cx=\\"50%\\" cy=\\"50%\\" r=\\"45\\" /></svg\\n>\\n\\n<style>.medium {\\n  --spinner-size: 30px;\\n}\\n\\n.small {\\n  --spinner-size: calc(var(--line-height-standard) * 1rem);\\n}\\n\\n.tiny {\\n  --spinner-size: calc(var(--line-height-standard) * 0.5rem);\\n}\\n\\nsvg {\\n  width: var(--spinner-size);\\n  height: var(--spinner-size);\\n  animation: spinner-linear-rotate 2000ms linear infinite;\\n  position: absolute;\\n  top: calc(50% - var(--spinner-size) / 2);\\n  left: calc(50% - var(--spinner-size) / 2);\\n  --radius: 45px;\\n  --circumference: calc(3.1415926536 * var(--radius) * 2);\\n  --start: calc((1 - 0.05) * var(--circumference));\\n  --end: calc((1 - 0.8) * var(--circumference));\\n}\\nsvg.inline {\\n  display: inline-block;\\n  position: relative;\\n}\\n\\ncircle {\\n  stroke-dasharray: var(--circumference);\\n  stroke-width: 10%;\\n  transform-origin: 50% 50% 0;\\n  transition-property: stroke;\\n  animation-name: spinner-stroke-rotate-100;\\n  animation-duration: 4000ms;\\n  animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\\n  animation-iteration-count: infinite;\\n  fill: transparent;\\n  stroke: currentColor;\\n  transition: stroke-dashoffset 225ms linear;\\n}\\n\\n/* -global- */\\n@keyframes -global-spinner-linear-rotate {\\n  0% {\\n    transform: rotate(0deg);\\n  }\\n  100% {\\n    transform: rotate(360deg);\\n  }\\n}\\n/* -global- */\\n@keyframes -global-spinner-stroke-rotate-100 {\\n  0% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotate(0);\\n  }\\n  12.5% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotate(0);\\n  }\\n  12.5001% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotateX(180deg) rotate(72.5deg);\\n  }\\n  25% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotateX(180deg) rotate(72.5deg);\\n  }\\n  25.0001% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotate(270deg);\\n  }\\n  37.5% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotate(270deg);\\n  }\\n  37.5001% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotateX(180deg) rotate(161.5deg);\\n  }\\n  50% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotateX(180deg) rotate(161.5deg);\\n  }\\n  50.0001% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotate(180deg);\\n  }\\n  62.5% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotate(180deg);\\n  }\\n  62.5001% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotateX(180deg) rotate(251.5deg);\\n  }\\n  75% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotateX(180deg) rotate(251.5deg);\\n  }\\n  75.0001% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotate(90deg);\\n  }\\n  87.5% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotate(90deg);\\n  }\\n  87.5001% {\\n    stroke-dashoffset: var(--end);\\n    transform: rotateX(180deg) rotate(341.5deg);\\n  }\\n  100% {\\n    stroke-dashoffset: var(--start);\\n    transform: rotateX(180deg) rotate(341.5deg);\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAeO,qBAAQ,CACb,cAAc,CAAE,IAClB,CAEA,oBAAO,CACL,cAAc,CAAE,wCAClB,CAEA,mBAAM,CACJ,cAAc,CAAE,0CAClB,CAEA,iBAAI,CACF,KAAK,CAAE,IAAI,cAAc,CAAC,CAC1B,MAAM,CAAE,IAAI,cAAc,CAAC,CAC3B,SAAS,CAAE,qBAAqB,CAAC,MAAM,CAAC,MAAM,CAAC,QAAQ,CACvD,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,cAAc,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACxC,IAAI,CAAE,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,cAAc,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACzC,QAAQ,CAAE,IAAI,CACd,eAAe,CAAE,sCAAsC,CACvD,OAAO,CAAE,uCAAuC,CAChD,KAAK,CAAE,sCACT,CACA,GAAG,qBAAQ,CACT,OAAO,CAAE,YAAY,CACrB,QAAQ,CAAE,QACZ,CAEA,oBAAO,CACL,gBAAgB,CAAE,IAAI,eAAe,CAAC,CACtC,YAAY,CAAE,GAAG,CACjB,gBAAgB,CAAE,GAAG,CAAC,GAAG,CAAC,CAAC,CAC3B,mBAAmB,CAAE,MAAM,CAC3B,cAAc,CAAE,yBAAyB,CACzC,kBAAkB,CAAE,MAAM,CAC1B,yBAAyB,CAAE,aAAa,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CACzD,yBAAyB,CAAE,QAAQ,CACnC,IAAI,CAAE,WAAW,CACjB,MAAM,CAAE,YAAY,CACpB,UAAU,CAAE,iBAAiB,CAAC,KAAK,CAAC,MACtC,CAGA,WAAmB,qBAAsB,CACvC,EAAG,CACD,SAAS,CAAE,OAAO,IAAI,CACxB,CACA,IAAK,CACH,SAAS,CAAE,OAAO,MAAM,CAC1B,CACF,CAEA,WAAmB,yBAA0B,CAC3C,EAAG,CACD,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,OAAO,CAAC,CACrB,CACA,KAAM,CACJ,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,OAAO,CAAC,CACrB,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,OAAO,CAC3C,CACA,GAAI,CACF,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,OAAO,CAC3C,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,OAAO,MAAM,CAC1B,CACA,KAAM,CACJ,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,OAAO,MAAM,CAC1B,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACA,GAAI,CACF,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,OAAO,MAAM,CAC1B,CACA,KAAM,CACJ,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,OAAO,MAAM,CAC1B,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACA,GAAI,CACF,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,OAAO,KAAK,CACzB,CACA,KAAM,CACJ,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,OAAO,KAAK,CACzB,CACA,QAAS,CACP,iBAAiB,CAAE,IAAI,KAAK,CAAC,CAC7B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACA,IAAK,CACH,iBAAiB,CAAE,IAAI,OAAO,CAAC,CAC/B,SAAS,CAAE,QAAQ,MAAM,CAAC,CAAC,OAAO,QAAQ,CAC5C,CACF"}'
};
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { inline = false } = $$props;
  let { size = "medium" } = $$props;
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$8);
  return `  <svg class="${[escape(null_to_empty(size), true) + " svelte-85668t", inline ? "inline" : ""].join(" ").trim()}" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true" data-tid="spinner" viewBox="0 0 100 100"><circle cx="50%" cy="50%" r="45" class="svelte-85668t"></circle></svg>`;
});
const css$7 = {
  code: "div.svelte-14plyno{z-index:calc(var(--z-index) + 1000);position:fixed;top:0;right:0;bottom:0;left:0;background:var(--backdrop);color:var(--backdrop-contrast)}.content.svelte-14plyno{display:flex;flex-direction:column;justify-content:center;align-items:center}p.svelte-14plyno{padding-bottom:var(--padding);max-width:calc(var(--section-max-width) / 2)}",
  map: '{"version":3,"file":"BusyScreen.svelte","sources":["BusyScreen.svelte"],"sourcesContent":["<script>import { fade } from \\"svelte/transition\\";\\nimport { busy, busyMessage } from \\"../stores/busy.store\\";\\nimport Spinner from \\"./Spinner.svelte\\";\\nimport { nonNullish } from \\"@dfinity/utils\\";\\n<\/script>\\n\\n<!-- Display spinner and lock UI if busyStore is not empty -->\\n{#if $busy}\\n  <div data-tid=\\"busy\\" transition:fade|global>\\n    <div class=\\"content\\">\\n      {#if nonNullish($busyMessage)}\\n        <p>{$busyMessage}</p>\\n      {/if}\\n      <span>\\n        <Spinner inline />\\n      </span>\\n    </div>\\n  </div>\\n{/if}\\n\\n<style>div {\\n  z-index: calc(var(--z-index) + 1000);\\n  position: fixed;\\n  top: 0;\\n  right: 0;\\n  bottom: 0;\\n  left: 0;\\n  background: var(--backdrop);\\n  color: var(--backdrop-contrast);\\n}\\n\\n.content {\\n  display: flex;\\n  flex-direction: column;\\n  justify-content: center;\\n  align-items: center;\\n}\\n\\np {\\n  padding-bottom: var(--padding);\\n  max-width: calc(var(--section-max-width) / 2);\\n}</style>\\n"],"names":[],"mappings":"AAoBO,kBAAI,CACT,OAAO,CAAE,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACpC,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,UAAU,CAAE,IAAI,UAAU,CAAC,CAC3B,KAAK,CAAE,IAAI,mBAAmB,CAChC,CAEA,uBAAS,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MACf,CAEA,gBAAE,CACA,cAAc,CAAE,IAAI,SAAS,CAAC,CAC9B,SAAS,CAAE,KAAK,IAAI,mBAAmB,CAAC,CAAC,CAAC,CAAC,CAAC,CAC9C"}'
};
const BusyScreen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $busy, $$unsubscribe_busy;
  let $busyMessage, $$unsubscribe_busyMessage;
  $$unsubscribe_busy = subscribe(busy, (value) => $busy = value);
  $$unsubscribe_busyMessage = subscribe(busyMessage, (value) => $busyMessage = value);
  $$result.css.add(css$7);
  $$unsubscribe_busy();
  $$unsubscribe_busyMessage();
  return ` ${$busy ? `<div data-tid="busy" class="svelte-14plyno"><div class="content svelte-14plyno">${nonNullish($busyMessage) ? `<p class="svelte-14plyno">${escape($busyMessage)}</p>` : ``} <span>${validate_component(Spinner, "Spinner").$$render($$result, { inline: true }, {}, {})}</span></div></div>` : ``}`;
});
const IconCheckCircle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `24px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `  <svg${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.25" y="1.25" width="21.5" height="21.5" rx="10.75" fill="var(--icon-check-circle-background, transparent)"></rect><path d="M7 11L11 15L17 9" stroke="var(--icon-check-circle-color, currentColor)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><rect x="1.25" y="1.25" width="21.5" height="21.5" rx="10.75" stroke="var(--icon-check-circle-background, currentColor)" stroke-width="1.5"></rect></svg>`;
});
const IconClose = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `  <svg${add_attribute("height", size, 0)}${add_attribute("width", size, 0)} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14.4194" y="4.52441" width="1.5" height="14" rx="0.75" transform="rotate(45 14.4194 4.52441)" fill="currentColor"></rect><rect x="4.5199" y="5.58496" width="1.5" height="14" rx="0.75" transform="rotate(-45 4.5199 5.58496)" fill="currentColor"></rect></svg>`;
});
const IconError = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `  <svg xmlns="http://www.w3.org/2000/svg"${add_attribute("height", size, 0)} viewBox="0 0 24 24"${add_attribute("width", size, 0)} fill="currentColor"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>`;
});
const css$6 = {
  code: "svg.svelte-1lui9gh{vertical-align:middle}",
  map: '{"version":3,"file":"IconInfo.svelte","sources":["IconInfo.svelte"],"sourcesContent":["<!-- source: DFINITY foundation -->\\n<script>import { DEFAULT_ICON_SIZE } from \\"../constants/constants\\";\\nexport let size = `${DEFAULT_ICON_SIZE}px`;\\n<\/script>\\n\\n<svg\\n  width={size}\\n  height={size}\\n  viewBox=\\"0 0 20 20\\"\\n  fill=\\"none\\"\\n  xmlns=\\"http://www.w3.org/2000/svg\\"\\n  data-tid=\\"icon-info\\"\\n>\\n  <path\\n    d=\\"M10.2222 17.5C14.3643 17.5 17.7222 14.1421 17.7222 10C17.7222 5.85786 14.3643 2.5 10.2222 2.5C6.08003 2.5 2.72217 5.85786 2.72217 10C2.72217 14.1421 6.08003 17.5 10.2222 17.5Z\\"\\n    stroke=\\"currentColor\\"\\n    stroke-width=\\"1.5\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n  />\\n  <path\\n    d=\\"M10.2222 13.3333V10\\"\\n    stroke=\\"currentColor\\"\\n    stroke-width=\\"1.5\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n  />\\n  <path\\n    d=\\"M10.2222 6.66699H10.2305\\"\\n    stroke=\\"currentColor\\"\\n    stroke-width=\\"1.5\\"\\n    stroke-linecap=\\"round\\"\\n    stroke-linejoin=\\"round\\"\\n  />\\n</svg>\\n\\n<style>svg {\\n  vertical-align: middle;\\n}</style>\\n"],"names":[],"mappings":"AAoCO,kBAAI,CACT,cAAc,CAAE,MAClB"}'
};
const IconInfo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$6);
  return `  <svg${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-tid="icon-info" class="svelte-1lui9gh"><path d="M10.2222 17.5C14.3643 17.5 17.7222 14.1421 17.7222 10C17.7222 5.85786 14.3643 2.5 10.2222 2.5C6.08003 2.5 2.72217 5.85786 2.72217 10C2.72217 14.1421 6.08003 17.5 10.2222 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.2222 13.3333V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.2222 6.66699H10.2305" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const IconWarning = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `  <svg xmlns="http://www.w3.org/2000/svg"${add_attribute("height", size, 0)} viewBox="0 0 20 20"${add_attribute("width", size, 0)} fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5324 12.6666L12.491 5.66659C11.7331 4.35394 11.354 3.69773 10.8593 3.47746C10.4278 3.28534 9.93473 3.28534 9.50322 3.47746C9.00871 3.69763 8.62985 4.35385 7.87262 5.66541L3.83048 12.6666C3.07262 13.9792 2.6938 14.6358 2.75041 15.1744C2.79978 15.6441 3.04633 16.0709 3.42847 16.3486C3.86643 16.6668 4.62382 16.6668 6.13851 16.6668H14.2243C15.739 16.6668 16.4962 16.6668 16.9342 16.3486C17.3163 16.0709 17.563 15.6441 17.6124 15.1744C17.669 14.6358 17.2903 13.9792 16.5324 12.6666ZM9.4314 13.5666C9.4314 13.1524 9.76718 12.8166 10.1814 12.8166H10.1914C10.6056 12.8166 10.9414 13.1524 10.9414 13.5666C10.9414 13.9809 10.6056 14.3166 10.1914 14.3166H10.1814C9.76718 14.3166 9.4314 13.9809 9.4314 13.5666ZM10.9314 7.73331C10.9314 7.3191 10.5956 6.98331 10.1814 6.98331C9.76718 6.98331 9.4314 7.3191 9.4314 7.73331V11.0666C9.4314 11.4809 9.76718 11.8166 10.1814 11.8166C10.5956 11.8166 10.9314 11.4809 10.9314 11.0666V7.73331Z"></path></svg>`;
});
let elementsCounters = {};
const nextElementId = (prefix) => {
  elementsCounters = {
    ...elementsCounters,
    [prefix]: (elementsCounters[prefix] ?? 0) + 1
  };
  return `${prefix}${elementsCounters[prefix]}`;
};
const Html = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text: text2 = void 0 } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text2 !== void 0)
    $$bindings.text(text2);
  return `${``}`;
});
var Theme;
(function(Theme2) {
  Theme2["DARK"] = "dark";
  Theme2["LIGHT"] = "light";
})(Theme || (Theme = {}));
const isNode = () => typeof process !== "undefined" && process.versions != null && process.versions.node != null;
const enumFromStringExists = ({ obj, value }) => Object.values(obj).includes(value);
const THEME_ATTRIBUTE = "theme";
const LOCALSTORAGE_THEME_KEY = "nnsTheme";
const initTheme = () => {
  if (isNode()) {
    return void 0;
  }
  const theme2 = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  const initialTheme = enumFromStringExists({
    obj: Theme,
    value: theme2
  }) ? theme2 : Theme.DARK;
  applyTheme({ theme: initialTheme, preserve: false });
  return initialTheme;
};
const applyTheme = ({ theme: theme2, preserve = true }) => {
  const { documentElement, head } = document;
  documentElement.setAttribute(THEME_ATTRIBUTE, theme2);
  const color = getComputedStyle(documentElement).getPropertyValue("--theme-color");
  head?.children?.namedItem("theme-color")?.setAttribute("content", color.trim());
  if (preserve) {
    localStorage.setItem(LOCALSTORAGE_THEME_KEY, JSON.stringify(theme2));
  }
};
initTheme();
var Menu;
(function(Menu2) {
  Menu2["COLLAPSED"] = "collapsed";
  Menu2["EXPANDED"] = "expanded";
})(Menu || (Menu = {}));
const MENU_ATTRIBUTE = "menu";
const LOCALSTORAGE_MENU_KEY = "nnsMenu";
const initMenu = () => {
  if (isNode()) {
    return void 0;
  }
  const menu = document.documentElement.getAttribute(MENU_ATTRIBUTE);
  const initialMenu2 = enumFromStringExists({
    obj: Menu,
    value: menu
  }) ? menu : Menu.EXPANDED;
  applyMenu({ menu: initialMenu2, preserve: false });
  return initialMenu2;
};
const applyMenu = ({ menu, preserve = true }) => {
  const { documentElement } = document;
  documentElement.setAttribute(MENU_ATTRIBUTE, menu);
  if (preserve) {
    localStorage.setItem(LOCALSTORAGE_MENU_KEY, JSON.stringify(menu));
  }
};
const initialMenu = initMenu();
const initMenuStore = () => {
  const { subscribe: subscribe2, update } = writable(initialMenu);
  return {
    subscribe: subscribe2,
    toggle: () => {
      update((state) => {
        const menu = state === Menu.EXPANDED ? Menu.COLLAPSED : Menu.EXPANDED;
        applyMenu({ menu, preserve: true });
        return menu;
      });
    }
  };
};
const menuStore = initMenuStore();
derived(menuStore, ($menuStore) => $menuStore === Menu.COLLAPSED);
const css$5 = {
  code: ".modal.svelte-1bbimtl.svelte-1bbimtl{position:fixed;top:0;right:0;bottom:0;left:0;z-index:var(--modal-z-index);touch-action:initial;cursor:initial}.wrapper.svelte-1bbimtl.svelte-1bbimtl{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;background:var(--overlay-background);color:var(--overlay-background-contrast);--button-secondary-background:var(--focus-background);overflow:hidden;box-sizing:border-box;box-shadow:var(--overlay-box-shadow)}.wrapper.svelte-1bbimtl .container-wrapper.svelte-1bbimtl{margin:var(--padding-1_5x) var(--padding-2x) auto;display:flex;flex-direction:column;gap:var(--padding-1_5x);flex:1;overflow:hidden}.wrapper.alert.svelte-1bbimtl.svelte-1bbimtl{width:var(--alert-width);max-width:var(--alert-max-width);max-height:var(--alert-max-height);border-radius:var(--alert-border-radius)}.wrapper.alert.svelte-1bbimtl .header.svelte-1bbimtl{padding:var(--alert-padding-y) var(--alert-padding-x) var(--padding)}.wrapper.alert.svelte-1bbimtl .container-wrapper.svelte-1bbimtl{margin-bottom:calc(var(--alert-padding-y) * 2 / 3)}.wrapper.alert.svelte-1bbimtl .content.svelte-1bbimtl{margin:0 0 calc(var(--alert-padding-y) / 2);padding:calc(var(--alert-padding-y) / 2) calc(var(--alert-padding-x) / 2) 0}.wrapper.alert.svelte-1bbimtl .footer.svelte-1bbimtl{padding:0 var(--alert-padding-x) calc(var(--alert-padding-y) * 2 / 3)}@media(min-width: 576px){.wrapper.alert.svelte-1bbimtl .footer.svelte-1bbimtl{justify-content:flex-end}}.wrapper.dialog.svelte-1bbimtl.svelte-1bbimtl{width:var(--dialog-width);max-width:var(--dialog-max-width);min-height:var(--dialog-min-height);height:var(--dialog-height);max-height:var(--dialog-max-height, 100%);border-radius:var(--dialog-border-radius)}@supports (-webkit-touch-callout: none){.wrapper.dialog.svelte-1bbimtl.svelte-1bbimtl{max-height:-webkit-fill-available}@media(min-width: 768px){.wrapper.dialog.svelte-1bbimtl.svelte-1bbimtl{max-height:var(--dialog-max-height, 100%)}}}.wrapper.dialog.svelte-1bbimtl .header.svelte-1bbimtl{padding:var(--dialog-padding-y) var(--padding-3x) var(--padding)}.wrapper.dialog.svelte-1bbimtl .container-wrapper.svelte-1bbimtl{margin-bottom:var(--dialog-padding-y)}.wrapper.dialog.svelte-1bbimtl .content.svelte-1bbimtl{margin:0;padding:var(--dialog-padding-y) var(--dialog-padding-x)}.header.svelte-1bbimtl.svelte-1bbimtl{display:grid;grid-template-columns:1fr auto 1fr;gap:var(--padding);z-index:var(--z-index);position:relative}.header.svelte-1bbimtl h2.svelte-1bbimtl{white-space:var(--text-white-space, nowrap);overflow:hidden;text-overflow:ellipsis;grid-column-start:2;text-align:center}.header.svelte-1bbimtl button.svelte-1bbimtl{display:flex;justify-content:center;align-items:center;padding:0;justify-self:flex-end}.header.svelte-1bbimtl button.svelte-1bbimtl:active,.header.svelte-1bbimtl button.svelte-1bbimtl:focus,.header.svelte-1bbimtl button.svelte-1bbimtl:hover{background:var(--background-shade);border-radius:var(--border-radius)}.content.svelte-1bbimtl.svelte-1bbimtl{overflow-y:var(--modal-content-overflow-y, auto);overflow-x:hidden}.container.svelte-1bbimtl.svelte-1bbimtl{position:relative;display:flex;flex-direction:column;flex:1;overflow:hidden;border-radius:16px;background:var(--overlay-content-background);color:var(--overlay-content-background-contrast)}",
  map: '{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script>import { fade } from \\"svelte/transition\\";\\nimport { createEventDispatcher } from \\"svelte\\";\\nimport { i18n } from \\"../stores/i18n\\";\\nimport IconClose from \\"../icons/IconClose.svelte\\";\\nimport Backdrop from \\"./Backdrop.svelte\\";\\nimport { nonNullish } from \\"@dfinity/utils\\";\\nimport { nextElementId } from \\"../utils/html.utils\\";\\nimport { busy } from \\"../stores/busy.store\\";\\nimport { get } from \\"svelte/store\\";\\nexport let visible = true;\\nexport let role = \\"dialog\\";\\nexport let testId = void 0;\\nexport let disablePointerEvents = false;\\nlet showHeader;\\n$: showHeader = nonNullish($$slots.title);\\nlet showFooterAlert;\\n$: showFooterAlert = nonNullish($$slots.footer) && role === \\"alert\\";\\nconst dispatch = createEventDispatcher();\\nconst close = () => dispatch(\\"nnsClose\\");\\nconst FADE_IN_DURATION = 125;\\nconst FADE_OUT_DURATION = 200;\\nconst modalTitleId = nextElementId(\\"modal-title-\\");\\nconst modalContentId = nextElementId(\\"modal-content-\\");\\nconst handleKeyDown = ({ key }) => {\\n  if (visible && !disablePointerEvents && !get(busy) && key === \\"Escape\\") {\\n    close();\\n  }\\n};\\n<\/script>\\n\\n<svelte:window on:keydown={handleKeyDown} />\\n\\n{#if visible}\\n  <div\\n    class=\\"modal\\"\\n    transition:fade|global={{ duration: 25 }}\\n    on:introend\\n    {role}\\n    data-tid={testId}\\n    aria-labelledby={showHeader ? modalTitleId : undefined}\\n    aria-describedby={modalContentId}\\n    on:click|stopPropagation\\n  >\\n    <Backdrop {disablePointerEvents} on:nnsClose />\\n    <div\\n      in:fade|global={{ duration: FADE_IN_DURATION }}\\n      out:fade|global={{ duration: FADE_OUT_DURATION }}\\n      class={`wrapper ${role}`}\\n    >\\n      {#if showHeader}\\n        <div class=\\"header\\">\\n          <h2 id={modalTitleId} data-tid=\\"modal-title\\">\\n            <slot name=\\"title\\" />\\n          </h2>\\n          {#if !disablePointerEvents}\\n            <button\\n              data-tid=\\"close-modal\\"\\n              on:click|stopPropagation={close}\\n              aria-label={$i18n.core.close}><IconClose size=\\"24px\\" /></button\\n            >\\n          {/if}\\n        </div>\\n      {/if}\\n\\n      <div class=\\"container-wrapper\\">\\n        <slot name=\\"sub-title\\" />\\n\\n        <div class=\\"container\\">\\n          <div\\n            class=\\"content\\"\\n            id={modalContentId}\\n            class:alert={role === \\"alert\\"}\\n          >\\n            <slot />\\n          </div>\\n        </div>\\n      </div>\\n\\n      {#if showFooterAlert}\\n        <div class=\\"footer toolbar\\">\\n          <slot name=\\"footer\\" />\\n        </div>\\n      {/if}\\n    </div>\\n  </div>\\n{/if}\\n\\n<style>.modal {\\n  position: fixed;\\n  top: 0;\\n  right: 0;\\n  bottom: 0;\\n  left: 0;\\n  z-index: var(--modal-z-index);\\n  touch-action: initial;\\n  cursor: initial;\\n}\\n\\n.wrapper {\\n  position: absolute;\\n  top: 50%;\\n  left: 50%;\\n  transform: translate(-50%, -50%);\\n  display: flex;\\n  flex-direction: column;\\n  background: var(--overlay-background);\\n  color: var(--overlay-background-contrast);\\n  --button-secondary-background: var(--focus-background);\\n  overflow: hidden;\\n  box-sizing: border-box;\\n  box-shadow: var(--overlay-box-shadow);\\n}\\n.wrapper .container-wrapper {\\n  margin: var(--padding-1_5x) var(--padding-2x) auto;\\n  display: flex;\\n  flex-direction: column;\\n  gap: var(--padding-1_5x);\\n  flex: 1;\\n  overflow: hidden;\\n}\\n.wrapper.alert {\\n  width: var(--alert-width);\\n  max-width: var(--alert-max-width);\\n  max-height: var(--alert-max-height);\\n  border-radius: var(--alert-border-radius);\\n}\\n.wrapper.alert .header {\\n  padding: var(--alert-padding-y) var(--alert-padding-x) var(--padding);\\n}\\n.wrapper.alert .container-wrapper {\\n  margin-bottom: calc(var(--alert-padding-y) * 2 / 3);\\n}\\n.wrapper.alert .content {\\n  margin: 0 0 calc(var(--alert-padding-y) / 2);\\n  padding: calc(var(--alert-padding-y) / 2) calc(var(--alert-padding-x) / 2) 0;\\n}\\n.wrapper.alert .footer {\\n  padding: 0 var(--alert-padding-x) calc(var(--alert-padding-y) * 2 / 3);\\n}\\n@media (min-width: 576px) {\\n  .wrapper.alert .footer {\\n    justify-content: flex-end;\\n  }\\n}\\n.wrapper.dialog {\\n  width: var(--dialog-width);\\n  max-width: var(--dialog-max-width);\\n  min-height: var(--dialog-min-height);\\n  height: var(--dialog-height);\\n  max-height: var(--dialog-max-height, 100%);\\n  border-radius: var(--dialog-border-radius);\\n}\\n@supports (-webkit-touch-callout: none) {\\n  .wrapper.dialog {\\n    max-height: -webkit-fill-available;\\n  }\\n  @media (min-width: 768px) {\\n    .wrapper.dialog {\\n      max-height: var(--dialog-max-height, 100%);\\n    }\\n  }\\n}\\n.wrapper.dialog .header {\\n  padding: var(--dialog-padding-y) var(--padding-3x) var(--padding);\\n}\\n.wrapper.dialog .container-wrapper {\\n  margin-bottom: var(--dialog-padding-y);\\n}\\n.wrapper.dialog .content {\\n  margin: 0;\\n  padding: var(--dialog-padding-y) var(--dialog-padding-x);\\n}\\n\\n.header {\\n  display: grid;\\n  grid-template-columns: 1fr auto 1fr;\\n  gap: var(--padding);\\n  z-index: var(--z-index);\\n  position: relative;\\n}\\n.header h2 {\\n  white-space: var(--text-white-space, nowrap);\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  grid-column-start: 2;\\n  text-align: center;\\n}\\n.header button {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  padding: 0;\\n  justify-self: flex-end;\\n}\\n.header button:active, .header button:focus, .header button:hover {\\n  background: var(--background-shade);\\n  border-radius: var(--border-radius);\\n}\\n\\n.content {\\n  overflow-y: var(--modal-content-overflow-y, auto);\\n  overflow-x: hidden;\\n}\\n\\n.container {\\n  position: relative;\\n  display: flex;\\n  flex-direction: column;\\n  flex: 1;\\n  overflow: hidden;\\n  border-radius: 16px;\\n  background: var(--overlay-content-background);\\n  color: var(--overlay-content-background-contrast);\\n}</style>\\n"],"names":[],"mappings":"AAuFO,oCAAO,CACZ,QAAQ,CAAE,KAAK,CACf,GAAG,CAAE,CAAC,CACN,KAAK,CAAE,CAAC,CACR,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,eAAe,CAAC,CAC7B,YAAY,CAAE,OAAO,CACrB,MAAM,CAAE,OACV,CAEA,sCAAS,CACP,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,IAAI,oBAAoB,CAAC,CACrC,KAAK,CAAE,IAAI,6BAA6B,CAAC,CACzC,6BAA6B,CAAE,uBAAuB,CACtD,QAAQ,CAAE,MAAM,CAChB,UAAU,CAAE,UAAU,CACtB,UAAU,CAAE,IAAI,oBAAoB,CACtC,CACA,uBAAQ,CAAC,iCAAmB,CAC1B,MAAM,CAAE,IAAI,cAAc,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,IAAI,CAClD,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,cAAc,CAAC,CACxB,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,MACZ,CACA,QAAQ,oCAAO,CACb,KAAK,CAAE,IAAI,aAAa,CAAC,CACzB,SAAS,CAAE,IAAI,iBAAiB,CAAC,CACjC,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,aAAa,CAAE,IAAI,qBAAqB,CAC1C,CACA,QAAQ,qBAAM,CAAC,sBAAQ,CACrB,OAAO,CAAE,IAAI,iBAAiB,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,IAAI,SAAS,CACtE,CACA,QAAQ,qBAAM,CAAC,iCAAmB,CAChC,aAAa,CAAE,KAAK,IAAI,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACpD,CACA,QAAQ,qBAAM,CAAC,uBAAS,CACtB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC5C,OAAO,CAAE,KAAK,IAAI,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC7E,CACA,QAAQ,qBAAM,CAAC,sBAAQ,CACrB,OAAO,CAAE,CAAC,CAAC,IAAI,iBAAiB,CAAC,CAAC,KAAK,IAAI,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACvE,CACA,MAAO,YAAY,KAAK,CAAE,CACxB,QAAQ,qBAAM,CAAC,sBAAQ,CACrB,eAAe,CAAE,QACnB,CACF,CACA,QAAQ,qCAAQ,CACd,KAAK,CAAE,IAAI,cAAc,CAAC,CAC1B,SAAS,CAAE,IAAI,kBAAkB,CAAC,CAClC,UAAU,CAAE,IAAI,mBAAmB,CAAC,CACpC,MAAM,CAAE,IAAI,eAAe,CAAC,CAC5B,UAAU,CAAE,IAAI,mBAAmB,CAAC,KAAK,CAAC,CAC1C,aAAa,CAAE,IAAI,sBAAsB,CAC3C,CACA,UAAU,CAAC,uBAAuB,IAAI,CAAE,CACtC,QAAQ,qCAAQ,CACd,UAAU,CAAE,sBACd,CACA,MAAO,YAAY,KAAK,CAAE,CACxB,QAAQ,qCAAQ,CACd,UAAU,CAAE,IAAI,mBAAmB,CAAC,KAAK,CAC3C,CACF,CACF,CACA,QAAQ,sBAAO,CAAC,sBAAQ,CACtB,OAAO,CAAE,IAAI,kBAAkB,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,IAAI,SAAS,CAClE,CACA,QAAQ,sBAAO,CAAC,iCAAmB,CACjC,aAAa,CAAE,IAAI,kBAAkB,CACvC,CACA,QAAQ,sBAAO,CAAC,uBAAS,CACvB,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,IAAI,kBAAkB,CAAC,CAAC,IAAI,kBAAkB,CACzD,CAEA,qCAAQ,CACN,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,GAAG,CAAC,IAAI,CAAC,GAAG,CACnC,GAAG,CAAE,IAAI,SAAS,CAAC,CACnB,OAAO,CAAE,IAAI,SAAS,CAAC,CACvB,QAAQ,CAAE,QACZ,CACA,sBAAO,CAAC,iBAAG,CACT,WAAW,CAAE,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAC5C,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,iBAAiB,CAAE,CAAC,CACpB,UAAU,CAAE,MACd,CACA,sBAAO,CAAC,qBAAO,CACb,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,CAAC,CACV,YAAY,CAAE,QAChB,CACA,sBAAO,CAAC,qBAAM,OAAO,CAAE,sBAAO,CAAC,qBAAM,MAAM,CAAE,sBAAO,CAAC,qBAAM,MAAO,CAChE,UAAU,CAAE,IAAI,kBAAkB,CAAC,CACnC,aAAa,CAAE,IAAI,eAAe,CACpC,CAEA,sCAAS,CACP,UAAU,CAAE,IAAI,0BAA0B,CAAC,KAAK,CAAC,CACjD,UAAU,CAAE,MACd,CAEA,wCAAW,CACT,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,IAAI,CACnB,UAAU,CAAE,IAAI,4BAA4B,CAAC,CAC7C,KAAK,CAAE,IAAI,qCAAqC,CAClD"}'
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { visible = true } = $$props;
  let { role = "dialog" } = $$props;
  let { testId = void 0 } = $$props;
  let { disablePointerEvents = false } = $$props;
  let showHeader;
  let showFooterAlert;
  createEventDispatcher();
  const modalTitleId = nextElementId("modal-title-");
  const modalContentId = nextElementId("modal-content-");
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.testId === void 0 && $$bindings.testId && testId !== void 0)
    $$bindings.testId(testId);
  if ($$props.disablePointerEvents === void 0 && $$bindings.disablePointerEvents && disablePointerEvents !== void 0)
    $$bindings.disablePointerEvents(disablePointerEvents);
  $$result.css.add(css$5);
  showHeader = nonNullish($$slots.title);
  showFooterAlert = nonNullish($$slots.footer) && role === "alert";
  $$unsubscribe_i18n();
  return ` ${visible ? `<div class="modal svelte-1bbimtl"${add_attribute("role", role, 0)}${add_attribute("data-tid", testId, 0)}${add_attribute("aria-labelledby", showHeader ? modalTitleId : void 0, 0)}${add_attribute("aria-describedby", modalContentId, 0)}>${validate_component(Backdrop, "Backdrop").$$render($$result, { disablePointerEvents }, {}, {})} <div class="${escape(null_to_empty(`wrapper ${role}`), true) + " svelte-1bbimtl"}">${showHeader ? `<div class="header svelte-1bbimtl"><h2${add_attribute("id", modalTitleId, 0)} data-tid="modal-title" class="svelte-1bbimtl">${slots.title ? slots.title({}) : ``}</h2> ${!disablePointerEvents ? `<button data-tid="close-modal"${add_attribute("aria-label", $i18n.core.close, 0)} class="svelte-1bbimtl">${validate_component(IconClose, "IconClose").$$render($$result, { size: "24px" }, {}, {})}</button>` : ``}</div>` : ``} <div class="container-wrapper svelte-1bbimtl">${slots["sub-title"] ? slots["sub-title"]({}) : ``} <div class="container svelte-1bbimtl"><div class="${["content svelte-1bbimtl", role === "alert" ? "alert" : ""].join(" ").trim()}"${add_attribute("id", modalContentId, 0)}>${slots.default ? slots.default({}) : ``}</div></div></div> ${showFooterAlert ? `<div class="footer toolbar svelte-1bbimtl">${slots.footer ? slots.footer({}) : ``}</div>` : ``}</div></div>` : ``}`;
});
const initToastsStore = () => {
  const { subscribe: subscribe2, update, set } = writable([]);
  return {
    subscribe: subscribe2,
    show({ id, ...rest }) {
      const toastId = id ?? Symbol("toast");
      update((messages) => {
        return [...messages, { ...rest, id: toastId }];
      });
      return toastId;
    },
    hide(idToHide) {
      update((messages) => messages.filter(({ id }) => id !== idToHide));
    },
    update({ id, content }) {
      update((messages) => (
        // use map to preserve order
        messages.map((message) => {
          if (message.id !== id) {
            return message;
          }
          return {
            ...message,
            ...content
          };
        })
      ));
    },
    reset(levels) {
      if (nonNullish(levels) && levels.length > 0) {
        update((messages) => messages.filter(({ level }) => !levels.includes(level)));
        return;
      }
      set([]);
    }
  };
};
const toastsStore = initToastsStore();
const css$4 = {
  code: ".toast.svelte-w1j1kj.svelte-w1j1kj{display:flex;justify-content:space-between;align-items:center;gap:var(--padding-1_5x);background:var(--overlay-background);color:var(--overlay-background-contrast);--button-secondary-background:var(--focus-background);border-radius:var(--border-radius);box-shadow:var(--strong-shadow, 8px 8px 16px 0 rgba(0, 0, 0, 0.25));padding:var(--padding-1_5x);box-sizing:border-box}.toast.inverted.svelte-w1j1kj.svelte-w1j1kj{background:var(--toast-inverted-background);color:var(--toast-inverted-background-contrast)}.toast.svelte-w1j1kj .icon.svelte-w1j1kj{line-height:0}.toast.svelte-w1j1kj .icon.success.svelte-w1j1kj{color:var(--positive-emphasis)}.toast.svelte-w1j1kj .icon.info.svelte-w1j1kj{color:var(--primary)}.toast.svelte-w1j1kj .icon.warn.svelte-w1j1kj{color:var(--warning-emphasis-shade)}.toast.svelte-w1j1kj .icon.error.svelte-w1j1kj{color:var(--negative-emphasis)}.toast.svelte-w1j1kj .msg.svelte-w1j1kj{flex-grow:1;margin:0;word-break:break-word}.toast.svelte-w1j1kj .msg.scroll.svelte-w1j1kj{overflow-y:auto;max-height:calc(var(--font-size-standard) * 3 * 1.3);line-height:normal}.toast.svelte-w1j1kj .msg.truncate.svelte-w1j1kj{white-space:var(--text-white-space, nowrap);overflow:hidden;text-overflow:ellipsis}.toast.svelte-w1j1kj .msg.truncate .title.svelte-w1j1kj{white-space:var(--text-white-space, nowrap);overflow:hidden;text-overflow:ellipsis}.toast.svelte-w1j1kj .msg.clamp.svelte-w1j1kj{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.toast.svelte-w1j1kj .msg.clamp .title.svelte-w1j1kj{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.toast.svelte-w1j1kj .title.svelte-w1j1kj{display:block;font-size:var(--font-size-standard);line-height:var(--line-height-standard);font-weight:var(--font-weight-bold);line-height:normal}.toast.svelte-w1j1kj button.close.svelte-w1j1kj{padding:0;line-height:0;color:inherit}",
  map: '{"version":3,"file":"Toast.svelte","sources":["Toast.svelte"],"sourcesContent":["<script>import { toastsStore } from \\"../stores/toasts.store\\";\\nimport { fade, fly } from \\"svelte/transition\\";\\nimport { i18n } from \\"../stores/i18n\\";\\nimport { onDestroy, onMount } from \\"svelte\\";\\nimport Spinner from \\"./Spinner.svelte\\";\\nimport IconWarning from \\"../icons/IconWarning.svelte\\";\\nimport IconClose from \\"../icons/IconClose.svelte\\";\\nimport IconInfo from \\"../icons/IconInfo.svelte\\";\\nimport IconCheckCircle from \\"../icons/IconCheckCircle.svelte\\";\\nimport IconError from \\"../icons/IconError.svelte\\";\\nimport { DEFAULT_ICON_SIZE } from \\"../constants/constants\\";\\nimport { isNullish, nonNullish } from \\"@dfinity/utils\\";\\nimport Html from \\"./Html.svelte\\";\\nexport let msg;\\nconst iconMapper = (level2) => ({\\n  [\\"success\\"]: IconCheckCircle,\\n  [\\"warn\\"]: IconWarning,\\n  [\\"error\\"]: IconError,\\n  [\\"info\\"]: IconInfo,\\n  [\\"custom\\"]: void 0\\n})[level2];\\nconst close = () => toastsStore.hide(msg.id);\\nlet text;\\nlet level;\\nlet spinner;\\nlet title;\\nlet overflow;\\nlet position;\\nlet icon;\\nlet theme;\\nlet renderAsHtml;\\n$: ({\\n  text,\\n  level,\\n  spinner,\\n  title,\\n  overflow,\\n  position,\\n  icon,\\n  theme,\\n  renderAsHtml\\n} = msg);\\nlet scroll;\\n$: scroll = overflow === void 0 || overflow === \\"scroll\\";\\nlet truncate;\\n$: truncate = overflow === \\"truncate\\";\\nlet clamp;\\n$: clamp = overflow === \\"clamp\\";\\nlet timeoutId = void 0;\\nconst autoHide = () => {\\n  const { duration } = msg;\\n  if (isNullish(duration)) {\\n    return;\\n  }\\n  timeoutId = setTimeout(close, duration);\\n};\\nconst cleanUpAutoHide = () => {\\n  if (isNullish(timeoutId)) {\\n    return;\\n  }\\n  clearTimeout(timeoutId);\\n};\\nconst minHeightMessage = `min-height: ${DEFAULT_ICON_SIZE}px;`;\\nonMount(autoHide);\\nonDestroy(cleanUpAutoHide);\\n<\/script>\\n\\n<div\\n  role=\\"dialog\\"\\n  class={`toast ${theme ?? \\"themed\\"}`}\\n  in:fly|global={{ y: (position === \\"top\\" ? -1 : 1) * 100, duration: 200 }}\\n  out:fade|global={{ delay: 100 }}\\n>\\n  <div class=\\"icon {level}\\" aria-hidden=\\"true\\">\\n    {#if spinner}\\n      <Spinner size=\\"small\\" inline />\\n    {:else if nonNullish(icon)}\\n      <svelte:component this={icon} />\\n    {:else if iconMapper(level)}\\n      <svelte:component this={iconMapper(level)} size={DEFAULT_ICON_SIZE} />\\n    {/if}\\n  </div>\\n\\n  <p\\n    class=\\"msg\\"\\n    class:truncate\\n    class:clamp\\n    class:scroll\\n    style={minHeightMessage}\\n  >\\n    {#if nonNullish(title)}\\n      <span class=\\"title\\">{title}</span>\\n    {/if}\\n    {#if renderAsHtml}\\n      <Html {text} />\\n    {:else}\\n      {text}\\n    {/if}\\n  </p>\\n\\n  <button class=\\"close\\" on:click={close} aria-label={$i18n.core.close}\\n    ><IconClose /></button\\n  >\\n</div>\\n\\n<style>.toast {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  gap: var(--padding-1_5x);\\n  background: var(--overlay-background);\\n  color: var(--overlay-background-contrast);\\n  --button-secondary-background: var(--focus-background);\\n  border-radius: var(--border-radius);\\n  box-shadow: var(--strong-shadow, 8px 8px 16px 0 rgba(0, 0, 0, 0.25));\\n  padding: var(--padding-1_5x);\\n  box-sizing: border-box;\\n}\\n.toast.inverted {\\n  background: var(--toast-inverted-background);\\n  color: var(--toast-inverted-background-contrast);\\n}\\n.toast .icon {\\n  line-height: 0;\\n}\\n.toast .icon.success {\\n  color: var(--positive-emphasis);\\n}\\n.toast .icon.info {\\n  color: var(--primary);\\n}\\n.toast .icon.warn {\\n  color: var(--warning-emphasis-shade);\\n}\\n.toast .icon.error {\\n  color: var(--negative-emphasis);\\n}\\n.toast .msg {\\n  flex-grow: 1;\\n  margin: 0;\\n  word-break: break-word;\\n}\\n.toast .msg.scroll {\\n  overflow-y: auto;\\n  max-height: calc(var(--font-size-standard) * 3 * 1.3);\\n  line-height: normal;\\n}\\n.toast .msg.truncate {\\n  white-space: var(--text-white-space, nowrap);\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n}\\n.toast .msg.truncate .title {\\n  white-space: var(--text-white-space, nowrap);\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n}\\n.toast .msg.clamp {\\n  display: -webkit-box;\\n  -webkit-box-orient: vertical;\\n  -webkit-line-clamp: 3;\\n  overflow: hidden;\\n}\\n.toast .msg.clamp .title {\\n  display: -webkit-box;\\n  -webkit-box-orient: vertical;\\n  -webkit-line-clamp: 2;\\n  overflow: hidden;\\n}\\n.toast .title {\\n  display: block;\\n  font-size: var(--font-size-standard);\\n  line-height: var(--line-height-standard);\\n  font-weight: var(--font-weight-bold);\\n  line-height: normal;\\n}\\n.toast button.close {\\n  padding: 0;\\n  line-height: 0;\\n  color: inherit;\\n}</style>\\n"],"names":[],"mappings":"AAyGO,kCAAO,CACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IAAI,cAAc,CAAC,CACxB,UAAU,CAAE,IAAI,oBAAoB,CAAC,CACrC,KAAK,CAAE,IAAI,6BAA6B,CAAC,CACzC,6BAA6B,CAAE,uBAAuB,CACtD,aAAa,CAAE,IAAI,eAAe,CAAC,CACnC,UAAU,CAAE,IAAI,eAAe,CAAC,mCAAmC,CAAC,CACpE,OAAO,CAAE,IAAI,cAAc,CAAC,CAC5B,UAAU,CAAE,UACd,CACA,MAAM,qCAAU,CACd,UAAU,CAAE,IAAI,2BAA2B,CAAC,CAC5C,KAAK,CAAE,IAAI,oCAAoC,CACjD,CACA,oBAAM,CAAC,mBAAM,CACX,WAAW,CAAE,CACf,CACA,oBAAM,CAAC,KAAK,sBAAS,CACnB,KAAK,CAAE,IAAI,mBAAmB,CAChC,CACA,oBAAM,CAAC,KAAK,mBAAM,CAChB,KAAK,CAAE,IAAI,SAAS,CACtB,CACA,oBAAM,CAAC,KAAK,mBAAM,CAChB,KAAK,CAAE,IAAI,wBAAwB,CACrC,CACA,oBAAM,CAAC,KAAK,oBAAO,CACjB,KAAK,CAAE,IAAI,mBAAmB,CAChC,CACA,oBAAM,CAAC,kBAAK,CACV,SAAS,CAAE,CAAC,CACZ,MAAM,CAAE,CAAC,CACT,UAAU,CAAE,UACd,CACA,oBAAM,CAAC,IAAI,qBAAQ,CACjB,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,KAAK,IAAI,oBAAoB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CACrD,WAAW,CAAE,MACf,CACA,oBAAM,CAAC,IAAI,uBAAU,CACnB,WAAW,CAAE,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAC5C,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QACjB,CACA,oBAAM,CAAC,IAAI,SAAS,CAAC,oBAAO,CAC1B,WAAW,CAAE,IAAI,kBAAkB,CAAC,OAAO,CAAC,CAC5C,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QACjB,CACA,oBAAM,CAAC,IAAI,oBAAO,CAChB,OAAO,CAAE,WAAW,CACpB,kBAAkB,CAAE,QAAQ,CAC5B,kBAAkB,CAAE,CAAC,CACrB,QAAQ,CAAE,MACZ,CACA,oBAAM,CAAC,IAAI,MAAM,CAAC,oBAAO,CACvB,OAAO,CAAE,WAAW,CACpB,kBAAkB,CAAE,QAAQ,CAC5B,kBAAkB,CAAE,CAAC,CACrB,QAAQ,CAAE,MACZ,CACA,oBAAM,CAAC,oBAAO,CACZ,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,IAAI,oBAAoB,CAAC,CACpC,WAAW,CAAE,IAAI,sBAAsB,CAAC,CACxC,WAAW,CAAE,IAAI,kBAAkB,CAAC,CACpC,WAAW,CAAE,MACf,CACA,oBAAM,CAAC,MAAM,oBAAO,CAClB,OAAO,CAAE,CAAC,CACV,WAAW,CAAE,CAAC,CACd,KAAK,CAAE,OACT"}'
};
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { msg } = $$props;
  const iconMapper = (level2) => ({
    ["success"]: IconCheckCircle,
    ["warn"]: IconWarning,
    ["error"]: IconError,
    ["info"]: IconInfo,
    ["custom"]: void 0
  })[level2];
  let text2;
  let level;
  let spinner;
  let title;
  let overflow;
  let position;
  let icon;
  let theme2;
  let renderAsHtml;
  let scroll;
  let truncate;
  let clamp;
  let timeoutId = void 0;
  const cleanUpAutoHide = () => {
    if (isNullish(timeoutId)) {
      return;
    }
    clearTimeout(timeoutId);
  };
  const minHeightMessage = `min-height: ${DEFAULT_ICON_SIZE}px;`;
  onDestroy(cleanUpAutoHide);
  if ($$props.msg === void 0 && $$bindings.msg && msg !== void 0)
    $$bindings.msg(msg);
  $$result.css.add(css$4);
  ({ text: text2, level, spinner, title, overflow, position, icon, theme: theme2, renderAsHtml } = msg);
  scroll = overflow === void 0 || overflow === "scroll";
  truncate = overflow === "truncate";
  clamp = overflow === "clamp";
  $$unsubscribe_i18n();
  return `<div role="dialog" class="${escape(null_to_empty(`toast ${theme2 ?? "themed"}`), true) + " svelte-w1j1kj"}"><div class="${"icon " + escape(level, true) + " svelte-w1j1kj"}" aria-hidden="true">${spinner ? `${validate_component(Spinner, "Spinner").$$render($$result, { size: "small", inline: true }, {}, {})}` : `${nonNullish(icon) ? `${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${iconMapper(level) ? `${validate_component(iconMapper(level) || missing_component, "svelte:component").$$render($$result, { size: DEFAULT_ICON_SIZE }, {}, {})}` : ``}`}`}</div> <p class="${[
    "msg svelte-w1j1kj",
    (truncate ? "truncate" : "") + " " + (clamp ? "clamp" : "") + " " + (scroll ? "scroll" : "")
  ].join(" ").trim()}"${add_attribute("style", minHeightMessage, 0)}>${nonNullish(title) ? `<span class="title svelte-w1j1kj">${escape(title)}</span>` : ``} ${renderAsHtml ? `${validate_component(Html, "Html").$$render($$result, { text: text2 }, {}, {})}` : `${escape(text2)}`}</p> <button class="close svelte-w1j1kj"${add_attribute("aria-label", $i18n.core.close, 0)}>${validate_component(IconClose, "IconClose").$$render($$result, {}, {}, {})}</button> </div>`;
});
const css$3 = {
  code: ".wrapper.svelte-1iulzbj{position:fixed;left:50%;transform:translate(-50%, 0);bottom:calc(var(--layout-bottom-offset, 0) + var(--padding-2x));width:calc(100% - var(--padding-8x) - var(--padding-0_5x));display:flex;flex-direction:column;gap:var(--padding);z-index:var(--toast-info-z-index)}.wrapper.error.svelte-1iulzbj{z-index:var(--toast-error-z-index)}@media(min-width: 768px){.wrapper.svelte-1iulzbj{max-width:calc(var(--section-max-width) - var(--padding-2x))}}.top.svelte-1iulzbj{top:calc(var(--header-height) + var(--padding-3x));bottom:unset;width:calc(100% - var(--padding-6x))}@media(min-width: 768px){.top.svelte-1iulzbj{right:var(--padding-2x);left:unset;transform:none;max-width:calc(var(--section-max-width) / 1.5 - var(--padding-2x))}}",
  map: '{"version":3,"file":"Toasts.svelte","sources":["Toasts.svelte"],"sourcesContent":["<script>import { toastsStore } from \\"../stores/toasts.store\\";\\nimport Toast from \\"./Toast.svelte\\";\\nimport { layoutBottomOffset } from \\"../stores/layout.store\\";\\nexport let position = \\"bottom\\";\\nexport let maxVisible = void 0;\\nlet toasts = [];\\n$: toasts = $toastsStore.filter(({ position: pos }) => (pos ?? \\"bottom\\") === position).slice(0, maxVisible);\\nlet hasErrors;\\n$: hasErrors = toasts.find(({ level }) => [\\"error\\", \\"warn\\"].includes(level)) !== void 0;\\n<\/script>\\n\\n{#if toasts.length > 0}\\n  <div\\n    class={`wrapper ${position}`}\\n    class:error={hasErrors}\\n    style={`--layout-bottom-offset: ${$layoutBottomOffset}px`}\\n  >\\n    {#each toasts as msg (msg.id)}\\n      <Toast {msg} />\\n    {/each}\\n  </div>\\n{/if}\\n\\n<style>.wrapper {\\n  position: fixed;\\n  left: 50%;\\n  transform: translate(-50%, 0);\\n  bottom: calc(var(--layout-bottom-offset, 0) + var(--padding-2x));\\n  width: calc(100% - var(--padding-8x) - var(--padding-0_5x));\\n  display: flex;\\n  flex-direction: column;\\n  gap: var(--padding);\\n  z-index: var(--toast-info-z-index);\\n}\\n.wrapper.error {\\n  z-index: var(--toast-error-z-index);\\n}\\n@media (min-width: 768px) {\\n  .wrapper {\\n    max-width: calc(var(--section-max-width) - var(--padding-2x));\\n  }\\n}\\n\\n.top {\\n  top: calc(var(--header-height) + var(--padding-3x));\\n  bottom: unset;\\n  width: calc(100% - var(--padding-6x));\\n}\\n@media (min-width: 768px) {\\n  .top {\\n    right: var(--padding-2x);\\n    left: unset;\\n    transform: none;\\n    max-width: calc(var(--section-max-width) / 1.5 - var(--padding-2x));\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAuBO,uBAAS,CACd,QAAQ,CAAE,KAAK,CACf,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,CAAC,CAAC,CAC7B,MAAM,CAAE,KAAK,IAAI,sBAAsB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,CAChE,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,CAAC,CAAC,IAAI,cAAc,CAAC,CAAC,CAC3D,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,SAAS,CAAC,CACnB,OAAO,CAAE,IAAI,oBAAoB,CACnC,CACA,QAAQ,qBAAO,CACb,OAAO,CAAE,IAAI,qBAAqB,CACpC,CACA,MAAO,YAAY,KAAK,CAAE,CACxB,uBAAS,CACP,SAAS,CAAE,KAAK,IAAI,mBAAmB,CAAC,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CAC9D,CACF,CAEA,mBAAK,CACH,GAAG,CAAE,KAAK,IAAI,eAAe,CAAC,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CAAC,CACnD,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CACtC,CACA,MAAO,YAAY,KAAK,CAAE,CACxB,mBAAK,CACH,KAAK,CAAE,IAAI,YAAY,CAAC,CACxB,IAAI,CAAE,KAAK,CACX,SAAS,CAAE,IAAI,CACf,SAAS,CAAE,KAAK,IAAI,mBAAmB,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,YAAY,CAAC,CACpE,CACF"}'
};
const Toasts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toastsStore, $$unsubscribe_toastsStore;
  let $layoutBottomOffset, $$unsubscribe_layoutBottomOffset;
  $$unsubscribe_toastsStore = subscribe(toastsStore, (value) => $toastsStore = value);
  $$unsubscribe_layoutBottomOffset = subscribe(layoutBottomOffset, (value) => $layoutBottomOffset = value);
  let { position = "bottom" } = $$props;
  let { maxVisible = void 0 } = $$props;
  let toasts = [];
  let hasErrors;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.maxVisible === void 0 && $$bindings.maxVisible && maxVisible !== void 0)
    $$bindings.maxVisible(maxVisible);
  $$result.css.add(css$3);
  toasts = $toastsStore.filter(({ position: pos }) => (pos ?? "bottom") === position).slice(0, maxVisible);
  hasErrors = toasts.find(({ level }) => ["error", "warn"].includes(level)) !== void 0;
  $$unsubscribe_toastsStore();
  $$unsubscribe_layoutBottomOffset();
  return `${toasts.length > 0 ? `<div class="${[
    escape(null_to_empty(`wrapper ${position}`), true) + " svelte-1iulzbj",
    hasErrors ? "error" : ""
  ].join(" ").trim()}"${add_attribute("style", `--layout-bottom-offset: ${$layoutBottomOffset}px`, 0)}>${each(toasts, (msg) => {
    return `${validate_component(Toast, "Toast").$$render($$result, { msg }, {}, {})}`;
  })}</div>` : ``}`;
});
const toastsShow = (msg) => toastsStore.show(msg);
const toastsError = ({
  msg: { text: text2, ...rest },
  err
}) => {
  if (nonNullish(err)) {
    console.error(err);
  }
  return toastsStore.show({
    text: `${text2}${nonNullish(err) ? ` / ${errorDetailToString(err)}` : ""}`,
    ...rest,
    level: "error"
  });
};
const LogoIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg xmlns="http://www.w3.org/2000/svg"${add_attribute("class", className, 0)} fill="currentColor" viewBox="0 0 30 32"><g clip-path="url(#clip0_32_590)"><path d="M30 1.83089V5.46025C30 6.47291 29.1951 7.29114 28.199 7.29114H10.2045C8.53101 7.29114 7.17227 8.67241 7.17227 10.3737V30.1691C7.17227 31.1818 6.36738 32 5.37123 32H1.80104C0.804888 32 0 31.1818 0 30.1691V10.3939C0 4.65418 4.5783 0 10.2245 0H28.199C29.1951 0 30 0.818228 30 1.83089Z"${add_attribute("fill", fill, 0)}></path><path d="M30 13.6992V24.7169C30 28.7392 26.7924 32.004 22.8317 32.004H13.6432C12.914 32.004 12.3203 31.4005 12.3203 30.6592V26.0537C12.3203 25.3124 12.914 24.7088 13.6432 24.7088H21.5048C22.234 24.7088 22.8277 24.1053 22.8277 23.364V20.9863C22.8277 20.245 22.234 19.6415 21.5048 19.6415H13.6432C12.914 19.6415 12.3203 19.038 12.3203 18.2967V13.6911C12.3203 12.9499 12.914 12.3463 13.6432 12.3463H28.6771C29.4062 12.3463 30 12.9499 30 13.6911V13.6992Z"${add_attribute("fill", fill, 0)}></path></g><defs><clipPath id="clip0_32_590"><rect width="30" height="32"${add_attribute("fill", fill, 0)}></rect></clipPath></defs></svg>`;
});
const HomeIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${add_attribute("class", className, 0)} fill="currentColor" viewBox="0 0 24 24"><path d="M21 10C21.1313 10 21.2614 9.97419 21.3827 9.92395C21.5041 9.8737 21.6143 9.80005 21.7072 9.70718C21.8 9.61432 21.8737 9.50406 21.9239 9.38272C21.9742 9.26138 22 9.13133 22 9V6C22.0001 5.79017 21.9341 5.58565 21.8114 5.41544C21.6887 5.24524 21.5155 5.11799 21.3164 5.05176L12.3164 2.05176C12.111 1.9834 11.889 1.9834 11.6836 2.05176L2.68359 5.05176C2.48449 5.11799 2.31131 5.24524 2.18861 5.41544C2.0659 5.58565 1.99991 5.79017 2 6V9C1.99997 9.13133 2.02581 9.26138 2.07605 9.38272C2.12629 9.50406 2.19995 9.61432 2.29282 9.70718C2.38568 9.80005 2.49594 9.8737 2.61728 9.92395C2.73862 9.97419 2.86867 10 3 10H4V17.1843C3.41674 17.3897 2.91137 17.7707 2.55327 18.2748C2.19517 18.779 2.0019 19.3816 2 20V22C1.99997 22.1313 2.02581 22.2614 2.07605 22.3827C2.12629 22.5041 2.19995 22.6143 2.29282 22.7072C2.38568 22.8 2.49594 22.8737 2.61728 22.9239C2.73862 22.9742 2.86867 23 3 23H21C21.1313 23 21.2614 22.9742 21.3827 22.9239C21.5041 22.8737 21.6143 22.8 21.7072 22.7072C21.8 22.6143 21.8737 22.5041 21.9239 22.3827C21.9742 22.2614 22 22.1313 22 22V20C21.9981 19.3816 21.8048 18.779 21.4467 18.2748C21.0886 17.7707 20.5833 17.3897 20 17.1843V10H21ZM20 21H4V20C4.00026 19.7349 4.10571 19.4807 4.29319 19.2932C4.48066 19.1057 4.73486 19.0003 5 19H19C19.2651 19.0003 19.5193 19.1057 19.7068 19.2932C19.8943 19.4807 19.9997 19.7349 20 20V21ZM6 17V10H8V17H6ZM10 17V10H14V17H10ZM16 17V10H18V17H16ZM4 8V6.7207L12 4.0537L20 6.7207V8H4Z"${add_attribute("fill", fill, 0)}></path></svg>`;
});
const StarIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${add_attribute("class", className, 0)} fill="currentColor" viewBox="0 0 24 24"><path d="M22 9.6699C21.9368 9.48699 21.822 9.32633 21.6693 9.2074C21.5167 9.08848 21.3328 9.0164 21.14 8.9999L15.45 8.1699L12.9 2.9999C12.8181 2.83083 12.6902 2.68824 12.5311 2.58847C12.3719 2.48871 12.1878 2.43579 12 2.43579C11.8121 2.43579 11.6281 2.48871 11.4689 2.58847C11.3097 2.68824 11.1819 2.83083 11.1 2.9999L8.54998 8.1599L2.85998 8.9999C2.6749 9.02621 2.5009 9.10386 2.35773 9.22406C2.21455 9.34425 2.10794 9.50218 2.04998 9.6799C1.99692 9.85358 1.99216 10.0384 2.03621 10.2146C2.08025 10.3908 2.17144 10.5516 2.29998 10.6799L6.42998 14.6799L5.42998 20.3599C5.39428 20.5474 5.41297 20.7412 5.48385 20.9184C5.55473 21.0955 5.67483 21.2488 5.82998 21.3599C5.98119 21.468 6.15955 21.5318 6.34503 21.5442C6.5305 21.5566 6.71575 21.517 6.87998 21.4299L12 18.7599L17.1 21.4399C17.2403 21.5191 17.3988 21.5604 17.56 21.5599C17.7718 21.5607 17.9784 21.4941 18.15 21.3699C18.3051 21.2588 18.4252 21.1055 18.4961 20.9284C18.567 20.7512 18.5857 20.5574 18.55 20.3699L17.55 14.6899L21.68 10.6899C21.8244 10.5676 21.9311 10.4068 21.9877 10.2262C22.0444 10.0457 22.0486 9.85278 22 9.6699ZM15.85 13.6699C15.7327 13.7833 15.645 13.9237 15.5944 14.0789C15.5439 14.234 15.532 14.3992 15.56 14.5599L16.28 18.7499L12.52 16.7499C12.3753 16.6729 12.2139 16.6326 12.05 16.6326C11.8861 16.6326 11.7247 16.6729 11.58 16.7499L7.81998 18.7499L8.53998 14.5599C8.56791 14.3992 8.55609 14.234 8.50554 14.0789C8.45499 13.9237 8.36725 13.7833 8.24998 13.6699L5.24998 10.6699L9.45998 10.0599C9.62198 10.0374 9.77598 9.97544 9.90848 9.87955C10.041 9.78366 10.1479 9.65674 10.22 9.5099L12 5.6999L13.88 9.5199C13.952 9.66674 14.059 9.79366 14.1915 9.88955C14.324 9.98544 14.478 10.0474 14.64 10.0699L18.85 10.6799L15.85 13.6699Z"${add_attribute("fill", fill, 0)}></path></svg>`;
});
const ProfileIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${add_attribute("class", className, 0)} fill="currentColor" viewBox="0 0 24 24"><path${add_attribute("fill", fill, 0)} d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"></path></svg>`;
});
const LogoutIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg${add_attribute("class", className, 0)} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24 24H0z"></path><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3H9c-1.1 0-2 .9-2 2v3h2V5h11v14H9v-3H7v3c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>`;
});
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { text: text2 } = $$props;
  if ($$props.text === void 0 && $$bindings.text && text2 !== void 0)
    $$bindings.text(text2);
  return `<button class="relative flex items-center w-6 max-w-6 text-sm">${slots.default ? slots.default({}) : ``} ${``}</button>`;
});
const RulesIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { className = "" } = $$props;
  let { fill = "white" } = $$props;
  if ($$props.className === void 0 && $$bindings.className && className !== void 0)
    $$bindings.className(className);
  if ($$props.fill === void 0 && $$bindings.fill && fill !== void 0)
    $$bindings.fill(fill);
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${add_attribute("class", className, 0)} fill="currentColor" viewBox="0 0 24 24"><path d="M22.9642 13.8226C22.9603 13.7638 22.9508 13.7055 22.936 13.6484L20.6313 7.51135C21.0508 7.24006 21.3957 6.86818 21.6347 6.42956C21.8738 5.99095 21.9993 5.49952 22 5C22 4.73478 21.8946 4.48043 21.7071 4.29289C21.5196 4.10536 21.2652 4 21 4C20.7348 4 20.4804 4.10536 20.2929 4.29289C20.1054 4.48043 20 4.73478 20 5C19.9999 5.22285 19.9254 5.43929 19.7884 5.61499C19.6513 5.79069 19.4595 5.91559 19.2433 5.96987C19.0272 6.02416 18.7991 6.00472 18.5953 5.91465C18.3915 5.82457 18.2235 5.66902 18.1182 5.47266C17.8616 5.01717 17.4863 4.63972 17.0324 4.38042C16.5784 4.12111 16.0627 3.98965 15.54 4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V4H8.46C7.93731 3.98965 7.42158 4.12111 6.96762 4.38042C6.51366 4.63972 6.13844 5.01717 5.88184 5.47266C5.77647 5.66902 5.60855 5.82457 5.40471 5.91465C5.20088 6.00472 4.97281 6.02416 4.75668 5.96987C4.54054 5.91559 4.34872 5.79069 4.21165 5.61499C4.07457 5.43929 4.00008 5.22285 4 5C4 4.73478 3.89464 4.48043 3.70711 4.29289C3.51957 4.10536 3.26522 4 3 4C2.73478 4 2.48043 4.10536 2.29289 4.29289C2.10536 4.48043 2 4.73478 2 5C2.00065 5.49952 2.12621 5.99095 2.36525 6.42956C2.60429 6.86818 2.94922 7.24006 3.36865 7.51135L1.064 13.6484C1.04921 13.7055 1.03977 13.7638 1.03581 13.8226C1.01825 13.8805 1.00626 13.9399 1 14C1 14.0093 1.00269 14.0178 1.00275 14.0271C1.00305 14.0403 1.00575 14.0524 1.00665 14.0655C1.02222 15.1144 1.4498 16.115 2.197 16.8512C2.94421 17.5874 3.95105 18.0001 5 18.0001C6.04895 18.0001 7.05579 17.5874 7.803 16.8512C8.5502 16.115 8.97778 15.1144 8.99335 14.0655C8.9942 14.0524 8.99695 14.0403 8.99725 14.0271C8.99731 14.0178 9 14.0093 9 14C8.99376 13.9399 8.98178 13.8805 8.96423 13.8226C8.96027 13.7638 8.95083 13.7055 8.93604 13.6484L6.62866 7.50421C7.05242 7.23377 7.40114 6.86085 7.64258 6.41992C7.72984 6.2842 7.85137 6.1739 7.99489 6.10017C8.13841 6.02644 8.29885 5.99189 8.46 6H11V20H8C7.73478 20 7.48043 20.1054 7.29289 20.2929C7.10536 20.4804 7 20.7348 7 21C7 21.2652 7.10536 21.5196 7.29289 21.7071C7.48043 21.8946 7.73478 22 8 22H16C16.2652 22 16.5196 21.8946 16.7071 21.7071C16.8946 21.5196 17 21.2652 17 21C17 20.7348 16.8946 20.4804 16.7071 20.2929C16.5196 20.1054 16.2652 20 16 20H13V6H15.54C15.7011 5.9919 15.8616 6.02646 16.0051 6.10018C16.1486 6.17391 16.2701 6.2842 16.3574 6.41992C16.5988 6.86085 16.9475 7.23377 17.3713 7.50421L15.064 13.6484C15.0492 13.7055 15.0398 13.7638 15.0358 13.8226C15.0182 13.8805 15.0063 13.9399 15 14C15 14.0093 15.0027 14.0178 15.0028 14.0271C15.0031 14.0403 15.0057 14.0524 15.0066 14.0655C15.0222 15.1144 15.4498 16.115 16.197 16.8512C16.9442 17.5874 17.951 18.0001 19 18.0001C20.049 18.0001 21.0558 17.5874 21.803 16.8512C22.5502 16.115 22.9778 15.1144 22.9933 14.0655C22.9942 14.0524 22.997 14.0403 22.9972 14.0271C22.9973 14.0178 23 14.0093 23 14C22.9938 13.9399 22.9818 13.8805 22.9642 13.8226ZM5 8.85553L6.5564 13H3.4436L5 8.85553ZM6.72266 15C6.54618 15.3011 6.29479 15.5515 5.99293 15.7267C5.69107 15.9019 5.34901 15.9961 5 16C4.64903 15.9999 4.30428 15.9074 4.00036 15.7319C3.69644 15.5563 3.44405 15.3039 3.26855 15H6.72266ZM19 8.85553L20.5564 13H17.4436L19 8.85553ZM19 16C18.649 15.9999 18.3043 15.9074 18.0004 15.7319C17.6964 15.5563 17.4441 15.3039 17.2686 15H20.7227C20.5462 15.3011 20.2948 15.5515 19.9929 15.7267C19.6911 15.9019 19.349 15.9961 19 16Z"${add_attribute("fill", fill, 0)}></path></svg>`;
});
const css$2 = {
  code: ".transition-width.svelte-frwh1m{transition:width 200ms}a.active.svelte-frwh1m{color:white !important}",
  map: `{"version":3,"file":"Layout.svelte","sources":["Layout.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nimport { browser } from \\"$app/environment\\";\\nimport { initAuthWorker } from \\"$lib/services/worker.auth.services\\";\\nimport { authStore } from \\"$lib/stores/auth-store\\";\\nimport { authSignedInStore } from \\"$lib/derived/auth.derived\\";\\nimport { toastsError } from \\"$lib/stores/toasts-store\\";\\nimport { writable } from \\"svelte/store\\";\\nimport { BusyScreen, Spinner, Toasts } from \\"@dfinity/gix-components\\";\\nimport LogoIcon from \\"$lib/icons/LogoIcon.svelte\\";\\nimport HomeIcon from \\"$lib/icons/HomeIcon.svelte\\";\\nimport BettingIcon from \\"$lib/icons/BettingIcon.svelte\\";\\nimport GamesIcon from \\"$lib/icons/GamesIcon.svelte\\";\\nimport StarIcon from \\"$lib/icons/StarIcon.svelte\\";\\nimport { fade } from \\"svelte/transition\\";\\nimport \\"../app.css\\";\\nimport { page } from \\"$app/stores\\";\\nimport ProfileIcon from \\"$lib/icons/ProfileIcon.svelte\\";\\nimport LogoutIcon from \\"$lib/icons/LogoutIcon.svelte\\";\\nimport { signOut } from \\"$lib/services/auth.services\\";\\nimport Tooltip from \\"$lib/components/tooltip.svelte\\";\\nimport WhitepaperIcon from \\"$lib/icons/WhitepaperIcon.svelte\\";\\nimport RulesIcon from \\"$lib/icons/RulesIcon.svelte\\";\\nlet isExpanded = writable(false);\\n$: links = $authSignedInStore ? [\\n    { name: \\"Home\\", icon: HomeIcon, href: \\"/\\" },\\n    { name: \\"Profile\\", icon: ProfileIcon, href: \\"/profile\\" },\\n    { name: \\"Governance\\", icon: RulesIcon, href: \\"/governance\\" },\\n    { name: \\"Admin\\", icon: StarIcon, href: \\"/admin\\" }\\n] :\\n    [\\n        { name: \\"Home\\", icon: HomeIcon, href: \\"/\\" }\\n    ];\\nlet worker;\\nconst init = async () => await Promise.all([syncAuthStore()]);\\nconst syncAuthStore = async () => {\\n    if (!browser) {\\n        return;\\n    }\\n    try {\\n        await authStore.sync();\\n    }\\n    catch (err) {\\n        toastsError({\\n            msg: {\\n                text: \\"Unexpected issue while syncing the status of your authentication.\\",\\n            },\\n            err,\\n        });\\n    }\\n};\\nonMount(async () => (worker = await initAuthWorker()));\\n$: activeRoute = $page.url.pathname;\\n$: worker, $authStore, (() => worker?.syncAuthIdle($authStore))();\\n$: (() => {\\n    if (!browser) {\\n        return;\\n    }\\n    if ($authStore === undefined) {\\n        return;\\n    }\\n    const spinner = document.querySelector(\\"body > #app-spinner\\");\\n    spinner?.remove();\\n})();\\nfunction handleLogin() {\\n    let params = {\\n        domain: import.meta.env.VITE_AUTH_PROVIDER_URL,\\n    };\\n    authStore.signIn(params);\\n}\\nasync function handleLogout() {\\n    await authStore.signOut();\\n}\\n<\/script>\\n\\n<svelte:window on:storage={syncAuthStore} />\\n{#await init()}\\n  <div in:fade>\\n    <Spinner />\\n  </div>\\n{:then _}\\n  <div class=\\"flex h-screen\\">\\n    <div\\n      class=\\"bg-GRAY text-white flex flex-col justify-between transition-width duration-300 p-5 rounded-lg m-2\\"\\n      style=\\"width: {$isExpanded ? '16rem' : '4rem'}\\"\\n    >\\n    <div class=\\"flex flex-col flex-grow\\">\\n      <button on:click={() => ($isExpanded = !$isExpanded)} class=\\"mb-4\\">\\n          <span>{$isExpanded ? \\"<<\\" : \\">>\\"}</span>\\n        </button>\\n\\n        <div class=\\"text-gray-400 flex flex-col\\">\\n          <a href=\\"/\\" class=\\"block mt-4 text-lg my-4\\">\\n            <div class=\\"flex flex-row items-center\\">\\n              <LogoIcon className=\\"w-6 mr-2\\" />\\n              {#if $isExpanded}\\n                <span\\n                  in:fade={{ duration: 200 }}\\n                  out:fade={{ delay: 0, duration: 100 }}>FootballGod</span\\n                >\\n              {/if}\\n            </div>\\n          </a>\\n          {#each links as link}\\n            <a\\n              href={link.href}\\n              class:active={activeRoute === link.href}\\n              rel=\\"prefetch\\"\\n              class=\\"block mt-4 text-lg\\"\\n            >\\n              <div class=\\"flex flex-row items-center\\">\\n\\n                <Tooltip text={link.name}>\\n                  <svelte:component\\n                    this={link.icon}\\n                    className=\\"w-6 mr-2\\"\\n                    fill={activeRoute === link.href ? \\"white\\" : \\"gray\\"}\\n                  />\\n                </Tooltip>\\n                {#if $isExpanded}\\n                  <span\\n                    in:fade={{ duration: 200 }}\\n                    out:fade={{ delay: 0, duration: 100 }}>{link.name}</span\\n                  >\\n                {/if}\\n              </div>\\n            </a>\\n          {/each}\\n        </div>\\n      </div>\\n      {#if $authSignedInStore && !$isExpanded}\\n        <button on:click={signOut} in:fade>\\n          <Tooltip text=\\"Logout\\">\\n            <LogoutIcon className=\\"max-w-6\\" />\\n          </Tooltip>\\n        </button>\\n      {/if}\\n      \\n\\n      <div class=\\"mb-4\\">\\n        {#if $isExpanded}\\n          {#if $authSignedInStore}\\n            <button on:click={handleLogout} class=\\"button-hover p-2 rounded-md text-sm w-full\\"\\n                in:fade={{ duration: 200 }}\\n                out:fade={{ delay: 0, duration: 100 }}>Disconnect</button\\n              >\\n          {:else}\\n            <button on:click={handleLogin} class=\\"bg-OPENFPL hover:bg-OPENFPL hover:text-GRAY p-2 rounded-md text-sm w-full\\"\\n                in:fade={{ duration: 200 }}\\n                out:fade={{ delay: 0, duration: 100 }}>Connect Internet Identity</button\\n              >\\n          {/if}\\n        {/if}\\n      </div>\\n    </div>\\n\\n    <div class=\\"flex-1\\">\\n      <slot />\\n    </div>\\n    <Toasts />\\n  </div>\\n{/await}\\n\\n<BusyScreen />\\n\\n<style>\\n  .transition-width {\\n    transition: width 200ms;\\n  }\\n  a.active {\\n    color: white !important;\\n  }</style>"],"names":[],"mappings":"AAqKE,+BAAkB,CAChB,UAAU,CAAE,KAAK,CAAC,KACpB,CACA,CAAC,qBAAQ,CACP,KAAK,CAAE,KAAK,CAAC,UACf"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let links;
  let activeRoute;
  let $$unsubscribe_authStore;
  let $page, $$unsubscribe_page;
  let $authSignedInStore, $$unsubscribe_authSignedInStore;
  let $isExpanded, $$unsubscribe_isExpanded;
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_authSignedInStore = subscribe(authSignedInStore, (value) => $authSignedInStore = value);
  let isExpanded = writable(false);
  $$unsubscribe_isExpanded = subscribe(isExpanded, (value) => $isExpanded = value);
  const init2 = async () => await Promise.all([syncAuthStore()]);
  const syncAuthStore = async () => {
    {
      return;
    }
  };
  $$result.css.add(css$2);
  links = $authSignedInStore ? [
    { name: "Home", icon: HomeIcon, href: "/" },
    {
      name: "Profile",
      icon: ProfileIcon,
      href: "/profile"
    },
    {
      name: "Governance",
      icon: RulesIcon,
      href: "/governance"
    },
    {
      name: "Admin",
      icon: StarIcon,
      href: "/admin"
    }
  ] : [{ name: "Home", icon: HomeIcon, href: "/" }];
  activeRoute = $page.url.pathname;
  $$unsubscribe_authStore();
  $$unsubscribe_page();
  $$unsubscribe_authSignedInStore();
  $$unsubscribe_isExpanded();
  return ` ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ` <div>${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}</div> `;
    }
    return function(_) {
      return ` <div class="flex h-screen"><div class="bg-GRAY text-white flex flex-col justify-between transition-width duration-300 p-5 rounded-lg m-2 svelte-frwh1m" style="${"width: " + escape($isExpanded ? "16rem" : "4rem", true)}"><div class="flex flex-col flex-grow"><button class="mb-4"><span>${escape($isExpanded ? "<<" : ">>")}</span></button> <div class="text-gray-400 flex flex-col"><a href="/" class="block mt-4 text-lg my-4"><div class="flex flex-row items-center">${validate_component(LogoIcon, "LogoIcon").$$render($$result, { className: "w-6 mr-2" }, {}, {})} ${$isExpanded ? `<span data-svelte-h="svelte-judcsy">FootballGod</span>` : ``}</div></a> ${each(links, (link) => {
        return `<a${add_attribute("href", link.href, 0)} rel="prefetch" class="${[
          "block mt-4 text-lg svelte-frwh1m",
          activeRoute === link.href ? "active" : ""
        ].join(" ").trim()}"><div class="flex flex-row items-center">${validate_component(Tooltip, "Tooltip").$$render($$result, { text: link.name }, {}, {
          default: () => {
            return `${validate_component(link.icon || missing_component, "svelte:component").$$render(
              $$result,
              {
                className: "w-6 mr-2",
                fill: activeRoute === link.href ? "white" : "gray"
              },
              {},
              {}
            )} `;
          }
        })} ${$isExpanded ? `<span>${escape(link.name)}</span>` : ``}</div> </a>`;
      })}</div></div> ${$authSignedInStore && !$isExpanded ? `<button>${validate_component(Tooltip, "Tooltip").$$render($$result, { text: "Logout" }, {}, {
        default: () => {
          return `${validate_component(LogoutIcon, "LogoutIcon").$$render($$result, { className: "max-w-6" }, {}, {})}`;
        }
      })}</button>` : ``} <div class="mb-4">${$isExpanded ? `${$authSignedInStore ? `<button class="button-hover p-2 rounded-md text-sm w-full" data-svelte-h="svelte-kl75by">Disconnect</button>` : `<button class="bg-OPENFPL hover:bg-OPENFPL hover:text-GRAY p-2 rounded-md text-sm w-full" data-svelte-h="svelte-lbywhq">Connect Internet Identity</button>`}` : ``}</div></div> <div class="flex-1">${slots.default ? slots.default({}) : ``}</div> ${validate_component(Toasts, "Toasts").$$render($$result, {}, {}, {})}</div> `;
    }();
  }(init2())} ${validate_component(BusyScreen, "BusyScreen").$$render($$result, {}, {}, {})}`;
});
function replacer(key2, value) {
  if (typeof value === "bigint") {
    return value.toString();
  } else {
    return value;
  }
}
function isError(response) {
  return response && response.err !== void 0;
}
function convertEvent(playerEvent) {
  if ("Appearance" in playerEvent)
    return 0;
  if ("Goal" in playerEvent)
    return 1;
  if ("GoalAssisted" in playerEvent)
    return 2;
  if ("GoalConceded" in playerEvent)
    return 3;
  if ("KeeperSave" in playerEvent)
    return 4;
  if ("CleanSheet" in playerEvent)
    return 5;
  if ("PenaltySaved" in playerEvent)
    return 6;
  if ("PenaltyMissed" in playerEvent)
    return 7;
  if ("YellowCard" in playerEvent)
    return 8;
  if ("RedCard" in playerEvent)
    return 9;
  if ("OwnGoal" in playerEvent)
    return 10;
  if ("HighestScoringPlayer" in playerEvent)
    return 11;
  return 0;
}
const css$1 = {
  code: ".overlay-panel.svelte-a3qity{position:absolute;bottom:0;right:0}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount, onDestroy } from \\"svelte\\";\\nimport { writable } from \\"svelte/store\\";\\nimport { authSignedInStore } from \\"$lib/derived/auth.derived\\";\\nimport { authStore } from \\"$lib/stores/auth-store\\";\\nimport { toastsError } from \\"$lib/stores/toasts-store\\";\\nimport Layout from \\"./Layout.svelte\\";\\nimport FootballIcon from \\"$lib/icons/FootballIcon.svelte\\";\\nimport OpenChatIcon from \\"$lib/icons/OpenChatIcon.svelte\\";\\nimport { Spinner } from \\"@dfinity/gix-components\\";\\nimport { isError } from \\"$lib/utils/helpers\\";\\nimport OpenFplIcon from \\"$lib/icons/OpenFPLIcon.svelte\\";\\nlet isLoggedIn = false;\\nlet isLoading = true;\\nlet interval;\\nonMount(async () => {\\n    try {\\n        await authStore.sync();\\n        authStore.subscribe((store) => {\\n            isLoggedIn = store.identity !== null && store.identity !== undefined;\\n        });\\n    }\\n    catch (error) {\\n        toastsError({\\n            msg: { text: \\"Error fetching homepage data.\\" },\\n            err: error,\\n        });\\n        console.error(\\"Error fetching homepage data:\\", error);\\n    }\\n    finally {\\n        isLoading = false;\\n    }\\n});\\nonDestroy(() => {\\n    clearInterval(interval);\\n});\\nlet tiles = [\\n    {\\n        title: \\"OpenFPL\\",\\n        content: \\"Decentralised Premier League fantasy football.\\",\\n        link: \\"https://openfpl.xyz\\",\\n        image: \\"fpl.jpg\\",\\n        buttonText: \\"Play\\",\\n    },\\n    {\\n        title: \\"OpenWSL\\",\\n        content: \\"Decentralised Women's Super League fantasy football.\\",\\n        link: \\"https://openwsl.xyz\\",\\n        image: \\"wsl.jpg\\",\\n        buttonText: \\"Play\\",\\n    },\\n    {\\n        title: \\"Transfer Kings\\",\\n        content: \\"Get your unique 'Transfer Kings' agent name today.\\",\\n        link: \\"https://transferkings.xyz\\",\\n        image: \\"transferkings.png\\",\\n        buttonText: \\"Rules\\",\\n    },\\n];\\nfunction handleLogin() {\\n    let params = {\\n        domain: import.meta.env.VITE_AUTH_PROVIDER_URL,\\n    };\\n    authStore.signIn(params);\\n}\\n<\/script>\\n\\n<Layout>\\n  {#if isLoading}\\n    <Spinner />\\n  {:else}\\n    <div class=\\"relative bg-gray-800 text-white mt-2 mr-2 rounded-lg\\">\\n      <div\\n        class=\\"bg-cover bg-center bg-no-repeat py-20 px-4\\"\\n        style=\\"background-image: url('banner.jpg');\\"\\n      >\\n        <div class=\\"container ml-4 flex flex-col justify-between\\">\\n          <p class=\\"text-xl md:text-4xl font-bold\\">FootballGod</p>\\n          <p class=\\"text-sm md:text-base\\">Decentralised Football Gaming</p>\\n         \\n          <div\\n            class=\\"overlay-panel h-10 rounded-tl-lg w-11/12 md:w-2/3 lg:w-2/5 xl:w-1/4 bg-DARK flex items-center px-1 md:px-4 text-xs md:text-sm\\"\\n          >\\n            <FootballIcon className=\\"w-6 mr-2\\" />\\n            <p class=\\"text-white  font-bold\\">Football Betting coming 2025</p>\\n          </div>\\n        </div>\\n      </div>\\n    </div>\\n    <div class=\\"mr-2 py-2\\">\\n      <div class=\\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\\">\\n        {#each tiles as tile}\\n          <div class=\\"bg-gray-700 rounded-lg overflow-hidden flex flex-col\\">\\n            {#if tile.image}\\n              <img\\n                class=\\"w-full h-48 object-cover\\"\\n                src={tile.image}\\n                alt={tile.title}\\n              />\\n            {/if}\\n            {#if tile.icon}\\n              <div class=\\"flex items-center justify-center h-48 bg-gray-800\\">\\n                <svelte:component this={tile.icon} className=\\"h-32 w-32\\" />\\n              </div>\\n            {/if}\\n            <div class=\\"flex flex-col justify-between flex-grow p-4\\">\\n              <div class=\\"flex-grow\\">\\n                <h3 class=\\"text-xl font-bold text-white\\">{tile.title}</h3>\\n                <p class=\\"mt-2 text-white\\">{tile.content}</p>\\n              </div>\\n              <div class=\\"mt-4 flex justify-end\\">\\n                <a\\n                  href={tile.link}\\n                  class=\\"bg-black text-white px-4 py-2 rounded\\"\\n                  target={tile.link.startsWith(\\"http\\") ? \\"_blank\\" : \\"_self\\"}\\n                  rel={tile.link.startsWith(\\"http\\") ? \\"noopener noreferrer\\" : \\"\\"}\\n                >\\n                  {tile.buttonText}\\n                </a>\\n              </div>\\n            </div>\\n          </div>\\n        {/each}\\n      </div>\\n    </div>\\n    \\n  {/if}\\n</Layout>\\n\\n<style>\\n  .overlay-container {\\n    position: relative;\\n  }\\n\\n  .overlay-panel {\\n    position: absolute;\\n    bottom: 0;\\n    right: 0;\\n  }</style>"],"names":[],"mappings":"AAqIE,4BAAe,CACb,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CACT,KAAK,CAAE,CACT"}`
};
const Page$5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let interval;
  onDestroy(() => {
    clearInterval(interval);
  });
  $$result.css.add(css$1);
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}`;
    }
  })}`;
});
const idlFactory = ({ IDL }) => {
  const LeagueId = IDL.Nat16;
  const FixtureStatusType = IDL.Variant({
    "Unplayed": IDL.Null,
    "Finalised": IDL.Null,
    "Active": IDL.Null,
    "Complete": IDL.Null
  });
  const SeasonId = IDL.Nat16;
  const ClubId = IDL.Nat16;
  const FixtureId = IDL.Nat32;
  const PlayerEventType = IDL.Variant({
    "PenaltyMissed": IDL.Null,
    "Goal": IDL.Null,
    "GoalConceded": IDL.Null,
    "Appearance": IDL.Null,
    "PenaltySaved": IDL.Null,
    "RedCard": IDL.Null,
    "KeeperSave": IDL.Null,
    "CleanSheet": IDL.Null,
    "YellowCard": IDL.Null,
    "GoalAssisted": IDL.Null,
    "OwnGoal": IDL.Null,
    "HighestScoringPlayer": IDL.Null
  });
  const PlayerEventData = IDL.Record({
    "fixtureId": FixtureId,
    "clubId": ClubId,
    "playerId": IDL.Nat16,
    "eventStartMinute": IDL.Nat8,
    "eventEndMinute": IDL.Nat8,
    "eventType": PlayerEventType
  });
  const GameweekNumber = IDL.Nat8;
  const FixtureDTO = IDL.Record({
    "id": IDL.Nat32,
    "status": FixtureStatusType,
    "highestScoringPlayerId": IDL.Nat16,
    "seasonId": SeasonId,
    "awayClubId": ClubId,
    "events": IDL.Vec(PlayerEventData),
    "homeClubId": ClubId,
    "kickOff": IDL.Int,
    "homeGoals": IDL.Nat8,
    "gameweek": GameweekNumber,
    "awayGoals": IDL.Nat8
  });
  const AddInitialFixturesDTO = IDL.Record({
    "seasonFixtures": IDL.Vec(FixtureDTO),
    "leagueId": LeagueId
  });
  const Gender = IDL.Variant({ "Male": IDL.Null, "Female": IDL.Null });
  const CountryId = IDL.Nat16;
  const CreateLeagueDTO = IDL.Record({
    "logo": IDL.Vec(IDL.Nat8),
    "name": IDL.Text,
    "teamCount": IDL.Nat8,
    "relatedGender": Gender,
    "countryId": CountryId,
    "abbreviation": IDL.Text,
    "governingBody": IDL.Text,
    "formed": IDL.Int
  });
  const PlayerPosition = IDL.Variant({
    "Goalkeeper": IDL.Null,
    "Midfielder": IDL.Null,
    "Forward": IDL.Null,
    "Defender": IDL.Null
  });
  const CreatePlayerDTO = IDL.Record({
    "clubId": ClubId,
    "valueQuarterMillions": IDL.Nat16,
    "dateOfBirth": IDL.Int,
    "nationality": CountryId,
    "gender": Gender,
    "shirtNumber": IDL.Nat8,
    "position": PlayerPosition,
    "lastName": IDL.Text,
    "leagueId": LeagueId,
    "firstName": IDL.Text
  });
  const PlayerId = IDL.Nat16;
  const LoanPlayerDTO = IDL.Record({
    "loanEndDate": IDL.Int,
    "playerId": PlayerId,
    "loanClubId": ClubId,
    "loanLeagueId": LeagueId,
    "leagueId": LeagueId
  });
  const MoveFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "updatedFixtureGameweek": GameweekNumber,
    "updatedFixtureDate": IDL.Int,
    "leagueId": LeagueId
  });
  const PostponeFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "leagueId": LeagueId
  });
  const ShirtType = IDL.Variant({ "Filled": IDL.Null, "Striped": IDL.Null });
  const PromoteNewClubDTO = IDL.Record({
    "secondaryColourHex": IDL.Text,
    "name": IDL.Text,
    "friendlyName": IDL.Text,
    "thirdColourHex": IDL.Text,
    "abbreviatedName": IDL.Text,
    "shirtType": ShirtType,
    "primaryColourHex": IDL.Text,
    "leagueId": LeagueId
  });
  const RecallPlayerDTO = IDL.Record({
    "playerId": PlayerId,
    "leagueId": LeagueId
  });
  const RescheduleFixtureDTO = IDL.Record({
    "postponedFixtureId": FixtureId,
    "updatedFixtureGameweek": GameweekNumber,
    "updatedFixtureDate": IDL.Int,
    "leagueId": LeagueId
  });
  const RetirePlayerDTO = IDL.Record({
    "playerId": PlayerId,
    "retirementDate": IDL.Int,
    "leagueId": LeagueId
  });
  const RevaluePlayerDownDTO = IDL.Record({
    "playerId": PlayerId,
    "leagueId": LeagueId
  });
  const RevaluePlayerUpDTO = IDL.Record({
    "playerId": PlayerId,
    "leagueId": LeagueId
  });
  const SetPlayerInjuryDTO = IDL.Record({
    "playerId": PlayerId,
    "description": IDL.Text,
    "leagueId": LeagueId,
    "expectedEndDate": IDL.Int
  });
  const TransferPlayerDTO = IDL.Record({
    "clubId": ClubId,
    "newLeagueId": LeagueId,
    "playerId": PlayerId,
    "newShirtNumber": IDL.Nat8,
    "newClubId": ClubId,
    "leagueId": LeagueId
  });
  const UnretirePlayerDTO = IDL.Record({
    "playerId": PlayerId,
    "leagueId": LeagueId
  });
  const UpdateClubDTO = IDL.Record({
    "clubId": ClubId,
    "secondaryColourHex": IDL.Text,
    "name": IDL.Text,
    "friendlyName": IDL.Text,
    "thirdColourHex": IDL.Text,
    "abbreviatedName": IDL.Text,
    "shirtType": ShirtType,
    "primaryColourHex": IDL.Text,
    "leagueId": LeagueId
  });
  const UpdateLeagueDTO = IDL.Record({
    "logo": IDL.Vec(IDL.Nat8),
    "name": IDL.Text,
    "teamCount": IDL.Nat8,
    "relatedGender": Gender,
    "countryId": CountryId,
    "abbreviation": IDL.Text,
    "governingBody": IDL.Text,
    "leagueId": LeagueId,
    "formed": IDL.Int
  });
  const UpdatePlayerDTO = IDL.Record({
    "dateOfBirth": IDL.Int,
    "playerId": PlayerId,
    "nationality": CountryId,
    "shirtNumber": IDL.Nat8,
    "position": PlayerPosition,
    "lastName": IDL.Text,
    "leagueId": LeagueId,
    "firstName": IDL.Text
  });
  const ClubDTO = IDL.Record({
    "id": ClubId,
    "secondaryColourHex": IDL.Text,
    "name": IDL.Text,
    "friendlyName": IDL.Text,
    "thirdColourHex": IDL.Text,
    "abbreviatedName": IDL.Text,
    "shirtType": ShirtType,
    "primaryColourHex": IDL.Text
  });
  const Error2 = IDL.Variant({
    "DecodeError": IDL.Null,
    "NotAllowed": IDL.Null,
    "NotFound": IDL.Null,
    "NotAuthorized": IDL.Null,
    "AlreadyExists": IDL.Null
  });
  const Result_3 = IDL.Variant({ "ok": IDL.Vec(ClubDTO), "err": Error2 });
  const FootballLeagueDTO = IDL.Record({
    "id": LeagueId,
    "logo": IDL.Vec(IDL.Nat8),
    "name": IDL.Text,
    "teamCount": IDL.Nat8,
    "relatedGender": Gender,
    "countryId": CountryId,
    "abbreviation": IDL.Text,
    "governingBody": IDL.Text,
    "formed": IDL.Int
  });
  const Result_2 = IDL.Variant({
    "ok": IDL.Vec(FootballLeagueDTO),
    "err": Error2
  });
  const PlayerStatus = IDL.Variant({
    "OnLoan": IDL.Null,
    "Active": IDL.Null,
    "FreeAgent": IDL.Null,
    "Retired": IDL.Null
  });
  const PlayerDTO = IDL.Record({
    "id": IDL.Nat16,
    "status": PlayerStatus,
    "clubId": ClubId,
    "valueQuarterMillions": IDL.Nat16,
    "dateOfBirth": IDL.Int,
    "nationality": CountryId,
    "shirtNumber": IDL.Nat8,
    "position": PlayerPosition,
    "lastName": IDL.Text,
    "leagueId": LeagueId,
    "firstName": IDL.Text
  });
  const Result_1 = IDL.Variant({ "ok": IDL.Vec(PlayerDTO), "err": Error2 });
  const Result = IDL.Variant({ "ok": IDL.Bool, "err": Error2 });
  const RustResult = IDL.Variant({ "Ok": IDL.Text, "Err": IDL.Text });
  const SubmitFixtureDataDTO = IDL.Record({
    "fixtureId": FixtureId,
    "playerEventData": IDL.Vec(PlayerEventData),
    "leagueId": LeagueId
  });
  return IDL.Service({
    "executeAddInitialFixtures": IDL.Func(
      [LeagueId, AddInitialFixturesDTO],
      [],
      []
    ),
    "executeCreateLeague": IDL.Func([CreateLeagueDTO], [], ["query"]),
    "executeCreatePlayer": IDL.Func([LeagueId, CreatePlayerDTO], [], []),
    "executeLoanPlayer": IDL.Func([LeagueId, LoanPlayerDTO], [], []),
    "executeMoveFixture": IDL.Func([LeagueId, MoveFixtureDTO], [], []),
    "executePostponeFixture": IDL.Func([LeagueId, PostponeFixtureDTO], [], []),
    "executePromoteNewClub": IDL.Func([LeagueId, PromoteNewClubDTO], [], []),
    "executeRecallPlayer": IDL.Func([LeagueId, RecallPlayerDTO], [], []),
    "executeRescheduleFixture": IDL.Func(
      [LeagueId, RescheduleFixtureDTO],
      [],
      []
    ),
    "executeRetirePlayer": IDL.Func([LeagueId, RetirePlayerDTO], [], []),
    "executeRevaluePlayerDown": IDL.Func(
      [LeagueId, RevaluePlayerDownDTO],
      [],
      []
    ),
    "executeRevaluePlayerUp": IDL.Func([LeagueId, RevaluePlayerUpDTO], [], []),
    "executeSetPlayerInjury": IDL.Func([LeagueId, SetPlayerInjuryDTO], [], []),
    "executeTransferPlayer": IDL.Func([LeagueId, TransferPlayerDTO], [], []),
    "executeUnretirePlayer": IDL.Func([LeagueId, UnretirePlayerDTO], [], []),
    "executeUpdateClub": IDL.Func([LeagueId, UpdateClubDTO], [], []),
    "executeUpdateLeague": IDL.Func([UpdateLeagueDTO], [], ["query"]),
    "executeUpdatePlayer": IDL.Func([LeagueId, UpdatePlayerDTO], [], []),
    "getLeagueClubs": IDL.Func([LeagueId], [Result_3], ["composite_query"]),
    "getLeagues": IDL.Func([], [Result_2], ["composite_query"]),
    "getPlayers": IDL.Func([LeagueId], [Result_1], ["composite_query"]),
    "isAdmin": IDL.Func([], [Result], []),
    "validateAddInitialFixtures": IDL.Func(
      [AddInitialFixturesDTO],
      [RustResult],
      ["query"]
    ),
    "validateCreateLeague": IDL.Func(
      [CreateLeagueDTO],
      [RustResult],
      ["query"]
    ),
    "validateCreatePlayer": IDL.Func(
      [CreatePlayerDTO],
      [RustResult],
      ["query"]
    ),
    "validateLoanPlayer": IDL.Func([LoanPlayerDTO], [RustResult], ["query"]),
    "validateMoveFixture": IDL.Func([MoveFixtureDTO], [RustResult], ["query"]),
    "validatePostponeFixture": IDL.Func(
      [PostponeFixtureDTO],
      [RustResult],
      ["query"]
    ),
    "validatePromoteNewClub": IDL.Func(
      [PromoteNewClubDTO],
      [RustResult],
      ["query"]
    ),
    "validateRecallPlayer": IDL.Func(
      [RecallPlayerDTO],
      [RustResult],
      ["query"]
    ),
    "validateRescheduleFixture": IDL.Func(
      [RescheduleFixtureDTO],
      [RustResult],
      ["query"]
    ),
    "validateRetirePlayer": IDL.Func(
      [RetirePlayerDTO],
      [RustResult],
      ["query"]
    ),
    "validateRevaluePlayerDown": IDL.Func(
      [RevaluePlayerDownDTO],
      [RustResult],
      ["query"]
    ),
    "validateRevaluePlayerUp": IDL.Func(
      [RevaluePlayerUpDTO],
      [RustResult],
      ["query"]
    ),
    "validateSetPlayerInjury": IDL.Func(
      [SetPlayerInjuryDTO],
      [RustResult],
      ["query"]
    ),
    "validateSubmitFixtureData": IDL.Func(
      [SubmitFixtureDataDTO],
      [RustResult],
      ["query"]
    ),
    "validateTransferPlayer": IDL.Func(
      [TransferPlayerDTO],
      [RustResult],
      ["query"]
    ),
    "validateUnretirePlayer": IDL.Func(
      [UnretirePlayerDTO],
      [RustResult],
      ["query"]
    ),
    "validateUpdateClub": IDL.Func([UpdateClubDTO], [RustResult], ["query"]),
    "validateUpdateLeague": IDL.Func(
      [UpdateLeagueDTO],
      [RustResult],
      ["query"]
    ),
    "validateUpdatePlayer": IDL.Func(
      [UpdatePlayerDTO],
      [RustResult],
      ["query"]
    )
  });
};
var define_process_env_default$a = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const canisterId = define_process_env_default$a.CANISTER_ID_FOOTBALL_GOD_BACKEND;
const createActor = (canisterId2, options2 = {}) => {
  const agent = options2.agent || new HttpAgent({ ...options2.agentOptions });
  if (options2.agent && options2.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId2,
    ...options2.actorOptions
  });
};
canisterId ? createActor(canisterId) : void 0;
class ActorFactory {
  static createActor(idlFactory2, canisterId2 = "", identity = null, options2 = null) {
    const hostOptions = {
      host: `https://${canisterId2}.icp-api.io`,
      identity
    };
    if (!options2) {
      options2 = {
        agentOptions: hostOptions
      };
    } else if (!options2.agentOptions) {
      options2.agentOptions = hostOptions;
    } else {
      options2.agentOptions.host = hostOptions.host;
    }
    const agent = new HttpAgent({ ...options2.agentOptions });
    return Actor.createActor(idlFactory2, {
      agent,
      canisterId: canisterId2,
      ...options2?.actorOptions
    });
  }
  static getAgent(canisterId2 = "", identity = null, options2 = null) {
    const hostOptions = {
      host: `https://${canisterId2}.icp-api.io`,
      identity
    };
    if (!options2) {
      options2 = {
        agentOptions: hostOptions
      };
    } else if (!options2.agentOptions) {
      options2.agentOptions = hostOptions;
    } else {
      options2.agentOptions.host = hostOptions.host;
    }
    return new HttpAgent({ ...options2.agentOptions });
  }
  static createIdentityActor(authStore2, canisterId2) {
    let unsubscribe;
    return new Promise((resolve2, reject) => {
      unsubscribe = authStore2.subscribe((store) => {
        if (store.identity) {
          resolve2(store.identity);
        }
      });
    }).then((identity) => {
      unsubscribe();
      return ActorFactory.createActor(idlFactory, canisterId2, identity);
    });
  }
  static createGovernanceAgent(authStore2, canisterId2) {
    let unsubscribe;
    return new Promise((resolve2, reject) => {
      unsubscribe = authStore2.subscribe((store) => {
        if (store.identity) {
          resolve2(store.identity);
        }
      });
    }).then((identity) => {
      unsubscribe();
      return ActorFactory.createActor(idlFactory, canisterId2, identity);
    });
  }
}
var define_process_env_default$9 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
class ClubService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$9.OPENFPL_BACKEND_CANISTER_ID
    );
  }
  async getClubs(leagueId) {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result))
      throw new Error("Failed to fetch clubs");
    return result.ok;
  }
}
function createClubStore() {
  async function getClubs(leagueId) {
    return new ClubService().getClubs(leagueId);
  }
  return {
    getClubs
  };
}
const clubStore = createClubStore();
var define_process_env_default$8 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
function createPlayerStore() {
  const { subscribe: subscribe2, set } = writable([]);
  ActorFactory.createActor(
    idlFactory,
    define_process_env_default$8.FOOTBALL_GOD_BACKEND_CANISTER_ID
  );
  async function sync() {
  }
  return {
    subscribe: subscribe2,
    sync
  };
}
const playerStore = createPlayerStore();
var define_process_env_default$7 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
class FixtureService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$7.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async getPostponedFixtures() {
    const result = await this.actor.getPostponedFixtures();
    if (isError(result))
      throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }
  async getFixtures(seasonId) {
    let dto = {
      seasonId
    };
    const result = await this.actor.getFixtures(dto);
    if (isError(result))
      throw new Error("Failed to fetch fixtures");
    return result.ok;
  }
}
function createFixtureStore() {
  const { subscribe: subscribe2, set } = writable([]);
  async function getPostponedFixtures() {
    return new FixtureService().getPostponedFixtures();
  }
  async function getNextFixture() {
    let fixtures = [];
    await subscribe2((value) => {
      fixtures = value;
    })();
    if (fixtures.length == 0) {
      return;
    }
    const now = /* @__PURE__ */ new Date();
    return fixtures.find(
      (fixture) => new Date(Number(fixture.kickOff) / 1e6) > now
    );
  }
  return {
    subscribe: subscribe2,
    setFixtures: (fixtures) => set(fixtures),
    getNextFixture,
    getPostponedFixtures
  };
}
const fixtureStore = createFixtureStore();
const Confirm_fixture_data_modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visible = false } = $$props;
  let { onConfirm } = $$props;
  let { closeModal } = $$props;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.onConfirm === void 0 && $$bindings.onConfirm && onConfirm !== void 0)
    $$bindings.onConfirm(onConfirm);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h4 data-svelte-h="svelte-1yevh2p">Confirm Fixture Data</h4> <button class="text-black" data-svelte-h="svelte-naxdfo">✕</button></div> <div class="my-5" data-svelte-h="svelte-1kpybyt"><h1>Please confirm your fixture data.</h1> <p class="text-gray-600">You will not be able to edit your submission and entries that differ
        from the accepted consensus data will not receive $FPL rewards. If
        consensus has already been reached for the fixture your submission will
        also not be counted.</p></div> <div class="flex justify-end gap-3"><button class="default-button fpl-cancel-btn" type="button" data-svelte-h="svelte-1n52tb1">Cancel</button> <button class="default-button brand-button" data-svelte-h="svelte-1expxo6">Confirm</button></div></div>`;
    }
  })}`;
});
const Clear_draft_modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visible = false } = $$props;
  let { onConfirm } = $$props;
  let { closeModal } = $$props;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.onConfirm === void 0 && $$bindings.onConfirm && onConfirm !== void 0)
    $$bindings.onConfirm(onConfirm);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-rcqdii">Clear Draft</h3> <button class="times-button" data-svelte-h="svelte-2aq7vi">×</button></div> <p data-svelte-h="svelte-idipww">Please confirm you want to clear the draft from your cache.</p> <div class="items-center py-3 flex space-x-4"><button class="default-button fpl-cancel-btn" type="button" data-svelte-h="svelte-1husm0b">Cancel</button> <button class="default-button brand-button" data-svelte-h="svelte-6k1q97">Clear</button></div></div>`;
    }
  })}`;
});
function createCountryStore() {
  const { subscribe: subscribe2, set } = writable([]);
  return {
    subscribe: subscribe2,
    setCountries: (countries) => set(countries)
  };
}
const countryStore = createCountryStore();
var define_process_env_default$6 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
class LeagueService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$6.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async getLeagues() {
    const result = await this.actor.getLeagues();
    if (isError(result))
      throw new Error("Failed to fetch leagues");
    return result.ok;
  }
  async setLeagueName(leagueId, leagueName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueName(leagueId, leagueName);
    if (isError(result))
      throw new Error("Failed to set league name");
  }
  async setAbbreviatedName(leagueId, abbreviatedName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setAbbreviatedLeagueName(
      leagueId,
      abbreviatedName
    );
    if (isError(result))
      throw new Error("Failed to set abbreviated league name");
  }
  async setGoverningBody(leagueId, governingBody) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueGoverningBody(
      leagueId,
      governingBody
    );
    if (isError(result))
      throw new Error("Failed to set governing body");
  }
  async setGender(leagueId, gender) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueGender(leagueId, gender);
    if (isError(result))
      throw new Error("Failed to set league gender");
  }
  async setDateFormed(leagueId, date) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueDateFormed(leagueId, date);
    if (isError(result))
      throw new Error("Failed to set league formed date");
  }
  async setCountryId(leagueId, countryId) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueCountryId(leagueId, countryId);
    if (isError(result))
      throw new Error("Failed to set league country");
  }
  async setLogo(leagueId, logo) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setLeagueLogo(leagueId, logo);
    if (isError(result))
      throw new Error("Failed to set league logo");
  }
  async setTeamCount(leagueId, teamCount) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.setTeamCount(leagueId, teamCount);
    if (isError(result))
      throw new Error("Failed to set league team count");
  }
  async createLeague(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$6.OPENFPL_BACKEND_CANISTER_ID ?? ""
    );
    const result = await identityActor.createLeague(dto);
    if (isError(result))
      throw new Error("Failed to create league");
  }
}
function createLeagueStore() {
  const { subscribe: subscribe2, set } = writable([]);
  async function updateName(leagueId, leagueName) {
    return new LeagueService().setLeagueName(leagueId, leagueName);
  }
  async function updateAbbreviatedName(leagueId, abbreviatedName) {
    return new LeagueService().setAbbreviatedName(leagueId, abbreviatedName);
  }
  async function updateGoverningBody(leagueId, governingBody) {
    return new LeagueService().setGoverningBody(leagueId, governingBody);
  }
  async function updateGender(leagueId, gender) {
    return new LeagueService().setGender(leagueId, gender);
  }
  async function updateDateFormed(leagueId, dateFormed) {
    return new LeagueService().setDateFormed(leagueId, dateFormed);
  }
  async function updateCountryId(leagueId, countryId) {
    return new LeagueService().setCountryId(leagueId, countryId);
  }
  async function updateLogo(leagueId, logo) {
    return new LeagueService().setLogo(leagueId, logo);
  }
  async function updateTeamCount(leagueId, teamCount) {
    return new LeagueService().setTeamCount(leagueId, teamCount);
  }
  return {
    subscribe: subscribe2,
    setLeagues: (leagues) => set(leagues),
    updateName,
    updateAbbreviatedName,
    updateGoverningBody,
    updateGender,
    updateDateFormed,
    updateCountryId,
    updateLogo,
    updateTeamCount
  };
}
const leagueStore = createLeagueStore();
var define_process_env_default$5 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
class DataHashService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$5.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async getDataHashes() {
    const result = await this.actor.getDataHashes();
    if (isError(result))
      throw new Error("Failed to fetch data hashes");
    return result.ok;
  }
}
var define_process_env_default$4 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
class CountryService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$4.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  /*
  async getCountries(): Promise<CountryDTO[]> {
    const result = await this.actor.getCountries();
    if (isError(result)) throw new Error("Failed to fetch countries");
    return result.ok;
  }
    */
}
class StoreManager {
  constructor() {
    this.categories = ["countries", "leagues"];
    this.dataHashService = new DataHashService();
    this.countryService = new CountryService();
    this.leagueService = new LeagueService();
  }
  async syncStores() {
    const newHashes = await this.dataHashService.getDataHashes();
    let error = isError(newHashes);
    if (error) {
      console.error("Error fetching data hashes.");
      return;
    }
    for (const category of this.categories) {
      console.log(`syncing ${category}`);
      const categoryHash = newHashes.find((hash2) => hash2.category === category);
      if (categoryHash?.hash !== localStorage.getItem(`${category}_hash`)) {
        await this.syncCategory(category);
        localStorage.setItem(`${category}_hash`, categoryHash?.hash || "");
      } else {
        this.loadFromCache(category);
      }
    }
  }
  async syncCategory(category) {
    switch (category) {
      case "countries":
        const updatedCountries = await this.countryService.getCountries();
        countryStore.setCountries(updatedCountries);
        localStorage.setItem(
          "countries",
          JSON.stringify(updatedCountries, replacer)
        );
        break;
      case "leagues":
        const updatedLeagues = await this.leagueService.getLeagues();
        leagueStore.setLeagues(updatedLeagues);
        localStorage.setItem(
          "leagues",
          JSON.stringify(updatedLeagues, replacer)
        );
        break;
    }
  }
  loadFromCache(category) {
    const cachedData = localStorage.getItem(category);
    switch (category) {
      case "countries":
        const cachedCountries = JSON.parse(cachedData || "[]");
        countryStore.setCountries(cachedCountries);
        break;
      case "leagues":
        const cachedLeagues = JSON.parse(cachedData || "[]");
        leagueStore.setLeagues(cachedLeagues);
        break;
    }
  }
}
new StoreManager();
const Page$4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let fixtureId;
  let $playerEventData, $$unsubscribe_playerEventData = noop, $$subscribe_playerEventData = () => ($$unsubscribe_playerEventData(), $$unsubscribe_playerEventData = subscribe(playerEventData, ($$value) => $playerEventData = $$value), playerEventData);
  let $$unsubscribe_clubStore;
  let $selectedPlayers, $$unsubscribe_selectedPlayers;
  let $page, $$unsubscribe_page;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let showClearDraftModal = false;
  let showConfirmDataModal = false;
  let selectedPlayers = writable([]);
  $$unsubscribe_selectedPlayers = subscribe(selectedPlayers, (value) => $selectedPlayers = value);
  let playerEventData = writable([]);
  $$subscribe_playerEventData();
  async function confirmFixtureData() {
    busyStore.startBusy({
      initiator: "confirm-data",
      text: "Saving fixture data..."
    });
    try {
      localStorage.removeItem(`fixtureDraft_${fixtureId}`);
      toastsShow({
        text: "Fixture data saved.",
        level: "success",
        duration: 2e3
      });
      goto("/fixture-validation");
    } catch (error) {
      toastsError({
        msg: { text: "Error saving fixture data." },
        err: error
      });
      console.error("Error saving fixture data: ", error);
    } finally {
      showConfirmDataModal = false;
      busyStore.stopBusy("confirm-data");
    }
  }
  function clearDraft() {
    $$subscribe_playerEventData(playerEventData = writable([]));
    localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    toastsShow({
      text: "Draft cleared.",
      level: "success",
      duration: 2e3
    });
    closeConfirmClearDraftModal();
  }
  function closeConfirmClearDraftModal() {
    showClearDraftModal = false;
  }
  function closeConfirmDataModal() {
    showConfirmDataModal = false;
  }
  fixtureId = Number($page.url.searchParams.get("id"));
  $playerEventData.length == 0 || $playerEventData.filter((x) => convertEvent(x.eventType) == 0).length != $selectedPlayers.length;
  $$unsubscribe_playerEventData();
  $$unsubscribe_clubStore();
  $$unsubscribe_selectedPlayers();
  $$unsubscribe_page();
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}`;
    }
  })} ${``} ${``} ${validate_component(Confirm_fixture_data_modal, "ConfirmFixtureDataModal").$$render(
    $$result,
    {
      visible: showConfirmDataModal,
      onConfirm: confirmFixtureData,
      closeModal: closeConfirmDataModal
    },
    {},
    {}
  )} ${validate_component(Clear_draft_modal, "ClearDraftModal").$$render(
    $$result,
    {
      closeModal: closeConfirmClearDraftModal,
      visible: showClearDraftModal,
      onConfirm: clearDraft
    },
    {},
    {}
  )}`;
});
const css = {
  code: ".local-spinner.svelte-pvdm52{border:5px solid rgba(255, 255, 255, 0.3);border-top:5px solid white;border-radius:50%;width:50px;height:50px;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);animation:svelte-pvdm52-spin 1s linear infinite}@keyframes svelte-pvdm52-spin{0%{transform:translate(-50%, -50%) rotate(0deg)}100%{transform:translate(-50%, -50%) rotate(360deg)}}",
  map: '{"version":3,"file":"local-spinner.svelte","sources":["local-spinner.svelte"],"sourcesContent":["<div class=\\"local-spinner\\" />\\n\\n<style>\\n  .local-spinner {\\n    border: 5px solid rgba(255, 255, 255, 0.3);\\n    border-top: 5px solid white;\\n    border-radius: 50%;\\n    width: 50px;\\n    height: 50px;\\n    position: absolute;\\n    top: 50%;\\n    left: 50%;\\n    transform: translate(-50%, -50%);\\n    animation: spin 1s linear infinite;\\n  }\\n\\n  @keyframes spin {\\n    0% {\\n      transform: translate(-50%, -50%) rotate(0deg);\\n    }\\n    100% {\\n      transform: translate(-50%, -50%) rotate(360deg);\\n    }\\n  }</style>\\n"],"names":[],"mappings":"AAGE,4BAAe,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1C,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,CAC3B,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAChC,SAAS,CAAE,kBAAI,CAAC,EAAE,CAAC,MAAM,CAAC,QAC5B,CAEA,WAAW,kBAAK,CACd,EAAG,CACD,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,CAC9C,CACA,IAAK,CACH,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,MAAM,CAChD,CACF"}'
};
const Local_spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="local-spinner svelte-pvdm52"></div>`;
});
const Revalue_player_up = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-15yd750">Revalue Player Up</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
const Revalue_player_down = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-itffcx">Revalue Player Down</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
              px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
var define_process_env_default$3 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const Move_fixture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  let $$unsubscribe_fixtureStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  $$unsubscribe_fixtureStore = subscribe(fixtureStore, (value) => value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let gameweeks = Array.from(
    {
      length: Number(define_process_env_default$3.TOTAL_GAMEWEEKS)
    },
    (_, i) => i + 1
  );
  let selectedFixtureId = 0;
  let gameweekFixtures = [];
  let date = "";
  let time = "";
  let showConfirm = false;
  function getTeamById(teamId) {
    return $clubStore.find((x) => x.id === teamId);
  }
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = !selectedFixtureId;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  $$unsubscribe_fixtureStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-kmrp2y">Move Fixture</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1hdxidk">Select Gameweek:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1qi0ln6">Select Gameweek</option>${each(gameweeks, (gameweek) => {
        return `<option${add_attribute("value", gameweek, 0)}>Gameweek ${escape(gameweek)}</option>`;
      })}</select></div> <div class="flex-col space-y-2"><p data-svelte-h="svelte-1mcsvml">Select Fixture:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1xsaz9j">Select Fixture</option>${each(gameweekFixtures, (fixture) => {
        let homeTeam = getTeamById(fixture.homeClubId), awayTeam = getTeamById(fixture.awayClubId);
        return `  <option${add_attribute("value", fixture.id, 0)}>${escape(homeTeam.friendlyName)} v ${escape(awayTeam.friendlyName)}</option>`;
      })}</select></div> <div class="border-b border-gray-200 my-4"></div> <p class="mr-2 my-2" data-svelte-h="svelte-1ct6cbi">Set new date:</p> <div class="flex flex-row my-2"><p class="mr-2" data-svelte-h="svelte-1gu3l1z">Select Date:</p> <input type="date" class="input input-bordered"${add_attribute("value", date, 0)}></div> <div class="flex flex-row my-2"><p class="mr-2" data-svelte-h="svelte-y26t78">Select Time:</p> <input type="time" class="input input-bordered"${add_attribute("value", time, 0)}></div> <div class="flex flex-row my-2 items-center"><p class="mr-2" data-svelte-h="svelte-1ullkw5">Select Gameweek:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1kvgm78">Select New Gameweek</option>${each(gameweeks, (gameweek) => {
        return `<option${add_attribute("value", gameweek, 0)}>Gameweek ${escape(gameweek)}</option>`;
      })}</select></div> <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
var define_process_env_default$2 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const Postpone_fixture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  let $$unsubscribe_fixtureStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  $$unsubscribe_fixtureStore = subscribe(fixtureStore, (value) => value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let gameweeks = Array.from(
    {
      length: Number(define_process_env_default$2.TOTAL_GAMEWEEKS)
    },
    (_, i) => i + 1
  );
  let selectedFixtureId = 0;
  let gameweekFixtures = [];
  let showConfirm = false;
  function getTeamById(teamId) {
    return $clubStore.find((x) => x.id === teamId);
  }
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = !selectedFixtureId;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  $$unsubscribe_fixtureStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-p6nm2f">Postpone Fixture</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1hdxidk">Select Gameweek:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1qi0ln6">Select Gameweek</option>${each(gameweeks, (gameweek) => {
        return `<option${add_attribute("value", gameweek, 0)}>Gameweek ${escape(gameweek)}</option>`;
      })}</select></div> <div class="flex-col space-y-2"><p data-svelte-h="svelte-1mcsvml">Select Fixture:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1xsaz9j">Select Fixture</option>${each(gameweekFixtures, (fixture) => {
        let homeTeam = getTeamById(fixture.homeClubId), awayTeam = getTeamById(fixture.awayClubId);
        return `  <option${add_attribute("value", fixture.id, 0)}>${escape(homeTeam.friendlyName)} v ${escape(awayTeam.friendlyName)}</option>`;
      })}</select></div> <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
var define_process_env_default$1 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const Reschedule_fixture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let gameweeks = Array.from(
    {
      length: Number(define_process_env_default$1.TOTAL_GAMEWEEKS)
    },
    (_, i) => i + 1
  );
  let selectedFixtureId = 0;
  let postponedFixtures = [];
  let date = "";
  let time = "";
  let showConfirm = false;
  function getTeamById(teamId) {
    return $clubStore.find((x) => x.id === teamId);
  }
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = !selectedFixtureId;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-q68hh1">Reschedule Fixture</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-ywwbfb">Select Postponed Fixture:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1xsaz9j">Select Fixture</option>${each(postponedFixtures, (fixture) => {
        let homeTeam = getTeamById(fixture.homeClubId), awayTeam = getTeamById(fixture.awayClubId);
        return `  <option${add_attribute("value", fixture.id, 0)}>${escape(homeTeam.friendlyName)} v ${escape(awayTeam.friendlyName)}</option>`;
      })}</select></div> <div class="border-b border-gray-200"></div> <p class="mr-2 my-2" data-svelte-h="svelte-1ct6cbi">Set new date:</p> <div class="flex flex-row my-2"><p class="mr-2" data-svelte-h="svelte-1gu3l1z">Select Date:</p> <input type="date" class="input input-bordered"${add_attribute("value", date, 0)}></div> <div class="flex flex-row my-2"><p class="mr-2" data-svelte-h="svelte-y26t78">Select Time:</p> <input type="time" class="input input-bordered"${add_attribute("value", time, 0)}></div> <div class="flex flex-row my-2 items-center"><p class="mr-2" data-svelte-h="svelte-1ullkw5">Select Gameweek:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1kvgm78">Select New Gameweek</option>${each(gameweeks, (gameweek) => {
        return `<option${add_attribute("value", gameweek, 0)}>Gameweek ${escape(gameweek)}</option>`;
      })}</select></div> <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Loan_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-yv1guj">Loan Player</h3> <button class="times-button" data-svelte-h="svelte-2aq7vi">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
const Transfer_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $leagueStore, $$unsubscribe_leagueStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_leagueStore = subscribe(leagueStore, (value) => $leagueStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedCurrentLeagueId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedCurrentLeagueId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_leagueStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-eogsmc">Transfer Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><p data-svelte-h="svelte-1yqgbrz">Select the player&#39;s league:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-1ctg2hj">Select League</option>${each($leagueStore, (league) => {
        return `<option${add_attribute("value", league.id, 0)}>${escape(league.name)}</option>`;
      })}</select> ${``} ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
const Recall_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-awztf2">Recall Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Create_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_clubStore;
  let $$unsubscribe_countryStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => value);
  $$unsubscribe_countryStore = subscribe(countryStore, (value) => value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  $$unsubscribe_clubStore();
  $$unsubscribe_countryStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-9uabtx">Create Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Update_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let firstName = "";
  let lastName = "";
  let shirtNumber;
  let nationalityId;
  let displayDOB = "";
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = firstName.length > 50 || lastName.length == 0 || lastName.length > 50 || shirtNumber <= 0 || shirtNumber > 99 || displayDOB == "" || nationalityId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-111jmmy">Update Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Set_player_injury = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-1epdx5w">Set Player Injury</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Retire_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $$unsubscribe_playerStore;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_playerStore();
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-181rwt8">Retire Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
const Unretire_player = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedPlayerId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedPlayerId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-1s9cm8h">Unretire Player</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1tp620s">Select the player&#39;s club:</p> <select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select></div> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Promote_new_club = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let { visible } = $$props;
  let { closeModal } = $$props;
  let name = "";
  let friendlyName = "";
  let abbreviatedName = "";
  let primaryColourHex = "";
  let secondaryColourHex = "";
  let thirdColourHex = "";
  let showConfirm = false;
  let shirtTypes = [{ Filled: null }, { Striped: null }];
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = name.length <= 0 || name.length > 100 || friendlyName.length <= 0 || friendlyName.length > 50 || abbreviatedName.length != 3;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-6c6oto">Promote New Club</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><input type="text" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" placeholder="Club Full Name"${add_attribute("value", name, 0)}> <input type="text" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" placeholder="Club Friendly Name"${add_attribute("value", name, 0)}> <input type="text" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" placeholder="Abbreviated Name"${add_attribute("value", abbreviatedName, 0)}> <input type="color" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"${add_attribute("value", primaryColourHex, 0)}> <input type="color" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"${add_attribute("value", secondaryColourHex, 0)}> <input type="color" class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"${add_attribute("value", thirdColourHex, 0)}> <select class="p-2 fpl-dropdown my-4 min-w-[100px]">${each(shirtTypes, (shirt) => {
        return `<option${add_attribute("value", shirt, 0)}>${escape(shirt)}</option>`;
      })}</select> <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${``}</div>`;
    }
  })}`;
});
const Update_club = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let selectedClubId = 0;
  let showConfirm = false;
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = selectedClubId <= 0;
  {
    if (isSubmitDisabled && showConfirm) {
      showConfirm = false;
    }
  }
  $$unsubscribe_clubStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-1p20ean">Update Club</h3> <button class="times-button" data-svelte-h="svelte-jkt426">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><select class="p-2 fpl-dropdown min-w-[100px]"><option${add_attribute("value", 0, 0)} data-svelte-h="svelte-gooey4">Select Club</option>${each($clubStore, (club) => {
        return `<option${add_attribute("value", club.id, 0)}>${escape(club.friendlyName)}</option>`;
      })}</select> ${``} <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-19jfrwv">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Raise Proposal</button></div> ${showConfirm ? `<div class="items-center flex" data-svelte-h="svelte-6fi0oe"><p class="text-orange-400">Failed proposals will cost the proposer 10 $FPL tokens.</p></div> <div class="items-center flex"><button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                            px-4 py-2 default-button w-full`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Confirm Submit Proposal</button></div>` : ``}</div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
var define_process_env_default = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const Add_fixture_data = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isSubmitDisabled;
  let $clubStore, $$unsubscribe_clubStore;
  let $$unsubscribe_fixtureStore;
  $$unsubscribe_clubStore = subscribe(clubStore, (value) => $clubStore = value);
  $$unsubscribe_fixtureStore = subscribe(fixtureStore, (value) => value);
  let { visible } = $$props;
  let { closeModal } = $$props;
  let gameweeks = Array.from(
    {
      length: Number(define_process_env_default.TOTAL_GAMEWEEKS)
    },
    (_, i) => i + 1
  );
  let selectedFixtureId;
  let gameweekFixtures = [];
  function getTeamById(teamId) {
    return $clubStore.find((x) => x.id === teamId);
  }
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeModal === void 0 && $$bindings.closeModal && closeModal !== void 0)
    $$bindings.closeModal(closeModal);
  isSubmitDisabled = !selectedFixtureId;
  $$unsubscribe_clubStore();
  $$unsubscribe_fixtureStore();
  return `${validate_component(Modal, "Modal").$$render($$result, { visible }, {}, {
    default: () => {
      return `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header" data-svelte-h="svelte-5slgzo">Add Fixture Data</h3> <button class="times-button" data-svelte-h="svelte-2aq7vi">×</button></div> <div class="flex justify-start items-center w-full"><div class="w-full flex-col space-y-4 mb-2"><div class="flex-col space-y-2"><p data-svelte-h="svelte-1hdxidk">Select Gameweek:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]">${each(gameweeks, (gameweek) => {
        return `<option${add_attribute("value", gameweek, 0)}>Gameweek ${escape(gameweek)}</option>`;
      })}</select></div> <div class="flex-col space-y-2"><p data-svelte-h="svelte-1mcsvml">Select Fixture:</p> <select class="p-2 fpl-dropdown my-4 min-w-[100px]">${each(gameweekFixtures, (fixture) => {
        let homeTeam = getTeamById(fixture.homeClubId), awayTeam = getTeamById(fixture.awayClubId);
        return `  <option${add_attribute("value", fixture.id, 0)}>${escape(homeTeam.friendlyName)} v ${escape(awayTeam.friendlyName)}</option>`;
      })}</select></div> <div class="border-b border-gray-200"></div> <div class="items-center flex space-x-4"><button class="px-4 py-2 default-button fpl-cancel-btn min-w-[150px]" type="button" data-svelte-h="svelte-1cdq9j1">Cancel</button> <button${add_attribute(
        "class",
        `${isSubmitDisabled ? "bg-gray-500" : "fpl-purple-btn"} 
                        px-4 py-2 default-button min-w-[150px]`,
        0
      )} ${isSubmitDisabled ? "disabled" : ""}>Add Fixture Data</button></div></div></div> ${`${validate_component(Local_spinner, "LocalSpinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Page$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showRevaluePlayerUpModal = false;
  let showRevaluePlayerDownModal = false;
  let showMoveFixtureModal = false;
  let showPostponeFixtureModal = false;
  let showRescheduleFixtureModal = false;
  let showLoanPlayerModal = false;
  let showTransferPlayerModal = false;
  let showRecallPlayerModal = false;
  let showCreatePlayerModal = false;
  let showUpdatePlayerModal = false;
  let showSetPlayerInjuryModal = false;
  let showRetirePlayerModal = false;
  let showUnretirePlayerModal = false;
  let showPromoteNewClubModal = false;
  let showUpdateClubModal = false;
  let showAddFixtureDataModal = false;
  function hideRevaluePlayerUpModal() {
    showRevaluePlayerUpModal = false;
  }
  function hideRevaluePlayerDownModal() {
    showRevaluePlayerDownModal = false;
  }
  function hideMoveFixturesModal() {
    showMoveFixtureModal = false;
  }
  function hidePostponeFixturesModal() {
    showPostponeFixtureModal = false;
  }
  function hideRescehduleFixturesModal() {
    showRescheduleFixtureModal = false;
  }
  function hideLoanPlayerModal() {
    showLoanPlayerModal = false;
  }
  function hideTransferPlayerModal() {
    showTransferPlayerModal = false;
  }
  function hideRecallPlayerModal() {
    showRecallPlayerModal = false;
  }
  function hideCreatePlayerModal() {
    showCreatePlayerModal = false;
  }
  function hideUpdatePlayerModal() {
    showUpdatePlayerModal = false;
  }
  function hideSetPlayerInjuryModal() {
    showSetPlayerInjuryModal = false;
  }
  function hideRetirePlayerModal() {
    showRetirePlayerModal = false;
  }
  function hideUnretirePlayerModal() {
    showUnretirePlayerModal = false;
  }
  function hidePromoteNewClubModal() {
    showPromoteNewClubModal = false;
  }
  function hideUpdateClubModal() {
    showUpdateClubModal = false;
  }
  function hideAddFixtureDataModal() {
    showAddFixtureDataModal = false;
  }
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Revalue_player_up, "RevaluePlayerUp").$$render(
        $$result,
        {
          visible: showRevaluePlayerUpModal,
          closeModal: hideRevaluePlayerUpModal
        },
        {},
        {}
      )} ${validate_component(Revalue_player_down, "RevaluePlayerDown").$$render(
        $$result,
        {
          visible: showRevaluePlayerDownModal,
          closeModal: hideRevaluePlayerDownModal
        },
        {},
        {}
      )}  ${validate_component(Move_fixture, "MoveFixture").$$render(
        $$result,
        {
          visible: showMoveFixtureModal,
          closeModal: hideMoveFixturesModal
        },
        {},
        {}
      )} ${validate_component(Postpone_fixture, "PostponeFixture").$$render(
        $$result,
        {
          visible: showPostponeFixtureModal,
          closeModal: hidePostponeFixturesModal
        },
        {},
        {}
      )} ${validate_component(Reschedule_fixture, "RescheduleFixture").$$render(
        $$result,
        {
          visible: showRescheduleFixtureModal,
          closeModal: hideRescehduleFixturesModal
        },
        {},
        {}
      )} ${validate_component(Loan_player, "LoanPlayer").$$render(
        $$result,
        {
          visible: showLoanPlayerModal,
          closeModal: hideLoanPlayerModal
        },
        {},
        {}
      )} ${validate_component(Transfer_player, "TransferPlayer").$$render(
        $$result,
        {
          visible: showTransferPlayerModal,
          closeModal: hideTransferPlayerModal
        },
        {},
        {}
      )} ${validate_component(Recall_player, "RecallPlayer").$$render(
        $$result,
        {
          visible: showRecallPlayerModal,
          closeModal: hideRecallPlayerModal
        },
        {},
        {}
      )} ${validate_component(Create_player, "CreatePlayer").$$render(
        $$result,
        {
          visible: showCreatePlayerModal,
          closeModal: hideCreatePlayerModal
        },
        {},
        {}
      )} ${validate_component(Update_player, "UpdatePlayer").$$render(
        $$result,
        {
          visible: showUpdatePlayerModal,
          closeModal: hideUpdatePlayerModal
        },
        {},
        {}
      )} ${validate_component(Set_player_injury, "SetPlayerInjury").$$render(
        $$result,
        {
          visible: showSetPlayerInjuryModal,
          closeModal: hideSetPlayerInjuryModal
        },
        {},
        {}
      )} ${validate_component(Retire_player, "RetirePlayer").$$render(
        $$result,
        {
          visible: showRetirePlayerModal,
          closeModal: hideRetirePlayerModal
        },
        {},
        {}
      )} ${validate_component(Unretire_player, "UnretirePlayer").$$render(
        $$result,
        {
          visible: showUnretirePlayerModal,
          closeModal: hideUnretirePlayerModal
        },
        {},
        {}
      )} ${validate_component(Promote_new_club, "PromoteNewClub").$$render(
        $$result,
        {
          visible: showPromoteNewClubModal,
          closeModal: hidePromoteNewClubModal
        },
        {},
        {}
      )} ${validate_component(Update_club, "UpdateClub").$$render(
        $$result,
        {
          visible: showUpdateClubModal,
          closeModal: hideUpdateClubModal
        },
        {},
        {}
      )} ${validate_component(Add_fixture_data, "AddFixtureData").$$render(
        $$result,
        {
          visible: showAddFixtureDataModal,
          closeModal: hideAddFixtureDataModal
        },
        {},
        {}
      )} <div class="m-4"><div class="bg-panel rounded-md"><ul class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2" data-svelte-h="svelte-18bk998"><li class="mr-4 active-tab"><button class="text-white">Raise Proposal</button></li></ul> <p class="m-4" data-svelte-h="svelte-fij59x">Player proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-it9i8d">Revalue Player Up</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-162gghh">Revalue Player Down</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-eo89tb">Loan Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1horqjh">Transfer Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1o7npyh">Recall Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1tjdvh7">Create Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1jm3yzd">Update Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1wgcz4h">Set Player Injury</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-t832j9">Retire Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-vfv4v">Unretire Player</button></div></div></div> <p class="m-4" data-svelte-h="svelte-11opyhx">Fixture proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1h7i74h">Add Fixture Data</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1len8y5">Add Initial Fixtures</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1tke3sh">Move Fixture</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1xc0i1">Postpone Fixture</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-165m7nx">Reschedule Fixture</button></div></div></div> <p class="m-4" data-svelte-h="svelte-ujx3lm">Club proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-148s19b">Promote New Club</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-u5583t">Update Club</button></div></div></div></div></div>`;
    }
  })}`;
});
const Page$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${``} ${``}  ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} ${``} <div class="m-4"><div class="bg-panel rounded-md"><ul class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2" data-svelte-h="svelte-np8kws"><li class="mr-4 active-tab"><button class="text-white">Raise Proposal</button></li></ul> <p class="m-4" data-svelte-h="svelte-fij59x">Player proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" disabled data-svelte-h="svelte-n2i7ls">Revalue Player Up</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-7bnqg4">Revalue Player Down</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-62vsgi">Loan Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-mo36vx">Transfer Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1gx3714">Recall Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-onko7i">Create Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1g1x96w">Update Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1li5d4w">Set Player Injury</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-cyyj0k">Retire Player</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-4w9f42">Unretire Player</button></div></div></div> <p class="m-4" data-svelte-h="svelte-11opyhx">Fixture proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-4vf6rk">Add Fixture Data</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-1b7p7y4">Add Initial Fixtures</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-18l7kps">Move Fixture</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-ge63i0">Postpone Fixture</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-j9ola4">Reschedule Fixture</button></div></div></div> <p class="m-4" data-svelte-h="svelte-ujx3lm">Club proposals</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-b4cle">Promote New Club</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button-disabled px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full" data-svelte-h="svelte-ugy92w">Update Club</button></div></div></div></div></div>`;
    }
  })}`;
});
const Page$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onDestroy(() => {
  });
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}`;
    }
  })} `;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
export {
  Error$1 as E,
  Layout$1 as L,
  Page$5 as P,
  Server as S,
  set_building as a,
  set_manifest as b,
  set_prerendering as c,
  set_private_env as d,
  set_public_env as e,
  set_read_implementation as f,
  get_hooks as g,
  set_safe_public_env as h,
  Page$4 as i,
  Page$3 as j,
  Page$2 as k,
  Page$1 as l,
  Page as m,
  options as o,
  set_assets as s
};
