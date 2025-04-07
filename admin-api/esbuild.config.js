import { build, context } from 'esbuild';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { copyAssets } from './copy-assets.js';

const isWatching = !!process.argv.includes('--watch');
const nodePackage = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

// Define the build options
const buildOptions = {
  entryPoints: [resolve(process.cwd(), 'src', 'index.ts')],
  outfile: resolve(process.cwd(), 'dist', 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true, // Optional: enable source maps
  external: [
    Object.keys(nodePackage.dependencies ?? {}),
    Object.keys(nodePackage.peerDependencies ?? {}),
    Object.keys(nodePackage.devDependencies ?? {}),
  ].flat()
};

const runBuild = async () => {
  try {
    if (isWatching) {
      const ctx = await context(buildOptions);
      await copyAssets();
      ctx.watch();
    } else {
      await build(buildOptions);
      await copyAssets();
    }
  } catch (err) {
    console.error('Build failed:', err);
  }
};

runBuild();
