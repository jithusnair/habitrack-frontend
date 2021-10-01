<script>
	import { ToastNotification, Loading, Button, Tooltip } from 'carbon-components-svelte';
	import dayjs from 'dayjs';
	import HabitStreak from '../molecules/HabitStreakNew.svelte';
	import { session } from '$app/stores';
	import { apiURL } from '$lib/envVariables';

	/**
	 * Headers and rows are an array of {key, value} pairs
	 * Keys being the keys to be used by rows. And value
	 * being header display labels.
	 */
	let headers = [];
	let rows = [];

	let loading = false;
	let errorMessage = '';
	let noResults = true;

	let startOfWeek = dayjs().startOf('week').format();
	let endOfWeek = dayjs().endOf('week').format();

	// function calculateMonths(month) {
	// 	months = [];
	// 	for (let i = 0; i <= month; i++) {
	// 		months.push(allMonths[i]);
	// 	}
	// 	months = [...months];
	// }

	// function calculateYears(createdDate) {
	// 	let currentYear = dayjs().get('year');
	// 	let createdYear = dayjs(createdDate).get('year');

	// 	let yearsArr = [];
	// 	for (let i = currentYear, j = 0; i >= createdYear; i--, j++) {
	// 		let obj = {};
	// 		obj.id = j;
	// 		obj.text = i;
	// 		yearsArr.push(obj);
	// 	}

	// 	return yearsArr;
	// }

	function createHeader() {
		headers = [
			{ key: 'title', value: 'Habit' },
			{ key: 'Mon', value: 'Mon' },
			{ key: 'Tue', value: 'Tue' },
			{ key: 'Wed', value: 'Wed' },
			{ key: 'Thu', value: 'Thu' },
			{ key: 'Fri', value: 'Fri' },
			{ key: 'Sat', value: 'Sat' },
			{ key: 'Sun', value: 'Sun' },
			{ key: 'total', value: 'Total' }
		];
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

			rows = data.map((habit, index, rows) => {
				let obj = {};
				obj.id = habit.id;
				obj.title = habit.title;
				obj.total = habit.total;

				let completedDates = habit.completed_dates;
				if (completedDates) {
					for (let i = 0; i < completedDates.length; i++) {
						obj[dayjs(completedDates[i]).format('ddd')] = true;
					}
				}
				obj.enabledDate = dayjs().format('ddd');
				return obj;
			});
		} catch (error) {
			console.error(error);
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
		let day = event.detail.date;

		let weekToNumberMap = {
			Sun: 0,
			Mon: 1,
			Tue: 2,
			Wed: 3,
			Thu: 4,
			Fri: 5,
			Sat: 6
		};

		let date = dayjs().set('day', weekToNumberMap[day]).startOf('day');

		let method = event.detail.method;
		if (method === 'patch') {
			await postStreak(habitId, date.format());
		} else if (method === 'delete') {
			await deleteStreak(habitId, date.format(), date.endOf('day').format());
		}
		await getStreaks(startOfWeek, endOfWeek);
	}

	createHeader(dayjs().get('date'));

	getStreaks(startOfWeek, endOfWeek);
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
	<HabitStreak {rows} {headers} on:toggleHabit={toggleHabit} />
{/if}
<!-- <Loading active={loading} /> -->

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
		align-items: center;
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
		place-content: center;
		justify-items: center;
	}
</style>
