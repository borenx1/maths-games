import { writable } from 'svelte/store';
import { browser } from '$app/env';

const savedTheme = browser ? localStorage.getItem('theme') : null;
const isPreferDarkMode = browser
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : false;

export const theme = writable<string>(savedTheme ?? (isPreferDarkMode ? 'dark' : 'light'));

if (browser) {
  theme.subscribe((value) => {
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });
}
