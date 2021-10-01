<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import Login from './Login.svelte';
</script>

<Meta
	title="User Login"
	component={Login}
	argTypes={{
		onSubmit: { action: 'Submit login form' }
	}}
/>

<Template let:args>
	<Login {...args} />
</Template>

<Story name="Default" args={{}} />
