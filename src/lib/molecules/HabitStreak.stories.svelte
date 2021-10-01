<script>
	import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
	import HabitStreak from './HabitStreak.svelte';
	import dayjs from 'dayjs';

	let allMonths = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	let obj = {};
	obj.id = 1;
	obj.title = 'Jogging';
	obj.total = 0;

	let rows = [];
	for (let i = 1; i <= dayjs().date(7); i++) {
		if (i % 3 === 0) {
			obj[i] = true;
			obj.total += 1;
		} else obj[i] = false;
	}

	let headers = [];
	for (let i = 0; i <= dayjs().date(7); i++) {
		if (i === 0) {
			headers.push({ key: 'habit', value: 'Habit' });
			headers.push({ key: `${i + 1}`, value: `${i + 1}` });
		} else if (i === dayjs().date()) {
			headers.push({ key: 'total', value: 'Total' });
		} else {
			headers.push({ key: `${i + 1}`, value: `${i + 1}` });
		}
	}

	let months = [];
	for (let i = 0; i <= dayjs().get('months'); i++) {
		months.push(allMonths[i]);
	}

	rows.push(obj);
</script>

<Meta
	title="Habit Streak"
	component={HabitStreak}
	argTypes={{
		rows: { control: 'object' },
		headers: { control: 'object' },
		months: { control: 'object' },
		selectedMonth: { control: 'number' },
		disabledMonth: { control: 'number' }
	}}
/>

<Template let:args>
	<HabitStreak {...args} />
</Template>

<Story
	name="Default"
	args={{ rows, headers, months, selectedMonth: dayjs().get('month'), disabledMonth: 1 }}
/>
