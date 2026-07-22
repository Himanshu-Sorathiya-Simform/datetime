import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'Datetime',
			fileName: 'index',
			formats: ['es'],
		},
		minify: true,
	},
	plugins: [
		dts({
			bundleTypes: true,
			tsconfigPath: './tsconfig.json',
		}),
	],
});
