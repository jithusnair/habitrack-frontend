<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	import { apiURL } from '$lib/envVariables';

	export async function load({ page, fetch, session, context }) {
		const res = await fetch(apiURL + 'api/' + session.user.uid + '/habits/' + page.params.habit, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			}
		});

		if (res.ok) {
			return {
				props: {
					habitDetails: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Something went wrong`)
		};
	}
</script>

<script>
	import HabitAddOrEdit from '$lib/organisms/HabitAddOrEdit.svelte';
	import HabitDetails from '$lib/organisms/HabitDetails.svelte';
	import Calendar from '$lib/organisms/Calendar.svelte';

	export let habitDetails = {};

	let editMode = false;
</script>

{#if editMode}
	<HabitAddOrEdit on:click={() => (editMode = false)} {habitDetails} mode="edit" />
{:else}
	<div>
		<HabitDetails {habitDetails} on:click={() => (editMode = true)} />
		<Calendar habitId={habitDetails.id} />
	</div>
{/if}

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 25px;
		justify-items: center;
		column-gap: 20px;
	}

	@media only screen and (max-width: 672px) {
		div {
			grid-template-columns: 1fr;
		}
	}
</style>
