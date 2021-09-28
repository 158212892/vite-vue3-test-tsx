import { defineConfig, loadEnv /*config使用环境变量*/ } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
//HTML 内容插入
import { injectHtml, minifyHtml } from 'vite-plugin-html';

// import styleImport from 'vite-plugin-style-import';
// import viteCompression from 'vite-plugin-compression';

const path = require('path');

export default async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  // const data = await asyncFunction()
  return defineConfig({
    build: {
      // outDir: "./dist", //打包后的文件目录 默认 dist
      // assetsDir: "assets", //指定生成静态资源的存放路径 默认 assets（相对于 build.outDir）
      // assetsInlineLimit: 4096, //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。 默认 4096
      // sourcemap: false,  //默认 false
      // 去除console
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          assetFileNames: 'css/[name].[hash].css',
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
        },
      },
    },
    server: {
      host: '0.0.0.0', // 默认为localhost
      port: 3000, // 端口号
      open: true, // 是否自动打开浏览器
      base: './', // 生产环境路径
      strictPort: true,

      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        // '/api': { //代理器中设置/api,项目中请求路径为/api的替换为target
        [env.VITE_APP_BASE_API]: {
          // target: 'http://172.16.22.133/prod-api/', // 后端服务实际地址
          target: 'http://127.0.0.1:3000', // 后端服务实际地址 本机
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
          rewrite: path => path.replace(new RegExp('^\\' + [env.VITE_APP_BASE_API]), ''),
        },
      },
    },
    optimizeDeps: {
      // include: ['axios', 'element-plus'] // 引入第三方插件
    },
    // publicDir: './src/assets', //作为静态资源服务的文件夹。该目录中的文件在开发期间在 / 处提供，并在构建期间复制到 outDir 的根目录
    // ssr: {
    //   external: '',
    //   noExternal: '',
    //   target: '',
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
        '~@': path.resolve('src'),
        '~component': path.resolve('src/components'),
        '~config': path.resolve('config'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          modifyVars: {},
          javascriptEnabled: true,
        },
        // postcss: {},
        modules: {
          // scopeBehaviour: "local",
          // generateScopedName: "[name]__[local]___[hash:base64:5]",
          // hashPrefix: "prefix",
          /**
           * 默认：'camelCaseOnly'
           */
          // localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly'
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      minifyHtml(),
      injectHtml({
        injectData: {
          title: env.VITE_APP_TITLE,
        },
      }),
      // styleImport({
      //   // css样式按需加载
      //   libs: [{
      //     libraryName: 'element-plus',
      //     esModule: true,
      //     ensureStyleFile: true,
      //     resolveStyle: name => {
      //       if (name === 'locale') return '';
      //       return `element-plus/lib/theme-chalk/${name}.css`;
      //     },
      //     resolveComponent: name => {
      //       return `element-plus/lib/${name}`;
      //     }
      //   }]
      // }),
      // viteCompression({
      //   // 开启gzip模式
      //   verbose: true,
      //   disable: false,
      //   threshold: 10240,
      //   algorithm: 'gzip',
      //   ext: '.gz'
      // })
    ],
  });
};