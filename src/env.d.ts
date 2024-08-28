/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes:
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}