import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// Use Netlify adapter manually to fix Netlify build error
		// Use adapter-auto instead when the bug is fixed
		adapter: adapter()
	}
};

export default config;
