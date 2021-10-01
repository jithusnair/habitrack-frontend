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
	import Dropdown from 'carbon-components-svelte/src/Dropdown/Dropdown.svelte';
	import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
	import ContentSwitcher from 'carbon-components-svelte/src/ContentSwitcher/ContentSwitcher.svelte';
	import Switch from 'carbon-components-svelte/src/ContentSwitcher/Switch.svelte';
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
	/**
	 * Array of month strings
	 */
	export let months = [];
	/**
	 * Array of years
	 */
	export let years = [];
	/**
	 * Current month as number. <br/>
	 * <em>Eg:- September will be <code>8</code></em>
	 */
	export let selectedMonth = 0;
	/**
	 * Index of year in 'years' prop
	 */
	export let selectedYear = 0;
	/**
	 * Months (including and before) disabled
	 */
	export let disabledMonth = null;

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
		<div class="years">
			<Dropdown titleText="Year" selectedIndex={selectedYear} items={years} on:select />
		</div>
		<div class="months">
			<p>Months</p>
			<ContentSwitcher selectedIndex={selectedMonth} size="sm" on:change>
				{#each months as month, i}
					<Switch text={month} disabled={disabledMonth !== null && disabledMonth > i} />
				{/each}
			</ContentSwitcher>
		</div>
		<DataTable {headers} {rows} style="width: 100%; overflow-x: scroll;">
			<span slot="cell" let:row let:cell>
				{#if cell.key === 'title'}
					<a href={'dashboard/habits/' + row.id}>{cell.value}</a>
				{:else if cell.key === 'total'}
					<strong>{cell.value}</strong>
				{:else}
					<Checkbox
						on:click={(event) => habitToggle(event, row.id, cell.key, cell.value)}
						checked={cell.value ? true : false}
						disabled={row.disabledDate !== null && row.disabledDate >= cell.key}
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

	.years {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 10px;
	}

	.months {
		display: grid;
		grid-template-columns: 82px 1fr;
		align-items: center;
		column-gap: 10px;
		overflow-x: scroll;
	}

	.months p {
		padding: 0 16px;
		font-weight: bold;
		margin: 0;
	}
</style>
