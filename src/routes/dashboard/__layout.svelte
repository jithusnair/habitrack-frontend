<script context="module">
	export async function load({ page, fetch, session, context }) {
		const user = session.user;

		if (!user) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	}
</script>

<script>
	import Nav from '$lib/Nav.svelte';

	async function logout() {
		await fetch('/logout', {
			method: 'POST'
		});
		window.location.reload();
	}
</script>

<Nav on:click={logout} />
<slot />
