<script>
	import { createEventDispatcher } from 'svelte';
	import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
	import PasswordInput from 'carbon-components-svelte/src/TextInput/PasswordInput.svelte';
	import Form from 'carbon-components-svelte/src/Form/Form.svelte';
	import Button from 'carbon-components-svelte/src/Button/Button.svelte';
	import Loading from 'carbon-components-svelte/src/Loading/Loading.svelte';

	let dispatch = createEventDispatcher();

	export let email = '';

	export let password = '';

	export let invalid = false;

	let loading = false;

	function submit(event) {
		event.preventDefault();
		dispatch('submit', {
			email,
			password
		});
	}
</script>

<Loading active={loading} />

<Form on:submit={submit}>
	<TextInput
		invalid={invalid ? true : false}
		required
		bind:value={email}
		labelText="Email"
		type="email"
		placeholder="Enter email"
	/>
	<PasswordInput
		invalid={invalid ? true : false}
		required
		bind:value={password}
		labelText="Password"
		placeholder="Enter password"
	/>
	<Button size="field" type="submit">Submit</Button>
</Form>
