<script context="module">
	import { apiURL } from '$lib/envVariables';

	export async function load({ page, fetch, session, context }) {
		const user = session.user;

		let response = await fetch(apiURL + 'api/' + user.uid + '/streaks/scoreboard', {
			credentials: 'include'
		});

		let rows = await response.json();

		return {
			props: { rows }
		};
	}
</script>

<script>
	import { DataTable } from 'carbon-components-svelte';

	export let rows = [];

	let headers = [
		{ key: 'habit', value: 'Habit' },
		{ key: 'streak', value: 'Highest Streak' }
	];
</script>

{#if rows.length}
	<div>
		<h1>Scoreboard</h1>
		<DataTable {headers} {rows} />
	</div>
{:else}
	<h1 class="noHabits">No habits found</h1>
{/if}

<style>
	div {
		padding: 0 16px;
	}

	div h1 {
		margin: 15px 0;
	}

	.noHabits {
		display: grid;
		text-align: center;
		height: calc(100vh - 48px);
		place-items: center;
	}
</style>
