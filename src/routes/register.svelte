<script context="module">
	export async function load({ page, fetch, session, context }) {
		if (session.user) {
			return {
				status: 302,
				redirect: '/dashboard'
			};
		}
		return {
			props: { ...session }
		};
	}
</script>

<script>
	import Register from '$lib/organisms/Register.svelte';
</script>

<div class="container">
	<Register />

	<a href="/">Already a member? Login!</a>
</div>

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: grid;
		place-content: center;
	}

	a {
		display: block;
		margin-top: 1rem;
	}
</style>
