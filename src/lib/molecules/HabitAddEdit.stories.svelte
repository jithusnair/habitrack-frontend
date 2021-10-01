<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import HabitAddEdit from './HabitAddEdit.svelte';
</script>

<Meta
	title="Habit Add Edit"
	component={HabitAddEdit}
	argTypes={{
		mode: {
			control: { type: 'select', options: ['add', 'edit'] }
		},
		loading: { control: 'boolean' },
		onSubmit: { action: 'onSubmit' },
		onDeleteHabit: { action: 'delete habit' }
	}}
/>

<Template let:args>
	<HabitAddEdit {...args} on:submit={args.onSubmit} on:deleteHabit={args.onDeleteHabit} />
</Template>

<Story name="Default" args={{ mode: 'add', loading: false, errorMessage: '' }} />

<Story
	name="Edit"
	args={{
		mode: 'edit',
		loading: false,
		title: 'Jogging',
		habitAction: 'go for jog',
		location: 'paddy field',
		time: '06:00'
	}}
/>
