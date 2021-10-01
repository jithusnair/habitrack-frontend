<script>
	import { ToastNotification, Loading, Button, Tooltip } from 'carbon-components-svelte';
	import Trophy32 from 'carbon-icons-svelte/lib/Trophy32';
	import dayjs from 'dayjs';
	import HabitStreak from '../molecules/HabitStreak.svelte';
	// import HabitStreak from '../molecules/HabitStreakNew.svelte';
	import { session } from '$app/stores';
	import { apiURL } from '$lib/envVariables';

	/**
	 * Headers and rows are an array of {key, value} pairs
	 * Keys being the keys to be used by rows. And value
	 * being header display labels.
	 */
	let headers = [];
	let rows = [];

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

	let years = [];
	let months = [];

	let selectedMonth = dayjs().get('month');
	let selectedYear = dayjs().get('year');
	let selectedYearIndex = 0;

	let disabledDate = null;
	let disabledMonth = null;

	let loading = false;
	let errorMessage = '';
	let noResults = true;

	function calculateMonths(month) {
		months = [];
		for (let i = 0; i <= month; i++) {
			months.push(allMonths[i]);
		}
		months = [...months];
	}

	function calculateYears(createdDate) {
		let currentYear = dayjs().get('year');
		let createdYear = dayjs(createdDate).get('year');

		let yearsArr = [];
		for (let i = currentYear, j = 0; i >= createdYear; i--, j++) {
			let obj = {};
			obj.id = j;
			obj.text = i;
			yearsArr.push(obj);
		}

		return yearsArr;
	}

	function createHeader(endingDate) {
		headers = [];
		for (let i = 0; i <= endingDate; i++) {
			if (i === 0) {
				headers.push({ key: 'title', value: 'Habit' });
				headers.push({ key: `${i + 1}`, value: `${i + 1}` });
			} else if (i === endingDate) {
				headers.push({ key: 'total', value: 'Total' });
			} else {
				headers.push({ key: `${i + 1}`, value: `${i + 1}` });
			}
		}
	}

	async function changeYear(event) {
		if (event.detail.selectedItem.id === selectedYearIndex) {
			return;
		}

		selectedYearIndex = event.detail.selectedItem.id;

		selectedYear = event.detail.selectedItem.text;

		let startingDate = dayjs()
			.set('year', selectedYear)
			.set('month', selectedMonth)
			.startOf('month');
		let endingDate = dayjs().set('year', selectedYear).set('month', selectedMonth).endOf('month');

		if (selectedYear === dayjs().get('years')) {
			calculateMonths(dayjs().get('month'));
		} else {
			calculateMonths(11);
		}

		loading = true;
		await getStreaks(startingDate.format(), endingDate.format());
		loading = false;
	}

	async function changeMonth(event) {
		selectedMonth = event.detail;
		let startingDate = dayjs().set('month', event.detail).startOf('month');
		let endingDate = dayjs().set('month', event.detail).endOf('month');

		if (event.detail === dayjs().get('month')) {
			createHeader(dayjs().get('date'));
		} else {
			createHeader(endingDate.get('date'));
		}

		loading = true;
		await getStreaks(startingDate.format(), endingDate.format());
		loading = false;
	}

	async function getStreaks(startDate, endDate) {
		// Call API
		startDate = encodeURIComponent(startDate);
		endDate = encodeURIComponent(endDate);

		loading = true;

		try {
			let resp = await fetch(
				apiURL + 'api/' + $session.user.uid + `/streaks?startDate=${startDate}&endDate=${endDate}`,
				{
					method: 'GET',
					credentials: 'include'
				}
			)
				.then((res) => res.json())
				.catch((error) => {
					return { error: error.message };
				});

			loading = false;

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}

			let data = resp;

			if (data.length === 0) {
				noResults = true;
				return;
			} else {
				noResults = false;
			}

			years = calculateYears(data[0].created_on);

			if (data[0].created_on) {
				let createdOn = dayjs(data[0].created_on);
				let createdOnMonth = createdOn.get('month');
				let createdOnYear = createdOn.get('year');

				if (selectedYear === createdOnYear) {
					disabledMonth = createdOnMonth;
				} else {
					disabledMonth = null;
				}
			}

			rows = data.map((habit) => {
				let obj = {};
				obj.id = habit.id;
				obj.title = habit.title;
				obj.total = habit.total;
				let completedDates = habit.completed_dates;
				if (completedDates.length && dayjs(completedDates[0]).get('year') === selectedYear) {
					for (let i = 0; i < completedDates.length; i++) {
						obj[dayjs(completedDates[i]).get('date')] = true;
					}
				}
				let createdOn = dayjs(habit.created_on);
				let createdOnMonth = createdOn.get('month');
				let createdOnYear = createdOn.get('year');

				// console.log(createdOn.formats(), createdOnMonth, createdOnYear, selectedMonth);
				if (selectedYear === createdOnYear) {
					if (selectedMonth === createdOnMonth) {
						if (createdOn.get('date') - 1 !== 0) {
							obj.disabledDate = createdOn.get('date') - 1;
						}
					} else if (selectedMonth < createdOnMonth) {
						obj.disabledDate = 31; // all 31 dates to be disabled
					}
				} else if (selectedYear < createdOnYear) {
					obj.disabledDate = 31;
				} else {
					obj.disabledDate = null;
				}
				return obj;
			});
		} catch (error) {
			errorMessage = error.message;
		}
	}

	async function deleteStreak(habitId, startDate, endDate) {
		loading = true;
		startDate = encodeURIComponent(startDate);
		endDate = encodeURIComponent(endDate);

		try {
			let resp = await fetch(
				apiURL +
					'api/' +
					$session.user.uid +
					`/streaks/${habitId}?startDate=${startDate}&endDate=${endDate}`,
				{
					method: 'DELETE',
					credentials: 'include'
				}
			).catch((error) => {
				return { error: error.message };
			});

			loading = false;

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}
		} catch (error) {
			loading = false;
			errorMessage = error.message;
		}
	}

	async function postStreak(habitId, date) {
		try {
			loading = true;
			let resp = await fetch(apiURL + 'api/' + $session.user.uid + '/streaks', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify({
					hid: habitId,
					completed_on: date
				}),
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				}
			})
				.then((res) => res.json())
				.catch((error) => {
					loading = false;
					return { error: error.message };
				});

			loading = false;

			if (resp.error) {
				errorMessage = resp.error;
				return;
			}
		} catch (error) {
			loading = false;
			errorMessage = error.message;
		}
	}

	async function toggleHabit(event) {
		let habitId = event.detail.habitId;
		let date = event.detail.date;
		date = dayjs().set('month', selectedMonth).set('date', date).startOf('day');

		let method = event.detail.method;
		if (method === 'patch') {
			await postStreak(habitId, date.format());
		} else if (method === 'delete') {
			await deleteStreak(habitId, date.format(), date.endOf('day').format());
		}
		await getStreaks(
			dayjs().set('month', selectedMonth).startOf('month').format(),
			dayjs().set('month', selectedMonth).endOf('month').format()
		);
	}

	calculateMonths(dayjs().get('months'));
	createHeader(dayjs().get('date'));

	getStreaks(dayjs().set('month', selectedMonth).startOf('month').format(), dayjs().format());
</script>

{#if noResults && !loading}
	<div class="noHabits">
		<h1>No habits found</h1>
		<Button style="margin-top: 25px;" href="/dashboard/habits">Add a new Habit</Button>
	</div>
{:else}
	<div class="addBtn">
		<h1>Habit Streak</h1>
		<Button href="/dashboard/habits">Add Habit</Button>
	</div>
	<HabitStreak
		{disabledMonth}
		{selectedMonth}
		selectedYear={selectedYearIndex}
		{years}
		{months}
		{rows}
		{headers}
		on:change={changeMonth}
		on:toggleHabit={toggleHabit}
		on:select={changeYear}
	/>
{/if}
<Loading active={loading} />

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
	.addBtn {
		display: flex;
		justify-content: space-between;
		margin: 15px 0;
		padding: 0 16px;
	}

	h1 {
		line-height: 1;
	}

	.notification {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.noHabits {
		display: grid;
		text-align: center;
		height: calc(100vh - 48px);
		place-items: center;
	}
</style>
