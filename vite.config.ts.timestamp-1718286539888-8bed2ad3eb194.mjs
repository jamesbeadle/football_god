// vite.config.ts
import { NodeModulesPolyfillPlugin } from "file:///Users/james/Documents/football_god/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
import inject from "file:///Users/james/Documents/football_god/node_modules/@rollup/plugin-inject/dist/es/index.js";
import { sveltekit } from "file:///Users/james/Documents/football_god/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  defineConfig,
  loadEnv,
} from "file:///Users/james/Documents/football_god/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url =
  "file:///Users/james/Documents/football_god/vite.config.ts";
var file = fileURLToPath(
  new URL("package.json", __vite_injected_original_import_meta_url),
);
var json = readFileSync(file, "utf8");
var { version } = JSON.parse(json);
var network = process.env.DFX_NETWORK ?? "local";
var readCanisterIds = ({ prefix }) => {
  const canisterIdsJsonFile =
    network === "ic"
      ? join(process.cwd(), "canister_ids.json")
      : join(process.cwd(), ".dfx", "local", "canister_ids.json");
  try {
    const config2 = JSON.parse(readFileSync(canisterIdsJsonFile, "utf-8"));
    return Object.entries(config2).reduce((acc, current) => {
      const [canisterName, canisterDetails] = current;
      return {
        ...acc,
        [`${prefix ?? ""}${canisterName.toUpperCase()}_CANISTER_ID`]:
          canisterDetails[network],
      };
    }, {});
  } catch (e) {
    throw Error(`Could not get canister ID from ${canisterIdsJsonFile}: ${e}`);
  }
};
var config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $declarations: resolve("./src/declarations"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "./node_modules/@dfinity/gix-components/dist/styles/mixins/media";
          @use "./node_modules/@dfinity/gix-components/dist/styles/mixins/text";
        `,
      },
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const folder = dirname(id);
          const lazy = ["@dfinity/nns"];
          if (
            ["@sveltejs", "svelte", "@dfinity/gix-components", ...lazy].find(
              (lib) => folder.includes(lib),
            ) === void 0 &&
            folder.includes("node_modules")
          ) {
            return "vendor";
          }
          if (
            lazy.find((lib) => folder.includes(lib)) !== void 0 &&
            folder.includes("node_modules")
          ) {
            return "lazy";
          }
          return "index";
        },
      },
      // Polyfill Buffer for production build
      plugins: [
        inject({
          modules: { Buffer: ["buffer", "Buffer"] },
        }),
      ],
    },
  },
  // proxy /api to port 4943 during development
  server: {
    proxy: {
      "/api": "http://localhost:4943",
    },
    watch: {
      ignored: ["**/.dfx/**", "**/.github/**"],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeModulesPolyfillPlugin(),
        {
          name: "fix-node-globals-polyfill",
          setup(build) {
            build.onResolve(
              { filter: /_virtual-process-polyfill_\.js/ },
              ({ path }) => ({ path }),
            );
          },
        },
      ],
    },
  },
  worker: {
    format: "es",
  },
};
var vite_config_default = defineConfig(() => {
  process.env = {
    ...process.env,
    ...loadEnv(
      network === "ic"
        ? "production"
        : network === "staging"
          ? "staging"
          : "development",
      process.cwd(),
    ),
    ...readCanisterIds({ prefix: "VITE_" }),
  };
  return {
    ...config,
    // Backwards compatibility for auto generated types of dfx that are meant for webpack and process.env
    define: {
      "process.env": {
        ...readCanisterIds({}),
        DFX_NETWORK: network,
      },
      VITE_APP_VERSION: JSON.stringify(version),
      VITE_DFX_NETWORK: JSON.stringify(network),
    },
  };
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvamFtZXMvRG9jdW1lbnRzL2Zvb3RiYWxsX2dvZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phbWVzL0RvY3VtZW50cy9mb290YmFsbF9nb2Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2phbWVzL0RvY3VtZW50cy9mb290YmFsbF9nb2Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBOb2RlTW9kdWxlc1BvbHlmaWxsUGx1Z2luIH0gZnJvbSBcIkBlc2J1aWxkLXBsdWdpbnMvbm9kZS1tb2R1bGVzLXBvbHlmaWxsXCI7XG5pbXBvcnQgaW5qZWN0IGZyb20gXCJAcm9sbHVwL3BsdWdpbi1pbmplY3RcIjtcbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gXCJAc3ZlbHRlanMva2l0L3ZpdGVcIjtcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgZGlybmFtZSwgam9pbiwgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5cbmNvbnN0IGZpbGUgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCJwYWNrYWdlLmpzb25cIiwgaW1wb3J0Lm1ldGEudXJsKSk7XG5jb25zdCBqc29uID0gcmVhZEZpbGVTeW5jKGZpbGUsIFwidXRmOFwiKTtcbmNvbnN0IHsgdmVyc2lvbiB9ID0gSlNPTi5wYXJzZShqc29uKTtcblxuLy8gbnBtIHJ1biBkZXYgPSBsb2NhbFxuLy8gbnBtIHJ1biBidWlsZCA9IGxvY2FsXG4vLyBkZnggZGVwbG95ID0gbG9jYWxcbi8vIGRmeCBkZXBsb3kgLS1uZXR3b3JrIGljID0gaWNcbmNvbnN0IG5ldHdvcmsgPSBwcm9jZXNzLmVudi5ERlhfTkVUV09SSyA/PyBcImxvY2FsXCI7XG5jb25zdCByZWFkQ2FuaXN0ZXJJZHMgPSAoe1xuICBwcmVmaXgsXG59OiB7XG4gIHByZWZpeD86IHN0cmluZztcbn0pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgY29uc3QgY2FuaXN0ZXJJZHNKc29uRmlsZSA9XG4gICAgbmV0d29yayA9PT0gXCJpY1wiXG4gICAgICA/IGpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJjYW5pc3Rlcl9pZHMuanNvblwiKVxuICAgICAgOiBqb2luKHByb2Nlc3MuY3dkKCksIFwiLmRmeFwiLCBcImxvY2FsXCIsIFwiY2FuaXN0ZXJfaWRzLmpzb25cIik7XG5cbiAgdHJ5IHtcbiAgICB0eXBlIERldGFpbHMgPSB7XG4gICAgICBpYz86IHN0cmluZztcbiAgICAgIGxvY2FsPzogc3RyaW5nO1xuICAgIH07XG5cbiAgICBjb25zdCBjb25maWc6IFJlY29yZDxzdHJpbmcsIERldGFpbHM+ID0gSlNPTi5wYXJzZShcbiAgICAgIHJlYWRGaWxlU3luYyhjYW5pc3Rlcklkc0pzb25GaWxlLCBcInV0Zi04XCIpLFxuICAgICk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoY29uZmlnKS5yZWR1Y2UoKGFjYywgY3VycmVudDogW3N0cmluZywgRGV0YWlsc10pID0+IHtcbiAgICAgIGNvbnN0IFtjYW5pc3Rlck5hbWUsIGNhbmlzdGVyRGV0YWlsc10gPSBjdXJyZW50O1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5hY2MsXG4gICAgICAgIFtgJHtwcmVmaXggPz8gXCJcIn0ke2NhbmlzdGVyTmFtZS50b1VwcGVyQ2FzZSgpfV9DQU5JU1RFUl9JRGBdOlxuICAgICAgICAgIGNhbmlzdGVyRGV0YWlsc1tuZXR3b3JrIGFzIGtleW9mIERldGFpbHNdLFxuICAgICAgfTtcbiAgICB9LCB7fSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGdldCBjYW5pc3RlciBJRCBmcm9tICR7Y2FuaXN0ZXJJZHNKc29uRmlsZX06ICR7ZX1gKTtcbiAgfVxufTtcblxuY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbc3ZlbHRla2l0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICRkZWNsYXJhdGlvbnM6IHJlc29sdmUoXCIuL3NyYy9kZWNsYXJhdGlvbnNcIiksXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYFxuICAgICAgICAgIEB1c2UgXCIuL25vZGVfbW9kdWxlcy9AZGZpbml0eS9naXgtY29tcG9uZW50cy9kaXN0L3N0eWxlcy9taXhpbnMvbWVkaWFcIjtcbiAgICAgICAgICBAdXNlIFwiLi9ub2RlX21vZHVsZXMvQGRmaW5pdHkvZ2l4LWNvbXBvbmVudHMvZGlzdC9zdHlsZXMvbWl4aW5zL3RleHRcIjtcbiAgICAgICAgYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXMyMDIwXCIsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm9sZGVyID0gZGlybmFtZShpZCk7XG5cbiAgICAgICAgICBjb25zdCBsYXp5ID0gW1wiQGRmaW5pdHkvbm5zXCJdO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgW1wiQHN2ZWx0ZWpzXCIsIFwic3ZlbHRlXCIsIFwiQGRmaW5pdHkvZ2l4LWNvbXBvbmVudHNcIiwgLi4ubGF6eV0uZmluZChcbiAgICAgICAgICAgICAgKGxpYikgPT4gZm9sZGVyLmluY2x1ZGVzKGxpYiksXG4gICAgICAgICAgICApID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGZvbGRlci5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIFwidmVuZG9yXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbGF6eS5maW5kKChsaWIpID0+IGZvbGRlci5pbmNsdWRlcyhsaWIpKSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBmb2xkZXIuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBcImxhenlcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gXCJpbmRleFwiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8vIFBvbHlmaWxsIEJ1ZmZlciBmb3IgcHJvZHVjdGlvbiBidWlsZFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBpbmplY3Qoe1xuICAgICAgICAgIG1vZHVsZXM6IHsgQnVmZmVyOiBbXCJidWZmZXJcIiwgXCJCdWZmZXJcIl0gfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIC8vIHByb3h5IC9hcGkgdG8gcG9ydCA0OTQzIGR1cmluZyBkZXZlbG9wbWVudFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IFwiaHR0cDovL2xvY2FsaG9zdDo0OTQzXCIsXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgaWdub3JlZDogW1wiKiovLmRmeC8qKlwiLCBcIioqLy5naXRodWIvKipcIl0sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIC8vIE5vZGUuanMgZ2xvYmFsIHRvIGJyb3dzZXIgZ2xvYmFsVGhpc1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCIsXG4gICAgICB9LFxuICAgICAgLy8gRW5hYmxlIGVzYnVpbGQgcG9seWZpbGwgcGx1Z2luc1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBOb2RlTW9kdWxlc1BvbHlmaWxsUGx1Z2luKCksXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcImZpeC1ub2RlLWdsb2JhbHMtcG9seWZpbGxcIixcbiAgICAgICAgICBzZXR1cChidWlsZCkge1xuICAgICAgICAgICAgYnVpbGQub25SZXNvbHZlKFxuICAgICAgICAgICAgICB7IGZpbHRlcjogL192aXJ0dWFsLXByb2Nlc3MtcG9seWZpbGxfXFwuanMvIH0sXG4gICAgICAgICAgICAgICh7IHBhdGggfSkgPT4gKHsgcGF0aCB9KSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgd29ya2VyOiB7XG4gICAgZm9ybWF0OiBcImVzXCIsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCk6IFVzZXJDb25maWcgPT4ge1xuICAvLyBFeHBhbmQgZW52aXJvbm1lbnQgLSAuZW52IGZpbGVzIC0gd2l0aCBjYW5pc3RlciBJRHNcbiAgcHJvY2Vzcy5lbnYgPSB7XG4gICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgLi4ubG9hZEVudihcbiAgICAgIG5ldHdvcmsgPT09IFwiaWNcIlxuICAgICAgICA/IFwicHJvZHVjdGlvblwiXG4gICAgICAgIDogbmV0d29yayA9PT0gXCJzdGFnaW5nXCJcbiAgICAgICAgICA/IFwic3RhZ2luZ1wiXG4gICAgICAgICAgOiBcImRldmVsb3BtZW50XCIsXG4gICAgICBwcm9jZXNzLmN3ZCgpLFxuICAgICksXG4gICAgLi4ucmVhZENhbmlzdGVySWRzKHsgcHJlZml4OiBcIlZJVEVfXCIgfSksXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5jb25maWcsXG4gICAgLy8gQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIGF1dG8gZ2VuZXJhdGVkIHR5cGVzIG9mIGRmeCB0aGF0IGFyZSBtZWFudCBmb3Igd2VicGFjayBhbmQgcHJvY2Vzcy5lbnZcbiAgICBkZWZpbmU6IHtcbiAgICAgIFwicHJvY2Vzcy5lbnZcIjoge1xuICAgICAgICAuLi5yZWFkQ2FuaXN0ZXJJZHMoe30pLFxuICAgICAgICBERlhfTkVUV09SSzogbmV0d29yayxcbiAgICAgIH0sXG4gICAgICBWSVRFX0FQUF9WRVJTSU9OOiBKU09OLnN0cmluZ2lmeSh2ZXJzaW9uKSxcbiAgICAgIFZJVEVfREZYX05FVFdPUks6IEpTT04uc3RyaW5naWZ5KG5ldHdvcmspLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxpQ0FBaUM7QUFDclUsT0FBTyxZQUFZO0FBQ25CLFNBQVMsaUJBQWlCO0FBQzFCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsU0FBUyxNQUFNLGVBQWU7QUFDdkMsU0FBUyxxQkFBcUI7QUFFOUIsU0FBUyxjQUFjLGVBQWU7QUFQd0ksSUFBTSwyQ0FBMkM7QUFTL04sSUFBTSxPQUFPLGNBQWMsSUFBSSxJQUFJLGdCQUFnQix3Q0FBZSxDQUFDO0FBQ25FLElBQU0sT0FBTyxhQUFhLE1BQU0sTUFBTTtBQUN0QyxJQUFNLEVBQUUsUUFBUSxJQUFJLEtBQUssTUFBTSxJQUFJO0FBTW5DLElBQU0sVUFBVSxRQUFRLElBQUksZUFBZTtBQUMzQyxJQUFNLGtCQUFrQixDQUFDO0FBQUEsRUFDdkI7QUFDRixNQUU4QjtBQUM1QixRQUFNLHNCQUNKLFlBQVksT0FDUixLQUFLLFFBQVEsSUFBSSxHQUFHLG1CQUFtQixJQUN2QyxLQUFLLFFBQVEsSUFBSSxHQUFHLFFBQVEsU0FBUyxtQkFBbUI7QUFFOUQsTUFBSTtBQU1GLFVBQU1BLFVBQWtDLEtBQUs7QUFBQSxNQUMzQyxhQUFhLHFCQUFxQixPQUFPO0FBQUEsSUFDM0M7QUFFQSxXQUFPLE9BQU8sUUFBUUEsT0FBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLFlBQStCO0FBQ3hFLFlBQU0sQ0FBQyxjQUFjLGVBQWUsSUFBSTtBQUV4QyxhQUFPO0FBQUEsUUFDTCxHQUFHO0FBQUEsUUFDSCxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsYUFBYSxZQUFZLENBQUMsY0FBYyxHQUN6RCxnQkFBZ0IsT0FBd0I7QUFBQSxNQUM1QztBQUFBLElBQ0YsR0FBRyxDQUFDLENBQUM7QUFBQSxFQUNQLFNBQVMsR0FBRztBQUNWLFVBQU0sTUFBTSxrQ0FBa0MsbUJBQW1CLEtBQUssQ0FBQyxFQUFFO0FBQUEsRUFDM0U7QUFDRjtBQUVBLElBQU0sU0FBcUI7QUFBQSxFQUN6QixTQUFTLENBQUMsVUFBVSxDQUFDO0FBQUEsRUFDckIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsZUFBZSxRQUFRLG9CQUFvQjtBQUFBLElBQzdDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYyxDQUFDLE9BQU87QUFDcEIsZ0JBQU0sU0FBUyxRQUFRLEVBQUU7QUFFekIsZ0JBQU0sT0FBTyxDQUFDLGNBQWM7QUFFNUIsY0FDRSxDQUFDLGFBQWEsVUFBVSwyQkFBMkIsR0FBRyxJQUFJLEVBQUU7QUFBQSxZQUMxRCxDQUFDLFFBQVEsT0FBTyxTQUFTLEdBQUc7QUFBQSxVQUM5QixNQUFNLFVBQ04sT0FBTyxTQUFTLGNBQWMsR0FDOUI7QUFDQSxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUNFLEtBQUssS0FBSyxDQUFDLFFBQVEsT0FBTyxTQUFTLEdBQUcsQ0FBQyxNQUFNLFVBQzdDLE9BQU8sU0FBUyxjQUFjLEdBQzlCO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBRUEsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxTQUFTO0FBQUEsUUFDUCxPQUFPO0FBQUEsVUFDTCxTQUFTLEVBQUUsUUFBUSxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQUEsUUFDMUMsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLGNBQWMsZUFBZTtBQUFBLElBQ3pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFNBQVM7QUFBQSxRQUNQLDBCQUEwQjtBQUFBLFFBQzFCO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTTtBQUFBLGNBQ0osRUFBRSxRQUFRLGlDQUFpQztBQUFBLGNBQzNDLENBQUMsRUFBRSxLQUFLLE9BQU8sRUFBRSxLQUFLO0FBQUEsWUFDeEI7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYSxNQUFrQjtBQUU1QyxVQUFRLE1BQU07QUFBQSxJQUNaLEdBQUcsUUFBUTtBQUFBLElBQ1gsR0FBRztBQUFBLE1BQ0QsWUFBWSxPQUNSLGVBQ0EsWUFBWSxZQUNWLFlBQ0E7QUFBQSxNQUNOLFFBQVEsSUFBSTtBQUFBLElBQ2Q7QUFBQSxJQUNBLEdBQUcsZ0JBQWdCLEVBQUUsUUFBUSxRQUFRLENBQUM7QUFBQSxFQUN4QztBQUVBLFNBQU87QUFBQSxJQUNMLEdBQUc7QUFBQTtBQUFBLElBRUgsUUFBUTtBQUFBLE1BQ04sZUFBZTtBQUFBLFFBQ2IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQUEsUUFDckIsYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLGtCQUFrQixLQUFLLFVBQVUsT0FBTztBQUFBLE1BQ3hDLGtCQUFrQixLQUFLLFVBQVUsT0FBTztBQUFBLElBQzFDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImNvbmZpZyJdCn0K
