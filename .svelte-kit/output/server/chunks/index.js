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
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
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
function destroy_derived_children(derived2) {
  var children = derived2.children;
  if (children !== null) {
    derived2.children = null;
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
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(derived2.parent);
  {
    try {
      destroy_derived_children(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  var status = (skip_reaction || (derived2.f & UNOWNED) !== 0) && derived2.deps !== null ? MAYBE_DIRTY : CLEAN;
  set_signal_status(derived2, status);
  if (!derived2.equals(value)) {
    derived2.v = value;
    derived2.version = increment_version();
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
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.children ??= []).push(effect2);
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
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    var parent = derived2.parent;
    if (parent !== null && !parent.deriveds?.includes(derived2)) {
      (parent.deriveds ??= []).push(derived2);
    }
  }
  if (is_derived) {
    derived2 = /** @type {Derived} */
    signal;
    if (check_dirtiness(derived2)) {
      update_derived(derived2);
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
    if (invalidate) invalidate(void 0);
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
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set2, update) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set2, update);
      if (auto) {
        set2(result);
      } else {
        cleanup = typeof result === "function" ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe_to_store(
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
  function replacer(thing) {
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
            str = devalue.uneval({ id, data, error }, replacer);
          } catch {
            error = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str = devalue.uneval({ id, data, error }, replacer);
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
      return `{"type":"data","data":${devalue.uneval(node.data, replacer)},${stringify_uses(node)}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
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
  version_hash: "12wsa5w"
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
const authSignedInStore = derived(
  authStore,
  ({ identity }) => identity !== null && identity !== void 0
);
function LogoIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg"${attr("class", className)} fill="currentColor" viewBox="0 0 30 32"><g clip-path="url(#clip0_32_590)"><path d="M30 1.83089V5.46025C30 6.47291 29.1951 7.29114 28.199 7.29114H10.2045C8.53101 7.29114 7.17227 8.67241 7.17227 10.3737V30.1691C7.17227 31.1818 6.36738 32 5.37123 32H1.80104C0.804888 32 0 31.1818 0 30.1691V10.3939C0 4.65418 4.5783 0 10.2245 0H28.199C29.1951 0 30 0.818228 30 1.83089Z"${attr("fill", fill)}></path><path d="M30 13.6992V24.7169C30 28.7392 26.7924 32.004 22.8317 32.004H13.6432C12.914 32.004 12.3203 31.4005 12.3203 30.6592V26.0537C12.3203 25.3124 12.914 24.7088 13.6432 24.7088H21.5048C22.234 24.7088 22.8277 24.1053 22.8277 23.364V20.9863C22.8277 20.245 22.234 19.6415 21.5048 19.6415H13.6432C12.914 19.6415 12.3203 19.038 12.3203 18.2967V13.6911C12.3203 12.9499 12.914 12.3463 13.6432 12.3463H28.6771C29.4062 12.3463 30 12.9499 30 13.6911V13.6992Z"${attr("fill", fill)}></path></g><defs><clipPath id="clip0_32_590"><rect width="30" height="32"${attr("fill", fill)}></rect></clipPath></defs></svg>`;
  bind_props($$props, { className, fill });
}
function HomeIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)} fill="currentColor" viewBox="0 0 24 24"><path d="M21 10C21.1313 10 21.2614 9.97419 21.3827 9.92395C21.5041 9.8737 21.6143 9.80005 21.7072 9.70718C21.8 9.61432 21.8737 9.50406 21.9239 9.38272C21.9742 9.26138 22 9.13133 22 9V6C22.0001 5.79017 21.9341 5.58565 21.8114 5.41544C21.6887 5.24524 21.5155 5.11799 21.3164 5.05176L12.3164 2.05176C12.111 1.9834 11.889 1.9834 11.6836 2.05176L2.68359 5.05176C2.48449 5.11799 2.31131 5.24524 2.18861 5.41544C2.0659 5.58565 1.99991 5.79017 2 6V9C1.99997 9.13133 2.02581 9.26138 2.07605 9.38272C2.12629 9.50406 2.19995 9.61432 2.29282 9.70718C2.38568 9.80005 2.49594 9.8737 2.61728 9.92395C2.73862 9.97419 2.86867 10 3 10H4V17.1843C3.41674 17.3897 2.91137 17.7707 2.55327 18.2748C2.19517 18.779 2.0019 19.3816 2 20V22C1.99997 22.1313 2.02581 22.2614 2.07605 22.3827C2.12629 22.5041 2.19995 22.6143 2.29282 22.7072C2.38568 22.8 2.49594 22.8737 2.61728 22.9239C2.73862 22.9742 2.86867 23 3 23H21C21.1313 23 21.2614 22.9742 21.3827 22.9239C21.5041 22.8737 21.6143 22.8 21.7072 22.7072C21.8 22.6143 21.8737 22.5041 21.9239 22.3827C21.9742 22.2614 22 22.1313 22 22V20C21.9981 19.3816 21.8048 18.779 21.4467 18.2748C21.0886 17.7707 20.5833 17.3897 20 17.1843V10H21ZM20 21H4V20C4.00026 19.7349 4.10571 19.4807 4.29319 19.2932C4.48066 19.1057 4.73486 19.0003 5 19H19C19.2651 19.0003 19.5193 19.1057 19.7068 19.2932C19.8943 19.4807 19.9997 19.7349 20 20V21ZM6 17V10H8V17H6ZM10 17V10H14V17H10ZM16 17V10H18V17H16ZM4 8V6.7207L12 4.0537L20 6.7207V8H4Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function StarIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)} fill="currentColor" viewBox="0 0 24 24"><path d="M22 9.6699C21.9368 9.48699 21.822 9.32633 21.6693 9.2074C21.5167 9.08848 21.3328 9.0164 21.14 8.9999L15.45 8.1699L12.9 2.9999C12.8181 2.83083 12.6902 2.68824 12.5311 2.58847C12.3719 2.48871 12.1878 2.43579 12 2.43579C11.8121 2.43579 11.6281 2.48871 11.4689 2.58847C11.3097 2.68824 11.1819 2.83083 11.1 2.9999L8.54998 8.1599L2.85998 8.9999C2.6749 9.02621 2.5009 9.10386 2.35773 9.22406C2.21455 9.34425 2.10794 9.50218 2.04998 9.6799C1.99692 9.85358 1.99216 10.0384 2.03621 10.2146C2.08025 10.3908 2.17144 10.5516 2.29998 10.6799L6.42998 14.6799L5.42998 20.3599C5.39428 20.5474 5.41297 20.7412 5.48385 20.9184C5.55473 21.0955 5.67483 21.2488 5.82998 21.3599C5.98119 21.468 6.15955 21.5318 6.34503 21.5442C6.5305 21.5566 6.71575 21.517 6.87998 21.4299L12 18.7599L17.1 21.4399C17.2403 21.5191 17.3988 21.5604 17.56 21.5599C17.7718 21.5607 17.9784 21.4941 18.15 21.3699C18.3051 21.2588 18.4252 21.1055 18.4961 20.9284C18.567 20.7512 18.5857 20.5574 18.55 20.3699L17.55 14.6899L21.68 10.6899C21.8244 10.5676 21.9311 10.4068 21.9877 10.2262C22.0444 10.0457 22.0486 9.85278 22 9.6699ZM15.85 13.6699C15.7327 13.7833 15.645 13.9237 15.5944 14.0789C15.5439 14.234 15.532 14.3992 15.56 14.5599L16.28 18.7499L12.52 16.7499C12.3753 16.6729 12.2139 16.6326 12.05 16.6326C11.8861 16.6326 11.7247 16.6729 11.58 16.7499L7.81998 18.7499L8.53998 14.5599C8.56791 14.3992 8.55609 14.234 8.50554 14.0789C8.45499 13.9237 8.36725 13.7833 8.24998 13.6699L5.24998 10.6699L9.45998 10.0599C9.62198 10.0374 9.77598 9.97544 9.90848 9.87955C10.041 9.78366 10.1479 9.65674 10.22 9.5099L12 5.6999L13.88 9.5199C13.952 9.66674 14.059 9.79366 14.1915 9.88955C14.324 9.98544 14.478 10.0474 14.64 10.0699L18.85 10.6799L15.85 13.6699Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
function ProfileIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)} fill="currentColor" viewBox="0 0 24 24"><path${attr("fill", fill)} d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"></path></svg>`;
  bind_props($$props, { className, fill });
}
function LogoutIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg${attr("class", className)} viewBox="0 0 24 24"${attr("fill", fill)} xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24 24H0z"></path><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3H9c-1.1 0-2 .9-2 2v3h2V5h11v14H9v-3H7v3c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>`;
  bind_props($$props, { className, fill });
}
function Tooltip($$payload, $$props) {
  let text2 = $$props["text"];
  $$payload.out += `<button class="relative flex items-center w-6 max-w-6 text-sm"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></button>`;
  bind_props($$props, { text: text2 });
}
function RulesIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)} fill="currentColor" viewBox="0 0 24 24"><path d="M22.9642 13.8226C22.9603 13.7638 22.9508 13.7055 22.936 13.6484L20.6313 7.51135C21.0508 7.24006 21.3957 6.86818 21.6347 6.42956C21.8738 5.99095 21.9993 5.49952 22 5C22 4.73478 21.8946 4.48043 21.7071 4.29289C21.5196 4.10536 21.2652 4 21 4C20.7348 4 20.4804 4.10536 20.2929 4.29289C20.1054 4.48043 20 4.73478 20 5C19.9999 5.22285 19.9254 5.43929 19.7884 5.61499C19.6513 5.79069 19.4595 5.91559 19.2433 5.96987C19.0272 6.02416 18.7991 6.00472 18.5953 5.91465C18.3915 5.82457 18.2235 5.66902 18.1182 5.47266C17.8616 5.01717 17.4863 4.63972 17.0324 4.38042C16.5784 4.12111 16.0627 3.98965 15.54 4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V4H8.46C7.93731 3.98965 7.42158 4.12111 6.96762 4.38042C6.51366 4.63972 6.13844 5.01717 5.88184 5.47266C5.77647 5.66902 5.60855 5.82457 5.40471 5.91465C5.20088 6.00472 4.97281 6.02416 4.75668 5.96987C4.54054 5.91559 4.34872 5.79069 4.21165 5.61499C4.07457 5.43929 4.00008 5.22285 4 5C4 4.73478 3.89464 4.48043 3.70711 4.29289C3.51957 4.10536 3.26522 4 3 4C2.73478 4 2.48043 4.10536 2.29289 4.29289C2.10536 4.48043 2 4.73478 2 5C2.00065 5.49952 2.12621 5.99095 2.36525 6.42956C2.60429 6.86818 2.94922 7.24006 3.36865 7.51135L1.064 13.6484C1.04921 13.7055 1.03977 13.7638 1.03581 13.8226C1.01825 13.8805 1.00626 13.9399 1 14C1 14.0093 1.00269 14.0178 1.00275 14.0271C1.00305 14.0403 1.00575 14.0524 1.00665 14.0655C1.02222 15.1144 1.4498 16.115 2.197 16.8512C2.94421 17.5874 3.95105 18.0001 5 18.0001C6.04895 18.0001 7.05579 17.5874 7.803 16.8512C8.5502 16.115 8.97778 15.1144 8.99335 14.0655C8.9942 14.0524 8.99695 14.0403 8.99725 14.0271C8.99731 14.0178 9 14.0093 9 14C8.99376 13.9399 8.98178 13.8805 8.96423 13.8226C8.96027 13.7638 8.95083 13.7055 8.93604 13.6484L6.62866 7.50421C7.05242 7.23377 7.40114 6.86085 7.64258 6.41992C7.72984 6.2842 7.85137 6.1739 7.99489 6.10017C8.13841 6.02644 8.29885 5.99189 8.46 6H11V20H8C7.73478 20 7.48043 20.1054 7.29289 20.2929C7.10536 20.4804 7 20.7348 7 21C7 21.2652 7.10536 21.5196 7.29289 21.7071C7.48043 21.8946 7.73478 22 8 22H16C16.2652 22 16.5196 21.8946 16.7071 21.7071C16.8946 21.5196 17 21.2652 17 21C17 20.7348 16.8946 20.4804 16.7071 20.2929C16.5196 20.1054 16.2652 20 16 20H13V6H15.54C15.7011 5.9919 15.8616 6.02646 16.0051 6.10018C16.1486 6.17391 16.2701 6.2842 16.3574 6.41992C16.5988 6.86085 16.9475 7.23377 17.3713 7.50421L15.064 13.6484C15.0492 13.7055 15.0398 13.7638 15.0358 13.8226C15.0182 13.8805 15.0063 13.9399 15 14C15 14.0093 15.0027 14.0178 15.0028 14.0271C15.0031 14.0403 15.0057 14.0524 15.0066 14.0655C15.0222 15.1144 15.4498 16.115 16.197 16.8512C16.9442 17.5874 17.951 18.0001 19 18.0001C20.049 18.0001 21.0558 17.5874 21.803 16.8512C22.5502 16.115 22.9778 15.1144 22.9933 14.0655C22.9942 14.0524 22.997 14.0403 22.9972 14.0271C22.9973 14.0178 23 14.0093 23 14C22.9938 13.9399 22.9818 13.8805 22.9642 13.8226ZM5 8.85553L6.5564 13H3.4436L5 8.85553ZM6.72266 15C6.54618 15.3011 6.29479 15.5515 5.99293 15.7267C5.69107 15.9019 5.34901 15.9961 5 16C4.64903 15.9999 4.30428 15.9074 4.00036 15.7319C3.69644 15.5563 3.44405 15.3039 3.26855 15H6.72266ZM19 8.85553L20.5564 13H17.4436L19 8.85553ZM19 16C18.649 15.9999 18.3043 15.9074 18.0004 15.7319C17.6964 15.5563 17.4441 15.3039 17.2686 15H20.7227C20.5462 15.3011 20.2948 15.5515 19.9929 15.7267C19.6911 15.9019 19.349 15.9961 19 16Z"${attr("fill", fill)}></path></svg>`;
  bind_props($$props, { className, fill });
}
const idlFactory = ({ IDL }) => {
  const LeagueId = IDL.Nat16;
  const FixtureId = IDL.Nat32;
  const Error2 = IDL.Variant({
    "DecodeError": IDL.Null,
    "NotAllowed": IDL.Null,
    "NotFound": IDL.Null,
    "NotAuthorized": IDL.Null,
    "AlreadyExists": IDL.Null,
    "CanisterCreateError": IDL.Null,
    "CanisterFull": IDL.Null
  });
  const Result = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const GameweekNumber = IDL.Nat8;
  const FixtureStatusType = IDL.Variant({
    "Unplayed": IDL.Null,
    "Finalised": IDL.Null,
    "Active": IDL.Null,
    "Complete": IDL.Null
  });
  const SeasonId = IDL.Nat16;
  const ClubId = IDL.Nat16;
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
    "clubId": ClubId,
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
  const UnretirePlayerDTO = IDL.Record({ "playerId": ClubId });
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
    "playerId": PlayerId,
    "minute": IDL.Nat8
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
    "selectionDetail": SelectionDetail,
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
    "settledOn": IDL.Int
  });
  const Result_13 = IDL.Variant({ "ok": IDL.Vec(BetSlip), "err": Error2 });
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
  const OverUnderSelection = IDL.Record({
    "odds": IDL.Float64,
    "margin": IDL.Float64
  });
  const OverUnderSelectionOdds = IDL.Record({
    "homeOdds": IDL.Vec(OverUnderSelection),
    "awayOdds": IDL.Vec(OverUnderSelection)
  });
  const SplitHalfTeamSelectionOdds = IDL.Record({
    "firstHalfClubId": ClubId,
    "odds": IDL.Float64,
    "secondHalfClubId": ClubId
  });
  const ClubAndYesNoSelectionOdds = IDL.Record({
    "clubId": ClubId,
    "isNo": IDL.Bool,
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
    "penaltyMissed": TeamSelectionOdds,
    "scoresHatTrick": IDL.Vec(PlayerSelectionOdds),
    "scoresBrace": IDL.Vec(PlayerSelectionOdds),
    "goalsOverUnder": OverUnderSelectionOdds,
    "firstAssisters": IDL.Vec(PlayerSelectionOdds),
    "firstGoalscorers": IDL.Vec(PlayerSelectionOdds),
    "halfTimeFullTimeResult": IDL.Vec(SplitHalfTeamSelectionOdds),
    "bothTeamsToScoreAndWinner": IDL.Vec(ClubAndYesNoSelectionOdds)
  });
  const Result_12 = IDL.Variant({
    "ok": IDL.Vec(MatchOddsDTO),
    "err": Error2
  });
  const BettableFixtureDTO = IDL.Record({
    "fixtureId": FixtureId,
    "correctResults": TeamSelectionOdds
  });
  const Result_11 = IDL.Variant({
    "ok": IDL.Vec(BettableFixtureDTO),
    "err": Error2
  });
  const CountryDTO = IDL.Record({
    "id": CountryId,
    "code": IDL.Text,
    "name": IDL.Text
  });
  const Result_10 = IDL.Variant({ "ok": IDL.Vec(CountryDTO), "err": Error2 });
  const GetFixturesDTO = IDL.Record({
    "seasonId": SeasonId,
    "leagueId": LeagueId
  });
  const Result_9 = IDL.Variant({ "ok": IDL.Vec(FixtureDTO), "err": Error2 });
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
  const Result_8 = IDL.Variant({ "ok": IDL.Vec(ClubDTO), "err": Error2 });
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
  const Result_7 = IDL.Variant({ "ok": IDL.Vec(PlayerDTO), "err": Error2 });
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
  const Result_6 = IDL.Variant({
    "ok": IDL.Vec(FootballLeagueDTO),
    "err": Error2
  });
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
  const Result_5 = IDL.Variant({ "ok": ProfileDTO, "err": Error2 });
  const SeasonDTO = IDL.Record({
    "id": SeasonId,
    "name": IDL.Text,
    "year": IDL.Nat16
  });
  const Result_4 = IDL.Variant({ "ok": IDL.Vec(SeasonDTO), "err": Error2 });
  const CalendarMonth = IDL.Nat8;
  const SystemStateDTO = IDL.Record({
    "pickTeamSeasonId": SeasonId,
    "calculationGameweek": GameweekNumber,
    "transferWindowActive": IDL.Bool,
    "pickTeamMonth": CalendarMonth,
    "pickTeamGameweek": GameweekNumber,
    "version": IDL.Text,
    "calculationMonth": CalendarMonth,
    "calculationSeasonId": SeasonId,
    "onHold": IDL.Bool,
    "seasonActive": IDL.Bool
  });
  const Result_3 = IDL.Variant({ "ok": SystemStateDTO, "err": Error2 });
  const Result_2 = IDL.Variant({ "ok": IDL.Bool, "err": Error2 });
  const PauseAccountDTO = IDL.Record({
    "pauseDays": IDL.Nat,
    "principalId": PrincipalId
  });
  const SubmitBetslipDTO = IDL.Record({
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
  const UpdateSystemStateDTO = IDL.Record({
    "pickTeamSeasonId": SeasonId,
    "calculationGameweek": GameweekNumber,
    "transferWindowActive": IDL.Bool,
    "pickTeamMonth": CalendarMonth,
    "pickTeamGameweek": GameweekNumber,
    "version": IDL.Text,
    "calculationMonth": CalendarMonth,
    "calculationSeasonId": SeasonId,
    "onHold": IDL.Bool,
    "seasonActive": IDL.Bool
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
    "addBettableFixture": IDL.Func([LeagueId, FixtureId], [Result], []),
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
    "getBets": IDL.Func([GetBetsDTO], [Result_13], []),
    "getBettableFixture": IDL.Func(
      [LeagueId, FixtureId],
      [Result_12],
      ["query"]
    ),
    "getBettableLeagueFixtures": IDL.Func([LeagueId], [Result_11], ["query"]),
    "getCountries": IDL.Func([], [Result_10], ["query"]),
    "getFixtures": IDL.Func([GetFixturesDTO], [Result_9], ["composite_query"]),
    "getLeagueClubs": IDL.Func([LeagueId], [Result_8], ["composite_query"]),
    "getLeaguePlayers": IDL.Func([LeagueId], [Result_7], ["composite_query"]),
    "getLeagues": IDL.Func([], [Result_6], ["composite_query"]),
    "getProfile": IDL.Func([], [Result_5], []),
    "getSeasons": IDL.Func([LeagueId], [Result_4], ["composite_query"]),
    "getSystemState": IDL.Func([IDL.Text], [Result_3], ["composite_query"]),
    "isAdmin": IDL.Func([], [Result_2], []),
    "isDataManager": IDL.Func([], [Result_2], []),
    "pauseAccount": IDL.Func([PauseAccountDTO], [Result], []),
    "payWeeklyRewards": IDL.Func([IDL.Text, GameweekNumber], [Result], []),
    "placeBet": IDL.Func([SubmitBetslipDTO], [Result_1], []),
    "removeBettableFixture": IDL.Func([LeagueId, FixtureId], [Result], []),
    "setMaxBetLimit": IDL.Func([SetMaxBetLimit], [Result], []),
    "setMonthlyBetLimit": IDL.Func([SetMonthlyBetLimitDTO], [Result], []),
    "snapshotManagers": IDL.Func([IDL.Text], [Result], []),
    "updateProfilePicture": IDL.Func([UpdateProfilePictureDTO], [Result], []),
    "updateSystemState": IDL.Func(
      [IDL.Text, UpdateSystemStateDTO],
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
const canisterId = "dqerg-34aaa-aaaaa-qaapq-cai";
const createActor = (canisterId2, options2 = {}) => {
  const agent = options2.agent || new HttpAgent({ ...options2.agentOptions });
  if (options2.agent && options2.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }
  {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
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
      host: `http://localhost:8080/?canisterId=qhbym-qaaaa-aaaaa-aaafq-cai`,
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
    {
      agent.fetchRootKey().catch((err) => {
        console.warn(
          "Unable to fetch root key. Ensure your local replica is running"
        );
        console.error(err);
      });
    }
    return Actor.createActor(idlFactory2, {
      agent,
      canisterId: canisterId2,
      ...options2?.actorOptions
    });
  }
  static getAgent(canisterId2 = "", identity = null, options2 = null) {
    const hostOptions = {
      host: `http://localhost:8080/?canisterId=qhbym-qaaaa-aaaaa-aaafq-cai`,
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
function uint8ArrayToBase64(bytes) {
  const binary = Array.from(bytes).map((byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}
function formatUnixDateToSmallReadable(unixNano) {
  const date = new Date(unixNano / 1e6);
  const options2 = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return new Intl.DateTimeFormat("en-UK", options2).format(date);
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
function getImageURL(blob) {
  let byteArray;
  if (blob && typeof blob === "object" && !Array.isArray(blob)) {
    const values = Object.values(blob);
    if (values.length === 0) {
      return "/profile_placeholder.png";
    }
    byteArray = Uint8Array.from(Object.values(blob));
  } else if (Array.isArray(blob) && blob[0] instanceof Uint8Array) {
    byteArray = blob[0];
  } else if (blob instanceof Uint8Array) {
    byteArray = blob;
  } else if (typeof blob === "string") {
    if (blob.startsWith("data:image")) {
      return blob;
    } else if (!blob.startsWith("/profile_placeholder.png")) {
      return `data:png;base64,${blob}`;
    }
  }
  if (byteArray) {
    return `data:image/png;base64,${uint8ArrayToBase64(byteArray)}`;
  }
  return "/profile_placeholder.png";
}
var define_process_env_default$2 = { __CANDID_UI_CANISTER_ID: "br5f7-7uaaa-aaaaa-qaaca-cai", BACKEND_CANISTER_ID: "dqerg-34aaa-aaaaa-qaapq-cai", FOOTBALL_GOD_BACKEND_CANISTER_ID: "bd3sg-teaaa-aaaaa-qaaba-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "be2us-64aaa-aaaaa-qaabq-cai", FRONTEND_CANISTER_ID: "gm7ld-quaaa-aaaaa-qaaqa-cai", DFX_NETWORK: "local" };
class AdminService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async isDataManager() {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.isDataManager();
    if (isError(result)) {
      throw new Error("Failed to check is data manager");
    }
    return result.ok;
  }
  async isAdmin() {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.isAdmin();
    if (isError(result)) {
      throw new Error("Failed to check is admin");
    }
    return result.ok;
  }
  async getLeagueClubs(leagueId) {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league clubs");
    return result.ok;
  }
  async createLeague(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeCreateLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }
  async updateLeague(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeUpdateLeague(dto);
    if (isError(result)) throw new Error("Failed to update league");
  }
  async transferPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeTransferPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to transfer player");
  }
  async setFreeAgent(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeSetFreeAgent(leagueId, dto);
    if (isError(result)) throw new Error("Failed to set player as free agent");
  }
  async loanPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeLoanPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to loan player");
  }
  async createPlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeCreatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to creaete player");
  }
  async updatePlayer(leagueId, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeUpdatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to update player");
  }
  async updateSystemState(applicationName, dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.updateSystemState(applicationName, dto);
    if (isError(result)) throw new Error("Failed to update system state");
  }
  async snapshotManagers(applicationName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.snapshotManagers(applicationName);
    if (isError(result)) throw new Error("Failed to snapshot managers");
  }
  async calculateGameweekScores(applicationName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.calculateGameweekScores(applicationName);
    if (isError(result)) throw new Error("Failed to calculate gameweek scores");
  }
  async calculateLeaderboards(applicationName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.calculateLeaderboards(applicationName);
    if (isError(result)) throw new Error("Failed to calculate leaderboards");
  }
  async calculateWeeklyRewards(applicationName, gameweek) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.calculateWeeklyRewards(
      applicationName,
      gameweek
    );
    if (isError(result)) throw new Error("Failed to calculate weekly rewards");
  }
  async payWeeklyRewards(applicationName, gameweek) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.payWeeklyRewards(
      applicationName,
      gameweek
    );
    console.log(result);
    if (isError(result)) throw new Error("Failed to pay weekly rewards");
  }
  async createClub(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeCreateClub(dto);
    if (isError(result)) throw new Error("Failed to create club");
  }
  async removeClub(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeRemoveClub(dto);
    if (isError(result)) throw new Error("Failed to remove club");
  }
  async getSystemState(applicationName) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.getSystemState(applicationName);
    console.log(result);
    if (isError(result)) throw new Error("Failed to get system state");
    return result.ok;
  }
  async getFixtures(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.getFixtures(dto);
    console.log(result);
    if (isError(result)) throw new Error("Failed to get fixtures");
    return result.ok;
  }
  async moveFixture(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeMoveFixture(dto);
    if (isError(result)) throw new Error("Failed to move fixture");
  }
  async postponeFixture(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executePostponeFixture(dto);
    if (isError(result)) throw new Error("Failed to postpone fixture");
  }
  async submitFixtureData(dto) {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      define_process_env_default$2.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
    const result = await identityActor.executeSubmitFixtureData(dto);
    if (isError(result)) throw new Error("Failed to submit fixture data");
  }
}
function LeaguesIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let fill = fallback($$props["fill"], "white");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"${attr("class", className)} fill="currentColor" viewBox="0 0 24 24"><path${attr("fill", fill)} d="M19 3H18V2C18 1.73478 17.8946 1.48043 17.7071 1.29289C17.5196 1.10536 17.2652 1 17 1C16.7348 1 16.4804 1.10536 16.2929 1.29289C16.1054 1.48043 16 1.73478 16 2V3H8V2C8 1.73478 7.89464 1.48043 7.70711 1.29289C7.51957 1.10536 7.26522 1 7 1C6.73478 1 6.48043 1.10536 6.29289 1.29289C6.10536 1.48043 6 1.73478 6 2V3H5C4.20435 3 3.44129 3.31607 2.87868 3.87868C2.31607 4.44129 2 5.20435 2 6V20C2 20.7956 2.31607 21.5587 2.87868 22.1213C3.44129 22.6839 4.20435 23 5 23H19C19.7956 23 20.5587 22.6839 21.1213 22.1213C21.6839 21.5587 22 20.7956 22 20V6C22 5.20435 21.6839 4.44129 21.1213 3.87868C20.5587 3.31607 19.7956 3 19 3ZM20 20C20 20.2652 19.8946 20.5196 19.7071 20.7071C19.5196 20.8946 19.2652 21 19 21H5C4.73478 21 4.48043 20.8946 4.29289 20.7071C4.10536 20.5196 4 20.2652 4 20V11H20V20ZM20 9H4V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H6V6C6 6.26522 6.10536 6.51957 6.29289 6.70711C6.48043 6.89464 6.73478 7 7 7C7.26522 7 7.51957 6.89464 7.70711 6.70711C7.89464 6.51957 8 6.26522 8 6V5H16V6C16 6.26522 16.1054 6.51957 16.2929 6.70711C16.4804 6.89464 16.7348 7 17 7C17.2652 7 17.51957 6.89464 17.7071 6.70711C17.8946 6.51957 18 6.26522 18 6V5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V9Z"></path><line x1="6" y1="15" x2="18" y2="15" stroke="#101111" stroke-width="2"></line><line x1="6" y1="18" x2="18" y2="18" stroke="#101111" stroke-width="2"></line></svg>`;
  bind_props($$props, { className, fill });
}
function ShirtIcon($$payload, $$props) {
  let className = fallback($$props["className"], "");
  let primaryColour = fallback($$props["primaryColour"], "#FFFFFF");
  let secondaryColour = fallback($$props["secondaryColour"], "gray");
  let thirdColour = fallback($$props["thirdColour"], "#FFFFFF");
  $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"${attr("class", className)} fill="currentColor" viewBox="0 0 86 88"><g><path d="M65.9308 38.3253L63.5966 33.0215L63.642 33.2129C63.5966 34.2107 63.5603 35.2633 63.533 36.366C63.4831 38.3299 63.4604 40.4442 63.4604 42.6587C63.4604 54.9386 64.1597 70.308 64.8727 79.9999H21.1266C21.835 70.2989 22.5389 54.9159 22.5389 42.6313C22.5389 40.4214 22.5162 38.3162 22.4663 36.3569C22.439 35.2542 22.4027 34.2062 22.3573 33.2129L22.3982 33.0215L20.0685 38.3253L9.30566 33.3131L20.5453 10.6213L20.5862 10.5438L20.6271 10.4573C20.6271 10.4573 31.6578 6.72087 32.0166 6.3609C32.0983 6.27889 32.2346 6.09662 32.3935 5.86424C34.2554 8.43871 36.6668 10.6122 39.4688 12.2252C40.2726 12.69 41.1037 13.1046 41.971 13.4737C42.3026 13.615 42.6432 13.7517 42.9883 13.8747V13.8838C42.9883 13.8838 42.9928 13.8838 42.9974 13.8793C43.0019 13.8838 43.0065 13.8838 43.011 13.8838V13.8747C43.3516 13.7517 43.6922 13.615 44.0237 13.4737C44.8865 13.1092 45.7267 12.69 46.5305 12.2252C49.3324 10.6122 51.7439 8.43871 53.6058 5.85968C53.7647 6.09662 53.901 6.27889 53.9827 6.3609C54.3415 6.72087 65.3722 10.4573 65.3722 10.4573L65.4131 10.5438L65.454 10.6213L76.6891 33.3131L65.9308 38.3253Z"${attr("fill", primaryColour)}></path><path d="M51.2756 3.04364C51.1348 3.26691 50.985 3.48563 50.8351 3.69979C49.0504 6.26059 46.7298 8.43864 44.0232 10.0881C43.6917 10.2932 43.3556 10.4845 43.0105 10.6714C43.0105 10.6714 43.0059 10.6759 43.0014 10.6759C42.9969 10.6759 42.9923 10.6714 42.9878 10.6714C42.6426 10.4845 42.302 10.2886 41.9705 10.0836C39.2685 8.43864 36.9479 6.26059 35.1632 3.69979C35.0133 3.48563 34.8634 3.26691 34.7227 3.04364H51.2756Z"${attr("fill", secondaryColour)}></path><path d="M68.5512 8.58005L68.265 8.00136C68.265 8.00136 68.2514 7.99681 68.2287 7.98769C67.5294 7.75075 57.3478 4.29686 55.1726 3.35365C54.9546 3.25796 54.8138 3.18505 54.7775 3.1486C54.7502 3.12126 54.7184 3.08936 54.6866 3.0438C54.2416 2.49701 53.1699 0.715384 52.8429 0.164037C52.7793 0.0592356 52.743 0 52.743 0H33.2564C33.2564 0 33.22 0.0592356 33.1565 0.164037C32.8295 0.715384 31.7578 2.49701 31.3173 3.0438C31.2809 3.08936 31.2491 3.12126 31.2219 3.1486C31.1856 3.18505 31.0448 3.25796 30.8223 3.35365C28.6424 4.29686 18.4654 7.75075 17.7706 7.98769C17.7479 7.99681 17.7343 8.00136 17.7343 8.00136L17.4482 8.5846L4.33301 35.0629L18.5835 41.7019L20.0685 38.3254L9.3057 33.3132L20.5454 10.6214L20.5862 10.5439L20.6271 10.4574C20.6271 10.4574 31.6578 6.72096 32.0166 6.36099C32.0984 6.27897 32.2346 6.09671 32.3935 5.86432C34.2555 8.43879 36.6669 10.6123 39.4688 12.2253C40.2726 12.6901 41.1037 13.1047 41.9711 13.4738C42.3026 13.6151 42.6432 13.7518 42.9883 13.8748C42.9883 13.8748 42.9914 13.8763 42.9974 13.8794C42.9974 13.8794 43.0065 13.8794 43.011 13.8748C43.3516 13.7518 43.6922 13.6151 44.0237 13.4738C44.8866 13.1093 45.7267 12.6901 46.5305 12.2253C49.3325 10.6123 51.7439 8.43879 53.6058 5.85977C53.7648 6.09671 53.901 6.27897 53.9827 6.36099C54.3415 6.72096 65.3723 10.4574 65.3723 10.4574L65.4131 10.5439L65.454 10.6214L76.6891 33.3132L65.9308 38.3254L67.4158 41.7019L81.6663 35.0629L68.5512 8.58005ZM50.8356 3.69995C49.0509 6.26075 46.7303 8.43879 44.0237 10.0883C43.6922 10.2933 43.3562 10.4847 43.011 10.6715V10.6806H43.0019C42.9974 10.6806 42.9929 10.6806 42.9883 10.6806V10.6715C42.6432 10.4847 42.3026 10.2888 41.9711 10.0837C39.269 8.43879 36.9484 6.26075 35.1637 3.69995C35.0138 3.48579 34.864 3.26707 34.7232 3.0438H51.2761C51.1354 3.26707 50.9855 3.48579 50.8356 3.69995Z"${attr("fill", thirdColour)}></path></g></svg>`;
  bind_props($$props, {
    className,
    primaryColour,
    secondaryColour,
    thirdColour
  });
}
function Full_screen_spinner($$payload) {
  $$payload.out += `<div class="local-spinner svelte-pvdm52"></div>`;
}
function Layout($$payload, $$props) {
  push();
  var $$store_subs;
  let links, activeRoute;
  let isExpanded = writable(false);
  const init2 = async () => await Promise.all([syncAuthStore()]);
  const syncAuthStore = async () => {
    {
      return;
    }
  };
  links = store_get($$store_subs ??= {}, "$authSignedInStore", authSignedInStore) ? [
    {
      name: "Home",
      icon: HomeIcon,
      href: "/",
      admin: false
    },
    {
      name: "Leagues",
      icon: LeaguesIcon,
      href: "/leagues",
      admin: false
    },
    {
      name: "Players",
      icon: ShirtIcon,
      href: "/players",
      admin: false
    },
    {
      name: "Profile",
      icon: ProfileIcon,
      href: "/profile",
      admin: false
    },
    {
      name: "Governance",
      icon: RulesIcon,
      href: "/governance",
      admin: false
    },
    {
      name: "Admin",
      icon: StarIcon,
      href: "/admin",
      admin: true
    }
  ] : [
    {
      name: "Home",
      icon: HomeIcon,
      href: "/",
      admin: false
    }
  ];
  activeRoute = store_get($$store_subs ??= {}, "$page", page).url.pathname;
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
      const each_array = ensure_array_like(links);
      $$payload.out += `<div class="flex h-screen"><div class="bg-GRAY text-white flex flex-col justify-between transition-width duration-300 p-5 rounded-lg m-2"${attr("style", `width: ${stringify(store_get($$store_subs ??= {}, "$isExpanded", isExpanded) ? "16rem" : "4rem")}`)}><div class="flex flex-col flex-grow"><button class="mb-4"><span>${escape_html(store_get($$store_subs ??= {}, "$isExpanded", isExpanded) ? "<<" : ">>")}</span></button> <div class="text-gray-400 flex flex-col"><a href="/" class="block mt-4 text-lg my-4"><div class="flex flex-row items-center">`;
      LogoIcon($$payload, { className: "w-6 mr-2" });
      $$payload.out += `<!----> `;
      if (store_get($$store_subs ??= {}, "$isExpanded", isExpanded)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span>FootballGod</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></a> <!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let link = each_array[$$index];
        if (link.admin) {
          $$payload.out += "<!--[-->";
          {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]-->`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<a${attr("href", link.href)} rel="prefetch"${attr("class", `block mt-4 text-lg ${stringify([activeRoute === link.href ? "active" : ""].filter(Boolean).join(" "))}`)}><div class="flex flex-row items-center">`;
          Tooltip($$payload, {
            text: link.name,
            children: ($$payload2) => {
              $$payload2.out += `<!---->`;
              link.icon?.($$payload2, {
                className: "w-6 mr-2",
                fill: activeRoute === link.href ? "white" : "gray"
              });
              $$payload2.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload.out += `<!----> `;
          if (store_get($$store_subs ??= {}, "$isExpanded", isExpanded)) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<span>${escape_html(link.name)}</span>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--></div></a>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></div></div> `;
      if (store_get($$store_subs ??= {}, "$authSignedInStore", authSignedInStore) && !store_get($$store_subs ??= {}, "$isExpanded", isExpanded)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button>`;
        Tooltip($$payload, {
          text: "Logout",
          children: ($$payload2) => {
            LogoutIcon($$payload2, { className: "max-w-6" });
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----></button>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="mb-4">`;
      if (store_get($$store_subs ??= {}, "$isExpanded", isExpanded)) {
        $$payload.out += "<!--[-->";
        if (store_get($$store_subs ??= {}, "$authSignedInStore", authSignedInStore)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<button class="button-hover p-2 rounded-md text-sm w-full">Disconnect</button>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<button class="bg-OPENFPL hover:bg-OPENFPL hover:text-GRAY p-2 rounded-md text-sm w-full">Connect Internet Identity</button>`;
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div> <div class="flex-1"><!---->`;
      slot($$payload, $$props, "default", {});
      $$payload.out += `<!----></div></div>`;
    }
  );
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page$7($$payload, $$props) {
  push();
  let interval;
  onDestroy(() => {
    clearInterval(interval);
  });
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
var define_process_env_default$1 = { __CANDID_UI_CANISTER_ID: "br5f7-7uaaa-aaaaa-qaaca-cai", BACKEND_CANISTER_ID: "dqerg-34aaa-aaaaa-qaapq-cai", FOOTBALL_GOD_BACKEND_CANISTER_ID: "bd3sg-teaaa-aaaaa-qaaba-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "be2us-64aaa-aaaaa-qaabq-cai", FRONTEND_CANISTER_ID: "gm7ld-quaaa-aaaaa-qaaqa-cai", DFX_NETWORK: "local" };
class ClubService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default$1.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async getClubs(leagueId) {
    const result = await this.actor.getLeagueClubs(leagueId);
    console.log(result);
    if (isError(result)) throw new Error("Failed to fetch clubs");
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
var define_process_env_default = { __CANDID_UI_CANISTER_ID: "br5f7-7uaaa-aaaaa-qaaca-cai", BACKEND_CANISTER_ID: "dqerg-34aaa-aaaaa-qaapq-cai", FOOTBALL_GOD_BACKEND_CANISTER_ID: "bd3sg-teaaa-aaaaa-qaaba-cai", FOOTBALL_GOD_FRONTEND_CANISTER_ID: "be2us-64aaa-aaaaa-qaabq-cai", FRONTEND_CANISTER_ID: "gm7ld-quaaa-aaaaa-qaaqa-cai", DFX_NETWORK: "local" };
class PlayerService {
  actor;
  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      define_process_env_default.FOOTBALL_GOD_BACKEND_CANISTER_ID
    );
  }
  async getPlayers(leagueId) {
    console.log("using actor to get players");
    console.log(`league id is ${leagueId}`);
    const result = await this.actor.getLeaguePlayers(leagueId);
    console.log(result);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }
}
function createPlayerStore() {
  async function getPlayers(leagueId) {
    console.log("calling service to get players");
    console.log(`league id is ${leagueId}`);
    return new PlayerService().getPlayers(leagueId);
  }
  return {
    getPlayers
  };
}
const playerStore = createPlayerStore();
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
    $$payload.out += `<div class="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center" aria-hidden="true"><div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-auto relative text-black" role="dialog" aria-modal="true"><button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Close modal">×</button> <!---->`;
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
        also not be counted.</p></div> <div class="flex justify-end gap-3"><button class="default-button fpl-cancel-btn" type="button">Cancel</button> <button class="default-button brand-button">Confirm</button></div></div>`;
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
      $$payload2.out += `<div class="mx-4 p-4"><div class="flex justify-between items-center my-2"><h3 class="default-header">Clear Draft</h3> <button class="times-button">×</button></div> <p>Please confirm you want to clear the draft from your cache.</p> <div class="items-center py-3 flex space-x-4"><button class="default-button fpl-cancel-btn" type="button">Cancel</button> <button class="default-button brand-button">Clear</button></div></div>`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { visible, onConfirm, closeModal });
}
function createAdminStore() {
  async function transferPlayer(leagueId, dto) {
    return new AdminService().transferPlayer(leagueId, dto);
  }
  async function setFreeAgent(leagueId, dto) {
    return new AdminService().setFreeAgent(leagueId, dto);
  }
  async function loanPlayer(leagueId, dto) {
    return new AdminService().loanPlayer(leagueId, dto);
  }
  async function createPlayer(leagueId, dto) {
    return new AdminService().createPlayer(leagueId, dto);
  }
  async function updatePlayer(leagueId, dto) {
    return new AdminService().updatePlayer(leagueId, dto);
  }
  async function createLeague(dto) {
    return new AdminService().createLeague(dto);
  }
  async function updateLeague(dto) {
    return new AdminService().updateLeague(dto);
  }
  async function getSystemState(applicationName) {
    return new AdminService().getSystemState(applicationName);
  }
  async function updateSystemState(applicationName, dto) {
    return new AdminService().updateSystemState(applicationName, dto);
  }
  async function snapshotManagers(applicationName) {
    return new AdminService().snapshotManagers(applicationName);
  }
  async function calculateGameweekScores(applicationName) {
    return new AdminService().calculateGameweekScores(applicationName);
  }
  async function calculateLeaderboards(applicationName) {
    return new AdminService().calculateLeaderboards(applicationName);
  }
  async function calculateWeeklyRewards(applicationName, gameweek) {
    return new AdminService().calculateWeeklyRewards(applicationName, gameweek);
  }
  async function payWeeklyRewards(applicationName, gameweek) {
    return new AdminService().payWeeklyRewards(applicationName, gameweek);
  }
  async function createClub(dto) {
    return new AdminService().createClub(dto);
  }
  async function removeClub(dto) {
    return new AdminService().removeClub(dto);
  }
  async function getFixtures(dto) {
    return new AdminService().getFixtures(dto);
  }
  async function moveFixture(dto) {
    return new AdminService().moveFixture(dto);
  }
  async function postponeFixture(dto) {
    return new AdminService().postponeFixture(dto);
  }
  async function submitFixtureData(dto) {
    return new AdminService().submitFixtureData(dto);
  }
  return {
    createLeague,
    updateLeague,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer,
    updateSystemState,
    snapshotManagers,
    calculateGameweekScores,
    calculateLeaderboards,
    calculateWeeklyRewards,
    payWeeklyRewards,
    createClub,
    removeClub,
    getSystemState,
    getFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData
  };
}
const adminStore = createAdminStore();
function _page$6($$payload, $$props) {
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
      await adminStore.submitFixtureData(dto);
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
function _page$5($$payload) {
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
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <div class="m-4"><div class="bg-panel rounded-md"><ul class="flex rounded-t-lg bg-light-gray border-b border-gray-700 px-4 pt-2"><li class="mr-4 active-tab"><button class="text-white">Raise Proposal</button></li></ul> <p class="m-4">Application Triggers</p> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mx-4 mb-4"><div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Update System State</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Snapshot Manager Teams</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Gameweek Scores</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Leaderboards</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Calculate Weekly Rewards</button></div></div> <div class="flex flex-col items-center bg-gray-700 rounded shadow p-4 w-full"><div class="flex items-center space-x-4 w-full"><button class="rounded brand-button px-3 sm:px-2 px-3 py-1 mr-1 my-1 w-full">Pay weekly rewards</button></div></div></div></div></div>`;
    },
    $$slots: { default: true }
  });
}
function _page$4($$payload, $$props) {
  push();
  onDestroy(() => {
  });
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
function _page$3($$payload, $$props) {
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
function _page$2($$payload, $$props) {
  push();
  let leagues = [];
  let countries = [];
  Layout($$payload, {
    children: ($$payload2) => {
      const each_array = ensure_array_like(leagues.sort((a, b) => Number(a.id) - Number(b.id)));
      $$payload2.out += `<div class="page-header-wrapper flex w-full py-10 bg-gradient-to-r from-blue-800 to-blue-600"><div class="container mx-auto px-6"><div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg"><div class="flex justify-between items-center w-full mb-4"><p class="text-3xl font-bold text-white">League Explorer</p> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let league = each_array[$$index];
        $$payload2.out += `<div class="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 hover:bg-gray-700 transition duration-300"><div class="flex items-center"><img${attr("src", getImageURL(league.logo))} class="w-12 h-12 object-cover rounded-full border-2 border-gray-600" alt="logo"> <div class="ml-4"><p class="text-md font-bold text-white">${escape_html(league.name)}</p> <p class="text-sm text-gray-400">${escape_html(league.abbreviation)} - ${escape_html(league.governingBody)}</p></div></div> <div class="text-sm text-gray-300 space-y-2"><p><span class="font-semibold text-gray-400">Country:</span> ${escape_html(countries.find((x) => x.id == league.countryId)?.name)}</p> <p><span class="font-semibold text-gray-400">Gender:</span> ${escape_html(Object.keys(league.relatedGender)[0])}</p> <p><span class="font-semibold text-gray-400">Teams:</span> ${escape_html(league.teamCount)}</p> <p><span class="font-semibold text-gray-400">Founded:</span> ${escape_html(formatUnixDateToSmallReadable(Number(league.formed)))}</p></div> <a${attr("href", `/league?id=${league.id}`)} class="block text-right"><button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">View League</button></a></div>`;
      }
      $$payload2.out += `<!--]--></div></div></div></div>`;
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
function _page$1($$payload, $$props) {
  push();
  let selectedLeagueId = 1;
  let minValue = 0;
  let maxValue = 150;
  let leagues = [];
  let positions = [
    { id: 1, positionName: "Goalkeeper" },
    { id: 2, positionName: "Defender" },
    { id: 3, positionName: "Midfielder" },
    { id: 4, positionName: "Forward" }
  ];
  let clubs = [];
  let allLeaguePlayers = {};
  let filteredPlayers = [];
  let dropdownVisible = null;
  let countries = [];
  let searchSurname = "";
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
    filteredPlayers = leaguePlayers.filter((player) => player.valueQuarterMillions / 4 >= minValue && player.valueQuarterMillions / 4 <= maxValue && searchSurname === "");
  }
  async function filterClubs() {
    clubs = await clubStore.getClubs(selectedLeagueId);
  }
  function handleClickOutside(event) {
    const dropdownElements = document.querySelectorAll(".dropdown-menu");
    const targetElement = event.target;
    if (![...dropdownElements].some((dropdown) => dropdown.contains(targetElement))) {
      dropdownVisible = null;
    }
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
      const each_array = ensure_array_like(leagues);
      const each_array_1 = ensure_array_like(positions);
      const each_array_2 = ensure_array_like(countries);
      const each_array_3 = ensure_array_like(clubs);
      const each_array_4 = ensure_array_like(filteredPlayers.sort((a, b) => b.valueQuarterMillions - a.valueQuarterMillions));
      $$payload2.out += `<div class="page-header-wrapper flex w-full py-10 bg-gradient-to-r from-blue-800 to-blue-600"><div class="container mx-auto px-6"><div class="content-panel w-full flex flex-col bg-gray-900 p-6 rounded-lg shadow-lg"><div class="flex justify-between items-center w-full mb-4"><p class="text-3xl font-bold text-white">Player Explorer</p> <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">+ New Player</button></div> <div class="flex flex-col gap-4 md:flex-row mb-6"><select class="form-select block w-full md:w-1/4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500"><option${attr("value", 0)}>Select League</option><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let league = each_array[$$index];
        $$payload2.out += `<option${attr("value", league.id)}>${escape_html(league.name)}</option>`;
      }
      $$payload2.out += `<!--]--></select> <select class="form-select block w-full md:w-1/4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500"><option${attr("value", 0)}>Select Position</option><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let position = each_array_1[$$index_1];
        $$payload2.out += `<option${attr("value", position.id)}>${escape_html(position.positionName)}</option>`;
      }
      $$payload2.out += `<!--]--></select> <select class="form-select block w-full md:w-1/4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500"><option${attr("value", 0)}>Select Nationality</option><!--[-->`;
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let country = each_array_2[$$index_2];
        $$payload2.out += `<option${attr("value", country.id)}>${escape_html(country.name)}</option>`;
      }
      $$payload2.out += `<!--]--></select> <select class="form-select block w-full md:w-1/4 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500"><option${attr("value", 0)}>Select Club</option><!--[-->`;
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let club = each_array_3[$$index_3];
        $$payload2.out += `<option${attr("value", club.id)}>${escape_html(club.name)}</option>`;
      }
      $$payload2.out += `<!--]--></select></div> <div class="flex flex-col gap-4 md:flex-row mb-6"><div class="flex items-center w-full md:w-1/4"><label for="minValue" class="text-sm text-gray-400 mr-2">Min Value (M):</label> <input type="number" id="minValue"${attr("value", minValue)} step="0.25" class="form-input bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500 w-full"></div> <div class="flex items-center w-full md:w-1/4"><label for="maxValue" class="text-sm text-gray-400 mr-2">Max Value (M):</label> <input type="number" id="maxValue"${attr("value", maxValue)} step="0.25" class="form-input bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500 w-full"></div></div> <div class="flex flex-col md:flex-row gap-4 mb-6"><div class="flex items-center w-full md:w-1/2"><label for="searchSurname" class="text-sm text-gray-400 mr-2">Search by Surname:</label> <input type="text" id="searchSurname"${attr("value", searchSurname)} class="form-input bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring focus:ring-blue-500 w-full"></div> <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Search</button></div> <div><!--[-->`;
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let player = each_array_4[$$index_4];
        $$payload2.out += `<div class="flex flex-row items-center bg-gray-800 rounded-lg shadow p-4 w-full my-2 transition hover:bg-gray-700"><div class="flex items-center space-x-4 w-full"><p class="flex-grow text-lg md:text-sm text-white">${escape_html(player.firstName)} ${escape_html(player.lastName)} <br> Player ID: ${escape_html(player.id)} <br> Value: £${escape_html(player.valueQuarterMillions / 4)}M</p> <div class="relative"><button class="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">Actions</button> `;
        if (dropdownVisible === player.id) {
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 text-sm dropdown-menu"><button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Update Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Set Player Injury</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Transfer Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Loan Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Recall Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Revalue Player Up</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Revalue Player Down</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Retire Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Unretire Player</button> <button class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Set Player As Free Agent</button></div>`;
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]--></div></div></div>`;
      }
      $$payload2.out += `<!--]--></div></div></div></div>`;
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
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _page($$payload, $$props) {
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
export {
  Error$1 as E,
  Layout$1 as L,
  Server as S,
  _page$7 as _,
  set_building as a,
  set_manifest as b,
  set_prerendering as c,
  set_private_env as d,
  set_public_env as e,
  set_read_implementation as f,
  get_hooks as g,
  set_safe_public_env as h,
  _page$6 as i,
  _page$5 as j,
  _page$4 as k,
  _page$3 as l,
  _page$2 as m,
  _page$1 as n,
  options as o,
  _page as p,
  set_assets as s
};
