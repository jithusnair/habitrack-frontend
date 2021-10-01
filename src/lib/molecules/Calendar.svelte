<script>
	import { createEventDispatcher } from 'svelte';
	import CaretLeft32 from 'carbon-icons-svelte/lib/CaretLeft32';
	import CaretRight32 from 'carbon-icons-svelte/lib/CaretRight32';
	import dayjs from 'dayjs';

	export let startDate = dayjs();

	export let loading = false;

	export let selectedDates = [];

	$: datesSelected = convertToObj(selectedDates);
	$: findBeforeAndAfter(startDate);

	let dispatch = createEventDispatcher();

	let today = dayjs();
	let nextDays = [];
	let prevDays = [];

	function convertToObj(dates) {
		let obj = {};
		for (const date of dates) {
			obj[dayjs(date).get('date')] = date;
		}

		return obj;
	}

	function next() {
		dispatch('next');
	}

	function prev() {
		dispatch('prev');
	}

	function findBeforeAndAfter(startDate) {
		if (!startDate) return;
		let startDayOfMonth = startDate.startOf('month').day(); // 0 for sunday
		let endDayOfMonth = startDate.endOf('month').day();

		let daysInPrevMonth = startDate.subtract(1, 'month').daysInMonth();

		prevDays = [];
		for (let i = daysInPrevMonth, j = 0; j < startDayOfMonth; i--, j++) {
			prevDays.push(i);
		}

		prevDays = [...prevDays].reverse();

		nextDays = calculateNextDaysRows(startDayOfMonth, endDayOfMonth, startDate.daysInMonth());
	}

	// this also keeps the number of rows constant
	function calculateNextDaysRows(startDayOfMonth, endDayOfMonth, daysInMonth) {
		let numberOfDaysInFirstRow = 7 - startDayOfMonth;
		let restOfTheRows = Math.floor((daysInMonth - numberOfDaysInFirstRow) / 7);
		restOfTheRows += (daysInMonth - numberOfDaysInFirstRow) % 7 ? 1 : 0;

		let totalRows = restOfTheRows + 1; // 1 indicates the first row
		if (totalRows === 5) {
			return [...Array(13 - endDayOfMonth)].map((value, index) => {
				return index + 1;
			});
		} else if (totalRows === 6) {
			return [...Array(6 - endDayOfMonth)].map((value, index) => {
				return index + 1;
			});
		}
	}

	function habitToggle(date, value) {
		let method = 'patch';
		if (value) {
			method = 'delete';
		}

		dispatch('toggleHabit', { method, date });
	}

	findBeforeAndAfter();
</script>

<div class="container">
	<p class="monthAndYear">
		<span class="prev" on:click={prev}>
			<CaretLeft32 />
		</span>
		{#if loading}
			<span class="loading" />
		{:else}
			{startDate.format('MMMM')}, {startDate.format('YYYY')}
		{/if}
		<span class="next" on:click={next}>
			<CaretRight32 />
		</span>
	</p>
	<p class="daysOfWeek">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayOfWeek}
			<span class="week">
				{dayOfWeek}
			</span>
		{/each}
		{#if loading}
			{#each [...Array(42).keys()] as item}
				<span class="loading" />
			{/each}
		{:else}
			{#each prevDays as prevDay}
				<span class="outsideDate">{prevDay}</span>
			{/each}
			{#each [...Array(startDate.daysInMonth() + 1).keys()].slice(1) as day}
				<span
					on:click={() => habitToggle(day, datesSelected[day])}
					class="currentMonthDate"
					class:selected={datesSelected[day] ? true : false}
				>
					{day}
				</span>
			{/each}
			{#each nextDays as nextDay}
				<span class="outsideDate">{nextDay}</span>
			{/each}
		{/if}
	</p>
</div>

<style>
	.container {
		width: max-content;
		background-color: var(--cds-ui-01, #f4f4f4);
		padding: 0.5rem;
	}

	.monthAndYear {
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		align-items: center;
		justify-items: center;
		font-size: 1.5rem;
		padding: 0 0.5rem;
		margin-bottom: 1rem;
	}

	.selected {
		color: var(--cds-text-04, #fff);
		background-color: var(--cds-interactive-01, #0f62fe);
	}

	span.prev,
	span.next {
		font-size: 1rem;
		cursor: pointer;
		width: 32px;
		height: 32px;
	}

	.daysOfWeek {
		display: grid;
		grid-template-columns: repeat(7, 50px);
		grid-template-rows: repeat(7, 50px);
		justify-content: center;
		row-gap: 1rem;
		column-gap: 1rem;
		color: var(--cds-text-01, #161616);
	}

	.week {
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.week,
	.currentMonthDate,
	.outsideDate {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.currentMonthDate {
		cursor: pointer;
	}

	.currentMonthDate:hover:not(.selected) {
		background-color: var(--cds-hover-ui, #e5e5e5);
	}

	.outsideDate {
		opacity: 0.5;
	}

	.next:hover,
	.prev:hover {
		background-color: var(--cds-hover-ui, #e5e5e5);
	}

	.daysOfWeek .loading {
		position: relative;
		margin: 0.25rem;
		border: none;
		background: var(--cds-skeleton-01, #e5e5e5);
		box-shadow: none;
		pointer-events: none;
	}

	.monthAndYear .loading {
		position: relative;
		background: var(--cds-skeleton-01, #e5e5e5);
		width: 150px;
		height: 2rem;
	}

	.loading::before {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-animation: 3s ease-in-out infinite skeleton;
		animation: 3s ease-in-out infinite skeleton;
		background: var(--cds-skeleton-02, #c6c6c6);
		content: '';
		will-change: transform-origin, transform, opacity;
	}

	@media only screen and (max-width: 672px) {
		.daysOfWeek {
			display: grid;
			grid-template-columns: repeat(7, 40px);
			grid-template-rows: repeat(7, 40px);
			justify-content: center;
			row-gap: 0.5rem;
			column-gap: 0.5rem;
			color: var(--cds-text-01, #161616);
		}
	}
</style>
