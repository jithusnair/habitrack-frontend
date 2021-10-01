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
	import Login from '$lib/organisms/Login.svelte';
</script>

<div class="container">
	<Login />

	<div class="links">
		<a href="/forgot">Forgot Password</a>
		<a href="/register">SignUp</a>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: grid;
		place-content: center;
	}

	.links {
		width: 100%;
		display: flex;
		justify-content: space-between;
		column-gap: 10px;
		margin-top: 1rem;
	}
</style>
