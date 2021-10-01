<script>
	import {
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody,
		Button
	} from 'carbon-components-svelte';

	export let habitDetails = {};
</script>

<div>
	<h1>{habitDetails.title}</h1>

	<StructuredList style="margin-bottom: 50px;">
		<StructuredListHead>
			<StructuredListRow>
				<StructuredListCell head>Action</StructuredListCell>
				<StructuredListCell>{habitDetails.action}</StructuredListCell>
			</StructuredListRow>
		</StructuredListHead>
		<StructuredListBody>
			<StructuredListRow>
				<StructuredListCell head>Time</StructuredListCell>
				<StructuredListCell>{habitDetails.time}</StructuredListCell>
			</StructuredListRow>
			<StructuredListRow>
				<StructuredListCell head>Location</StructuredListCell>
				<StructuredListCell>{habitDetails.location}</StructuredListCell>
			</StructuredListRow>
		</StructuredListBody>
	</StructuredList>

	<Button on:click>Edit</Button>
</div>

<style>
	div {
		width: 100%;
		margin-bottom: 50px;
	}

	h1 {
		margin: 15px 0;
	}
</style>
