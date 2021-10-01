<script>
	/**
	 * This component is used to create, edit or delete a habit.
	 * @component
	 */
	import Form from 'carbon-components-svelte/src/Form/Form.svelte';
	import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
	import Button from 'carbon-components-svelte/src/Button/Button.svelte';
	import TimePicker from 'carbon-components-svelte/src/TimePicker/TimePicker.svelte';
	import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import TrashCan16 from 'carbon-icons-svelte/lib/TrashCan16/TrashCan16.svelte';

	/**
	 * Id of the habit.
	 * <em>Required for mode = 'edit'</em>
	 */
	export let id = '';
	/**
	 * Adding a new habit? Or editing a habit? <br/>
	 * <em>Delete option will only appear in edit mode</em>
	 */
	export let mode = 'add';
	/**
	 * Habit title
	 * <em>use only in edit mode</em>
	 */
	export let title = '';
	/**
	 * Habit action
	 * <em>use only in edit mode</em>
	 */
	export let action = '';
	/**
	 * Habit time
	 * <em>use only in edit mode</em>
	 */
	export let time = '';
	/**
	 * Habit location
	 * <em>use only in edit mode</em>
	 */
	export let location = '';
	/**
	 * Waiting to save? <br/>
	 * <em>Buttons will be disabled when loading</em>
	 */
	export let loading = false;

	let dispatch = createEventDispatcher();

	/**
	 * Title input element. This can be used to focus first input field.
	 */
	let firstInputElem;

	let open = false;

	let titleValue = title || '';
	let actionValue = action || '';
	let timeValue = time || '';
	let locationValue = location || '';

	$: if (firstInputElem) {
		firstInputElem.focus();
	}

	function deleteHabitOpenModal() {
		open = true;
	}

	function deleteHabitConfirmed() {
		open = false;
		dispatch('deleteHabit', id);
	}

	function submit(event) {
		event.preventDefault();
		let data = {
			id,
			title: titleValue,
			action: actionValue,
			time: timeValue,
			location: locationValue
		};
		dispatch('submit', data);
	}
</script>

<Form on:submit={submit} style="height: calc(100vh - 50px); padding: 25px;">
	<div class="container">
		<div class="titleAndBack">
			<TextInput
				bind:ref={firstInputElem}
				style="width: 50%;"
				required
				hideLabel
				labelText="Habit Title"
				placeholder="Habit Title"
				bind:value={titleValue}
			/>
			{#if mode === 'add'}
				<Button size="small" kind="secondary" href="/dashboard">Go Back</Button>
			{:else}
				<Button size="small" kind="secondary" on:click>Cancel</Button>
			{/if}
		</div>

		<p>
			<strong>I will</strong>
			<TextInput
				bind:value={actionValue}
				required
				size="sm"
				hideLabel
				labelText="Habit/Action"
				placeholder="Action"
			/>
			<strong>at</strong>
			<TimePicker
				pattern="([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]"
				required
				hideLabel
				size="xl"
				labelText="At what time"
				placeholder="hh:mm:ss"
				bind:value={timeValue}
				style="width: 125px;"
				maxlength="8"
			/>
			<strong>in</strong>
			<TextInput
				bind:value={locationValue}
				required
				hideLabel
				size="sm"
				labelText="In which location"
				placeholder="Location"
			/>
		</p>

		{#if mode === 'edit'}
			<div class="buttons">
				<Button
					aria-label="Delete"
					style="justify-self: start;"
					kind="danger-tertiary"
					iconDescription="Delete"
					icon={TrashCan16}
					on:click={deleteHabitOpenModal}
				/>
				<Button disabled={loading} style="justify-self: end;" type="submit">Submit</Button>
			</div>
		{:else}
			<Button disabled={loading} style="align-self: center; justify-self: end;" type="submit">
				Submit
			</Button>
		{/if}
	</div>
</Form>

<Modal
	bind:open
	modalHeading="Delete habit?"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:submit={deleteHabitConfirmed}
/>

<style>
	.container {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto auto auto;
		height: 100%;
	}

	.titleAndBack {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	p {
		width: 50%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: max-content auto;
		grid-template-rows: max-content max-content max-content;
		align-items: center;
		row-gap: 15px;
		column-gap: 20px;
	}

	.buttons {
		display: grid;
		grid-template-columns: auto auto;
		align-items: center;
	}
</style>
