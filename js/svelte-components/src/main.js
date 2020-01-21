import App from './App.svelte';

const { course, year } = window.DAVID;

const app = new App({
	target: document.querySelector('#students-container'),
	props: {
		course,
		year
	}
});

export default app;