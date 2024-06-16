import { D as DEV } from "./vendor.js";
import * as devalue from "devalue";
import { Buffer } from "buffer";
import { parse, serialize } from "cookie";
import * as set_cookie_parser from "set-cookie-parser";
import { nonNullish, isNullish } from "@dfinity/utils";
import "dompurify";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import "@dfinity/ledger-icrc";
import "@dfinity/principal";
import "@dfinity/candid/lib/cjs/idl.js";
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
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
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
function null_to_empty(value) {
  return value == null ? "" : value;
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
const ATTR_REGEX = /[&"]/g;
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
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape(value, true)}"`;
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
      headers: {
        "content-type": "text/html"
      }
    }
  );
}
function get_data(event, options2, nodes, global) {
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
          } catch (e) {
            error = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = devalue.uneval({ id, data, error }, replacer2);
          }
          push(`<script>${global}.resolve(${str})<\/script>
`);
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
        parent: async () => ({})
      });
      const server_data = await server_data_promise;
      const data = await load_data({
        event,
        fetched,
        node: default_layout,
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
            } catch (e) {
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
                  Object.assign(data, await parent.data);
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
        const is_asset = manifest.assets.has(filename);
        const is_asset_html = manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
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
            const { name, value, ...options3 } = set_cookie_parser.parseString(str);
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name, value, {
              path,
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
  } catch (e) {
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
    return text("Not found", { status: 404 });
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
function set_read_implementation(fn) {
}
function set_manifest(_) {
}
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
  version_hash: "oh6t18"
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
const css$6 = {
  code: ".medium.svelte-85668t{--spinner-size:30px}.small.svelte-85668t{--spinner-size:calc(var(--line-height-standard) * 1rem)}.tiny.svelte-85668t{--spinner-size:calc(var(--line-height-standard) * 0.5rem)}svg.svelte-85668t{width:var(--spinner-size);height:var(--spinner-size);animation:spinner-linear-rotate 2000ms linear infinite;position:absolute;top:calc(50% - var(--spinner-size) / 2);left:calc(50% - var(--spinner-size) / 2);--radius:45px;--circumference:calc(3.1415926536 * var(--radius) * 2);--start:calc((1 - 0.05) * var(--circumference));--end:calc((1 - 0.8) * var(--circumference))}svg.inline.svelte-85668t{display:inline-block;position:relative}circle.svelte-85668t{stroke-dasharray:var(--circumference);stroke-width:10%;transform-origin:50% 50% 0;transition-property:stroke;animation-name:spinner-stroke-rotate-100;animation-duration:4000ms;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite;fill:transparent;stroke:currentColor;transition:stroke-dashoffset 225ms linear}@keyframes spinner-linear-rotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes spinner-stroke-rotate-100{0%{stroke-dashoffset:var(--start);transform:rotate(0)}12.5%{stroke-dashoffset:var(--end);transform:rotate(0)}12.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(72.5deg)}25%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(72.5deg)}25.0001%{stroke-dashoffset:var(--start);transform:rotate(270deg)}37.5%{stroke-dashoffset:var(--end);transform:rotate(270deg)}37.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(161.5deg)}50%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(161.5deg)}50.0001%{stroke-dashoffset:var(--start);transform:rotate(180deg)}62.5%{stroke-dashoffset:var(--end);transform:rotate(180deg)}62.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(251.5deg)}75%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(251.5deg)}75.0001%{stroke-dashoffset:var(--start);transform:rotate(90deg)}87.5%{stroke-dashoffset:var(--end);transform:rotate(90deg)}87.5001%{stroke-dashoffset:var(--end);transform:rotateX(180deg) rotate(341.5deg)}100%{stroke-dashoffset:var(--start);transform:rotateX(180deg) rotate(341.5deg)}}",
  map: null
};
const Spinner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { inline = false } = $$props;
  let { size = "medium" } = $$props;
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$6);
  return `  <svg class="${[escape(null_to_empty(size), true) + " svelte-85668t", inline ? "inline" : ""].join(" ").trim()}" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true" data-tid="spinner" viewBox="0 0 100 100"><circle cx="50%" cy="50%" r="45" class="svelte-85668t"></circle></svg>`;
});
const css$5 = {
  code: "div.svelte-14plyno{z-index:calc(var(--z-index) + 1000);position:fixed;top:0;right:0;bottom:0;left:0;background:var(--backdrop);color:var(--backdrop-contrast)}.content.svelte-14plyno{display:flex;flex-direction:column;justify-content:center;align-items:center}p.svelte-14plyno{padding-bottom:var(--padding);max-width:calc(var(--section-max-width) / 2)}",
  map: null
};
const BusyScreen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $busy, $$unsubscribe_busy;
  let $busyMessage, $$unsubscribe_busyMessage;
  $$unsubscribe_busy = subscribe(busy, (value) => $busy = value);
  $$unsubscribe_busyMessage = subscribe(busyMessage, (value) => $busyMessage = value);
  $$result.css.add(css$5);
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
const css$4 = {
  code: "svg.svelte-1lui9gh{vertical-align:middle}",
  map: null
};
const IconInfo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css$4);
  return `  <svg${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-tid="icon-info" class="svelte-1lui9gh"><path d="M10.2222 17.5C14.3643 17.5 17.7222 14.1421 17.7222 10C17.7222 5.85786 14.3643 2.5 10.2222 2.5C6.08003 2.5 2.72217 5.85786 2.72217 10C2.72217 14.1421 6.08003 17.5 10.2222 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.2222 13.3333V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.2222 6.66699H10.2305" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
});
const IconWarning = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = `${DEFAULT_ICON_SIZE}px` } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `  <svg xmlns="http://www.w3.org/2000/svg"${add_attribute("height", size, 0)} viewBox="0 0 24 24"${add_attribute("width", size, 0)} fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>`;
});
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
const css$3 = {
  code: ".toast.svelte-w1j1kj.svelte-w1j1kj{display:flex;justify-content:space-between;align-items:center;gap:var(--padding-1_5x);background:var(--overlay-background);color:var(--overlay-background-contrast);--button-secondary-background:var(--focus-background);border-radius:var(--border-radius);box-shadow:var(--strong-shadow, 8px 8px 16px 0 rgba(0, 0, 0, 0.25));padding:var(--padding-1_5x);box-sizing:border-box}.toast.inverted.svelte-w1j1kj.svelte-w1j1kj{background:var(--toast-inverted-background);color:var(--toast-inverted-background-contrast)}.toast.svelte-w1j1kj .icon.svelte-w1j1kj{line-height:0}.toast.svelte-w1j1kj .icon.success.svelte-w1j1kj{color:var(--positive-emphasis)}.toast.svelte-w1j1kj .icon.info.svelte-w1j1kj{color:var(--primary)}.toast.svelte-w1j1kj .icon.warn.svelte-w1j1kj{color:var(--warning-emphasis-shade)}.toast.svelte-w1j1kj .icon.error.svelte-w1j1kj{color:var(--negative-emphasis)}.toast.svelte-w1j1kj .msg.svelte-w1j1kj{flex-grow:1;margin:0;word-break:break-word}.toast.svelte-w1j1kj .msg.scroll.svelte-w1j1kj{overflow-y:auto;max-height:calc(var(--font-size-standard) * 3 * 1.3);line-height:normal}.toast.svelte-w1j1kj .msg.truncate.svelte-w1j1kj{white-space:var(--text-white-space, nowrap);overflow:hidden;text-overflow:ellipsis}.toast.svelte-w1j1kj .msg.truncate .title.svelte-w1j1kj{white-space:var(--text-white-space, nowrap);overflow:hidden;text-overflow:ellipsis}.toast.svelte-w1j1kj .msg.clamp.svelte-w1j1kj{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.toast.svelte-w1j1kj .msg.clamp .title.svelte-w1j1kj{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.toast.svelte-w1j1kj .title.svelte-w1j1kj{display:block;font-size:var(--font-size-standard);line-height:var(--line-height-standard);font-weight:var(--font-weight-bold);line-height:normal}.toast.svelte-w1j1kj button.close.svelte-w1j1kj{padding:0;line-height:0;color:inherit}",
  map: null
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
  $$result.css.add(css$3);
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
const css$2 = {
  code: ".wrapper.svelte-24m335{position:fixed;left:50%;transform:translate(-50%, 0);bottom:calc(var(--layout-bottom-offset, 0) + var(--padding-2x));width:calc(100% - var(--padding-8x) - var(--padding-0_5x));display:flex;flex-direction:column;gap:var(--padding);z-index:var(--toast-info-z-index)}.wrapper.error.svelte-24m335{z-index:var(--toast-error-z-index)}@media(min-width: 1024px){.wrapper.svelte-24m335{max-width:calc(var(--section-max-width) - var(--padding-2x))}}.top.svelte-24m335{top:calc(var(--header-height) + var(--padding-3x));bottom:unset;width:calc(100% - var(--padding-6x))}@media(min-width: 1024px){.top.svelte-24m335{right:var(--padding-2x);left:unset;transform:none;max-width:calc(var(--section-max-width) / 1.5 - var(--padding-2x))}}",
  map: null
};
const Toasts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toastsStore, $$unsubscribe_toastsStore;
  let $layoutBottomOffset, $$unsubscribe_layoutBottomOffset;
  $$unsubscribe_toastsStore = subscribe(toastsStore, (value) => $toastsStore = value);
  $$unsubscribe_layoutBottomOffset = subscribe(layoutBottomOffset, (value) => $layoutBottomOffset = value);
  let { position = "bottom" } = $$props;
  let toasts = [];
  let hasErrors;
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  $$result.css.add(css$2);
  toasts = $toastsStore.filter(({ position: pos }) => (pos ?? "bottom") === position);
  hasErrors = toasts.find(({ level }) => ["error", "warn"].includes(level)) !== void 0;
  $$unsubscribe_toastsStore();
  $$unsubscribe_layoutBottomOffset();
  return `${toasts.length > 0 ? `<div class="${[
    escape(null_to_empty(`wrapper ${position}`), true) + " svelte-24m335",
    hasErrors ? "error" : ""
  ].join(" ").trim()}"${add_attribute("style", `--layout-bottom-offset: ${$layoutBottomOffset}px`, 0)}>${each(toasts, (msg) => {
    return `${validate_component(Toast, "Toast").$$render($$result, { msg }, {}, {})}`;
  })}</div>` : ``}`;
});
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
const css$1 = {
  code: ".transition-width.svelte-frwh1m{transition:width 200ms}a.active.svelte-frwh1m{color:white !important}",
  map: null
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
  $$result.css.add(css$1);
  links = $authSignedInStore ? [
    { name: "Home", icon: HomeIcon, href: "/" },
    {
      name: "Euro 2024",
      icon: StarIcon,
      href: "/leaderboard"
    },
    {
      name: "Profile",
      icon: ProfileIcon,
      href: "/profile"
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
const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const FixtureId = IDL.Nat32;
  const PlayerId = IDL.Nat16;
  const TournamentStage = IDL.Variant({
    "RoundOf16": IDL.Null,
    "SemiFinal": IDL.Null,
    "GroupA": IDL.Null,
    "GroupB": IDL.Null,
    "GroupC": IDL.Null,
    "GroupD": IDL.Null,
    "GroupE": IDL.Null,
    "GroupF": IDL.Null,
    "Final": IDL.Null,
    "QuarterFinal": IDL.Null
  });
  const TeamId = IDL.Nat16;
  const EventType = IDL.Variant({
    "RedCard": IDL.Null,
    "GoalScored": IDL.Null,
    "StageLost": IDL.Null,
    "StageWon": IDL.Null,
    "YellowCard": IDL.Null,
    "GoalAssisted": IDL.Null
  });
  const Euro2024Event = IDL.Record({
    "eventId": IDL.Nat,
    "fixtureId": FixtureId,
    "playerId": PlayerId,
    "stage": TournamentStage,
    "teamId": TeamId,
    "eventType": EventType
  });
  const Error2 = IDL.Variant({
    "DecodeError": IDL.Null,
    "NotAllowed": IDL.Null,
    "NotFound": IDL.Null,
    "NotAuthorized": IDL.Null,
    "AlreadyExists": IDL.Null
  });
  const Result = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const PrincipalName = IDL.Text;
  const Euro2024EventId = IDL.Nat;
  const PredictionSet = IDL.Record({
    "goalAssister": PlayerId,
    "winner": TeamId,
    "loser": TeamId,
    "stage": TournamentStage,
    "goalScorer": PlayerId,
    "redCard": PlayerId,
    "yellowCard": PlayerId
  });
  const Euro2024PredictionDTO = IDL.Record({
    "sfPrediction": PredictionSet,
    "entryTime": IDL.Int,
    "groupAPrediction": PredictionSet,
    "groupCPrediction": PredictionSet,
    "groupEPrediction": PredictionSet,
    "fPrediction": PredictionSet,
    "qfPrediction": PredictionSet,
    "totalScore": IDL.Nat16,
    "alreadyEntered": IDL.Bool,
    "groupBPrediction": PredictionSet,
    "groupDPrediction": PredictionSet,
    "groupFPrediction": PredictionSet,
    "principalId": PrincipalName,
    "r16Prediction": PredictionSet
  });
  const Euro2024EventDTO = IDL.Record({
    "eventId": Euro2024EventId,
    "fixtureId": FixtureId,
    "playerId": PlayerId,
    "stage": TournamentStage,
    "teamId": TeamId,
    "eventType": EventType
  });
  const AccountBalancesDTO = IDL.Record({
    "icpBalance": IDL.Nat64,
    "principalId": PrincipalName,
    "fplBalance": IDL.Nat
  });
  const GameweekDTO = IDL.Record({
    "totalFixtures": IDL.Nat8,
    "correctScores": IDL.Nat8,
    "winnings": IDL.Nat64,
    "sweepstakeEntered": IDL.Bool,
    "gameweekNumber": IDL.Nat8
  });
  const SeasonDTO = IDL.Record({
    "seasonId": IDL.Nat16,
    "gameweeks": IDL.Vec(GameweekDTO),
    "seasonName": IDL.Text,
    "seasonYear": IDL.Nat16
  });
  const AdminDTO = IDL.Record({
    "activeGameweekNumber": IDL.Nat8,
    "seasons": IDL.Vec(SeasonDTO),
    "activeGameweekStatus": IDL.Text,
    "activeSeasonId": IDL.Nat16,
    "activeSeasonName": IDL.Text
  });
  const Result_10 = IDL.Variant({
    "ok": IDL.Vec(Euro2024EventDTO),
    "err": Error2
  });
  const CorrectPredictionDTO = IDL.Record({
    "displayName": IDL.Text,
    "principalName": IDL.Text
  });
  const CorrectPredictionsDTO = IDL.Record({
    "totalEntries": IDL.Nat64,
    "predictions": IDL.Vec(CorrectPredictionDTO),
    "awayTeamName": IDL.Text,
    "seasonId": IDL.Nat16,
    "homeTeamName": IDL.Text,
    "homeTeamGoals": IDL.Nat8,
    "seasonName": IDL.Text,
    "gameweekNumber": IDL.Nat8,
    "awayTeamGoals": IDL.Nat8
  });
  const DataCacheDTO = IDL.Record({ "hash": IDL.Text, "category": IDL.Text });
  const Result_9 = IDL.Variant({ "ok": IDL.Vec(DataCacheDTO), "err": Error2 });
  const Result_1 = IDL.Variant({ "ok": Euro2024PredictionDTO, "err": Error2 });
  const FixtureStatus = IDL.Variant({
    "Unplayed": IDL.Null,
    "Active": IDL.Null,
    "Finished": IDL.Null
  });
  const Euro2024Fixture = IDL.Record({
    "id": IDL.Nat8,
    "status": FixtureStatus,
    "awayTeamId": TeamId,
    "homeTeamId": TeamId,
    "stage": TournamentStage,
    "homeGoals": IDL.Nat8,
    "awayGoals": IDL.Nat8
  });
  const Result_8 = IDL.Variant({
    "ok": IDL.Vec(Euro2024Fixture),
    "err": Error2
  });
  const Position = IDL.Variant({
    "Goalkeeper": IDL.Null,
    "Midfielder": IDL.Null,
    "Forward": IDL.Null,
    "Defender": IDL.Null
  });
  const InternationalPlayer = IDL.Record({
    "id": PlayerId,
    "teamId": TeamId,
    "position": Position,
    "lastName": IDL.Text,
    "firstName": IDL.Text
  });
  const Result_7 = IDL.Variant({
    "ok": IDL.Vec(InternationalPlayer),
    "err": Error2
  });
  const GameState = IDL.Variant({
    "Selecting": IDL.Null,
    "Active": IDL.Null,
    "Completed": IDL.Null
  });
  const Euro2024State = IDL.Record({
    "totalManagers": IDL.Nat,
    "stage": GameState,
    "prizePool": IDL.Nat64
  });
  const Result_6 = IDL.Variant({ "ok": Euro2024State, "err": Error2 });
  const Euro2024DTO = IDL.Record({
    "totalManagers": IDL.Nat,
    "stage": GameState,
    "prizePool": IDL.Nat64
  });
  const Result_5 = IDL.Variant({ "ok": Euro2024DTO, "err": Error2 });
  const InternationalTeam = IDL.Record({
    "id": TeamId,
    "name": IDL.Text,
    "countryCode": IDL.Text,
    "players": IDL.Vec(InternationalPlayer)
  });
  const Result_4 = IDL.Variant({
    "ok": IDL.Vec(InternationalTeam),
    "err": Error2
  });
  const AccountBalanceDTO = IDL.Record({ "accountBalance": IDL.Nat });
  const Fixture = IDL.Record({
    "id": IDL.Nat32,
    "status": IDL.Nat8,
    "awayTeamId": IDL.Nat16,
    "homeTeamId": IDL.Nat16,
    "homeGoals": IDL.Nat8,
    "awayGoals": IDL.Nat8
  });
  const GameweekPotDTO = IDL.Record({ "gameweekPot": IDL.Nat64 });
  List_1.fill(IDL.Opt(IDL.Tuple(Fixture, List_1)));
  const Gameweek = IDL.Record({
    "status": IDL.Nat8,
    "winningShare": IDL.Nat64,
    "totalPot": IDL.Nat64,
    "number": IDL.Nat8,
    "fixtureCount": IDL.Nat8,
    "fixtures": List_1
  });
  const HistoryDTO = IDL.Record({
    "seasons": IDL.Vec(SeasonDTO),
    "seasonGameweeks": IDL.Vec(GameweekDTO),
    "userId": IDL.Text,
    "activeSeasonId": IDL.Nat16,
    "activeSeasonName": IDL.Text
  });
  const FixtureDTO = IDL.Record({
    "status": IDL.Nat8,
    "awayTeamPrediction": IDL.Nat8,
    "fixtureId": IDL.Nat32,
    "homeTeamPrediction": IDL.Nat8,
    "awayTeamId": IDL.Nat16,
    "awayTeamName": IDL.Text,
    "homeTeamId": IDL.Nat16,
    "correct": IDL.Bool,
    "homeTeamName": IDL.Text,
    "homeTeamGoals": IDL.Nat8,
    "awayTeamGoals": IDL.Nat8
  });
  const HomeDTO = IDL.Record({
    "activeGameweekNumber": IDL.Nat8,
    "hasPredictions": IDL.Bool,
    "systemUpdating": IDL.Bool,
    "gameweekStatus": IDL.Nat8,
    "activeSeasonId": IDL.Nat16,
    "principalName": IDL.Text,
    "activeSeasonName": IDL.Text,
    "fixtures": IDL.Vec(FixtureDTO)
  });
  const LeaderboardEntryDTO = IDL.Record({
    "totalFixtures": IDL.Nat8,
    "correctScores": IDL.Nat8,
    "displayName": IDL.Text,
    "enteredSweepstake": IDL.Bool,
    "principalName": IDL.Text,
    "position": IDL.Text
  });
  const GetLeaderboardDTO = IDL.Record({
    "totalEntries": IDL.Nat,
    "offset": IDL.Nat,
    "limit": IDL.Nat,
    "entries": IDL.Vec(LeaderboardEntryDTO)
  });
  const Euro2024LeaderboardEntryDTO = IDL.Record({
    "displayName": IDL.Text,
    "totalScore": IDL.Nat,
    "principalName": IDL.Text,
    "position": IDL.Text,
    "profilePicture": IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const Euro2024LeaderBoardDTO = IDL.Record({
    "status": IDL.Nat8,
    "totalEntries": IDL.Nat,
    "winningShare": IDL.Nat64,
    "leaderboardEntries": IDL.Vec(Euro2024LeaderboardEntryDTO),
    "totalPot": IDL.Nat64
  });
  const Result_3 = IDL.Variant({
    "ok": Euro2024LeaderBoardDTO,
    "err": Error2
  });
  const LeaderBoardDTO = IDL.Record({
    "status": IDL.Nat8,
    "activeGameweekNumber": IDL.Nat8,
    "totalEntries": IDL.Nat64,
    "seasons": IDL.Vec(SeasonDTO),
    "winningShare": IDL.Nat64,
    "leaderboardEntries": IDL.Vec(LeaderboardEntryDTO),
    "totalPot": IDL.Nat64,
    "activeSeasonId": IDL.Nat16,
    "activeSeasonName": IDL.Text
  });
  const PayoutDTO = IDL.Record({
    "winnerShare": IDL.Nat64,
    "activeGameweekNumber": IDL.Nat8,
    "gameweekPot": IDL.Nat64,
    "adminFee": IDL.Nat64,
    "potAccountBalance": IDL.Nat64,
    "winnerCount": IDL.Nat64,
    "activeSeasonName": IDL.Text
  });
  const PlayDTO = IDL.Record({
    "activeGameweekNumber": IDL.Nat8,
    "userId": IDL.Text,
    "sweepstakePaid": IDL.Bool,
    "activeSeasonId": IDL.Nat16,
    "activeSeasonName": IDL.Text,
    "fixtures": IDL.Vec(FixtureDTO)
  });
  const ProfileDTO = IDL.Record({
    "displayName": IDL.Text,
    "fplDepositAddress": IDL.Text,
    "walletAddress": IDL.Text,
    "depositAddress": IDL.Vec(IDL.Nat8),
    "principalName": IDL.Text
  });
  const Result_2 = IDL.Variant({ "ok": ProfileDTO, "err": Error2 });
  List.fill(IDL.Opt(IDL.Tuple(Gameweek, List)));
  const Season = IDL.Record({
    "id": IDL.Nat16,
    "name": IDL.Text,
    "year": IDL.Nat16,
    "gameweeks": List
  });
  const Team = IDL.Record({ "id": IDL.Nat16, "name": IDL.Text });
  const UserBalanceDTO = IDL.Record({
    "balance": IDL.Nat64,
    "displayName": IDL.Text,
    "principalName": IDL.Text
  });
  const BalancesDTO = IDL.Record({
    "totalEntries": IDL.Nat64,
    "potAccountBalance": IDL.Nat64,
    "userBalances": IDL.Vec(UserBalanceDTO)
  });
  const ViewPredictionDTO = IDL.Record({
    "totalFixtures": IDL.Nat8,
    "correctScores": IDL.Nat8,
    "playerName": IDL.Text,
    "seasonName": IDL.Text,
    "fixtures": IDL.Vec(FixtureDTO)
  });
  const SubmitPlayDTO = IDL.Record({
    "enterSweepstake": IDL.Bool,
    "fixtures": IDL.Vec(FixtureDTO)
  });
  return IDL.Service({
    "addEuro2024Event": IDL.Func([Euro2024Event], [Result], []),
    "addFixtureToGameweek": IDL.Func(
      [IDL.Nat16, IDL.Nat8, IDL.Nat16, IDL.Nat16],
      [Result],
      []
    ),
    "adminDelete2024Entry": IDL.Func([PrincipalName], [IDL.Bool], []),
    "adminDelete2024Event": IDL.Func([Euro2024EventId], [IDL.Bool], []),
    "adminGetEuro2024Entries": IDL.Func(
      [IDL.Nat, IDL.Nat],
      [IDL.Vec(Euro2024PredictionDTO)],
      []
    ),
    "adminGetEuro2024Events": IDL.Func([], [IDL.Vec(Euro2024EventDTO)], []),
    "calculateEuro2024Leaderboard": IDL.Func([], [Result], []),
    "checkPaidButNoEntry": IDL.Func([], [IDL.Bool], []),
    "closeEuro2024Entries": IDL.Func([], [Result], []),
    "completeEuro2024Competition": IDL.Func([], [Result], []),
    "createSeason": IDL.Func([IDL.Text, IDL.Nat16], [Result], []),
    "createTeam": IDL.Func([IDL.Text], [Result], []),
    "deleteFixture": IDL.Func([IDL.Nat16, IDL.Nat8, IDL.Nat32], [Result], []),
    "deleteSeason": IDL.Func([IDL.Nat16], [Result], []),
    "deleteTeam": IDL.Func([IDL.Nat16], [Result], []),
    "getAccountBalances": IDL.Func([], [AccountBalancesDTO], []),
    "getAdminDTO": IDL.Func([], [AdminDTO], ["query"]),
    "getAllEvents": IDL.Func([], [Result_10], []),
    "getCorrectPredictionsDTO": IDL.Func(
      [IDL.Nat16, IDL.Nat8, IDL.Nat32, IDL.Nat, IDL.Nat],
      [CorrectPredictionsDTO],
      []
    ),
    "getDataHashes": IDL.Func([], [Result_9], ["query"]),
    "getEuro2024DTO": IDL.Func([], [Result_1], ["query"]),
    "getEuro2024Events": IDL.Func([], [IDL.Vec(Euro2024EventDTO)], []),
    "getEuro2024Fixtures": IDL.Func([], [Result_8], []),
    "getEuro2024Players": IDL.Func([], [Result_7], ["query"]),
    "getEuro2024State": IDL.Func([], [Result_6], ["query"]),
    "getEuro2024StateDTO": IDL.Func([], [Result_5], ["query"]),
    "getEuro2024Teams": IDL.Func([], [Result_4], ["query"]),
    "getEuroPotBalance": IDL.Func([], [IDL.Nat64], []),
    "getFPLAccountBalance": IDL.Func([], [AccountBalanceDTO], []),
    "getFPLAccountBalanceDTO": IDL.Func([], [AccountBalanceDTO], []),
    "getFixture": IDL.Func(
      [IDL.Nat16, IDL.Nat8, IDL.Nat32],
      [IDL.Opt(Fixture)],
      ["query"]
    ),
    "getFixtures": IDL.Func(
      [IDL.Nat16, IDL.Nat8],
      [IDL.Vec(Fixture)],
      ["query"]
    ),
    "getGameweekPotDTO": IDL.Func([], [GameweekPotDTO], []),
    "getGameweeks": IDL.Func([IDL.Nat16], [IDL.Vec(Gameweek)], ["query"]),
    "getHistoryDTO": IDL.Func([IDL.Nat16], [HistoryDTO], ["query"]),
    "getHomeDTO": IDL.Func([], [HomeDTO], ["query"]),
    "getLeaderboard": IDL.Func([GetLeaderboardDTO], [Result_3], ["query"]),
    "getLeaderboardDTO": IDL.Func(
      [IDL.Nat16, IDL.Nat8, IDL.Nat, IDL.Nat],
      [LeaderBoardDTO],
      ["query"]
    ),
    "getPayoutDTO": IDL.Func([], [PayoutDTO], []),
    "getPlayDTO": IDL.Func([], [PlayDTO], ["query"]),
    "getProfileDTO": IDL.Func([], [Result_2], []),
    "getPublicEuro2024DTO": IDL.Func([IDL.Text], [Result_1], ["query"]),
    "getSeason": IDL.Func([IDL.Nat16], [IDL.Opt(Season)], ["query"]),
    "getSeasons": IDL.Func([], [IDL.Vec(Season)], ["query"]),
    "getTeams": IDL.Func([], [IDL.Vec(Team)], ["query"]),
    "getUserBalancesDTO": IDL.Func([IDL.Nat, IDL.Nat], [BalancesDTO], []),
    "getUserPrediction": IDL.Func([], [Result_1], []),
    "getViewPredictionDTO": IDL.Func(
      [IDL.Text, IDL.Nat16, IDL.Nat8],
      [ViewPredictionDTO],
      ["query"]
    ),
    "giftEntry": IDL.Func([PrincipalName], [Result], []),
    "isAdmin": IDL.Func([], [IDL.Bool], ["query"]),
    "isDisplayNameValid": IDL.Func([IDL.Text], [IDL.Bool], ["query"]),
    "isWalletValid": IDL.Func([IDL.Text], [IDL.Bool], ["query"]),
    "openEuro2024Entries": IDL.Func([], [Result], []),
    "payoutSweepstake": IDL.Func([], [Result], []),
    "recalculateLeaderboard": IDL.Func([], [Result], []),
    "setEuroSystemState": IDL.Func([GameState], [Result], []),
    "setSystemState": IDL.Func([IDL.Nat16, IDL.Nat8], [Result], []),
    "submitEuro2024Prediction": IDL.Func(
      [Euro2024PredictionDTO],
      [Result],
      []
    ),
    "submitEvent": IDL.Func([Euro2024EventDTO], [Result], []),
    "submitPlayDTO": IDL.Func([SubmitPlayDTO], [Result], []),
    "unsetActiveState": IDL.Func([], [Result], []),
    "updateDisplayName": IDL.Func([IDL.Text], [Result], []),
    "updateFixture": IDL.Func(
      [
        IDL.Nat16,
        IDL.Nat8,
        IDL.Nat32,
        IDL.Nat16,
        IDL.Nat16,
        IDL.Nat8,
        IDL.Nat8,
        IDL.Nat8
      ],
      [Result],
      []
    ),
    "updateGameweekStatus": IDL.Func(
      [IDL.Nat16, IDL.Nat8, IDL.Nat8],
      [Result],
      []
    ),
    "updateSeason": IDL.Func([IDL.Nat16, IDL.Text, IDL.Nat16], [Result], []),
    "updateTeam": IDL.Func([IDL.Nat16, IDL.Text], [Result], []),
    "updateWalletAddress": IDL.Func([IDL.Text], [Result], []),
    "withdrawICP": IDL.Func([IDL.Float64], [Result], [])
  });
};
var define_process_env_default$3 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
const canisterId = define_process_env_default$3.CANISTER_ID_FOOTBALL_GOD_BACKEND;
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
function formatUnixDateToReadable(unixNano) {
  const date = new Date(unixNano / 1e6);
  const options2 = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return new Intl.DateTimeFormat("en-UK", options2).format(date);
}
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
var define_process_env_default$2 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
function createEuro2024Store() {
  const { subscribe: subscribe2, set } = writable(null);
  let actor = ActorFactory.createActor(
    idlFactory,
    define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
  );
  async function sync() {
    let result = await actor.getEuro2024StateDTO();
    if (isError(result)) {
      console.error("Error syncing euro 2024 store");
      return;
    }
    let updatedEuro2024StateData = result.ok;
    set(updatedEuro2024StateData);
  }
  async function getEuro2024State() {
    let result = await actor.getEuro2024State();
    return result;
  }
  async function getPotBalance() {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    let result = await identityActor.getEuroPotBalance();
    return result;
  }
  async function getTotalEntries() {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    let result = await identityActor.getTotalEntries();
    return result;
  }
  async function getPrediction(principalId) {
    let result = await actor.getPublicEuro2024DTO(principalId);
    if (isError(result)) {
      console.error("error fetching prediction");
    }
    return result.ok;
  }
  async function getFixtures() {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    let result = await identityActor.getEuro2024Fixtures();
    if (isError(result)) {
      console.error("error fetching euro 2024 fixtures", result);
      return [];
    }
    return result.ok;
  }
  async function getLeaderboard(offset, limit) {
    let dto = {
      totalEntries: 0n,
      offset,
      limit,
      entries: []
    };
    let result = await actor.getLeaderboard(dto);
    if (isError(result)) {
      console.error("error fetching euro 2024 fixtures", result);
    }
    return result.ok;
  }
  async function getEvents() {
    let entries = await actor.getEuro2024Events();
    return entries;
  }
  return {
    subscribe: subscribe2,
    sync,
    getEuro2024State,
    getPotBalance,
    getTotalEntries,
    getFixtures,
    getLeaderboard,
    getPrediction,
    getEvents
  };
}
const euro2024Store = createEuro2024Store();
const css = {
  code: ".overlay-panel.svelte-a3qity{position:absolute;bottom:0;right:0}",
  map: null
};
const Page$8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authSignedInStore;
  let $$unsubscribe_countdown;
  $$unsubscribe_authSignedInStore = subscribe(authSignedInStore, (value) => value);
  const countdown = writable("");
  $$unsubscribe_countdown = subscribe(countdown, (value) => value);
  let interval;
  onDestroy(() => {
    clearInterval(interval);
  });
  $$result.css.add(css);
  $$unsubscribe_authSignedInStore();
  $$unsubscribe_countdown();
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}`;
    }
  })}`;
});
const pageSize = 100;
const Admin_euro2024_entries = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPage = 1;
  let entries = [];
  return `${``} <div class="p-4"><div class="overflow-x-auto flex-1"><div class="flex justify-between border border-gray-700 py-2 bg-light-gray border-b border-gray-700" data-svelte-h="svelte-1vms2iz"><div class="w-6/12">PrincipalId</div> <div class="w-3/12">Entry Date</div> <div class="w-3/12"></div></div> ${each(entries, (entry, index) => {
    return `<div class="flex items-center justify-between py-2 border-b border-gray-700 cursor-pointer"><div class="w-6/12">${escape(entry.principalId)}</div> <div class="w-3/12">${escape(formatUnixDateToReadable(Number(entry.entryTime)))}</div> <div class="w-3/12"><button data-svelte-h="svelte-189gxcl">Delete</button></div> </div>`;
  })}</div></div> <div class="justify-center mt-4 pb-4 overflow-x-auto"><div class="flex space-x-1 min-w-max">${each(Array(Math.ceil(entries.length / pageSize)), (_, index) => {
    return `<button${add_attribute("class", `px-4 py-2 rounded-md ${index + 1 === currentPage ? "fpl-button" : ""}`, 0)}>${escape(index + 1)} </button>`;
  })}</div></div>    `;
});
var define_process_env_default$1 = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
function createPlayerStore() {
  const { subscribe: subscribe2, set } = writable([]);
  let actor = ActorFactory.createActor(
    idlFactory,
    define_process_env_default$1.FOOTBALL_GOD_BACKEND_CANISTER_ID
  );
  async function sync() {
    const category = "players";
    const newHashValues = await actor.getDataHashes();
    let error = isError(newHashValues);
    if (error) {
      console.error("Error syncing player store");
      return;
    }
    let dataCacheValues = newHashValues.ok;
    let categoryHash = dataCacheValues.find((x) => x.category === category) ?? null;
    const localHash = localStorage.getItem(`${category}_hash`);
    if (categoryHash?.hash != localHash) {
      const updatedPlayersData = await actor.getEuro2024Players();
      if (isError(updatedPlayersData)) {
        return [];
      }
      localStorage.setItem(
        category,
        JSON.stringify(updatedPlayersData.ok, replacer)
      );
      localStorage.setItem(`${category}_hash`, categoryHash?.hash ?? "");
      set(updatedPlayersData.ok);
    } else {
      const cachedPlayersData = localStorage.getItem(category);
      let cachedPlayers = [];
      try {
        cachedPlayers = JSON.parse(cachedPlayersData || "[]");
      } catch (e) {
        cachedPlayers = [];
      }
      set(cachedPlayers);
    }
  }
  return {
    subscribe: subscribe2,
    sync
  };
}
const playerStore = createPlayerStore();
var define_process_env_default = { FOOTBALL_GOD_BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DFX_NETWORK: "ic" };
function createTeamStore() {
  const { subscribe: subscribe2, set } = writable([]);
  let actor = ActorFactory.createActor(
    idlFactory,
    define_process_env_default.FOOTBALL_GOD_BACKEND_CANISTER_ID
  );
  async function sync() {
    const category = "teams";
    const newHashValues = await actor.getDataHashes();
    let error = isError(newHashValues);
    if (error) {
      console.error("Error syncing team store");
      return;
    }
    let dataCacheValues = newHashValues.ok;
    let categoryHash = dataCacheValues.find((x) => x.category === category) ?? null;
    const localHash = localStorage.getItem(`${category}_hash`);
    if (categoryHash?.hash != localHash) {
      const updatedTeamsData = await actor.getEuro2024Teams();
      if (isError(updatedTeamsData)) {
        return [];
      }
      localStorage.setItem(
        category,
        JSON.stringify(updatedTeamsData.ok, replacer)
      );
      localStorage.setItem(`${category}_hash`, categoryHash?.hash ?? "");
      set(updatedTeamsData.ok);
    } else {
      const cachedTeamsData = localStorage.getItem(category);
      let cachedTeams = [];
      try {
        cachedTeams = JSON.parse(cachedTeamsData || "[]");
      } catch (e) {
        cachedTeams = [];
      }
      set(cachedTeams);
    }
  }
  return {
    subscribe: subscribe2,
    sync
  };
}
const teamStore = createTeamStore();
const Page$7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg"><p class="text-2xl p-8" data-svelte-h="svelte-e3xv4p">Admin</p> <div class="bg-panel rounded-md p-2"><ul class="flex bg-light-gray contained-text border-b border-gray-700"><li${add_attribute("class", `mr-1 md:mr-4 ${"active-tab"}`, 0)}><button${add_attribute(
        "class",
        `p-2 ${"text-white"}`,
        0
      )}>Euro 2024 Entries</button></li> <li${add_attribute("class", `mr-1 md:mr-4 ${""}`, 0)}><button${add_attribute(
        "class",
        `p-2 ${"text-gray-400"}`,
        0
      )}>Euro 2024 Events</button></li></ul> <div class="flex w-100 bg-OPENFPL p-4 my-4"><button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" data-svelte-h="svelte-149u5mp">Close Euro 2024 Entries</button> <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" data-svelte-h="svelte-n58rcp">Open Euro 2024 Entries</button> <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" data-svelte-h="svelte-1a9fkjn">Complete Euro 2024 Competition</button> <button class="bg-OPENFPLPURPLE mx-4 p-4 rounded-md" data-svelte-h="svelte-1p9lklt">Recalculate Leaderboard</button></div> ${`${validate_component(Admin_euro2024_entries, "AdminEuro2024Entries").$$render($$result, {}, {}, {})}`}</div></div>`;
    }
  })}`;
});
const Page$6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loadingText;
  let $$unsubscribe_playerStore;
  let $$unsubscribe_teamStore;
  let $authSignedInStore, $$unsubscribe_authSignedInStore;
  let $$unsubscribe_dots;
  let $$unsubscribe_euro2024Store;
  let $$unsubscribe_countdown;
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $$unsubscribe_teamStore = subscribe(teamStore, (value) => value);
  $$unsubscribe_authSignedInStore = subscribe(authSignedInStore, (value) => $authSignedInStore = value);
  $$unsubscribe_euro2024Store = subscribe(euro2024Store, (value) => value);
  let interval;
  let dots = writable(".");
  $$unsubscribe_dots = subscribe(dots, (value) => value);
  const countdown = writable("");
  $$unsubscribe_countdown = subscribe(countdown, (value) => value);
  onDestroy(() => {
    clearInterval(interval);
  });
  loadingText = "Loading, please wait...";
  $$unsubscribe_playerStore();
  $$unsubscribe_teamStore();
  $$unsubscribe_authSignedInStore();
  $$unsubscribe_dots();
  $$unsubscribe_euro2024Store();
  $$unsubscribe_countdown();
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${!$authSignedInStore ? `<div class="relative bg-gray-800 text-white mt-2 mr-2 rounded-lg"><div class="bg-cover bg-center bg-no-repeat py-20 px-4" style="background-image: url('banner.jpg');"><div class="container ml-4 flex flex-col justify-between"><p class="text-xl" data-svelte-h="svelte-xwnshe">$FPL Prediction Sweepstake</p> <p class="text-4xl font-bold" data-svelte-h="svelte-1icqllx">Euro 2024</p> <p class="text-xl" data-svelte-h="svelte-1hdg5zl">Play for free or enter the $FPL sweepstake up until Friday 14th June
            2024</p> ${$authSignedInStore ? `<a href="/euro2024" data-svelte-h="svelte-1bm7ttp"><button class="btn bg-DARK mt-4 py-4 w-48 rounded-md">Enter Now</button></a>` : `<button class="btn bg-DARK mt-4 py-4 w-48 rounded-md" data-svelte-h="svelte-yce1a2">Connect To Play</button>`}</div></div></div>` : `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})} <div class="fixed inset-0 flex flex-col items-center justify-center"><p class="mt-24">${escape(loadingText)}</p></div>`}`}`;
    }
  })}`;
});
const Page$5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const games = [
    {
      title: "Euro 2024",
      description: "Predict your way through Euro 2024 to win $FPL.",
      imageUrl: "/FPLCoin.png",
      link: "/euro2024"
    }
  ];
  return `  ${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="min-h-screen flex flex-col p-4"><h1 class="text-3xl font-bold my-6" data-svelte-h="svelte-fogumv">Our Games</h1> <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">${each(games, (game) => {
        return `<a${add_attribute("href", game.link, 0)} class="bg-OPENFPLPURPLE rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"><img${add_attribute("src", game.imageUrl, 0)}${add_attribute("alt", game.title, 0)} class="w-full h-48 object-cover"> <div class="p-4"><h2 class="text-xl font-bold mb-2">${escape(game.title)}</h2> <p class="">${escape(game.description)}</p></div> </a>`;
      })}</div></div>`;
    }
  })}`;
});
const Page$4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let loadingText;
  let $authSignedInStore, $$unsubscribe_authSignedInStore;
  $$unsubscribe_authSignedInStore = subscribe(authSignedInStore, (value) => $authSignedInStore = value);
  loadingText = "Loading, please wait...";
  $$unsubscribe_authSignedInStore();
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${!$authSignedInStore ? `<p data-svelte-h="svelte-qhegyw">Please sign in to gift an entry.</p>` : `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})} <div class="fixed inset-0 flex flex-col items-center justify-center"><p class="mt-24">${escape(loadingText)}</p></div>`}`}`;
    }
  })}`;
});
const Page$3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="bg-panel mt-4"><h1 class="p-4 mx-1 default-header" data-svelte-h="svelte-1bmq93s">Euro 2024 Leaderboard</h1> <div class="flex flex-row p-4" data-svelte-h="svelte-15mkq1d"><div class="w-1/6"><p>Pos</p></div> <div class="w-3/6"><p>Username</p></div> <div class="w-1/6"><p>Points</p></div> <div class="w-1/6"><p>View</p></div></div> ${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Vision = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="m-4" data-svelte-h="svelte-1dza2e7"><h1 class="default-header">Our Vision</h1> <p class="my-4">FootballGod is the hub of range of dApps built on the Internet Computer blockchain.
    These dApps will integrate our utility token, $FOOTBALL.
    The first dApp to be released will be Transfer Kings (<a href="https://transferkings.xyz">transferkings.xyz</a>).</p> <p class="my-4">We aim to phase in difference markets, games and features. Eventually we want
    to provide reliable fixed-odds betting markets for every major football
    league in the world along with games for major events like
    international football tournaments. This will require us to obtain a gambling license, which we are working on.</p> <p class="my-4">Our vision for FootballGod encompasses a commitment to societal impact,
    specifically through our organisation, the ICPFA. The ICPFA will be focused
    on supporting grassroots football initiatives, demonstrating our belief in
    FootballGod&#39;s ability to bring about positive change in the football
    community using the IC.</p> <br> <br></div>`;
});
const Page$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="bg-panel mt-4"><h1 class="p-4 mx-1 default-header" data-svelte-h="svelte-14v1lwf">FootballGod Lightpaper</h1> <ul class="flex flex-nowrap overflow-x-auto bg-light-gray border-b border-gray-700 px-4 pt-2"><li${add_attribute("class", `mr-4 ${"active-tab"}`, 0)}><button${add_attribute("class", `p-2 ${"text-white"}`, 0)}>Vision</button></li></ul> ${`${validate_component(Vision, "Vision").$$render($$result, {}, {}, {})}`}</div>`;
    }
  })}`;
});
const Page$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $$unsubscribe_teamStore;
  let $$unsubscribe_playerStore;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_teamStore = subscribe(teamStore, (value) => value);
  $$unsubscribe_playerStore = subscribe(playerStore, (value) => value);
  $page.url.searchParams.get("id");
  $$unsubscribe_page();
  $$unsubscribe_teamStore();
  $$unsubscribe_playerStore();
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="bg-panel mt-2 p-4"><h1 class="my-2 default-header" data-svelte-h="svelte-od2mk5">Euro 2024 Prediction</h1> ${`<div data-svelte-h="svelte-194gxkm">Loading...</div>`}</div>`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout, "Layout").$$render($$result, {}, {}, {
    default: () => {
      return `${`${validate_component(Spinner, "Spinner").$$render($$result, {}, {}, {})}`}`;
    }
  })}`;
});
export {
  Error$1 as E,
  Layout$1 as L,
  Page$8 as P,
  Server as S,
  set_building as a,
  set_manifest as b,
  set_prerendering as c,
  set_private_env as d,
  set_public_env as e,
  set_read_implementation as f,
  get_hooks as g,
  set_safe_public_env as h,
  Page$7 as i,
  Page$6 as j,
  Page$5 as k,
  Page$4 as l,
  Page$3 as m,
  Page$2 as n,
  options as o,
  Page$1 as p,
  Page as q,
  set_assets as s
};
