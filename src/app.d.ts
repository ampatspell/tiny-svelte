// See https://kit.svelte.dev/docs/types#app
import type { Server } from '$server/server';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      server: Server;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
