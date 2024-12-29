import { D as DEV } from "./vendor.js";
import * as devalue from "devalue";
import { Buffer } from "buffer";
import { parse, serialize } from "cookie";
import * as set_cookie_parser from "set-cookie-parser";
import { AuthClient } from "@dfinity/auth-client";
import "@dfinity/utils";
import { HttpAgent, Actor } from "@dfinity/agent";
import "@dfinity/ledger-icrc";
import "@dfinity/principal";
import "@dfinity/candid/lib/cjs/idl.js";
let base = "";
let assets = base;
const initial$1 = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial$1.base;
  assets = initial$1.assets;
}
function set_assets(path) {
  assets = initial$1.assets = path;
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
  if ("GET" in mod || "HEAD" in mod) allowed.push("HEAD");
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
  if (node.uses?.parent) uses.push('"parent":1');
  if (node.uses?.route) uses.push('"route":1');
  if (node.uses?.url) uses.push('"url":1');
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
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true") return false;
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
  if (path[0] === "/" && path[1] === "/") return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore") return path;
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
  if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
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
    if (false) ;
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
    if (false) ;
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
      "When using named actions, the default action cannot be used. See the docs for more info: https://svelte.dev/docs/kit/form-actions#named-actions"
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
    if (data instanceof Response) {
      throw new Error(
        `Data returned from action inside ${route_id} is not serializable. Form actions need to return plain objects or fail(). E.g. return { success: true } or return fail(400, { message: "invalid" });`
      );
    }
    if ("path" in error) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error.message}`;
      if (error.path !== "") message += ` (data.${error.path})`;
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
  if (!node?.server) return null;
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
              `Failed to get response header "${lower}" — it must be included by the \`filterSerializedResponseHeaders\` option: https://svelte.dev/docs/kit/hooks#Server-hooks-handle (at ${event.route.id})`
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
var is_array = Array.isArray;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
const noop = () => {
};
function is_promise(value) {
  return typeof value?.then === "function";
}
function fallback(value, fallback2, lazy = false) {
  return value === void 0 ? lazy ? (
    /** @type {() => V} */
    fallback2()
  ) : (
    /** @type {V} */
    fallback2
  ) : value;
}
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
const DERIVED = 1 << 1;
const EFFECT = 1 << 2;
const RENDER_EFFECT = 1 << 3;
const BLOCK_EFFECT = 1 << 4;
const BRANCH_EFFECT = 1 << 5;
const ROOT_EFFECT = 1 << 6;
const UNOWNED = 1 << 7;
const DISCONNECTED = 1 << 8;
const CLEAN = 1 << 9;
const DIRTY = 1 << 10;
const MAYBE_DIRTY = 1 << 11;
const INERT = 1 << 12;
const DESTROYED = 1 << 13;
const EFFECT_RAN = 1 << 14;
const HEAD_EFFECT = 1 << 18;
const EFFECT_HAS_DERIVED = 1 << 19;
const LEGACY_PROPS = Symbol("legacy props");
function effect_update_depth_exceeded() {
  {
    throw new Error("effect_update_depth_exceeded");
  }
}
function hydration_failed() {
  {
    throw new Error("hydration_failed");
  }
}
function state_unsafe_local_read() {
  {
    throw new Error("state_unsafe_local_read");
  }
}
function state_unsafe_mutation() {
  {
    throw new Error("state_unsafe_mutation");
  }
}
let legacy_mode_flag = false;
function source(v) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v,
    reactions: null,
    equals,
    version: 0
  };
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable = false) {
  const s2 = source(initial_value);
  if (!immutable) {
    s2.equals = safe_equals;
  }
  return s2;
}
function set(source2, value) {
  if (active_reaction !== null && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT)) !== 0 && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (derived_sources === null || !derived_sources.includes(source2))) {
    state_unsafe_mutation();
  }
  return internal_set(source2, value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    source2.v = value;
    source2.version = increment_version();
    mark_reactions(source2, DIRTY);
    if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0) {
      if (new_deps !== null && new_deps.includes(source2)) {
        set_signal_status(active_effect, DIRTY);
        schedule_effect(active_effect);
      } else {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
    }
  }
  return value;
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags = reaction.f;
    if ((flags & DIRTY) !== 0) continue;
    set_signal_status(reaction, status);
    if ((flags & (CLEAN | UNOWNED)) !== 0) {
      if ((flags & DERIVED) !== 0) {
        mark_reactions(
          /** @type {Derived} */
          reaction,
          MAYBE_DIRTY
        );
      } else {
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
}
const HYDRATION_START = "[";
const HYDRATION_END = "]";
const HYDRATION_ERROR = {};
function hydration_mismatch(location) {
  {
    console.warn("hydration_mismatch");
  }
}
let hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
let hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(
    /** @type {TemplateNode} */
    /* @__PURE__ */ get_next_sibling(hydrate_node)
  );
}
var $window;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== void 0) {
    return;
  }
  $window = window;
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  element_prototype.__click = void 0;
  element_prototype.__className = "";
  element_prototype.__attributes = null;
  element_prototype.__styles = null;
  element_prototype.__e = void 0;
  Text.prototype.__t = void 0;
}
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return first_child_getter.call(node);
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function clear_text_content(node) {
  node.textContent = "";
}
function destroy_derived_children(derived) {
  var children = derived.children;
  if (children !== null) {
    derived.children = null;
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      if ((child.f & DERIVED) !== 0) {
        destroy_derived(
          /** @type {Derived} */
          child
        );
      } else {
        destroy_effect(
          /** @type {Effect} */
          child
        );
      }
    }
  }
}
function execute_derived(derived) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(derived.parent);
  {
    try {
      destroy_derived_children(derived);
      value = update_reaction(derived);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived) {
  var value = execute_derived(derived);
  var status = (skip_reaction || (derived.f & UNOWNED) !== 0) && derived.deps !== null ? MAYBE_DIRTY : CLEAN;
  set_signal_status(derived, status);
  if (!derived.equals(value)) {
    derived.v = value;
    derived.version = increment_version();
  }
}
function destroy_derived(signal) {
  destroy_derived_children(signal);
  remove_reactions(signal, 0);
  set_signal_status(signal, DESTROYED);
  signal.v = signal.children = signal.deps = signal.ctx = signal.reactions = null;
}
function push_effect(effect2, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect2;
  } else {
    parent_last.next = effect2;
    effect2.prev = parent_last;
    parent_effect.last = effect2;
  }
}
function create_effect(type, fn, sync, push2 = true) {
  var is_root = (type & ROOT_EFFECT) !== 0;
  var parent_effect = active_effect;
  var effect2 = {
    ctx: component_context,
    deps: null,
    deriveds: null,
    nodes_start: null,
    nodes_end: null,
    f: type | DIRTY,
    first: null,
    fn,
    last: null,
    next: null,
    parent: is_root ? null : parent_effect,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (sync) {
    var previously_flushing_effect = is_flushing_effect;
    try {
      set_is_flushing_effect(true);
      update_effect(effect2);
      effect2.f |= EFFECT_RAN;
    } catch (e) {
      destroy_effect(effect2);
      throw e;
    } finally {
      set_is_flushing_effect(previously_flushing_effect);
    }
  } else if (fn !== null) {
    schedule_effect(effect2);
  }
  var inert = sync && effect2.deps === null && effect2.first === null && effect2.nodes_start === null && effect2.teardown === null && (effect2.f & EFFECT_HAS_DERIVED) === 0;
  if (!inert && !is_root && push2) {
    if (parent_effect !== null) {
      push_effect(effect2, parent_effect);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0) {
      var derived = (
        /** @type {Derived} */
        active_reaction
      );
      (derived.children ??= []).push(effect2);
    }
  }
  return effect2;
}
function effect_root(fn) {
  const effect2 = create_effect(ROOT_EFFECT, fn, true);
  return () => {
    destroy_effect(effect2);
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function branch(fn, push2 = true) {
  return create_effect(RENDER_EFFECT | BRANCH_EFFECT, fn, true, push2);
}
function execute_effect_teardown(effect2) {
  var teardown = effect2.teardown;
  if (teardown !== null) {
    const previous_reaction = active_reaction;
    set_active_reaction(null);
    try {
      teardown.call(null);
    } finally {
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_deriveds(signal) {
  var deriveds = signal.deriveds;
  if (deriveds !== null) {
    signal.deriveds = null;
    for (var i = 0; i < deriveds.length; i += 1) {
      destroy_derived(deriveds[i]);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    var next = effect2.next;
    destroy_effect(effect2, remove_dom);
    effect2 = next;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes_start !== null) {
    var node = effect2.nodes_start;
    var end = effect2.nodes_end;
    while (node !== null) {
      var next = node === end ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ get_next_sibling(node)
      );
      node.remove();
      node = next;
    }
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  destroy_effect_deriveds(effect2);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.transitions;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.parent = effect2.fn = effect2.nodes_start = effect2.nodes_end = null;
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next = effect2.next;
  if (prev !== null) prev.next = next;
  if (next !== null) next.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next;
    if (parent.last === effect2) parent.last = prev;
  }
}
function flush_tasks() {
}
function lifecycle_outside_component(name) {
  {
    throw new Error("lifecycle_outside_component");
  }
}
const FLUSH_MICROTASK = 0;
const FLUSH_SYNC = 1;
let scheduler_mode = FLUSH_MICROTASK;
let is_micro_task_queued = false;
let is_flushing_effect = false;
function set_is_flushing_effect(value) {
  is_flushing_effect = value;
}
let queued_root_effects = [];
let flush_count = 0;
let dev_effect_stack = [];
let active_reaction = null;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
let active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
let derived_sources = null;
let new_deps = null;
let skipped_deps = 0;
let untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
let current_version = 0;
let skip_reaction = false;
let component_context = null;
function increment_version() {
  return ++current_version;
}
function is_runes() {
  return !legacy_mode_flag;
}
function check_dirtiness(reaction) {
  var flags = reaction.f;
  if ((flags & DIRTY) !== 0) {
    return true;
  }
  if ((flags & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var is_unowned = (flags & UNOWNED) !== 0;
    if (dependencies !== null) {
      var i;
      if ((flags & DISCONNECTED) !== 0) {
        for (i = 0; i < dependencies.length; i++) {
          (dependencies[i].reactions ??= []).push(reaction);
        }
        reaction.f ^= DISCONNECTED;
      }
      for (i = 0; i < dependencies.length; i++) {
        var dependency = dependencies[i];
        if (check_dirtiness(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (is_unowned && active_effect !== null && !skip_reaction && !dependency?.reactions?.includes(reaction)) {
          (dependency.reactions ??= []).push(reaction);
        }
        if (dependency.version > reaction.version) {
          return true;
        }
      }
    }
    if (!is_unowned) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function handle_error(error, effect2, component_context2) {
  {
    throw error;
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_skip_reaction = skip_reaction;
  var prev_derived_sources = derived_sources;
  var previous_component_context = component_context;
  var flags = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  skip_reaction = !is_flushing_effect && (flags & UNOWNED) !== 0;
  derived_sources = null;
  component_context = reaction.ctx;
  try {
    var result = (
      /** @type {Function} */
      (0, reaction.fn)()
    );
    var deps = reaction.deps;
    if (new_deps !== null) {
      var i;
      remove_reactions(reaction, skipped_deps);
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (!skip_reaction) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    return result;
  } finally {
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    skip_reaction = previous_skip_reaction;
    derived_sources = prev_derived_sources;
    component_context = previous_component_context;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = reactions.indexOf(signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !new_deps.includes(dependency))) {
    set_signal_status(dependency, MAYBE_DIRTY);
    if ((dependency.f & (UNOWNED | DISCONNECTED)) === 0) {
      dependency.f ^= DISCONNECTED;
    }
    remove_reactions(
      /** @type {Derived} **/
      dependency,
      0
    );
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags = effect2.f;
  if ((flags & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  active_effect = effect2;
  try {
    if ((flags & BLOCK_EFFECT) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    destroy_effect_deriveds(effect2);
    execute_effect_teardown(effect2);
    var teardown = update_reaction(effect2);
    effect2.teardown = typeof teardown === "function" ? teardown : null;
    effect2.version = current_version;
    if (DEV) ;
  } catch (error) {
    handle_error(
      /** @type {Error} */
      error
    );
  } finally {
    active_effect = previous_effect;
  }
}
function infinite_loop_guard() {
  if (flush_count > 1e3) {
    flush_count = 0;
    {
      effect_update_depth_exceeded();
    }
  }
  flush_count++;
}
function flush_queued_root_effects(root_effects) {
  var length = root_effects.length;
  if (length === 0) {
    return;
  }
  infinite_loop_guard();
  var previously_flushing_effect = is_flushing_effect;
  is_flushing_effect = true;
  try {
    for (var i = 0; i < length; i++) {
      var effect2 = root_effects[i];
      if ((effect2.f & CLEAN) === 0) {
        effect2.f ^= CLEAN;
      }
      var collected_effects = [];
      process_effects(effect2, collected_effects);
      flush_queued_effects(collected_effects);
    }
  } finally {
    is_flushing_effect = previously_flushing_effect;
  }
}
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  for (var i = 0; i < length; i++) {
    var effect2 = effects[i];
    if ((effect2.f & (DESTROYED | INERT)) === 0 && check_dirtiness(effect2)) {
      update_effect(effect2);
      if (effect2.deps === null && effect2.first === null && effect2.nodes_start === null) {
        if (effect2.teardown === null) {
          unlink_effect(effect2);
        } else {
          effect2.fn = null;
        }
      }
    }
  }
}
function process_deferred() {
  is_micro_task_queued = false;
  if (flush_count > 1001) {
    return;
  }
  const previous_queued_root_effects = queued_root_effects;
  queued_root_effects = [];
  flush_queued_root_effects(previous_queued_root_effects);
  if (!is_micro_task_queued) {
    flush_count = 0;
  }
}
function schedule_effect(signal) {
  if (scheduler_mode === FLUSH_MICROTASK) {
    if (!is_micro_task_queued) {
      is_micro_task_queued = true;
      queueMicrotask(process_deferred);
    }
  }
  var effect2 = signal;
  while (effect2.parent !== null) {
    effect2 = effect2.parent;
    var flags = effect2.f;
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0) return;
      effect2.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect2);
}
function process_effects(effect2, collected_effects) {
  var current_effect = effect2.first;
  var effects = [];
  main_loop: while (current_effect !== null) {
    var flags = current_effect.f;
    var is_branch = (flags & BRANCH_EFFECT) !== 0;
    var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
    if (!is_skippable_branch && (flags & INERT) === 0) {
      if ((flags & RENDER_EFFECT) !== 0) {
        if (is_branch) {
          current_effect.f ^= CLEAN;
        } else if (check_dirtiness(current_effect)) {
          update_effect(current_effect);
        }
        var child = current_effect.first;
        if (child !== null) {
          current_effect = child;
          continue;
        }
      } else if ((flags & EFFECT) !== 0) {
        effects.push(current_effect);
      }
    }
    var sibling = current_effect.next;
    if (sibling === null) {
      let parent = current_effect.parent;
      while (parent !== null) {
        if (effect2 === parent) {
          break main_loop;
        }
        var parent_sibling = parent.next;
        if (parent_sibling !== null) {
          current_effect = parent_sibling;
          continue main_loop;
        }
        parent = parent.parent;
      }
    }
    current_effect = sibling;
  }
  for (var i = 0; i < effects.length; i++) {
    child = effects[i];
    collected_effects.push(child);
    process_effects(child, collected_effects);
  }
}
function flush_sync(fn) {
  var previous_scheduler_mode = scheduler_mode;
  var previous_queued_root_effects = queued_root_effects;
  try {
    infinite_loop_guard();
    const root_effects = [];
    scheduler_mode = FLUSH_SYNC;
    queued_root_effects = root_effects;
    is_micro_task_queued = false;
    flush_queued_root_effects(previous_queued_root_effects);
    var result = fn?.();
    flush_tasks();
    if (queued_root_effects.length > 0 || root_effects.length > 0) {
      flush_sync();
    }
    flush_count = 0;
    if (DEV) ;
    return result;
  } finally {
    scheduler_mode = previous_scheduler_mode;
    queued_root_effects = previous_queued_root_effects;
  }
}
function get$1(signal) {
  var flags = signal.f;
  var is_derived = (flags & DERIVED) !== 0;
  if (is_derived && (flags & DESTROYED) !== 0) {
    var value = execute_derived(
      /** @type {Derived} */
      signal
    );
    destroy_derived(
      /** @type {Derived} */
      signal
    );
    return value;
  }
  if (active_reaction !== null) {
    if (derived_sources !== null && derived_sources.includes(signal)) {
      state_unsafe_local_read();
    }
    var deps = active_reaction.deps;
    if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
      skipped_deps++;
    } else if (new_deps === null) {
      new_deps = [signal];
    } else {
      new_deps.push(signal);
    }
    if (untracked_writes !== null && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & BRANCH_EFFECT) === 0 && untracked_writes.includes(signal)) {
      set_signal_status(active_effect, DIRTY);
      schedule_effect(active_effect);
    }
  } else if (is_derived && /** @type {Derived} */
  signal.deps === null) {
    var derived = (
      /** @type {Derived} */
      signal
    );
    var parent = derived.parent;
    if (parent !== null && !parent.deriveds?.includes(derived)) {
      (parent.deriveds ??= []).push(derived);
    }
  }
  if (is_derived) {
    derived = /** @type {Derived} */
    signal;
    if (check_dirtiness(derived)) {
      update_derived(derived);
    }
  }
  return signal.v;
}
function untrack(fn) {
  const previous_reaction = active_reaction;
  try {
    active_reaction = null;
    return fn();
  } finally {
    active_reaction = previous_reaction;
  }
}
const STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function push$1(props, runes = false, fn) {
  component_context = {
    p: component_context,
    c: null,
    e: null,
    m: false,
    s: props,
    x: null,
    l: null
  };
}
function pop$1(component) {
  const context_stack_item = component_context;
  if (context_stack_item !== null) {
    const component_effects = context_stack_item.e;
    if (component_effects !== null) {
      var previous_effect = active_effect;
      var previous_reaction = active_reaction;
      context_stack_item.e = null;
      try {
        for (var i = 0; i < component_effects.length; i++) {
          var component_effect = component_effects[i];
          set_active_effect(component_effect.effect);
          set_active_reaction(component_effect.reaction);
          effect(component_effect.fn);
        }
      } finally {
        set_active_effect(previous_effect);
        set_active_reaction(previous_reaction);
      }
    }
    component_context = context_stack_item.p;
    context_stack_item.m = true;
  }
  return (
    /** @type {T} */
    {}
  );
}
const all_registered_events = /* @__PURE__ */ new Set();
const root_event_handles = /* @__PURE__ */ new Set();
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  var path_idx = 0;
  var handled_at = event.__root;
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event.__root = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
      current_target.host || null;
      try {
        var delegated = current_target["__" + event_name];
        if (delegated !== void 0 && !/** @type {any} */
        current_target.disabled) {
          if (is_array(delegated)) {
            var [fn, ...data] = delegated;
            fn.apply(current_target, [event, ...data]);
          } else {
            delegated.call(current_target, event);
          }
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble || parent_element === handler_element || parent_element === null) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event.__root = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function assign_nodes(start, end) {
  var effect2 = (
    /** @type {Effect} */
    active_effect
  );
  if (effect2.nodes_start === null) {
    effect2.nodes_start = start;
    effect2.nodes_end = end;
  }
}
const PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
function mount(component, options2) {
  return _mount(component, options2);
}
function hydrate(component, options2) {
  init_operations();
  options2.intro = options2.intro ?? false;
  const target = options2.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_first_child(target)
    );
    while (anchor && (anchor.nodeType !== 8 || /** @type {Comment} */
    anchor.data !== HYDRATION_START)) {
      anchor = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    hydrate_next();
    const instance = _mount(component, { ...options2, anchor });
    if (hydrate_node === null || hydrate_node.nodeType !== 8 || /** @type {Comment} */
    hydrate_node.data !== HYDRATION_END) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error === HYDRATION_ERROR) {
      if (options2.recover === false) {
        hydration_failed();
      }
      init_operations();
      clear_text_content(target);
      set_hydrating(false);
      return mount(component, options2);
    }
    throw error;
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
const document_listeners = /* @__PURE__ */ new Map();
function _mount(Component, { target, anchor, props = {}, events, context, intro = true }) {
  init_operations();
  var registered_events = /* @__PURE__ */ new Set();
  var event_handle = (events2) => {
    for (var i = 0; i < events2.length; i++) {
      var event_name = events2[i];
      if (registered_events.has(event_name)) continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      target.addEventListener(event_name, handle_event_propagation, { passive });
      var n = document_listeners.get(event_name);
      if (n === void 0) {
        document.addEventListener(event_name, handle_event_propagation, { passive });
        document_listeners.set(event_name, 1);
      } else {
        document_listeners.set(event_name, n + 1);
      }
    }
  };
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  var component = void 0;
  var unmount2 = effect_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    branch(() => {
      if (context) {
        push$1({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        ctx.c = context;
      }
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(
          /** @type {TemplateNode} */
          anchor_node,
          null
        );
      }
      component = Component(anchor_node, props) || {};
      if (hydrating) {
        active_effect.nodes_end = hydrate_node;
      }
      if (context) {
        pop$1();
      }
    });
    return () => {
      for (var event_name of registered_events) {
        target.removeEventListener(event_name, handle_event_propagation);
        var n = (
          /** @type {number} */
          document_listeners.get(event_name)
        );
        if (--n === 0) {
          document.removeEventListener(event_name, handle_event_propagation);
          document_listeners.delete(event_name);
        } else {
          document_listeners.set(event_name, n);
        }
      }
      root_event_handles.delete(event_handle);
      mounted_components.delete(component);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component, unmount2);
  return component;
}
let mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component) {
  const fn = mounted_components.get(component);
  if (fn) {
    fn();
  }
}
function asClassComponent$1(component) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options2) {
      super({
        component,
        ...options2
      });
    }
  };
}
class Svelte4Component {
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options2) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key2, value) => {
      var s2 = /* @__PURE__ */ mutable_source(value);
      sources.set(key2, s2);
      return s2;
    };
    const props = new Proxy(
      { ...options2.props || {}, $$events: {} },
      {
        get(target, prop) {
          return get$1(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
        },
        has(target, prop) {
          if (prop === LEGACY_PROPS) return true;
          get$1(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
          return Reflect.has(target, prop);
        },
        set(target, prop, value) {
          set(sources.get(prop) ?? add_source(prop, value), value);
          return Reflect.set(target, prop, value);
        }
      }
    );
    this.#instance = (options2.hydrate ? hydrate : mount)(options2.component, {
      target: options2.target,
      anchor: options2.anchor,
      props,
      context: options2.context,
      intro: options2.intro ?? false,
      recover: options2.recover
    });
    if (!options2?.props?.$$host || options2.sync === false) {
      flush_sync();
    }
    this.#events = props.$$events;
    for (const key2 of Object.keys(this.#instance)) {
      if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
      define_property(this, key2, {
        get() {
          return this.#instance[key2];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key2] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next) => {
      Object.assign(props, next);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event, callback) {
    this.#events[event] = this.#events[event] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event].push(cb);
    return () => {
      this.#events[event] = this.#events[event].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
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
const replacements$1 = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements$1 && replacements$1[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function subscribe_to_store(store, run, invalidate) {
  if (store == null) {
    run(void 0);
    return noop;
  }
  const unsub = untrack(
    () => store.subscribe(
      run,
      // @ts-expect-error
      invalidate
    )
  );
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop = null;
  const subscribers = /* @__PURE__ */ new Set();
  function set2(new_value) {
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
    set2(fn(
      /** @type {T} */
      value
    ));
  }
  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2, update) || noop;
    }
    run(
      /** @type {T} */
      value
    );
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe };
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i = value.length;
      while (i) hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i = buffer.length;
      while (i) hash2 = hash2 * 33 ^ buffer[--i];
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
    if (key2 === "cache-control") cache_control = value;
    else if (key2 === "age") age = value;
    else if (key2 === "vary" && value.trim() === "*") varyAny = true;
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
  if (!key[0]) precompute();
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
  #script_src_needs_csp;
  /** @type {boolean} */
  #script_src_elem_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {boolean} */
  #style_src_needs_csp;
  /** @type {boolean} */
  #style_src_attr_needs_csp;
  /** @type {boolean} */
  #style_src_elem_needs_csp;
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
    const needs_csp = (directive) => !!directive && !directive.some((value) => value === "unsafe-inline");
    this.#script_src_needs_csp = needs_csp(effective_script_src);
    this.#script_src_elem_needs_csp = needs_csp(script_src_elem);
    this.#style_src_needs_csp = needs_csp(effective_style_src);
    this.#style_src_attr_needs_csp = needs_csp(style_src_attr);
    this.#style_src_elem_needs_csp = needs_csp(style_src_elem);
    this.#script_needs_csp = this.#script_src_needs_csp || this.#script_src_elem_needs_csp;
    this.#style_needs_csp = this.#style_src_needs_csp || this.#style_src_attr_needs_csp || this.#style_src_elem_needs_csp;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (!this.#script_needs_csp) return;
    const source2 = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#script_src_needs_csp) {
      this.#script_src.push(source2);
    }
    if (this.#script_src_elem_needs_csp) {
      this.#script_src_elem.push(source2);
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (!this.#style_needs_csp) return;
    const source2 = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#style_src_needs_csp) {
      this.#style_src.push(source2);
    }
    if (this.#style_src_needs_csp) {
      this.#style_src.push(source2);
    }
    if (this.#style_src_attr_needs_csp) {
      this.#style_src_attr.push(source2);
    }
    if (this.#style_src_elem_needs_csp) {
      const sha256_empty_comment_hash = "sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d = this.#directives;
      if (d["style-src-elem"] && !d["style-src-elem"].includes(sha256_empty_comment_hash) && !this.#style_src_elem.includes(sha256_empty_comment_hash)) {
        this.#style_src_elem.push(sha256_empty_comment_hash);
      }
      if (source2 !== sha256_empty_comment_hash) {
        this.#style_src_elem.push(source2);
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
      if (!value) continue;
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
            if (!next.done) deferred.shift();
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
  branch: branch2,
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
      constructors: await Promise.all(branch2.map(({ node }) => node.component())),
      form: form_value
    };
    let data2 = {};
    for (let i = 0; i < branch2.length; i += 1) {
      data2 = { ...data2, ...branch2[i].data };
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
    for (const { node } of branch2) {
      for (const url of node.imports) modulepreloads.add(url);
      for (const url of node.stylesheets) stylesheets.add(url);
      for (const url of node.fonts) fonts.add(url);
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
    if (csp.style_needs_nonce) attributes.push(` nonce="${csp.nonce}"`);
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
    branch2.map((b) => b.server_data),
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
      const hydrate2 = [
        `node_ids: [${branch2.map(({ node }) => node.index).join(", ")}]`,
        "data",
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate2.push(`status: ${status}`);
      }
      if (options2.embedded) {
        hydrate2.push(`params: ${devalue.uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate2.join(`,
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
  const { iterator, push: push2, done } = create_async_iterator();
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
          const nonce = csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : "";
          push2(`<script${nonce}>${global}.resolve(${str})<\/script>
`);
          if (count === 0) done();
        }
      );
      return `${global}.defer(${id})`;
    }
  }
  try {
    const strings = nodes.map((node) => {
      if (!node) return "null";
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
    const branch2 = [];
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
      branch2.push(
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
      branch: branch2,
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
    if (done) return result;
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
  const { iterator, push: push2, done } = create_async_iterator();
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
            push2(`{"type":"chunk","id":${id},"${key2}":${str}}
`);
            if (count === 0) done();
          }
        );
        return id;
      }
    }
  };
  try {
    const strings = nodes.map((node) => {
      if (!node) return "null";
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
      if (DEV && action_result && !event.request.headers.has("x-sveltekit-action")) ;
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
    const branch2 = [];
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
                if (parent) Object.assign(data, parent.data);
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
      if (load_error) throw load_error;
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
    for (const p of server_promises) p.catch(() => {
    });
    for (const p of load_promises) p.catch(() => {
    });
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node) {
        try {
          const server_data = await server_promises[i];
          const data = await load_promises[i];
          branch2.push({ node, server_data, data });
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
              while (!branch2[j]) j -= 1;
              return await render_response({
                event,
                options: options2,
                manifest,
                state,
                resolve_opts,
                page_config: { ssr: true, csr: true },
                status: status2,
                error,
                branch: compact(branch2.slice(0, j + 1)).concat({
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
        branch2.push(null);
      }
    }
    if (state.prerendering && should_prerender_data) {
      let { data, chunks } = get_data_json(
        event,
        options2,
        branch2.map((node) => node?.server_data)
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
      branch: ssr === false ? [] : compact(branch2),
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
      if (param.rest) result[param.name] = "";
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
  if (buffered) return;
  return result;
}
const INVALID_COOKIE_CHARACTER_REGEX = /[\x00-\x1F\x7F()<>@,;:"/[\]?={} \t]/;
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
      const illegal_characters = name.match(INVALID_COOKIE_CHARACTER_REGEX);
      if (illegal_characters) {
        console.warn(
          `The cookie name "${name}" will be invalid in SvelteKit 3.0 as it contains ${illegal_characters.join(
            " and "
          )}. See RFC 2616 for more details https://datatracker.ietf.org/doc/html/rfc2616#section-2.2`
        );
      }
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
      if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
      if (!path_matches(destination.pathname, cookie.options.path)) continue;
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
  if (!constraint) return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized) return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint) return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized) return true;
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
            if (cookie) request.headers.set("cookie", cookie);
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
          } else if (read_implementation && file in manifest._.server_assets) {
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
    if (!module) return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2)) continue;
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
    if (!node?.universal?.config && !node?.server?.config) continue;
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
      if (!match) continue;
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
        if (DEV) ;
        trailing_slash = get_option(nodes, "trailingSlash");
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash;
        if (DEV) ;
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
    if (state.prerendering && !state.prerendering.fallback) disable_search(url);
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
          if (value) headers22.set(key2, value);
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
var current_component = null;
function getContext(key2) {
  const context_map = get_or_init_context_map();
  const result = (
    /** @type {T} */
    context_map.get(key2)
  );
  return result;
}
function setContext(key2, context) {
  get_or_init_context_map().set(key2, context);
  return context;
}
function get_or_init_context_map(name) {
  if (current_component === null) {
    lifecycle_outside_component();
  }
  return current_component.c ??= new Map(get_parent_context(current_component) || void 0);
}
function push(fn) {
  current_component = { p: current_component, c: null, d: null };
}
function pop() {
  var component = (
    /** @type {Component} */
    current_component
  );
  var ondestroy = component.d;
  if (ondestroy) {
    on_destroy.push(...ondestroy);
  }
  current_component = component.p;
}
function get_parent_context(component_context2) {
  let parent = component_context2.p;
  while (parent !== null) {
    const context_map = parent.c;
    if (context_map !== null) {
      return context_map;
    }
    parent = parent.p;
  }
  return null;
}
const BLOCK_OPEN = `<!--${HYDRATION_START}-->`;
const BLOCK_CLOSE = `<!--${HYDRATION_END}-->`;
function copy_payload({ out, css, head }) {
  return {
    out,
    css: new Set(css),
    head: {
      title: head.title,
      out: head.out
    }
  };
}
function assign_payload(p1, p2) {
  p1.out = p2.out;
  p1.head = p2.head;
}
let on_destroy = [];
function render(component, options2 = {}) {
  const payload = { out: "", css: /* @__PURE__ */ new Set(), head: { title: "", out: "" } };
  const prev_on_destroy = on_destroy;
  on_destroy = [];
  payload.out += BLOCK_OPEN;
  if (options2.context) {
    push();
    current_component.c = options2.context;
  }
  component(payload, options2.props ?? {}, {}, {});
  if (options2.context) {
    pop();
  }
  payload.out += BLOCK_CLOSE;
  for (const cleanup of on_destroy) cleanup();
  on_destroy = prev_on_destroy;
  let head = payload.head.out + payload.head.title;
  for (const { hash: hash2, code } of payload.css) {
    head += `<style id="${hash2}">${code}</style>`;
  }
  return {
    head,
    html: payload.out,
    body: payload.out
  };
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function store_get(store_values, store_name, store) {
  if (store_name in store_values && store_values[store_name][0] === store) {
    return store_values[store_name][2];
  }
  store_values[store_name]?.[1]();
  store_values[store_name] = [store, null, void 0];
  const unsub = subscribe_to_store(
    store,
    /** @param {any} v */
    (v) => store_values[store_name][2] = v
  );
  store_values[store_name][1] = unsub;
  return store_values[store_name][2];
}
function unsubscribe_stores(store_values) {
  for (const store_name in store_values) {
    store_values[store_name][1]();
  }
}
function slot(payload, $$props, name, slot_props, fallback_fn) {
  var slot_fn = $$props.$$slots?.[name];
  if (slot_fn === true) {
    slot_fn = $$props["children"];
  }
  if (slot_fn !== void 0) {
    slot_fn(payload, slot_props);
  }
}
function bind_props(props_parent, props_now) {
  for (const key2 in props_now) {
    const initial_value = props_parent[key2];
    const value = props_now[key2];
    if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key2)?.set) {
      props_parent[key2] = value;
    }
  }
}
function await_block(promise, pending_fn, then_fn) {
  if (is_promise(promise)) {
    promise.then(null, noop);
    if (pending_fn !== null) {
      pending_fn();
    }
  } else if (then_fn !== null) {
    then_fn(promise);
  }
}
function ensure_array_like(array_like_or_iterator) {
  if (array_like_or_iterator) {
    return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  return [];
}
function asClassComponent(component) {
  const component_constructor = asClassComponent$1(component);
  const _render = (props, { context } = {}) => {
    const result = render(component, { props, context });
    return {
      css: { code: "", map: null },
      head: result.head,
      html: result.body
    };
  };
  component_constructor.render = _render;
  return component_constructor;
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
let prerendering = false;
function set_building() {
}
function set_prerendering() {
  prerendering = true;
}
function Root($$payload, $$props) {
  push();
  let {
    stores,
    page: page2,
    constructors,
    components = [],
    form,
    data_0 = null,
    data_1 = null
  } = $$props;
  {
    setContext("__svelte__", stores);
  }
  {
    stores.page.set(page2);
  }
  const Pyramid_1 = constructors[1];
  if (constructors[1]) {
    $$payload.out += "<!--[-->";
    const Pyramid_0 = constructors[0];
    $$payload.out += `<!---->`;
    Pyramid_0($$payload, {
      data: data_0,
      form,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        Pyramid_1($$payload2, { data: data_1, form });
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    const Pyramid_0 = constructors[0];
    $$payload.out += `<!---->`;
    Pyramid_0($$payload, { data: data_0, form });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
const root = asClassComponent(Root);
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
  root,
  service_worker: false,
  templates: {
    app: ({ head, body: body2, assets: assets2, nonce, env }) => '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta content="width=device-width, initial-scale=1" name="viewport" />\n\n    <title>FootballGod</title>\n    <link href="https://footballgod.xyz" rel="canonical" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      name="description"\n    />\n    <meta content="FootballGod" property="og:title" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      property="og:description"\n    />\n    <meta content="website" property="og:type" />\n    <meta content="https://footballgod.xyz" property="og:url" />\n    <meta\n      content="https://footballgod.xyz/meta-share.jpg"\n      property="og:image"\n    />\n    <meta content="summary_large_image" name="twitter:card" />\n    <meta content="FootballGod" name="twitter:title" />\n    <meta\n      content="FootballGod is a tokenised betting platform on the Internet Computer blockchain."\n      name="twitter:description"\n    />\n    <meta\n      content="https://footballgod.xyz/meta-share.jpg"\n      name="twitter:image"\n    />\n    <meta content="@beadle1989" name="twitter:creator" />\n\n    <link crossorigin="anonymous" href="/manifest.webmanifest" rel="manifest" />\n\n    <link\n      rel="icon"\n      type="image/png"\n      sizes="32x32"\n      href="' + assets2 + '/favicons/favicon-32x32.png"\n    />\n    <link\n      rel="icon"\n      type="image/png"\n      sizes="16x16"\n      href="' + assets2 + '/favicons/favicon-16x16.png"\n    />\n    <link rel="shortcut icon" href="' + assets2 + '/favicons/favicon.ico" />\n\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="#7F56F1" />\n    <meta name="apple-mobile-web-app-title" content="FootballGod" />\n    <link\n      rel="apple-touch-icon"\n      href="' + assets2 + '/favicons/apple-touch-icon.png"\n    />\n    <link\n      rel="mask-icon"\n      href="' + assets2 + '/favicons/safari-pinned-tab.svg"\n      color="#7F56F1"\n    />\n\n    <meta name="msapplication-TileColor" content="#7F56F1" />\n    <meta\n      name="msapplication-config"\n      content="' + assets2 + '/favicons/browserconfig.xml"\n    />\n\n    <meta content="#7F56F1" name="theme-color" />\n    ' + head + '\n\n    <style>\n      html,\n      body {\n        height: 100%;\n        margin: 0;\n      }\n\n      @font-face {\n        font-display: swap;\n        font-family: "Poppins";\n        font-style: normal;\n        font-weight: 400;\n        src: url("' + assets2 + '/poppins-regular-webfont.woff2")\n          format("woff2");\n      }\n\n      @font-face {\n        font-display: swap;\n        font-family: "Manrope";\n        font-style: normal;\n        font-weight: 400;\n        src: url("' + assets2 + '/Manrope-Regular.woff2") format("woff2");\n      }\n      body {\n        font-family: "Poppins", sans-serif !important;\n        color: white !important;\n        background-color: #1a1a1d;\n        height: 100vh;\n        margin: 0;\n      }\n\n      #app-spinner {\n        --spinner-size: 30px;\n\n        width: var(--spinner-size);\n        height: var(--spinner-size);\n\n        animation: app-spinner-linear-rotate 2000ms linear infinite;\n\n        position: absolute;\n        top: calc(50% - (var(--spinner-size) / 2));\n        left: calc(50% - (var(--spinner-size) / 2));\n\n        --radius: 45px;\n        --circumference: calc(3.14159265359 * var(--radius) * 2);\n\n        --start: calc((1 - 0.05) * var(--circumference));\n        --end: calc((1 - 0.8) * var(--circumference));\n      }\n\n      #app-spinner circle {\n        stroke-dasharray: var(--circumference);\n        stroke-width: 10%;\n        transform-origin: 50% 50% 0;\n\n        transition-property: stroke;\n\n        animation-name: app-spinner-stroke-rotate-100;\n        animation-duration: 4000ms;\n        animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\n        animation-iteration-count: infinite;\n\n        fill: transparent;\n        stroke: currentColor;\n\n        transition: stroke-dashoffset 225ms linear;\n      }\n\n      @keyframes app-spinner-linear-rotate {\n        0% {\n          transform: rotate(0deg);\n        }\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n\n      @keyframes app-spinner-stroke-rotate-100 {\n        0% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(0);\n        }\n        12.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(0);\n        }\n        12.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(72.5deg);\n        }\n        25% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(72.5deg);\n        }\n\n        25.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(270deg);\n        }\n        37.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(270deg);\n        }\n        37.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(161.5deg);\n        }\n        50% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(161.5deg);\n        }\n\n        50.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(180deg);\n        }\n        62.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(180deg);\n        }\n        62.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(251.5deg);\n        }\n        75% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(251.5deg);\n        }\n\n        75.0001% {\n          stroke-dashoffset: var(--start);\n          transform: rotate(90deg);\n        }\n        87.5% {\n          stroke-dashoffset: var(--end);\n          transform: rotate(90deg);\n        }\n        87.5001% {\n          stroke-dashoffset: var(--end);\n          transform: rotateX(180deg) rotate(341.5deg);\n        }\n        100% {\n          stroke-dashoffset: var(--start);\n          transform: rotateX(180deg) rotate(341.5deg);\n        }\n      }\n    </style>\n  </head>\n  <body data-sveltekit-preload-data="hover">\n    <div style="display: contents">' + body2 + '</div>\n\n    <svg\n      id="app-spinner"\n      preserveAspectRatio="xMidYMid meet"\n      focusable="false"\n      aria-hidden="true"\n      data-tid="spinner"\n      viewBox="0 0 100 100"\n    >\n      <circle cx="50%" cy="50%" r="45" />\n    </svg>\n  </body>\n</html>\n',
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
  version_hash: "l7oeny"
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
function Layout$1($$payload, $$props) {
  push();
  let { children } = $$props;
  children($$payload);
  $$payload.out += `<!---->`;
  pop();
}
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
function Error$1($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<h1>${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p>${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
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
  if (typeof window === "undefined") return false;
  return window.location.origin === NNS_IC_ORG_ALTERNATIVE_ORIGIN;
};
const initAuthStore = () => {
  const { subscribe, set: set2, update } = writable({
    identity: void 0
  });
  return {
    subscribe,
    sync: async () => {
      authClient = authClient ?? await createAuthClient();
      const isAuthenticated = await authClient.isAuthenticated();
      set2({
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
const idlFactory = ({ IDL }) => {
  const Error2 = IDL.Variant({
    "DecodeError": IDL.Null,
    "NotAllowed": IDL.Null,
    "NotFound": IDL.Null,
    "NotAuthorized": IDL.Null,
    "InvalidData": IDL.Null,
    "AlreadyExists": IDL.Null,
    "CanisterCreateError": IDL.Null,
    "CanisterFull": IDL.Null
  });
  const Result = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const GameweekNumber = IDL.Nat8;
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
    "seasonFixtures": IDL.Vec(FixtureDTO)
  });
  const ShirtType = IDL.Variant({ "Filled": IDL.Null, "Striped": IDL.Null });
  const CreateClubDTO = IDL.Record({
    "secondaryColourHex": IDL.Text,
    "name": IDL.Text,
    "friendlyName": IDL.Text,
    "thirdColourHex": IDL.Text,
    "abbreviatedName": IDL.Text,
    "shirtType": ShirtType,
    "primaryColourHex": IDL.Text,
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
    "shirtNumber": IDL.Nat8,
    "position": PlayerPosition,
    "lastName": IDL.Text,
    "firstName": IDL.Text
  });
  const LoanPlayerDTO = IDL.Record({
    "loanEndDate": IDL.Int,
    "playerId": ClubId,
    "loanClubId": ClubId,
    "loanLeagueId": LeagueId
  });
  const MoveFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "updatedFixtureGameweek": GameweekNumber,
    "updatedFixtureDate": IDL.Int,
    "seasonId": SeasonId,
    "leagueId": LeagueId
  });
  const PostponeFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "seasonId": SeasonId,
    "leagueId": LeagueId
  });
  const PromoteClubDTO = IDL.Record({
    "secondaryColourHex": IDL.Text,
    "name": IDL.Text,
    "friendlyName": IDL.Text,
    "thirdColourHex": IDL.Text,
    "abbreviatedName": IDL.Text,
    "shirtType": ShirtType,
    "primaryColourHex": IDL.Text
  });
  const RecallPlayerDTO = IDL.Record({ "playerId": ClubId });
  const RemoveClubDTO = IDL.Record({
    "clubId": ClubId,
    "leagueId": LeagueId
  });
  const RescheduleFixtureDTO = IDL.Record({
    "postponedFixtureId": FixtureId,
    "updatedFixtureGameweek": GameweekNumber,
    "updatedFixtureDate": IDL.Int
  });
  const RetirePlayerDTO = IDL.Record({
    "playerId": ClubId,
    "retirementDate": IDL.Int
  });
  const RevaluePlayerDownDTO = IDL.Record({
    "playerId": ClubId,
    "seasonId": SeasonId,
    "gameweek": GameweekNumber
  });
  const RevaluePlayerUpDTO = IDL.Record({
    "playerId": ClubId,
    "seasonId": SeasonId,
    "gameweek": GameweekNumber
  });
  const SetFreeAgentDTO = IDL.Record({
    "playerId": ClubId,
    "leagueId": LeagueId
  });
  const SetPlayerInjuryDTO = IDL.Record({
    "playerId": ClubId,
    "description": IDL.Text,
    "expectedEndDate": IDL.Int
  });
  const SubmitFixtureDataDTO = IDL.Record({
    "fixtureId": FixtureId,
    "seasonId": SeasonId,
    "gameweek": GameweekNumber,
    "playerEventData": IDL.Vec(PlayerEventData),
    "leagueId": LeagueId
  });
  const TransferPlayerDTO = IDL.Record({
    "clubId": ClubId,
    "newLeagueId": LeagueId,
    "playerId": ClubId,
    "newShirtNumber": IDL.Nat8,
    "newClubId": ClubId,
    "leagueId": LeagueId
  });
  const UnretirePlayerDTO = IDL.Record({
    "playerId": ClubId,
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
    "primaryColourHex": IDL.Text
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
    "playerId": ClubId,
    "nationality": CountryId,
    "shirtNumber": IDL.Nat8,
    "position": PlayerPosition,
    "lastName": IDL.Text,
    "firstName": IDL.Text
  });
  const PrincipalId = IDL.Text;
  const GetBetsDTO = IDL.Record({ "principalId": PrincipalId });
  const SelectionStatus = IDL.Variant({
    "Void": IDL.Null,
    "Unsettled": IDL.Null,
    "Settled": IDL.Null
  });
  const BetResult = IDL.Variant({
    "Won": IDL.Null,
    "Lost": IDL.Null,
    "Open": IDL.Null
  });
  const BetType = IDL.Variant({
    "SevenFold": IDL.Null,
    "Patent": IDL.Null,
    "FiveFold": IDL.Null,
    "FourFold": IDL.Null,
    "Goliath": IDL.Null,
    "Double": IDL.Null,
    "Lucky15": IDL.Null,
    "Lucky31": IDL.Null,
    "Lucky63": IDL.Null,
    "SuperHeinz": IDL.Null,
    "Treble": IDL.Null,
    "Trixie": IDL.Null,
    "TenFold": IDL.Null,
    "EightFold": IDL.Null,
    "Heinz": IDL.Null,
    "Yankee": IDL.Null,
    "SixFold": IDL.Null,
    "NineFold": IDL.Null,
    "Canadian": IDL.Null,
    "Single": IDL.Null
  });
  const PlayerId = IDL.Nat16;
  const PlayerEventDetail = IDL.Record({
    "clubId": ClubId,
    "playerId": PlayerId
  });
  const ClubEventDetail = IDL.Record({ "clubId": ClubId });
  const MatchResult = IDL.Variant({
    "HomeWin": IDL.Null,
    "Draw": IDL.Null,
    "AwayWin": IDL.Null
  });
  const CorrectResultDetail = IDL.Record({ "matchResult": MatchResult });
  const ScoreDetail = IDL.Record({
    "homeGoals": IDL.Nat8,
    "awayGoals": IDL.Nat8
  });
  const BothTeamsToScoreDetail = IDL.Record({ "bothTeamsToScore": IDL.Bool });
  const HalfTimeFullTimeResultDetail = IDL.Record({
    "fullTimeResult": MatchResult,
    "halfTimeResult": MatchResult
  });
  const PlayerGroupEventDetail = IDL.Record({
    "clubId": ClubId,
    "playerId": PlayerId
  });
  const BothTeamsToScoreAndWinnerDetail = IDL.Record({
    "bothTeamsToScore": IDL.Bool,
    "matchResult": MatchResult
  });
  const SelectionDetail = IDL.Variant({
    "MissPenalty": PlayerEventDetail,
    "LastAssist": PlayerEventDetail,
    "PenaltyMissed": ClubEventDetail,
    "FirstAssist": PlayerEventDetail,
    "AnytimeGoalscorer": PlayerEventDetail,
    "CorrectResult": CorrectResultDetail,
    "HalfTimeScore": ScoreDetail,
    "BothTeamsToScore": BothTeamsToScoreDetail,
    "HalfTimeFullTimeResult": HalfTimeFullTimeResultDetail,
    "LastGoalscorer": PlayerEventDetail,
    "RedCard": PlayerEventDetail,
    "ScoreHatrick": PlayerGroupEventDetail,
    "CorrectScore": ScoreDetail,
    "AnytimeAssist": PlayerEventDetail,
    "YellowCard": PlayerEventDetail,
    "BothTeamsToScoreAndWinner": BothTeamsToScoreAndWinnerDetail,
    "FirstGoalscorer": PlayerEventDetail,
    "ScoreBrace": PlayerGroupEventDetail
  });
  const Category = IDL.Variant({
    "MissPenalty": IDL.Null,
    "LastAssist": IDL.Null,
    "PenaltyMissed": IDL.Null,
    "FirstAssist": IDL.Null,
    "AnytimeGoalscorer": IDL.Null,
    "CorrectResult": IDL.Null,
    "HalfTimeScore": IDL.Null,
    "BothTeamsToScore": IDL.Null,
    "HalfTimeFullTimeResult": IDL.Null,
    "LastGoalscorer": IDL.Null,
    "RedCard": IDL.Null,
    "ScoreHatrick": IDL.Null,
    "CorrectScore": IDL.Null,
    "AnytimeAssist": IDL.Null,
    "YellowCard": IDL.Null,
    "BothTeamsToScoreAndWinner": IDL.Null,
    "FirstGoalscorer": IDL.Null,
    "ScoreBrace": IDL.Null
  });
  const Selection = IDL.Record({
    "status": SelectionStatus,
    "result": BetResult,
    "fixtureId": FixtureId,
    "winnings": IDL.Float64,
    "odds": IDL.Float64,
    "stake": IDL.Nat64,
    "expectedReturns": IDL.Nat64,
    "selectionDetail": SelectionDetail,
    "leagueId": LeagueId,
    "selectionType": Category
  });
  const BetSlip = IDL.Record({
    "id": IDL.Nat,
    "status": SelectionStatus,
    "result": BetResult,
    "betType": BetType,
    "totalWinnings": IDL.Nat64,
    "totalStake": IDL.Nat64,
    "placedBy": PrincipalId,
    "placedOn": IDL.Int,
    "selections": IDL.Vec(Selection),
    "expectedReturns": IDL.Nat64,
    "settledOn": IDL.Int
  });
  const Result_16 = IDL.Variant({ "ok": IDL.Vec(BetSlip), "err": Error2 });
  const HomePageFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "homeOdds": IDL.Float64,
    "drawOdds": IDL.Float64,
    "awayOdds": IDL.Float64,
    "gameweek": GameweekNumber,
    "leagueId": LeagueId
  });
  const Result_15 = IDL.Variant({
    "ok": IDL.Vec(HomePageFixtureDTO),
    "err": Error2
  });
  const CountryDTO = IDL.Record({
    "id": CountryId,
    "code": IDL.Text,
    "name": IDL.Text
  });
  const Result_14 = IDL.Variant({ "ok": IDL.Vec(CountryDTO), "err": Error2 });
  const Result_13 = IDL.Variant({ "ok": IDL.Vec(FixtureDTO), "err": Error2 });
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
  const Result_12 = IDL.Variant({ "ok": IDL.Vec(ClubDTO), "err": Error2 });
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
    "firstName": IDL.Text
  });
  const Result_11 = IDL.Variant({ "ok": IDL.Vec(PlayerDTO), "err": Error2 });
  const CalendarMonth = IDL.Nat8;
  const LeagueStatus = IDL.Record({
    "transferWindowEndMonth": IDL.Nat8,
    "transferWindowEndDay": IDL.Nat8,
    "transferWindowStartMonth": IDL.Nat8,
    "transferWindowActive": IDL.Bool,
    "totalGameweeks": IDL.Nat8,
    "completedGameweek": GameweekNumber,
    "transferWindowStartDay": IDL.Nat8,
    "unplayedGameweek": GameweekNumber,
    "activeMonth": CalendarMonth,
    "activeSeasonId": SeasonId,
    "activeGameweek": GameweekNumber,
    "leagueId": LeagueId,
    "seasonActive": IDL.Bool
  });
  const Result_10 = IDL.Variant({ "ok": LeagueStatus, "err": Error2 });
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
  const Result_9 = IDL.Variant({
    "ok": IDL.Vec(FootballLeagueDTO),
    "err": Error2
  });
  const PlayerSelectionOdds = IDL.Record({
    "playerId": PlayerId,
    "odds": IDL.Float64
  });
  const ScoreSelectionOdds = IDL.Record({
    "odds": IDL.Float64,
    "homeGoals": IDL.Nat8,
    "awayGoals": IDL.Nat8
  });
  const YesNoSelectionOdds = IDL.Record({
    "noOdds": IDL.Float64,
    "yesOdds": IDL.Float64
  });
  const TeamSelectionOdds = IDL.Record({
    "homeOdds": IDL.Float64,
    "drawOdds": IDL.Float64,
    "awayOdds": IDL.Float64
  });
  const MissPenaltyOdds = IDL.Record({
    "homeTeam": IDL.Float64,
    "awayTeam": IDL.Float64
  });
  const OverUnderSelection = IDL.Record({
    "odds": IDL.Float64,
    "margin": IDL.Float64
  });
  const OverUnderSelectionOdds = IDL.Record({
    "overOdds": IDL.Vec(OverUnderSelection),
    "underOdds": IDL.Vec(OverUnderSelection)
  });
  const HalfTimeFullTimeOdds = IDL.Record({
    "firstHalfResult": MatchResult,
    "odds": IDL.Float64,
    "secondHalfResult": MatchResult
  });
  const ResultAndYesNoSelectionOdds = IDL.Record({
    "result": MatchResult,
    "odds": IDL.Float64,
    "isYes": IDL.Bool
  });
  const MatchOddsDTO = IDL.Record({
    "fixtureId": FixtureId,
    "lastAssist": IDL.Vec(PlayerSelectionOdds),
    "correctScores": IDL.Vec(ScoreSelectionOdds),
    "bothTeamsToScore": YesNoSelectionOdds,
    "yellowCards": IDL.Vec(PlayerSelectionOdds),
    "lastGoalscorers": IDL.Vec(PlayerSelectionOdds),
    "halfTimeScores": IDL.Vec(ScoreSelectionOdds),
    "anytimeAssist": IDL.Vec(PlayerSelectionOdds),
    "penaltyMissers": IDL.Vec(PlayerSelectionOdds),
    "redCards": IDL.Vec(PlayerSelectionOdds),
    "anytimeScorers": IDL.Vec(PlayerSelectionOdds),
    "correctResults": TeamSelectionOdds,
    "penaltyMissed": MissPenaltyOdds,
    "scoresHatTrick": IDL.Vec(PlayerSelectionOdds),
    "scoresBrace": IDL.Vec(PlayerSelectionOdds),
    "goalsOverUnder": OverUnderSelectionOdds,
    "firstAssisters": IDL.Vec(PlayerSelectionOdds),
    "leagueId": LeagueId,
    "firstGoalscorers": IDL.Vec(PlayerSelectionOdds),
    "halfTimeFullTimeResult": IDL.Vec(HalfTimeFullTimeOdds),
    "bothTeamsToScoreAndWinner": IDL.Vec(ResultAndYesNoSelectionOdds)
  });
  const Result_8 = IDL.Variant({ "ok": MatchOddsDTO, "err": Error2 });
  const ProfileDTO = IDL.Record({
    "username": IDL.Text,
    "maxBetLimit": IDL.Nat64,
    "monthlyBetLimit": IDL.Nat64,
    "withdrawalAddress": IDL.Text,
    "profilePictureExtension": IDL.Text,
    "accountBalance": IDL.Nat64,
    "accountOnPause": IDL.Bool,
    "completedKYC": IDL.Bool,
    "profilePicture": IDL.Opt(IDL.Vec(IDL.Nat8)),
    "principalId": PrincipalId,
    "monthlyBetTotal": IDL.Nat64
  });
  const Result_7 = IDL.Variant({ "ok": ProfileDTO, "err": Error2 });
  const SeasonDTO = IDL.Record({
    "id": SeasonId,
    "name": IDL.Text,
    "year": IDL.Nat16
  });
  const Result_6 = IDL.Variant({ "ok": IDL.Vec(SeasonDTO), "err": Error2 });
  const SystemStateDTO = IDL.Record({
    "version": IDL.Text,
    "onHold": IDL.Bool
  });
  const Result_5 = IDL.Variant({ "ok": SystemStateDTO, "err": Error2 });
  const TimerInfo = IDL.Record({
    "id": IDL.Int,
    "callbackName": IDL.Text,
    "triggerTime": IDL.Int
  });
  const Result_4 = IDL.Variant({ "ok": IDL.Vec(TimerInfo), "err": Error2 });
  const UserDTO = IDL.Record({
    "kyc_ref": IDL.Text,
    "terms_accepted": IDL.Bool,
    "joined": IDL.Int,
    "principalId": PrincipalId
  });
  const UserAuditDTO = IDL.Record({
    "date": IDL.Int,
    "users": IDL.Vec(UserDTO)
  });
  const Result_3 = IDL.Variant({ "ok": UserAuditDTO, "err": Error2 });
  const Result_2 = IDL.Variant({ "ok": IDL.Bool, "err": Error2 });
  const PauseAccountDTO = IDL.Record({
    "pauseDays": IDL.Nat,
    "principalId": PrincipalId
  });
  const SubmitBetslipDTO = IDL.Record({
    "expectedReturn": IDL.Nat64,
    "seasonId": SeasonId,
    "totalStake": IDL.Nat64,
    "principalId": PrincipalId,
    "leagueId": LeagueId
  });
  const Result_1 = IDL.Variant({ "ok": BetSlip, "err": Error2 });
  const SetMaxBetLimit = IDL.Record({
    "maxBetLimit": IDL.Nat64,
    "principalId": PrincipalId
  });
  const SetMonthlyBetLimitDTO = IDL.Record({
    "monthlyBetLimit": IDL.Nat64,
    "principalId": PrincipalId
  });
  const UpdateProfilePictureDTO = IDL.Record({
    "profilePictureExtension": IDL.Text,
    "profilePicture": IDL.Vec(IDL.Nat8),
    "principalId": PrincipalId
  });
  const UpdateAppStatusDTO = IDL.Record({
    "version": IDL.Text,
    "onHold": IDL.Bool
  });
  const UpdateUsernameDTO = IDL.Record({
    "username": IDL.Text,
    "principalId": PrincipalId
  });
  const UpdateWithdrawalAddressDTO = IDL.Record({
    "withdrawalAddress": IDL.Text,
    "principalId": PrincipalId
  });
  const RustResult = IDL.Variant({ "Ok": IDL.Text, "Err": IDL.Text });
  return IDL.Service({
    "calculateGameweekScores": IDL.Func([IDL.Text], [Result], []),
    "calculateLeaderboards": IDL.Func([IDL.Text], [Result], []),
    "calculateWeeklyRewards": IDL.Func(
      [IDL.Text, GameweekNumber],
      [Result],
      []
    ),
    "executeAddInitialFixtures": IDL.Func(
      [LeagueId, AddInitialFixturesDTO],
      [],
      []
    ),
    "executeCreateClub": IDL.Func([CreateClubDTO], [], []),
    "executeCreateLeague": IDL.Func([CreateLeagueDTO], [], []),
    "executeCreatePlayer": IDL.Func([LeagueId, CreatePlayerDTO], [], []),
    "executeLoanPlayer": IDL.Func([LeagueId, LoanPlayerDTO], [], []),
    "executeMoveFixture": IDL.Func([MoveFixtureDTO], [], []),
    "executePostponeFixture": IDL.Func([PostponeFixtureDTO], [], []),
    "executePromoteClub": IDL.Func([LeagueId, PromoteClubDTO], [], []),
    "executeRecallPlayer": IDL.Func([LeagueId, RecallPlayerDTO], [], []),
    "executeRemoveClub": IDL.Func([RemoveClubDTO], [], []),
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
    "executeSetFreeAgent": IDL.Func([LeagueId, SetFreeAgentDTO], [], []),
    "executeSetPlayerInjury": IDL.Func([LeagueId, SetPlayerInjuryDTO], [], []),
    "executeSubmitFixtureData": IDL.Func([SubmitFixtureDataDTO], [], []),
    "executeTransferPlayer": IDL.Func([LeagueId, TransferPlayerDTO], [], []),
    "executeUnretirePlayer": IDL.Func([LeagueId, UnretirePlayerDTO], [], []),
    "executeUpdateClub": IDL.Func([LeagueId, UpdateClubDTO], [], []),
    "executeUpdateLeague": IDL.Func([UpdateLeagueDTO], [], []),
    "executeUpdatePlayer": IDL.Func([LeagueId, UpdatePlayerDTO], [], []),
    "getBets": IDL.Func([GetBetsDTO], [Result_16], []),
    "getBettableHomepageFixtures": IDL.Func(
      [LeagueId],
      [Result_15],
      ["query"]
    ),
    "getCountries": IDL.Func([], [Result_14], ["query"]),
    "getFixtures": IDL.Func([LeagueId], [Result_13], ["composite_query"]),
    "getLeagueClubs": IDL.Func([LeagueId], [Result_12], ["composite_query"]),
    "getLeaguePlayers": IDL.Func([LeagueId], [Result_11], ["composite_query"]),
    "getLeagueStatus": IDL.Func([LeagueId], [Result_10], ["composite_query"]),
    "getLeagues": IDL.Func([], [Result_9], ["composite_query"]),
    "getMatchOdds": IDL.Func([LeagueId, FixtureId], [Result_8], ["query"]),
    "getProfile": IDL.Func([], [Result_7], []),
    "getSeasons": IDL.Func([LeagueId], [Result_6], ["composite_query"]),
    "getSystemState": IDL.Func([IDL.Text], [Result_5], ["composite_query"]),
    "getTimers": IDL.Func([], [Result_4], ["composite_query"]),
    "getUserAudit": IDL.Func([], [Result_3], []),
    "isAdmin": IDL.Func([], [Result_2], []),
    "isDataManager": IDL.Func([], [Result_2], []),
    "pauseAccount": IDL.Func([PauseAccountDTO], [Result], []),
    "payWeeklyRewards": IDL.Func([IDL.Text, GameweekNumber], [Result], []),
    "placeBet": IDL.Func([SubmitBetslipDTO], [Result_1], []),
    "setMaxBetLimit": IDL.Func([SetMaxBetLimit], [Result], []),
    "setMonthlyBetLimit": IDL.Func([SetMonthlyBetLimitDTO], [Result], []),
    "snapshotManagers": IDL.Func([IDL.Text], [Result], []),
    "updateBettingOdds": IDL.Func([LeagueId], [Result], []),
    "updateProfilePicture": IDL.Func([UpdateProfilePictureDTO], [Result], []),
    "updateSystemState": IDL.Func(
      [IDL.Text, UpdateAppStatusDTO],
      [Result],
      []
    ),
    "updateUsername": IDL.Func([UpdateUsernameDTO], [Result], []),
    "updateWithdrawalAddress": IDL.Func(
      [UpdateWithdrawalAddressDTO],
      [Result],
      []
    ),
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
    "validatePromoteClub": IDL.Func([PromoteClubDTO], [RustResult], ["query"]),
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
    "validateSetFreeAgent": IDL.Func(
      [TransferPlayerDTO],
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
const canisterId = "44kin-waaaa-aaaal-qbxra-cai";
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
createActor(canisterId);
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
  if ("Appearance" in playerEvent) return 0;
  if ("Goal" in playerEvent) return 1;
  if ("GoalAssisted" in playerEvent) return 2;
  if ("GoalConceded" in playerEvent) return 3;
  if ("KeeperSave" in playerEvent) return 4;
  if ("CleanSheet" in playerEvent) return 5;
  if ("PenaltySaved" in playerEvent) return 6;
  if ("PenaltyMissed" in playerEvent) return 7;
  if ("YellowCard" in playerEvent) return 8;
  if ("RedCard" in playerEvent) return 9;
  if ("OwnGoal" in playerEvent) return 10;
  if ("HighestScoringPlayer" in playerEvent)
    return 11;
  return 0;
}
function Governance_icon($$payload, $$props) {
  let className = fallback($$props["className"], "w-6");
  let fill = fallback($$props["fill"], "#919191");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10C21.1313 10 21.2614 9.97419 21.3827 9.92395C21.5041 9.8737 21.6143 9.80005 21.7072 9.70718C21.8 9.61432 21.8737 9.50406 21.9239 9.38272C21.9742 9.26138 22 9.13133 22 9V6C22.0001 5.79017 21.9341 5.58565 21.8114 5.41544C21.6887 5.24524 21.5155 5.11799 21.3164 5.05176L12.3164 2.05176C12.111 1.9834 11.889 1.9834 11.6836 2.05176L2.68359 5.05176C2.48449 5.11799 2.31131 5.24524 2.18861 5.41544C2.0659 5.58565 1.99991 5.79017 2 6V9C1.99997 9.13133 2.02581 9.26138 2.07605 9.38272C2.12629 9.50406 2.19995 9.61432 2.29282 9.70718C2.38568 9.80005 2.49594 9.8737 2.61728 9.92395C2.73862 9.97419 2.86867 10 3 10H4V17.1843C3.41674 17.3897 2.91137 17.7707 2.55327 18.2748C2.19517 18.779 2.0019 19.3816 2 20V22C1.99997 22.1313 2.02581 22.2614 2.07605 22.3827C2.12629 22.5041 2.19995 22.6143 2.29282 22.7072C2.38568 22.8 2.49594 22.8737 2.61728 22.9239C2.73862 22.9742 2.86867 23 3 23H21C21.1313 23 21.2614 22.9742 21.3827 22.9239C21.5041 22.8737 21.6143 22.8 21.7072 22.7072C21.8 22.6143 21.8737 22.5041 21.9239 22.3827C21.9742 22.2614 22 22.1313 22 22V20C21.9981 19.3816 21.8048 18.779 21.4467 18.2748C21.0886 17.7707 20.5833 17.3897 20 17.1843V10H21ZM20 21H4V20C4.00026 19.7349 4.10571 19.4807 4.29319 19.2932C4.48066 19.1057 4.73486 19.0003 5 19H19C19.2651 19.0003 19.5193 19.1057 19.7068 19.2932C19.8943 19.4807 19.9997 19.7349 20 20V21ZM6 17V10H8V17H6ZM10 17V10H14V17H10ZM16 17V10H18V17H16ZM4 8V6.7207L12 4.0537L20 6.7207V8H4Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function Home_icon($$payload, $$props) {
  let className = fallback($$props["className"], "w-6");
  let fill = fallback($$props["fill"], "#919191");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0001 8.00001L14.0001 2.74001C13.4501 2.24805 12.738 1.97607 12.0001 1.97607C11.2622 1.97607 10.5501 2.24805 10.0001 2.74001L4.00009 8.00001C3.68246 8.28408 3.42899 8.63256 3.25657 9.02225C3.08414 9.41194 2.99671 9.83389 3.00009 10.26V19C3.00009 19.7957 3.31617 20.5587 3.87877 21.1213C4.44138 21.6839 5.20445 22 6.00009 22H18.0001C18.7957 22 19.5588 21.6839 20.1214 21.1213C20.684 20.5587 21.0001 19.7957 21.0001 19V10.25C21.0021 9.82557 20.9139 9.40555 20.7416 9.01769C20.5692 8.62983 20.3165 8.28296 20.0001 8.00001ZM14.0001 20H10.0001V15C10.0001 14.7348 10.1055 14.4804 10.293 14.2929C10.4805 14.1054 10.7349 14 11.0001 14H13.0001C13.2653 14 13.5197 14.1054 13.7072 14.2929C13.8947 14.4804 14.0001 14.7348 14.0001 15V20ZM19.0001 19C19.0001 19.2652 18.8947 19.5196 18.7072 19.7071C18.5197 19.8946 18.2653 20 18.0001 20H16.0001V15C16.0001 14.2044 15.684 13.4413 15.1214 12.8787C14.5588 12.3161 13.7957 12 13.0001 12H11.0001C10.2044 12 9.44138 12.3161 8.87877 12.8787C8.31616 13.4413 8.00009 14.2044 8.00009 15V20H6.00009C5.73488 20 5.48052 19.8946 5.29299 19.7071C5.10545 19.5196 5.00009 19.2652 5.00009 19V10.25C5.00027 10.108 5.03069 9.9677 5.08931 9.83839C5.14794 9.70907 5.23343 9.59372 5.3401 9.50001L11.3401 4.25001C11.5226 4.08969 11.7572 4.00127 12.0001 4.00127C12.243 4.00127 12.4776 4.08969 12.6601 4.25001L18.6601 9.50001C18.7668 9.59372 18.8523 9.70907 18.9109 9.83839C18.9695 9.9677 18.9999 10.108 19.0001 10.25V19Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function Players_icon($$payload, $$props) {
  let className = fallback($$props["className"], "w-6");
  let fill = fallback($$props["fill"], "#919191");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.71 12.71C16.6904 11.9387 17.406 10.8809 17.7572 9.68394C18.1085 8.48697 18.0779 7.21027 17.6698 6.03147C17.2617 4.85267 16.4963 3.83039 15.4801 3.10686C14.4639 2.38332 13.2474 1.99451 12 1.99451C10.7525 1.99451 9.53611 2.38332 8.51993 3.10686C7.50374 3.83039 6.73834 4.85267 6.33021 6.03147C5.92208 7.21027 5.89151 8.48697 6.24276 9.68394C6.59401 10.8809 7.3096 11.9387 8.29 12.71C6.61007 13.383 5.14428 14.4994 4.04889 15.9399C2.95349 17.3805 2.26956 19.0913 2.07 20.89C2.05555 21.0213 2.06711 21.1542 2.10402 21.2811C2.14093 21.4079 2.20246 21.5263 2.28511 21.6293C2.45202 21.8375 2.69478 21.9708 2.96 22C3.22521 22.0292 3.49116 21.9518 3.69932 21.7849C3.90749 21.618 4.04082 21.3752 4.07 21.11C4.28958 19.1552 5.22168 17.3498 6.68822 16.0388C8.15475 14.7278 10.0529 14.003 12.02 14.003C13.9871 14.003 15.8852 14.7278 17.3518 16.0388C18.8183 17.3498 19.7504 19.1552 19.97 21.11C19.9972 21.3557 20.1144 21.5827 20.2991 21.747C20.4838 21.9114 20.7228 22.0015 20.97 22H21.08C21.3421 21.9698 21.5817 21.8373 21.7466 21.6313C21.9114 21.4252 21.9881 21.1624 21.96 20.9C21.7595 19.0962 21.0719 17.381 19.9708 15.9382C18.8698 14.4954 17.3969 13.3795 15.71 12.71ZM12 12C11.2089 12 10.4355 11.7654 9.77772 11.3259C9.11992 10.8864 8.60723 10.2616 8.30448 9.53074C8.00173 8.79983 7.92251 7.99557 8.07686 7.21964C8.2312 6.44372 8.61216 5.73099 9.17157 5.17158C9.73098 4.61217 10.4437 4.2312 11.2196 4.07686C11.9956 3.92252 12.7998 4.00173 13.5307 4.30448C14.2616 4.60724 14.8863 5.11993 15.3259 5.77772C15.7654 6.43552 16 7.20888 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function Leagues_icon($$payload, $$props) {
  let className = fallback($$props["className"], "w-6");
  let fill = fallback($$props["fill"], "#919191");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.3 12.22C12.8336 11.7581 13.2616 11.1869 13.5549 10.545C13.8482 9.90316 14 9.20571 14 8.5C14 7.17392 13.4732 5.90215 12.5355 4.96447C11.5979 4.02678 10.3261 3.5 9 3.5C7.67392 3.5 6.40215 4.02678 5.46447 4.96447C4.52678 5.90215 4 7.17392 4 8.5C3.99999 9.20571 4.1518 9.90316 4.44513 10.545C4.73845 11.1869 5.16642 11.7581 5.7 12.22C4.30014 12.8539 3.11247 13.8775 2.27898 15.1685C1.4455 16.4596 1.00147 17.9633 1 19.5C1 19.7652 1.10536 20.0196 1.29289 20.2071C1.48043 20.3946 1.73478 20.5 2 20.5C2.26522 20.5 2.51957 20.3946 2.70711 20.2071C2.89464 20.0196 3 19.7652 3 19.5C3 17.9087 3.63214 16.3826 4.75736 15.2574C5.88258 14.1321 7.4087 13.5 9 13.5C10.5913 13.5 12.1174 14.1321 13.2426 15.2574C14.3679 16.3826 15 17.9087 15 19.5C15 19.7652 15.1054 20.0196 15.2929 20.2071C15.4804 20.3946 15.7348 20.5 16 20.5C16.2652 20.5 16.5196 20.3946 16.7071 20.2071C16.8946 20.0196 17 19.7652 17 19.5C16.9985 17.9633 16.5545 16.4596 15.721 15.1685C14.8875 13.8775 13.6999 12.8539 12.3 12.22ZM9 11.5C8.40666 11.5 7.82664 11.3241 7.33329 10.9944C6.83994 10.6648 6.45542 10.1962 6.22836 9.64805C6.0013 9.09987 5.94189 8.49667 6.05764 7.91473C6.1734 7.33279 6.45912 6.79824 6.87868 6.37868C7.29824 5.95912 7.83279 5.6734 8.41473 5.55764C8.99667 5.44189 9.59987 5.5013 10.1481 5.72836C10.6962 5.95542 11.1648 6.33994 11.4944 6.83329C11.8241 7.32664 12 7.90666 12 8.5C12 9.29565 11.6839 10.0587 11.1213 10.6213C10.5587 11.1839 9.79565 11.5 9 11.5ZM18.74 11.82C19.38 11.0993 19.798 10.2091 19.9438 9.25634C20.0896 8.30362 19.9569 7.32907 19.5618 6.45C19.1666 5.57093 18.5258 4.8248 17.7165 4.30142C16.9071 3.77805 15.9638 3.49974 15 3.5C14.7348 3.5 14.4804 3.60536 14.2929 3.79289C14.1054 3.98043 14 4.23478 14 4.5C14 4.76522 14.1054 5.01957 14.2929 5.20711C14.4804 5.39464 14.7348 5.5 15 5.5C15.7956 5.5 16.5587 5.81607 17.1213 6.37868C17.6839 6.94129 18 7.70435 18 8.5C17.9986 9.02524 17.8593 9.5409 17.5961 9.99542C17.3328 10.4499 16.9549 10.8274 16.5 11.09C16.3517 11.1755 16.2279 11.2977 16.1404 11.4447C16.0528 11.5918 16.0045 11.7589 16 11.93C15.9958 12.0998 16.0349 12.2678 16.1137 12.4183C16.1924 12.5687 16.3081 12.6967 16.45 12.79L16.84 13.05L16.97 13.12C18.1754 13.6917 19.1923 14.596 19.901 15.7263C20.6096 16.8566 20.9805 18.1659 20.97 19.5C20.97 19.7652 21.0754 20.0196 21.2629 20.2071C21.4504 20.3946 21.7048 20.5 21.97 20.5C22.2352 20.5 22.4896 20.3946 22.6771 20.2071C22.8646 20.0196 22.97 19.7652 22.97 19.5C22.9782 17.9654 22.5938 16.4543 21.8535 15.1101C21.1131 13.7659 20.0413 12.6333 18.74 11.82Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function LogoIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg"${attr("class", className)} fill="currentColor" viewBox="0 0 36 36"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 18C36 27.9411 27.9411 36 18 36C8.05887 36 0 27.9411 0 18C0 8.05887 8.05887 0 18 0C27.9411 0 36 8.05887 36 18ZM29.7637 14.815L31.3422 8.55242C29.4196 5.84223 26.692 3.74327 23.5078 2.60406L17.7243 5.6939L12.3027 2.67331C9.27944 3.79761 6.67883 5.79086 4.80443 8.3495L6.43409 14.815L1.75327 19.8188C2.0331 22.3467 2.88938 24.7008 4.18772 26.7468L10.6178 28.0847L12.6832 33.4627C14.3501 34.0358 16.1388 34.3469 18.0002 34.3469C19.8148 34.3469 21.5605 34.0512 23.1915 33.5054L25.2732 28.0847L31.8292 26.7206C33.1506 24.6296 34.0108 22.2181 34.2669 19.629L29.7637 14.815Z" fill="#F9F9F9"></path><g clip-path="url(#clip0_2409_110)"><path d="M24.4289 11.9818V13.5233C24.4289 13.9534 24.084 14.301 23.657 14.301H15.9452C15.2279 14.301 14.6456 14.8877 14.6456 15.6103V24.0183C14.6456 24.4484 14.3007 24.7959 13.8737 24.7959H12.3436C11.9167 24.7959 11.5718 24.4484 11.5718 24.0183V15.6189C11.5718 13.1809 13.5339 11.2041 15.9537 11.2041H23.657C24.084 11.2041 24.4289 11.5516 24.4289 11.9818Z" fill="#F9F9F9"></path><path d="M24.429 17.0229V21.7026C24.429 23.411 23.0544 24.7978 21.3569 24.7978H17.419C17.1065 24.7978 16.8521 24.5414 16.8521 24.2266V22.2704C16.8521 21.9555 17.1065 21.6992 17.419 21.6992H20.7883C21.1008 21.6992 21.3552 21.4428 21.3552 21.128V20.118C21.3552 19.8032 21.1008 19.5468 20.7883 19.5468H17.419C17.1065 19.5468 16.8521 19.2905 16.8521 18.9756V17.0194C16.8521 16.7046 17.1065 16.4482 17.419 16.4482H23.8621C24.1746 16.4482 24.429 16.7046 24.429 17.0194V17.0229Z" fill="#F9F9F9"></path></g><defs><clipPath id="clip0_2409_110"><rect width="12.8571" height="13.5918" fill="white" transform="translate(11.5718 11.2041)"></rect></clipPath></defs></svg>`;
  bind_props($$props, { className, fill });
}
function Expand_icon($$payload, $$props) {
  let className = fallback($$props["className"], "w-6");
  let fill = fallback($$props["fill"], "#919191");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg"${attr("class", className)} viewBox="0 0 24 24" fill="none"><path d="M8.4599 8.29002C8.2716 8.09641 8.01409 7.98554 7.74404 7.98179C7.47399 7.97804 7.21351 8.08172 7.0199 8.27002C6.82629 8.45833 6.71542 8.71583 6.71167 8.98588C6.70792 9.25593 6.8116 9.51641 6.9999 9.71002L9.3399 12L6.9999 14.29C6.90617 14.383 6.83178 14.4936 6.78101 14.6154C6.73024 14.7373 6.7041 14.868 6.7041 15C6.7041 15.132 6.73024 15.2627 6.78101 15.3846C6.83178 15.5065 6.90617 15.6171 6.9999 15.71C7.09286 15.8038 7.20346 15.8781 7.32532 15.9289C7.44718 15.9797 7.57789 16.0058 7.7099 16.0058C7.84191 16.0058 7.97262 15.9797 8.09448 15.9289C8.21634 15.8781 8.32694 15.8038 8.4199 15.71L11.4199 12.71C11.5136 12.6171 11.588 12.5065 11.6388 12.3846C11.6896 12.2627 11.7157 12.132 11.7157 12C11.7157 11.868 11.6896 11.7373 11.6388 11.6154C11.588 11.4936 11.5136 11.383 11.4199 11.29L8.4599 8.29002ZM16.9599 11.29L13.9599 8.29002C13.7716 8.10172 13.5162 7.99593 13.2499 7.99593C12.9836 7.99593 12.7282 8.10172 12.5399 8.29002C12.3516 8.47833 12.2458 8.73372 12.2458 9.00002C12.2458 9.26632 12.3516 9.52172 12.5399 9.71002L14.8399 12L12.5399 14.29C12.4462 14.383 12.3718 14.4936 12.321 14.6154C12.2702 14.7373 12.2441 14.868 12.2441 15C12.2441 15.132 12.2702 15.2627 12.321 15.3846C12.3718 15.5065 12.4462 15.6171 12.5399 15.71C12.6329 15.8038 12.7435 15.8781 12.8653 15.9289C12.9872 15.9797 13.1179 16.0058 13.2499 16.0058C13.3819 16.0058 13.5126 15.9797 13.6345 15.9289C13.7563 15.8781 13.8669 15.8038 13.9599 15.71L16.9599 12.71C17.0563 12.6197 17.1338 12.5112 17.1881 12.3908C17.2423 12.2704 17.2721 12.1404 17.2759 12.0084C17.2796 11.8763 17.2571 11.7449 17.2097 11.6216C17.1624 11.4983 17.0911 11.3856 16.9999 11.29H16.9599Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function MenuIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "");
  $$payload.out += `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"${attr("class", className)}${attr("fill", fill)}><path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17Z" fill="#919191"></path></svg>`;
  bind_props($$props, { className, fill });
}
function XIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let color = fallback($$props["color"], "currentColor");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)}${attr("fill", color)} viewBox="0 0 19 15"><path d="M12.8767 0.0963813V0.0931396H13.7207L14.029 0.154732C14.2346 0.194718 14.4213 0.24712 14.589 0.311953C14.7567 0.376787 14.9191 0.452431 15.0759 0.538871C15.2328 0.62531 15.3751 0.713387 15.5028 0.803068C15.6294 0.891679 15.743 0.985688 15.8437 1.08509C15.9432 1.18559 16.0985 1.21152 16.3095 1.16289C16.5205 1.11427 16.7477 1.04673 16.9912 0.960289C17.2346 0.87385 17.4754 0.7766 17.7135 0.668538C17.9515 0.560477 18.0965 0.491866 18.1485 0.462691C18.1993 0.432446 18.2264 0.416238 18.2296 0.414066L18.2328 0.409204L18.2491 0.401099L18.2653 0.392995L18.2815 0.384891L18.2978 0.376787L18.301 0.371924L18.3059 0.368683L18.3108 0.365441L18.314 0.360578L18.3302 0.355716L18.3465 0.352474L18.3432 0.376787L18.3383 0.401099L18.3302 0.425412L18.3221 0.449725L18.314 0.465933L18.3059 0.482141L18.2978 0.506454C18.2924 0.522662 18.287 0.544268 18.2815 0.571288C18.2761 0.598307 18.2247 0.706352 18.1273 0.895456C18.03 1.08456 17.9082 1.27635 17.7621 1.47085C17.6161 1.66536 17.4851 1.8123 17.3694 1.91172C17.2525 2.01222 17.1751 2.08245 17.1373 2.12243C17.0994 2.16349 17.0534 2.2013 16.9993 2.23589L16.9181 2.28938L16.9019 2.29748L16.8857 2.30559L16.8824 2.31045L16.8776 2.31369L16.8727 2.31693L16.8694 2.3218L16.8532 2.3299L16.837 2.338L16.8338 2.34287L16.8289 2.34611L16.824 2.34935L16.8208 2.35421L16.8175 2.35908L16.8126 2.36232L16.8078 2.36556L16.8045 2.37042H16.8857L17.3401 2.27317C17.6431 2.20834 17.9326 2.13 18.2085 2.03815L18.6467 1.89227L18.6954 1.87606L18.7198 1.86796L18.736 1.85986L18.7522 1.85175L18.7685 1.84365L18.7847 1.83554L18.8171 1.83068L18.8496 1.82744V1.85986L18.8415 1.8631L18.8334 1.86796L18.8301 1.87282L18.8253 1.87606L18.8204 1.87931L18.8171 1.88417L18.8139 1.88903L18.809 1.89227L18.8042 1.89551L18.8009 1.90038L18.7977 1.90524L18.7928 1.90848L18.7847 1.92469L18.7766 1.9409L18.7717 1.94414C18.7695 1.94738 18.7008 2.03922 18.5656 2.21968C18.4303 2.40122 18.3573 2.49305 18.3465 2.49523C18.3356 2.49847 18.3205 2.51468 18.301 2.54385C18.2826 2.5741 18.1679 2.69459 17.9569 2.9053C17.7459 3.11601 17.5393 3.30347 17.3369 3.46773C17.1335 3.63306 17.0307 3.8362 17.0285 4.07717C17.0253 4.31705 17.0128 4.58828 16.9912 4.89083C16.9695 5.19339 16.929 5.52025 16.8694 5.87144C16.8099 6.22262 16.718 6.61973 16.5935 7.06276C16.4691 7.50578 16.3176 7.93801 16.1391 8.35943C15.9605 8.78085 15.7739 9.15904 15.5791 9.49402C15.3843 9.829 15.2058 10.1126 15.0435 10.345C14.8812 10.5773 14.7162 10.7961 14.5484 11.0014C14.3807 11.2067 14.1687 11.438 13.9122 11.6951C13.6547 11.9512 13.514 12.0917 13.4902 12.1165C13.4653 12.1403 13.3593 12.2289 13.1721 12.3824C12.986 12.5369 12.7858 12.6914 12.5715 12.8459C12.3584 12.9994 12.1625 13.1274 11.984 13.2301C11.8054 13.3327 11.5901 13.4499 11.338 13.5818C11.087 13.7147 10.8153 13.8379 10.5232 13.9513C10.231 14.0648 9.92265 14.1701 9.59803 14.2674C9.27341 14.3646 8.95962 14.4403 8.65664 14.4943C8.35368 14.5483 8.01012 14.5943 7.62598 14.6321L7.04979 14.6888V14.6969H5.99479V14.6888L5.85682 14.6807C5.76486 14.6753 5.68911 14.6699 5.62959 14.6645C5.57009 14.6591 5.34555 14.6294 4.95601 14.5754C4.56647 14.5213 4.2608 14.4673 4.03897 14.4133C3.81716 14.3592 3.48712 14.2566 3.04889 14.1053C2.61066 13.954 2.23572 13.8011 1.92409 13.6466C1.61355 13.4932 1.41878 13.3959 1.33978 13.3549C1.26187 13.3149 1.17423 13.2652 1.07684 13.2057L0.930764 13.1166L0.927534 13.1117L0.922648 13.1085L0.917779 13.1052L0.914533 13.1004L0.898302 13.0923L0.882071 13.0842L0.878841 13.0793L0.873956 13.0761L0.869086 13.0728L0.86584 13.068L0.86261 13.0631L0.857725 13.0599H0.849609V13.0274L0.86584 13.0307L0.882071 13.0356L0.95511 13.0437C1.0038 13.0491 1.13636 13.0572 1.35277 13.068C1.56919 13.0788 1.79911 13.0788 2.04258 13.068C2.28604 13.0572 2.53492 13.0328 2.78919 12.995C3.04348 12.9572 3.34375 12.8924 3.69001 12.8005C4.03627 12.7087 4.3544 12.5995 4.6444 12.4731C4.9333 12.3456 5.13888 12.2505 5.26117 12.1879C5.38235 12.1263 5.56738 12.0117 5.81625 11.8442L6.18956 11.593L6.1928 11.5881L6.19767 11.5849L6.20256 11.5817L6.20579 11.5768L6.20903 11.5719L6.2139 11.5687L6.21879 11.5655L6.22202 11.5606L6.23825 11.5557L6.25448 11.5525L6.25772 11.5363L6.26259 11.5201L6.26748 11.5168L6.27071 11.512L6.14086 11.5039C6.0543 11.4985 5.97044 11.493 5.88928 11.4877C5.80813 11.4823 5.68099 11.4579 5.50786 11.4147C5.33474 11.3715 5.14809 11.3067 4.9479 11.2202C4.74772 11.1338 4.55295 11.0311 4.36359 10.9123C4.17424 10.7934 4.03735 10.6945 3.95295 10.6156C3.86963 10.5378 3.76142 10.4276 3.62833 10.285C3.49632 10.1413 3.38162 9.99377 3.28424 9.8425C3.18685 9.69122 3.0938 9.51669 3.00508 9.31897L2.87035 9.02397L2.86223 8.99966L2.85412 8.97535L2.84925 8.95914L2.846 8.94293L2.87035 8.94617L2.8947 8.95103L3.07323 8.97535C3.19227 8.99156 3.37893 8.99695 3.6332 8.99156C3.88749 8.98616 4.06332 8.97535 4.1607 8.95914C4.25809 8.94293 4.3176 8.93212 4.33924 8.92672L4.3717 8.91862L4.41228 8.91051L4.45286 8.90241L4.4561 8.89755L4.46097 8.89431L4.46586 8.89106L4.46909 8.8862L4.43662 8.8781L4.40416 8.86999L4.3717 8.86189L4.33924 8.85378L4.30678 8.84568C4.28514 8.84028 4.24728 8.82947 4.19316 8.81326C4.13906 8.79706 3.99299 8.73762 3.75493 8.63497C3.51689 8.53232 3.32752 8.43237 3.18685 8.33512C3.04583 8.23758 2.91137 8.13092 2.78433 8.01581C2.65772 7.89911 2.51869 7.74891 2.36719 7.56522C2.21571 7.38153 2.08046 7.16811 1.96142 6.92498C1.8424 6.68186 1.75313 6.44954 1.69361 6.22802C1.63433 6.0078 1.59522 5.78266 1.57677 5.55537L1.54754 5.215L1.56377 5.21824L1.58 5.2231L1.59623 5.2312L1.61246 5.23931L1.62869 5.24741L1.64492 5.25552L1.8965 5.36898C2.06423 5.44462 2.27252 5.50945 2.52139 5.56348C2.77027 5.6175 2.91904 5.64723 2.96773 5.65262L3.04077 5.66073H3.18685L3.18362 5.65587L3.17873 5.65262L3.17387 5.64938L3.17062 5.64452L3.16739 5.63966L3.1625 5.63642L3.15763 5.63317L3.15439 5.62831L3.13816 5.62021L3.12193 5.6121L3.1187 5.60724L3.11381 5.604L3.10894 5.60076L3.1057 5.59589L3.08947 5.58779L3.07323 5.57969L3.07 5.57482C3.06676 5.57265 3.02022 5.53808 2.9304 5.47109C2.84167 5.40301 2.74862 5.31495 2.65123 5.20689C2.55385 5.09883 2.45646 4.98537 2.35908 4.86652C2.26151 4.74739 2.17461 4.61993 2.09938 4.48562C2.02365 4.35055 1.94357 4.17873 1.85917 3.97019C1.77585 3.76272 1.71255 3.55363 1.66927 3.34293C1.626 3.13222 1.60165 2.92421 1.59623 2.7189C1.59082 2.51359 1.59623 2.338 1.61246 2.19213C1.62869 2.04625 1.66115 1.88146 1.70984 1.69777C1.75854 1.51408 1.82888 1.31958 1.92084 1.11427L2.05881 0.80631L2.06692 0.781997L2.07504 0.757684L2.07992 0.754443L2.08315 0.74958L2.0864 0.744718L2.09127 0.741476L2.09615 0.744718L2.09938 0.74958L2.10263 0.754443L2.1075 0.757684L2.11238 0.760926L2.11561 0.765789L2.11886 0.770651L2.12373 0.773893L2.13185 0.790101L2.13996 0.80631L2.14485 0.809551L2.14808 0.814414L2.36719 1.05754C2.51327 1.21962 2.6864 1.40062 2.88658 1.60052C3.08677 1.80042 3.19768 1.90415 3.21931 1.91172C3.24096 1.92036 3.268 1.94521 3.30047 1.98628C3.33293 2.02627 3.44114 2.1219 3.62508 2.27317C3.80904 2.42444 4.0498 2.60005 4.34736 2.79994C4.64493 2.99984 4.97495 3.19705 5.33744 3.39155C5.69994 3.58605 6.08948 3.76164 6.50606 3.91832C6.92265 4.07501 7.21481 4.17766 7.38252 4.22628C7.55025 4.27491 7.83699 4.33704 8.24276 4.41268C8.64853 4.48833 8.95422 4.53695 9.1598 4.55856C9.36539 4.58016 9.50607 4.59259 9.5818 4.59584L9.69542 4.59908L9.69219 4.57476L9.6873 4.55045L9.65484 4.34785C9.6332 4.21278 9.62238 4.02368 9.62238 3.78055C9.62238 3.53743 9.64132 3.31322 9.67919 3.1079C9.71707 2.90259 9.77388 2.69459 9.84961 2.48388C9.92536 2.27317 9.99949 2.10405 10.072 1.97656C10.1456 1.85013 10.2419 1.70588 10.3609 1.54379C10.4799 1.38171 10.6341 1.21423 10.8235 1.04133C11.0128 0.868436 11.2292 0.714457 11.4727 0.579392C11.7162 0.444327 11.9407 0.341663 12.1463 0.271432C12.3519 0.201201 12.525 0.155266 12.6657 0.133661C12.8063 0.112055 12.8767 0.099623 12.8767 0.0963813Z"></path></svg>`;
  bind_props($$props, { className, color });
}
function GithubIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let color = fallback($$props["color"], "currentColor");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)}${attr("fill", color)} viewBox="0 0 18 19"><path d="M9 0.5C4.0305 0.5 0 4.52975 0 9.5C0 13.4765 2.5785 16.85 6.15525 18.0402C6.6045 18.1235 6.75 17.8445 6.75 17.6075V15.932C4.2465 16.4765 3.72525 14.87 3.72525 14.87C3.31575 13.8298 2.7255 13.553 2.7255 13.553C1.90875 12.9942 2.78775 13.0062 2.78775 13.0062C3.6915 13.0692 4.167 13.934 4.167 13.934C4.9695 15.3095 6.27225 14.912 6.786 14.6818C6.86625 14.1005 7.0995 13.703 7.3575 13.4788C5.35875 13.25 3.25725 12.4782 3.25725 9.0305C3.25725 8.04725 3.609 7.24475 4.18425 6.61475C4.09125 6.3875 3.783 5.47175 4.272 4.23275C4.272 4.23275 5.028 3.99125 6.74775 5.15525C7.4655 4.95575 8.235 4.856 9 4.85225C9.765 4.856 10.5352 4.95575 11.2545 5.15525C12.9727 3.99125 13.7272 4.23275 13.7272 4.23275C14.217 5.4725 13.9087 6.38825 13.8158 6.61475C14.3932 7.24475 14.742 8.048 14.742 9.0305C14.742 12.4872 12.6368 13.2485 10.6327 13.4713C10.9552 13.7502 11.25 14.2978 11.25 15.1378V17.6075C11.25 17.8468 11.394 18.128 11.8507 18.0395C15.4245 16.8477 18 13.475 18 9.5C18 4.52975 13.9703 0.5 9 0.5Z"></path></svg>`;
  bind_props($$props, { className, color });
}
function Connect($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 21 20"${attr("fill", fill)} xmlns="http://www.w3.org/2000/svg"><path d="M19.0002 13.1C18.7628 12.9821 18.4883 12.9633 18.2371 13.0477C17.9858 13.1321 17.7783 13.3127 17.6602 13.55C17.0273 14.8282 16.0641 15.914 14.8705 16.6948C13.6768 17.4756 12.2962 17.9231 10.8715 17.991C9.44674 18.0588 8.02979 17.7445 6.76738 17.0806C5.50498 16.4167 4.44302 15.4274 3.6915 14.2151C2.93999 13.0028 2.52625 11.6116 2.49314 10.1857C2.46003 8.75975 2.80876 7.35088 3.50321 6.10502C4.19765 4.85915 5.21255 3.82161 6.44279 3.09985C7.67303 2.37809 9.07386 1.99837 10.5002 2.00001C11.9913 1.99355 13.454 2.40764 14.7205 3.19476C15.987 3.98188 17.0058 5.11012 17.6602 6.45001C17.7795 6.6887 17.9888 6.87021 18.242 6.9546C18.4952 7.03899 18.7715 7.01936 19.0102 6.90001C19.2489 6.78066 19.4304 6.57138 19.5148 6.31821C19.5992 6.06503 19.5795 5.7887 19.4602 5.55001C18.4568 3.53075 16.8004 1.90987 14.7599 0.950438C12.7194 -0.00899237 10.4145 -0.250651 8.21939 0.264685C6.02426 0.780021 4.06771 2.0221 2.66732 3.78933C1.26692 5.55656 0.504883 7.74519 0.504883 10C0.504883 12.2548 1.26692 14.4435 2.66732 16.2107C4.06771 17.9779 6.02426 19.22 8.21939 19.7353C10.4145 20.2507 12.7194 20.009 14.7599 19.0496C16.8004 18.0901 18.4568 16.4693 19.4602 14.45C19.5198 14.3314 19.5552 14.2021 19.5643 14.0696C19.5733 13.9372 19.556 13.8043 19.5132 13.6786C19.4703 13.5529 19.4029 13.437 19.3149 13.3377C19.2268 13.2384 19.1198 13.1576 19.0002 13.1ZM19.5002 9.00001H9.91019L12.2102 6.71001C12.3034 6.61677 12.3774 6.50608 12.4278 6.38426C12.4783 6.26244 12.5043 6.13187 12.5043 6.00001C12.5043 5.86815 12.4783 5.73758 12.4278 5.61576C12.3774 5.49394 12.3034 5.38325 12.2102 5.29001C12.117 5.19677 12.0063 5.12281 11.8844 5.07235C11.7626 5.02189 11.632 4.99592 11.5002 4.99592C11.3683 4.99592 11.2378 5.02189 11.1159 5.07235C10.9941 5.12281 10.8834 5.19677 10.7902 5.29001L6.79019 9.29001C6.69915 9.38511 6.62778 9.49726 6.58019 9.62001C6.48017 9.86347 6.48017 10.1365 6.58019 10.38C6.62778 10.5028 6.69915 10.6149 6.79019 10.71L10.7902 14.71C10.8832 14.8037 10.9938 14.8781 11.1156 14.9289C11.2375 14.9797 11.3682 15.0058 11.5002 15.0058C11.6322 15.0058 11.7629 14.9797 11.8848 14.9289C12.0066 14.8781 12.1172 14.8037 12.2102 14.71C12.3039 14.617 12.3783 14.5064 12.4291 14.3846C12.4798 14.2627 12.506 14.132 12.506 14C12.506 13.868 12.4798 13.7373 12.4291 13.6154C12.3783 13.4936 12.3039 13.383 12.2102 13.29L9.91019 11H19.5002C19.7654 11 20.0198 10.8947 20.2073 10.7071C20.3948 10.5196 20.5002 10.2652 20.5002 10C20.5002 9.73479 20.3948 9.48044 20.2073 9.2929C20.0198 9.10537 19.7654 9.00001 19.5002 9.00001Z" fill="white"></path></svg>`;
  bind_props($$props, { className, fill });
}
function Dashboard($$payload, $$props) {
  push();
  var $$store_subs;
  const menuItems = [
    { icon: Home_icon, title: "Home", route: "/" },
    {
      icon: Governance_icon,
      title: "Governance",
      route: "/governance"
    },
    {
      icon: Players_icon,
      title: "Players",
      route: "/players"
    },
    {
      icon: Leagues_icon,
      title: "Leagues",
      route: "/leagues"
    }
  ];
  const each_array = ensure_array_like(menuItems);
  $$payload.out += `<div class="flex h-screen md:p-2"><div${attr("class", `hidden md:flex bg-BrandGray text-white rounded-lg transition-all ${"w-16"} flex-col fixed top-2 bottom-2 left-2`)}><div class="relative flex flex-col items-center"><a href="/"${attr("class", `flex items-center ${"justify-center py-4"} transition-all`)}>`;
  LogoIcon($$payload, { className: "w-4 md:w-6" });
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></a> <button${attr("class", `w-8 h-8 bg-zinc-700 flex items-center justify-center rounded-full hover:bg-zinc-600 transition-all ${""}`)}>`;
  {
    $$payload.out += "<!--[!-->";
    Expand_icon($$payload, { className: "w-6" });
  }
  $$payload.out += `<!--]--></button></div> <ul class="flex-1 mt-2 space-y-1"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li><a${attr("href", item.route)}${attr("class", `flex items-center px-4 py-2 space-x-2 hover:bg-zinc-700 rounded ${"justify-center"}`)}>`;
    if (store_get($$store_subs ??= {}, "$page", page).url.pathname == item.route) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      item.icon?.($$payload, { className: "w-5 h-5", fill: "#FFFFFF" });
      $$payload.out += `<!----> `;
      {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<!---->`;
      item.icon?.($$payload, { className: "w-5 h-5" });
      $$payload.out += `<!----> `;
      {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></a></li>`;
  }
  $$payload.out += `<!--]--></ul> <div class="absolute left-0 right-0 bottom-20"><div${attr("class", `flex ${"flex-col items-center space-y-4"}`)}><a href="https://x.com/OpenFPL_DAO" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">`;
  XIcon($$payload, { className: "w-5 h-5" });
  $$payload.out += `<!----></a> <a href="https://github.com/jamesbeadle/football_god" target="_blank" rel="noopener noreferrer" class="text-white transition-colors hover:text-zinc-400">`;
  GithubIcon($$payload, { className: "w-5 h-5" });
  $$payload.out += `<!----></a></div></div> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${attr("class", `absolute bottom-4 left-4 right-4 flex items-center justify-center ${"p-2"} bg-BrandPurple hover:bg-BrandPurpleDark text-white rounded transition-all`)}>`;
    Connect($$payload, { className: "w-6" });
    $$payload.out += `<!----> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button>`;
  }
  $$payload.out += `<!--]--></div> <div class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-BrandGray md:hidden"><div class="flex items-center">`;
  LogoIcon($$payload, { className: "w-8" });
  $$payload.out += `<!----></div> <div class="flex items-center space-x-4">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button class="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-full bg-BrandPurple">`;
    Connect($$payload, { className: "w-4" });
    $$payload.out += `<!----> <span class="text-lg font-medium">Log In</span></button>`;
  }
  $$payload.out += `<!--]--> <button class="p-2 text-white transition-colors rounded-full bg-BrandGray">`;
  MenuIcon($$payload, { className: "w-6" });
  $$payload.out += `<!----></button></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", `w-full mt-16 bg-BrandDark md:px-6 md:py-4 md:mx-2 md:rounded-lg md:mt-0 ${"md:ml-20"} transition-all`)}><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Full_screen_spinner($$payload) {
  $$payload.out += `<div class="local-spinner svelte-pvdm52"></div>`;
}
function Layout($$payload, $$props) {
  push();
  var $$store_subs;
  async function syncAuthStore() {
    return;
  }
  const init2 = async () => {
    await Promise.all([syncAuthStore()]);
  };
  store_get($$store_subs ??= {}, "$authStore", authStore);
  $$payload.out += `<!---->`;
  await_block(
    init2(),
    () => {
      $$payload.out += `<div>`;
      Full_screen_spinner($$payload);
      $$payload.out += `<!----></div>`;
    },
    (_) => {
      Dashboard($$payload, {
        children: ($$payload2) => {
          $$payload2.out += `<!---->`;
          slot($$payload2, $$props, "default", {});
          $$payload2.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    }
  );
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Local_spinner($$payload) {
  $$payload.out += `<div class="widget svelte-1eu5871"><div class="widget-spinner svelte-1eu5871"></div></div>`;
}
function OpenFPLIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg"${attr("class", className)}${attr("fill", fill)} viewBox="0 0 16 17"><circle cx="8" cy="8.5" r="8" fill="black"></circle><path d="M8.02385 3.48511C6.6199 3.71513 5.36083 4.30378 4.30199 5.15248L4.29834 5.16018V10.5697L8.0202 13.7538L11.7005 10.5697L11.7013 5.15787C10.6579 4.34305 9.39726 3.71153 8.02385 3.48511ZM8.7595 11.4071C8.7595 11.4338 8.74279 11.4605 8.71564 11.4672L8.0202 11.6975C8.00662 11.7008 7.99304 11.7008 7.97947 11.6975L7.28402 11.4672C7.25687 11.4572 7.2399 11.4338 7.2399 11.4071V11.1735C7.2399 11.1501 7.25348 11.1268 7.27384 11.1168L7.96929 10.7563C7.98965 10.7463 8.01001 10.7463 8.03038 10.7563L8.72583 11.1168C8.74619 11.1268 8.7595 11.1501 8.7595 11.1735V11.4071ZM10.0674 8.83405C10.0674 8.85741 10.0538 8.88077 10.0301 8.89079L9.53483 9.14108C9.5009 9.15777 9.49072 9.19782 9.50768 9.22785L9.98933 10.1056C10.0029 10.1323 9.99951 10.1623 9.97915 10.1823L9.15813 10.9766C9.13438 11 9.10044 11 9.07329 10.9833L8.13715 10.3192C8.1066 10.2958 8.09982 10.2524 8.12697 10.2224L8.86993 9.40807C8.91405 9.35801 8.86314 9.28459 8.80205 9.30461L8.01837 9.55491C8.00479 9.55825 7.99122 9.55825 7.97764 9.55491L7.19761 9.30461C7.13313 9.28459 7.08562 9.36135 7.12974 9.40807L7.87244 10.2224C7.89959 10.2524 7.8928 10.2958 7.86226 10.3192L6.92612 10.9833C6.89897 11 6.86503 11 6.84127 10.9766L6.02052 10.179C6.00015 10.159 5.99676 10.1289 6.01034 10.1022L6.49198 9.22452C6.50895 9.19114 6.49537 9.15443 6.46483 9.13775L5.96961 8.88745C5.94925 8.87744 5.93228 8.85407 5.93228 8.83071V7.08196C5.93228 7.0319 5.98997 6.99853 6.03409 7.02856L6.44108 7.29889C6.45804 7.31224 6.46823 7.32892 6.46823 7.35228L6.47162 7.80282C6.47162 7.82284 6.4818 7.84287 6.49877 7.85622L7.0958 8.26671C7.13992 8.29674 7.20101 8.26337 7.19761 8.20997L7.16028 7.41569C7.16028 7.39567 7.1501 7.37565 7.13313 7.36563L5.95943 6.57469C5.94246 6.56134 5.93228 6.54132 5.93228 6.52129V6.13083C5.93228 6.11748 5.93567 6.10079 5.94586 6.09078L6.36981 5.56348C6.38678 5.54012 6.41732 5.53345 6.44447 5.54346L7.97425 6.10079C7.98782 6.10747 8.00479 6.10747 8.01837 6.10079L9.54841 5.54346C9.57556 5.53345 9.60584 5.54346 9.62281 5.56348L10.047 6.09078C10.0572 6.10079 10.0606 6.11748 10.0606 6.13083V6.52129C10.0606 6.54132 10.0504 6.56134 10.0334 6.57469L8.85975 7.36563C8.84957 7.37898 8.83938 7.39901 8.83938 7.41903L8.80205 8.21331C8.79866 8.26671 8.85975 8.30008 8.90386 8.27005L9.5009 7.85956C9.51786 7.84621 9.52805 7.82952 9.52805 7.80616L9.53144 7.35562C9.53144 7.3356 9.54162 7.31557 9.55859 7.30222L9.96557 7.0319C10.0097 7.00187 10.0674 7.0319 10.0674 7.0853V8.83405Z" fill="white"></path></svg>`;
  bind_props($$props, { className, fill });
}
function EmptyBetSlipIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "");
  $$payload.out += `<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"${attr("class", className)}${attr("fill", fill)}><ellipse opacity="0.1" cx="90" cy="174.6" rx="90" ry="5.4" fill="#7F56F1"></ellipse><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M69.6727 39.6C70.8479 35.4447 74.6684 32.4 79.2 32.4H115.713C112.669 34.2341 110.044 36.6934 108.017 39.6H69.6727ZM105.925 43.2H53.1C47.1353 43.2 42.3 48.0354 42.3 54V120.6H98.1H99C99.9941 120.6 100.8 121.406 100.8 122.4V131.85C100.8 139.554 107.046 145.8 114.75 145.8C122.454 145.8 128.7 139.554 128.7 131.85V79.2C114.782 79.2 103.5 67.9176 103.5 54C103.5 50.1351 104.37 46.4734 105.925 43.2ZM132.3 78.9448V129.451C137.408 128.594 141.3 124.151 141.3 118.8V75.8287C138.58 77.4019 135.54 78.4815 132.3 78.9448ZM144.9 73.3037V118.8C144.9 126.158 139.381 132.228 132.257 133.094C131.618 142.206 124.024 149.4 114.75 149.4C114.593 149.4 114.436 149.398 114.28 149.394L114.3 149.4H49.5C39.5589 149.4 31.5 141.341 31.5 131.4V127.8C31.5 123.824 34.7235 120.6 38.7 120.6V54C38.7 46.0471 45.1471 39.6 53.1 39.6H65.9701C67.2209 33.438 72.6688 28.8 79.2 28.8H126.9V28.8633C127.495 28.8214 128.095 28.8 128.7 28.8C142.618 28.8 153.9 40.0825 153.9 54C153.9 61.749 150.402 68.681 144.9 73.3037ZM51.3 90.9C51.3 88.4148 53.3147 86.4 55.8 86.4H82.8C85.2853 86.4 87.3 88.4148 87.3 90.9C87.3 93.3853 85.2853 95.4 82.8 95.4H55.8C53.3147 95.4 51.3 93.3853 51.3 90.9ZM55.8 90C55.3029 90 54.9 90.403 54.9 90.9C54.9 91.3971 55.3029 91.8 55.8 91.8H82.8C83.2971 91.8 83.7 91.3971 83.7 90.9C83.7 90.403 83.2971 90 82.8 90H55.8ZM66.5174 79.4831C66.6545 79.6202 66.8707 79.6887 67.166 79.6887C67.4191 79.6887 67.6037 79.6202 67.7197 79.4831C67.8463 79.3459 67.9096 79.1297 67.9096 78.8344V77.553C68.8904 77.4475 69.7816 77.168 70.5832 76.7145C71.3848 76.2504 72.0281 75.5754 72.5133 74.6895C73.009 73.793 73.2568 72.6856 73.2568 71.3672C73.2568 70.2282 72.9984 69.2895 72.4816 68.5512C71.9648 67.8024 71.3637 67.2276 70.6781 66.8268C69.9926 66.426 69.0697 65.9725 67.9096 65.4663V61.1948C68.4369 61.2159 68.8799 61.2739 69.2385 61.3688C69.6076 61.4637 69.982 61.585 70.3617 61.7327C70.6254 61.8381 70.7994 61.8909 70.8838 61.8909C71.0947 61.8909 71.3162 61.7432 71.5482 61.4479C71.7908 61.1526 71.9965 60.8098 72.1652 60.4196C72.334 60.0188 72.4184 59.6918 72.4184 59.4387C72.4184 59.154 72.2232 58.8692 71.833 58.5844C71.4533 58.2997 70.9154 58.0571 70.2193 57.8567C69.5338 57.6563 68.7639 57.5403 67.9096 57.5086V56.6385C67.9096 56.3327 67.8463 56.1165 67.7197 55.9899C67.5932 55.8633 67.3769 55.8 67.0711 55.8C66.818 55.8 66.6281 55.8686 66.5016 56.0057C66.375 56.1323 66.3117 56.3432 66.3117 56.6385V57.5245C65.2887 57.6405 64.35 57.92 63.4957 58.3629C62.652 58.8059 61.9717 59.4387 61.4549 60.2614C60.9486 61.0735 60.6955 62.0702 60.6955 63.2514C60.6955 64.4959 60.9645 65.5084 61.5023 66.2889C62.0508 67.0588 62.6889 67.6442 63.4166 68.045C64.1549 68.4352 65.1199 68.8518 66.3117 69.2948V73.9301C65.6578 73.9301 65.0566 73.8405 64.5082 73.6612C63.9703 73.4819 63.4166 73.2499 62.8471 72.9651C62.4463 72.7542 62.1826 72.6487 62.0561 72.6487C61.8662 72.6487 61.6289 72.7963 61.3441 73.0916C61.0594 73.3764 60.8115 73.7192 60.6006 74.12C60.4002 74.5207 60.3 74.8582 60.3 75.1325C60.3 75.4594 60.5373 75.8075 61.0119 76.1766C61.4971 76.5457 62.1932 76.8674 63.1002 77.1416C64.0178 77.4053 65.0883 77.5583 66.3117 77.6004V78.8344C66.3117 79.1297 66.3803 79.3459 66.5174 79.4831ZM65.1727 61.9858C65.3836 61.701 65.7633 61.4901 66.3117 61.353V64.7385C65.8371 64.4643 65.4732 64.1795 65.2201 63.8842C64.9775 63.5889 64.8562 63.2409 64.8562 62.8401C64.8562 62.5448 64.9617 62.26 65.1727 61.9858ZM68.7955 72.9651C68.574 73.2499 68.2787 73.4661 67.9096 73.6137V70.0541C68.7217 70.5182 69.1277 71.1299 69.1277 71.8893C69.1277 72.3217 69.017 72.6803 68.7955 72.9651ZM51.3 105.3C51.3 102.815 53.3147 100.8 55.8 100.8H109.8C112.285 100.8 114.3 102.815 114.3 105.3C114.3 107.785 112.285 109.8 109.8 109.8H55.8C53.3147 109.8 51.3 107.785 51.3 105.3ZM55.8 104.4C55.3029 104.4 54.9 104.803 54.9 105.3C54.9 105.797 55.3029 106.2 55.8 106.2H109.8C110.297 106.2 110.7 105.797 110.7 105.3C110.7 104.803 110.297 104.4 109.8 104.4H55.8ZM107.1 54C107.1 42.0707 116.771 32.4 128.7 32.4C140.629 32.4 150.3 42.0707 150.3 54C150.3 65.9294 140.629 75.6 128.7 75.6C116.771 75.6 107.1 65.9294 107.1 54ZM124.2 42.3C124.2 39.8148 126.215 37.8 128.7 37.8C131.185 37.8 133.2 39.8148 133.2 42.3V53.1C133.2 55.5853 131.185 57.6 128.7 57.6C126.215 57.6 124.2 55.5853 124.2 53.1V42.3ZM128.7 41.4C128.203 41.4 127.8 41.803 127.8 42.3V53.1C127.8 53.5971 128.203 54 128.7 54C129.197 54 129.6 53.5971 129.6 53.1V42.3C129.6 41.803 129.197 41.4 128.7 41.4ZM128.7 70.2C126.215 70.2 124.2 68.1853 124.2 65.7C124.2 63.2148 126.215 61.2 128.7 61.2C131.185 61.2 133.2 63.2148 133.2 65.7C133.2 68.1853 131.185 70.2 128.7 70.2ZM127.8 65.7C127.8 66.1971 128.203 66.6 128.7 66.6C129.197 66.6 129.6 66.1971 129.6 65.7C129.6 65.203 129.197 64.8 128.7 64.8C128.203 64.8 127.8 65.203 127.8 65.7Z"></path></svg>`;
  bind_props($$props, { className, fill });
}
function loadInitial() {
  return [];
}
function detailEquals(d1, d2) {
  return JSON.stringify(d1, replacer) === JSON.stringify(d2, replacer);
}
function categoryEquals(c1, c2) {
  return JSON.stringify(c1, replacer) === JSON.stringify(c2, replacer);
}
const initial = loadInitial();
const selectedBetsStore = writable(initial);
selectedBetsStore.subscribe((value) => {
});
function addBet(bet) {
  selectedBetsStore.update((current) => {
    const exists = current.some(
      (b) => b.leagueId === bet.leagueId && b.fixtureId === bet.fixtureId && categoryEquals(b.selectionType, bet.selectionType) && detailEquals(b.selectionDetail, bet.selectionDetail)
    );
    return exists ? current : [...current, bet];
  });
}
function removeBet(leagueId, fixtureId, category, detail) {
  selectedBetsStore.update(
    (current) => current.filter(
      (b) => !(b.leagueId === leagueId && b.fixtureId === fixtureId && categoryEquals(b.selectionType, category) && detailEquals(b.selectionDetail, detail))
    )
  );
}
function isSelected(leagueId, fixtureId, category, detail) {
  let found = false;
  selectedBetsStore.subscribe((current) => {
    found = current.some(
      (b) => b.leagueId === leagueId && b.fixtureId === fixtureId && categoryEquals(b.selectionType, category) && detailEquals(b.selectionDetail, detail)
    );
  })();
  return found;
}
const betSlipStore = {
  subscribe: selectedBetsStore.subscribe,
  addBet,
  removeBet,
  isSelected
};
function Betslip($$payload, $$props) {
  push();
  var $$store_subs;
  let bets, totalStakes;
  let isExpanded = fallback($$props["isExpanded"], false);
  let stakes = {};
  let totalReturns = 0;
  bets = store_get($$store_subs ??= {}, "$betSlipStore", betSlipStore);
  totalStakes = Object.values(stakes).reduce((total, stake) => total + (stake || 0), 0);
  if (isExpanded) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div${attr("class", `flex flex-col h-[95vh] mx-2 md:h-screen md:mx-0 overflow-hidden bg-white border rounded-2xl md:rounded-xl ${stringify(isExpanded ? "fixed inset-x-0 top-[2.5vh] z-50 w-auto md:relative md:inset-auto md:w-80 md:rounded-lg" : "w-80")}`)}><div class="flex items-center justify-between p-4 border-b border-gray-100 md:px-4 md:py-2 md:bg-gray-100"><div class="flex items-center"><span class="flex items-center justify-center w-8 text-lg font-medium text-white rounded-full h-7 bg-BrandPurple">${escape_html(bets.length)}</span> <span class="px-3 text-xl font-bold text-black">Bet Slip</span></div> `;
  if (isExpanded) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="text-2xl text-gray-400 hover:text-gray-600 md:hidden">×</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="flex flex-col flex-1 overflow-auto">`;
  if (bets.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center"><div class="w-24 h-24 mb-4">`;
    EmptyBetSlipIcon($$payload, { className: "w-24 h-24 fill-BrandPurple" });
    $$payload.out += `<!----></div> <p class="text-lg text-gray-400 md:text-sm">There are no selections in<br>your bet slip.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(bets);
    $$payload.out += `<div class="flex items-center px-4 py-2 mt-2 rounded bg-BrandPurple"><span class="text-white">${escape_html(`${bets.length} Single${bets.length > 1 ? "s" : ""}`)}</span></div> <div class="flex-1 p-4 space-y-2"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let bet = each_array[index];
      $$payload.out += `<div class="p-2 rounded border border-gray-300 flex flex-col gap-2"><div class="flex justify-between"><div><p class="text-sm text-black font-medium">${escape_html(bet.uiDescription)}</p> <p class="text-xs text-gray-500">League: ${escape_html(bet.leagueId)}, Fixture: ${escape_html(bet.fixtureId)}</p></div> <button class="text-gray-400 hover:text-red-500">×</button></div> <div class="flex justify-between items-center"><span class="text-sm text-gray-600">@ ${escape_html(bet.odds.toFixed(2))}</span> `;
      {
        $$payload.out += "<!--[-->";
        $$payload.out += `<input type="number" min="0" placeholder="Stake" class="text-sm w-20 p-1 border rounded"${attr("value", stakes[index])}>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--> <div class="p-6 mt-auto border-t border-gray-100 md:p-4 md:bg-gray-100"><div class="flex items-center justify-between mb-4"><span class="text-lg text-gray-500 md:text-sm">FPL Balance:</span> <div class="flex items-center space-x-3"><span class="flex items-center text-lg font-medium text-black md:text-sm">`;
  OpenFPLIcon($$payload, { className: "w-3 h-3 mr-1" });
  $$payload.out += `<!----> 0.0000</span> <button class="px-4 py-1.5 md:px-2 md:py-1 text-sm md:text-xs text-white rounded-full bg-BrandPurple">Deposit</button></div></div> <div class="flex items-center justify-between mb-4"><span class="text-lg text-gray-500 md:text-sm">Bet Total:</span> <span class="flex items-center text-lg font-medium text-black md:text-sm">`;
  OpenFPLIcon($$payload, { className: "w-3 h-3 mr-1" });
  $$payload.out += `<!----> ${escape_html(totalStakes.toFixed(2))}</span></div> <div class="flex items-center justify-between mb-6 md:mb-4"><span class="text-lg text-gray-500 md:text-sm">Potential Returns:</span> <span class="flex items-center text-lg font-medium text-black md:text-sm">`;
  OpenFPLIcon($$payload, { className: "w-3 h-3 mr-1", fill: "black" });
  $$payload.out += `<!----> ${escape_html(totalReturns.toFixed(2))}</span></div> <button class="w-full px-4 py-4 text-lg font-medium text-white rounded-xl md:py-2 md:text-sm bg-BrandPurple hover:bg-BrandPurpleHover disabled:opacity-50 disabled:bg-gray-300"${attr("disabled", totalStakes <= 0 || bets.length === 0, true)}>Place Bet</button></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { isExpanded });
  pop();
}
var define_process_env_default$2 = { BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DATA_CANISTER_CANISTER_ID: "52fzd-2aaaa-aaaal-qmzsa-cai", DFX_NETWORK: "ic" };
class ClubService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$2.BACKEND_CANISTER_ID
    );
  }
  async getClubs(leagueId) {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }
  async createClub(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeCreateClub(dto);
    if (isError(result)) throw new Error("Failed to create club");
  }
  async removeClub(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeRemoveClub(dto);
    if (isError(result)) throw new Error("Failed to remove club");
  }
}
function createClubStore() {
  async function getClubs(leagueId) {
    return new ClubService().getClubs(leagueId);
  }
  async function createClub(dto) {
    return new ClubService().createClub(dto);
  }
  async function removeClub(dto) {
    return new ClubService().removeClub(dto);
  }
  return {
    getClubs,
    createClub,
    removeClub
  };
}
const clubStore = createClubStore();
var define_process_env_default$1 = { BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DATA_CANISTER_CANISTER_ID: "52fzd-2aaaa-aaaal-qmzsa-cai", DFX_NETWORK: "ic" };
class FixtureService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$1.BACKEND_CANISTER_ID
    );
  }
  async getPostponedFixtures() {
    const result = await this.actor.getPostponedFixtures();
    if (isError(result)) throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }
  async getFixtures(leagueId) {
    const result = await this.actor.getFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures");
    return result.ok;
  }
  async moveFixture(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$1.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeMoveFixture(dto);
    if (isError(result)) throw new Error("Failed to move fixture");
  }
  async postponeFixture(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$1.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executePostponeFixture(dto);
    if (isError(result)) throw new Error("Failed to postpone fixture");
  }
  async submitFixtureData(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$1.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeSubmitFixtureData(dto);
    if (isError(result)) throw new Error("Failed to submit fixture data");
  }
}
function createFixtureStore() {
  async function getFixtures(leagueId) {
    return new FixtureService().getFixtures(leagueId);
  }
  async function moveFixture(dto) {
    return new FixtureService().moveFixture(dto);
  }
  async function postponeFixture(dto) {
    return new FixtureService().postponeFixture(dto);
  }
  async function submitFixtureData(dto) {
    return new FixtureService().submitFixtureData(dto);
  }
  async function getPostponedFixtures() {
    return new FixtureService().getPostponedFixtures();
  }
  return {
    getFixtures,
    getPostponedFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData
  };
}
const fixtureStore = createFixtureStore();
var define_process_env_default = { BACKEND_CANISTER_ID: "44kin-waaaa-aaaal-qbxra-cai", FRONTEND_CANISTER_ID: "43loz-3yaaa-aaaal-qbxrq-cai", DATA_CANISTER_CANISTER_ID: "52fzd-2aaaa-aaaal-qmzsa-cai", DFX_NETWORK: "ic" };
class PlayerService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default.BACKEND_CANISTER_ID
    );
  }
  async getPlayers(leagueId) {
    const result = await this.actor.getLeaguePlayers(leagueId);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }
  async transferPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeTransferPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to transfer player");
  }
  async setFreeAgent(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeSetFreeAgent(leagueId, dto);
    if (isError(result)) throw new Error("Failed to set player as free agent");
  }
  async loanPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeLoanPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to loan player");
  }
  async createPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeCreatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to creaete player");
  }
  async updatePlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default.BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeUpdatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to update player");
  }
}
function createPlayerStore() {
  async function getPlayers(leagueId) {
    return new PlayerService().getPlayers(leagueId);
  }
  async function transferPlayer(leagueId, dto) {
    return new PlayerService().transferPlayer(leagueId, dto);
  }
  async function setFreeAgent(leagueId, dto) {
    return new PlayerService().setFreeAgent(leagueId, dto);
  }
  async function loanPlayer(leagueId, dto) {
    return new PlayerService().loanPlayer(leagueId, dto);
  }
  async function createPlayer(leagueId, dto) {
    return new PlayerService().createPlayer(leagueId, dto);
  }
  async function updatePlayer(leagueId, dto) {
    return new PlayerService().updatePlayer(leagueId, dto);
  }
  return {
    getPlayers,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer
  };
}
const playerStore = createPlayerStore();
const dataStore = writable({});
async function ensureLeagueData(leagueId) {
  let currentData;
  dataStore.subscribe((val) => currentData = val)();
  if (currentData[leagueId]) {
    return currentData[leagueId];
  }
  const clubsArr = await clubStore.getClubs(leagueId);
  const playersArr = await playerStore.getPlayers(leagueId);
  const clubsObj = {};
  for (const c of clubsArr) clubsObj[c.id] = c;
  const playersObj = {};
  for (const p of playersArr) playersObj[p.id] = p;
  dataStore.update((old) => ({
    ...old,
    [leagueId]: { clubs: clubsObj, players: playersObj }
  }));
  return { clubs: clubsObj, players: playersObj };
}
({
  subscribe: dataStore.subscribe,
  ensureLeagueData
});
function _page$a($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Layout($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<div class="flex flex-col md:flex-row"><div class="flex-1 md:block">`;
        {
          $$payload3.out += "<!--[-->";
          Full_screen_spinner($$payload3);
        }
        $$payload3.out += `<!--]--></div> <div class="flex-shrink-0 lg:ml-4 lg:w-80"><div class="hidden lg:block lg:sticky lg:top-4">`;
        Betslip($$payload3, {});
        $$payload3.out += `<!----></div> <div${attr("class", ` fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl border-BrandOddsDivider bg-BrandGray lg:hidden ${stringify("")} md:left-24 md:right-12 `)}><div class="w-full p-4 bg-white rounded-2xl md:mx-0"><button class="flex items-center w-full text-left"><div class="flex items-center"><span class="flex items-center justify-center w-12 h-10 mr-3 text-xl font-medium text-white rounded-full bg-BrandPurple">Bets</span> <span class="text-xl font-semibold text-black">Bet Slip</span></div></button></div></div> `;
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--></div></div>`;
      },
      $$slots: { default: true }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
function Modal($$payload, $$props) {
  push();
  let showModal = $$props["showModal"];
  let onClose = $$props["onClose"];
  const handleKeydown = (e) => {
    if (e.key === "Escape" && showModal) {
      onClose();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeydown);
  }
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", handleKeydown);
    }
  });
  if (showModal) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto"${attr("aria-hidden", showModal ? "false" : "true")}><div class="bg-BrandLightGray rounded-lg shadow-lg max-w-lg w-full mx-auto relative overflow-y-auto max-h-[90vh] px-6 py-4" role="dialog" aria-modal="true" tabindex="-1"><!---->`;
    slot($$payload, $$props, "default", {});
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { showModal, onClose });
  pop();
}
function Confirm_fixture_data_modal($$payload, $$props) {
  let visible = fallback($$props["visible"], false);
  let onConfirm = $$props["onConfirm"];
  let closeModal = $$props["closeModal"];
  Modal($$payload, {
    showModal: visible,
    onClose: closeModal,
    children: ($$payload2) => {
      $$payload2.out += `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h4>Confirm Fixture Data</h4> <button class="text-black">✕</button></div> <div class="my-5"><h1>Please confirm your fixture data.</h1> <p class="text-gray-600">You will not be able to edit your submission and entries that differ
        from the accepted consensus data will not receive $FPL rewards. If
        consensus has already been reached for the fixture your submission will
        also not be counted.</p></div> <div class="flex justify-end gap-3"><button class="brand-cancel-button" type="button">Cancel</button> <button class="brand-button">Confirm</button></div></div>`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { visible, onConfirm, closeModal });
}
function Clear_draft_modal($$payload, $$props) {
  let visible = fallback($$props["visible"], false);
  let onConfirm = $$props["onConfirm"];
  let closeModal = $$props["closeModal"];
  Modal($$payload, {
    showModal: visible,
    onClose: closeModal,
    children: ($$payload2) => {
      $$payload2.out += `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header">Clear Draft</h3> <button class="times-button">×</button></div> <p>Please confirm you want to clear the draft from your cache.</p> <div class="items-center py-3 flex space-x-4"><button class="brand-cancel-button" type="button">Cancel</button> <button class="brand-button">Clear</button></div></div>`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { visible, onConfirm, closeModal });
}
function _page$9($$payload, $$props) {
  push();
  var $$store_subs;
  let fixtureId, leagueId, seasonId;
  let showClearDraftModal = false;
  let showConfirmDataModal = false;
  let selectedPlayers = writable([]);
  let playerEventData = writable([]);
  let gameweek = 0;
  async function confirmFixtureData() {
    try {
      let dto = {
        seasonId,
        leagueId,
        fixtureId,
        gameweek,
        playerEventData: store_get($$store_subs ??= {}, "$playerEventData", playerEventData)
      };
      await fixtureStore.submitFixtureData(dto);
      localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    } catch (error) {
      console.error("Error saving fixture data: ", error);
    } finally {
      showConfirmDataModal = false;
    }
  }
  function clearDraft() {
    playerEventData = writable([]);
    selectedPlayers = writable([]);
    localStorage.removeItem(`fixtureDraft_${fixtureId}`);
    closeConfirmClearDraftModal();
  }
  function closeConfirmClearDraftModal() {
    showClearDraftModal = false;
  }
  function closeConfirmDataModal() {
    showConfirmDataModal = false;
  }
  fixtureId = Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("id"));
  leagueId = Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("league-id"));
  seasonId = Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("season-id"));
  store_get($$store_subs ??= {}, "$playerEventData", playerEventData).length == 0 || store_get($$store_subs ??= {}, "$playerEventData", playerEventData).filter((x) => convertEvent(x.eventType) == 0).length != store_get($$store_subs ??= {}, "$selectedPlayers", selectedPlayers).length;
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Full_screen_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  Confirm_fixture_data_modal($$payload, {
    visible: showConfirmDataModal,
    onConfirm: confirmFixtureData,
    closeModal: closeConfirmDataModal
  });
  $$payload.out += `<!----> `;
  Clear_draft_modal($$payload, {
    closeModal: closeConfirmClearDraftModal,
    visible: showClearDraftModal,
    onConfirm: clearDraft
  });
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page$8($$payload) {
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <div class="m-4"><div class="bg-panel rounded-md"><p class="p-4">Application Triggers</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Update System State</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Snapshot Manager Teams</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Gameweek Scores</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Leaderboards</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Weekly Rewards</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Pay weekly rewards</button></div></div></div></div></div>`;
    },
    $$slots: { default: true }
  });
}
function _page$7($$payload) {
}
function _page$6($$payload, $$props) {
  push();
  var $$store_subs;
  Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("leagueId"));
  Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("fixtureId"));
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    Layout($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<div class="flex flex-col md:flex-row"><div class="flex-1 md:block">`;
        {
          $$payload3.out += "<!--[-->";
          Full_screen_spinner($$payload3);
        }
        $$payload3.out += `<!--]--></div> <div class="flex-shrink-0 lg:ml-4 lg:w-80"><div class="hidden lg:block lg:sticky lg:top-4">`;
        Betslip($$payload3, {});
        $$payload3.out += `<!----></div> <div${attr("class", ` fixed bottom-0 left-0 right-0 px-3 py-4 border-t-4 rounded-xl border-BrandOddsDivider bg-BrandGray lg:hidden ${stringify("")} md:left-24 md:right-12 `)}><div class="w-full p-4 bg-white rounded-2xl md:mx-0"><button class="flex items-center w-full text-left"><div class="flex items-center"><span class="flex items-center justify-center w-12 h-10 mr-3 text-xl font-medium text-white rounded-full bg-BrandPurple">Bets</span> <span class="text-xl font-semibold text-black">Bet Slip</span></div></button></div></div> `;
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--></div></div>`;
      },
      $$slots: { default: true }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page$5($$payload) {
  Layout($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<p class="text-xl">Governance</p> <p class="mt-4 text-sm">A full range of governance features will be released here.</p>`;
    },
    $$slots: { default: true }
  });
}
function _page$4($$payload, $$props) {
  push();
  var $$store_subs;
  Number(store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("id"));
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Full_screen_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page$3($$payload, $$props) {
  push();
  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  const handleClickOutside = (event) => {
    if (!event.target?.closest(".dropdown-container")) ;
  };
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Local_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _page$2($$payload, $$props) {
  push();
  let selectedLeagueId = 1;
  let minValue = 0;
  let maxValue = 150;
  let searchSurname = "";
  let allLeaguePlayers = {};
  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  async function fetchPlayersForLeague(leagueId) {
    if (!allLeaguePlayers[leagueId]) {
      try {
        const leaguePlayers = await playerStore.getPlayers(leagueId);
        allLeaguePlayers[leagueId] = leaguePlayers;
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
    filterPlayers();
  }
  function filterPlayers() {
    let leaguePlayers = allLeaguePlayers[selectedLeagueId] || [];
    leaguePlayers.filter((player) => player.valueQuarterMillions / 4 >= minValue && player.valueQuarterMillions / 4 <= maxValue && searchSurname === "");
  }
  async function filterClubs() {
    await clubStore.getClubs(selectedLeagueId);
  }
  function handleClickOutside(event) {
    const dropdownElements = document.querySelectorAll(".dropdown-menu");
    const targetElement = event.target;
    if (![...dropdownElements].some((dropdown) => dropdown.contains(targetElement))) ;
  }
  {
    fetchPlayersForLeague(selectedLeagueId);
    filterClubs();
  }
  {
    filterPlayers();
  }
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Local_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  pop();
}
function _page$1($$payload, $$props) {
  push();
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Full_screen_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  Layout($$payload, {
    children: ($$payload2) => {
      {
        $$payload2.out += "<!--[-->";
        Local_spinner($$payload2);
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  pop();
}
export {
  Error$1 as E,
  Layout$1 as L,
  Server as S,
  _page$a as _,
  set_building as a,
  set_manifest as b,
  set_prerendering as c,
  set_private_env as d,
  set_public_env as e,
  set_read_implementation as f,
  get_hooks as g,
  set_safe_public_env as h,
  _page$9 as i,
  _page$8 as j,
  _page$7 as k,
  _page$6 as l,
  _page$5 as m,
  _page$4 as n,
  options as o,
  _page$3 as p,
  _page$2 as q,
  _page$1 as r,
  set_assets as s,
  _page as t
};
