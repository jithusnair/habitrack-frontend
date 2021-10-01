<script context="module">
	export async function load({ page, fetch, session, context }) {
		return {
			props: { ...session }
		};
	}
</script>

<script>
	import { apiURL } from '$lib/envVariables';
	import HabitStreak from '$lib/organisms/HabitStreakNew.svelte';
	import Calendar from '$lib/molecules/Calendar.svelte';

	export let user = {};

	let apiTest = 'Click to test API';

	async function testAPI() {
		apiTest = await fetch(apiURL + 'api', { credentials: 'include' }).then((res) => res.json());

		if (apiTest.error) {
			apiTest = apiTest.error;
		}
	}
</script>

<HabitStreak />
<!-- <Calendar /> -->
