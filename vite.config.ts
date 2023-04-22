import path from "path";
import { defineConfig } from 'vite';

const root = path.resolve(__dirname)
const outDir = path.resolve(__dirname, "dist")
export default defineConfig({
  base: "/",
  build: {
    outDir,
    emptyOutDir: true,
    target: "es2020",
    minify: false,
    rollupOptions: {
      input : {
        main: path.resolve(root, "index.html"),
        quickSort: path.resolve(root, "quickSort.html"),
        mergeSort: path.resolve(root, "mergeSort.html"),
        bubbleSort: path.resolve(root, "bubbleSort.html"),
        insertSort: path.resolve(root, "insertSort.html"),
        naturalMergeSort: path.resolve(root, "naturalMergeSort.html"),
        compareSorting: path.resolve(root, "compareSorting.html"),

      }
    }
  },
  worker: {
    format: "es", // enable code-splitting
  }
})

