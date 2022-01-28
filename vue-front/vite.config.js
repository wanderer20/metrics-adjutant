import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    base:  process.env.NODE_ENV === 'production' ?
        '/metrics-adjutant/' :
        '/',
    css: {
        preprocessorOptions: {
            css: {
                charset: false
            },
            scss: {
                charset: false,
                additionalData: `@import "./src/assets/scss/utils/_variables.scss"; @import "./src/assets/scss/utils/_mixins.scss";`
            }
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    }
})
