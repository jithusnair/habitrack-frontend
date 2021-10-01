<script>
	/**
	 * This component shows the habit streaks as checkboxes.
	 * Checkboxes show the days where habit was completed.
	 * Checkboxes can be toggled. <br/>
	 * <em>Note: Toggling won't work until API call is completed and data is set from outside.
	 * Hence, checkbox won't toggle since event is prevented from default behaviour.
	 * </em>
	 * @component
	 */
	import DataTable from 'carbon-components-svelte/src/DataTable/DataTable.svelte';
	import DataTableSkeleton from 'carbon-components-svelte/src/DataTable/DataTableSkeleton.svelte';
	import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
	import { createEventDispatcher } from 'svelte';

	/**
	 * Rows are an array of {key, value} pairs.
	 * <em>keys are numbers and values are true or false</em>
	 */
	export let rows = [];
	/**
	 * Headers are an array of {key, value} pairs.
	 */
	export let headers = [];

	let dispatch = createEventDispatcher();

	/**
	 * Function is used to call dispatch event with
	 * details to toggle the habit checkbox for the
	 * required day.
	 *
	 * @param {object} event
	 * @param {number} row
	 * @param {string} cell
	 */
	function habitToggle(event, rowId, date, value) {
		event.preventDefault();

		let method = 'patch';
		if (value) {
			method = 'delete';
		}

		dispatch('toggleHabit', { habitId: rowId, method, date });
	}
</script>

<div class="container">
	{#if rows.length !== 0}
		<DataTable {headers} {rows} style="overflow-x: scroll;">
			<span slot="cell" let:row let:cell>
				{#if cell.key === 'title'}
					<a href={'dashboard/habits/' + row.id}>{cell.value}</a>
				{:else if cell.key === 'total'}
					<strong>{cell.value}</strong>
				{:else}
					<Checkbox
						on:click={(event) => habitToggle(event, row.id, cell.key, cell.value)}
						checked={cell.value ? true : false}
						disabled={row.enabledDate !== cell.key}
					/>
				{/if}
			</span>
		</DataTable>
	{:else}
		<DataTableSkeleton showHeader={false} showToolbar={false} />
	{/if}
</div>

<style>
	.container {
		padding: 0 16px;
	}
</style>
