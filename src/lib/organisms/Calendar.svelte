<script>
	import Calendar from '../molecules/Calendar.svelte';
	import { session } from '$app/stores';
	import { apiURL } from '$lib/envVariables';
	import dayjs from 'dayjs';

	export let habitId = '';

	export let startDate = dayjs();

	export let selectedDates = [];

	let loading = false;

	async function getStreaks(startDate, endDate) {
		// Call API
		startDate = encodeURIComponent(startDate);
		endDate = encodeURIComponent(endDate);

		loading = true;

		try {
			let resp = await fetch(
				apiURL +
					'api/' +
					$session.user.uid +
					`/streaks?startDate=${startDate}&endDate=${endDate}&hid=${habitId}`,
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

			selectedDates = [...resp[0].completed_dates];
		} catch (error) {
			console.error(error);
			errorMessage = error.message;
		}
	}

	async function previous() {
		startDate = startDate.subtract(1, 'month');
		await getStreaks(startDate.startOf('month').format(), startDate.endOf('month').format());
	}

	async function next() {
		startDate = startDate.add(1, 'month');
		await getStreaks(startDate.startOf('month').format(), startDate.endOf('month').format());
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
		let date = event.detail.date;
		date = dayjs().set('date', date).startOf('day');

		let method = event.detail.method;
		if (method === 'patch') {
			await postStreak(habitId, date.format());
		} else if (method === 'delete') {
			await deleteStreak(habitId, date.format(), date.endOf('day').format());
		}
		await getStreaks(
			dayjs(startDate).startOf('month').format(),
			dayjs(startDate).endOf('month').format()
		);
	}

	getStreaks(startDate.startOf('month').format(), startDate.endOf('month').format());
</script>

<Calendar
	{startDate}
	{loading}
	{selectedDates}
	on:prev={previous}
	on:next={next}
	on:toggleHabit={toggleHabit}
/>

<style>
</style>
