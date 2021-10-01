<script>
	import {
		TextInput,
		PasswordInput,
		Form,
		Button,
		Loading,
		ToastNotification
	} from 'carbon-components-svelte';
	import { apiURL } from '$lib/envVariables';

	let name = '';
	let email = '';
	let password = '';

	let loading = false;
	let errorMessage = '';

	async function submit(event) {
		event.preventDefault();
		loading = true;

		let data = {
			full_name: name,
			email,
			password
		};
		// Call API
		try {
			let registerResp = await fetch(apiURL + 'users/register', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json'
				}
			})
				.then((res) => res.json())
				.catch((error) => {
					return { error: error.message };
				});

			if (registerResp.error) {
				errorMessage = registerResp.error;
				return;
			}

			let loginResp = await fetch('/login', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password
				})
			})
				.then((res) => res.json())
				.catch((error) => {
					return { error: error.message };
				});

			if (loginResp.error) {
				errorMessage = loginResp.error;
				return;
			}

			window.location.reload();
		} catch (error) {
			errorMessage = error.message;
		}
	}
</script>

<Loading active={loading} />

<Form on:submit={submit}>
	<TextInput required bind:value={name} labelText="Full Name" placeholder="Enter full name" />
	<TextInput required bind:value={email} labelText="Email" type="email" placeholder="Enter email" />
	<PasswordInput required bind:value={password} labelText="Password" placeholder="Enter password" />
	<Button type="submit">Submit</Button>
</Form>

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
