<script>
	import { Loading, ToastNotification } from 'carbon-components-svelte';
	import HabitAddOrEdit from '../molecules/HabitAddEdit.svelte';
	import { session } from '$app/stores';
	import { apiURL } from '$lib/envVariables';
	import { goto } from '$app/navigation';

	export let mode = 'add';

	export let habitDetails = {};

	let loading = false;

	let errorMessage = '';

	async function addHabit(data) {
		try {
			loading = true;
			let resp = await fetch(apiURL + 'api/' + $session.user.uid + '/habits', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				}
			})
				.then((res) => res.json())
				.catch((error) => {
					loading = false;
					return { error: error.message };
				});

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}

			await goto('/dashboard');
		} catch (error) {
			loading = false;
			errorMessage = error.message;
		}
	}

	async function updateHabit(data) {
		try {
			loading = true;
			let resp = await fetch(apiURL + 'api/' + $session.user.uid + '/habits/' + data.id, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => res.json())
				.catch((error) => {
					loading = false;
					return { error: error.message };
				});

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}

			await goto('/dashboard');
		} catch (error) {
			loading = false;
			errorMessage = error.message;
		}
	}

	async function onSave({ detail }) {
		if (mode === 'add') {
			await addHabit(detail);
		} else if (mode === 'edit') {
			await updateHabit(detail);
		}
	}

	async function deleteHabit(event) {
		try {
			loading = true;
			let resp = await fetch(apiURL + 'api/' + $session.user.uid + '/habits/' + event.detail, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			}).catch((error) => {
				loading = false;
				return { error: error.message };
			});

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}

			await goto('/dashboard');
		} catch (error) {
			loading = false;
			errorMessage = error.message;
		}
	}
</script>

{#if loading}
	<Loading />
{/if}

{#if errorMessage}
	<div class="notification">
		<ToastNotification title="Error" subtitle={errorMessage} />
	</div>
{/if}

<HabitAddOrEdit
	{loading}
	{...habitDetails}
	{mode}
	on:deleteHabit={deleteHabit}
	on:submit={onSave}
	on:click
/>

<style>
	.notification {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
