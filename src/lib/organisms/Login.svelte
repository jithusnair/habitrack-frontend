<script>
	import { ToastNotification } from 'carbon-components-svelte';
	import Login from '$lib/molecules/Login.svelte';

	let errorMessage = '';

	async function submit(event) {
		let data = { ...event.detail };
		// Call API
		try {
			let resp = await fetch('/login', {
				method: 'POST',
				body: JSON.stringify(data)
			})
				.then((res) => res.json())
				.catch((error) => {
					return { error: error.message };
				});

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}

			// $session = {
			// 	user: { ...resp.user }
			// };
			// await goto('/dashboard');
			window.location.reload();
		} catch (error) {
			errorMessage = error.message;
		}
	}
</script>

<Login on:submit={submit} invalid={errorMessage ? true : false} />

{#if errorMessage}
	<div class="notification">
		<ToastNotification
			timeout={5000}
			title="Error"
			caption={errorMessage}
			on:close={() => (errorMessage = '')}
		/>
	</div>
{/if}

<style>
	.notification {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
