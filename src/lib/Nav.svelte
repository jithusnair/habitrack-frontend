<script>
	import { Tile, OverflowMenu, OverflowMenuItem, Button, Theme } from 'carbon-components-svelte';
	import UserAvatarFilled32 from 'carbon-icons-svelte/lib/UserAvatarFilled32';
	import TrophyFilled16 from 'carbon-icons-svelte/lib/TrophyFilled16';

	import { session } from '$app/stores';

	let toggled = false;
</script>

<Tile style="min-height: 40px; padding: 0;">
	<div class="container">
		<div class="websiteAndScoreboard">
			<a class="titleBig" href="/dashboard"> HABITRACK </a>
			<a class="titleSmall" href="/dashboard"> HTK </a>

			<a class="scoreboardLarge" href="/dashboard/scoreboard">Scoreboard</a>
			<a class="scoreboardSmall" href="/dashboard/scoreboard">
				<TrophyFilled16 />
			</a>
		</div>
		<div class="rightSide">
			<Theme
				render="select"
				select={{ themes: ['white', 'g90', 'g100'], labelText: '', inline: true }}
			/>
			<OverflowMenu icon={UserAvatarFilled32} size="xl" flipped>
				<p>
					Hi, {$session.user.fullName}
				</p>
				<OverflowMenuItem text="Logout" on:click />
			</OverflowMenu>
		</div>
	</div>
</Tile>

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0px 16px;
	}

	.titleBig {
		display: inline-block;
	}

	.titleSmall {
		display: none;
	}

	.websiteAndScoreboard {
		display: flex;
		column-gap: 25px;
		align-items: center;
	}

	.scoreboardLarge {
		font-size: 1rem;
	}

	.scoreboardSmall {
		display: none;
	}

	.rightSide {
		width: 200px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	a {
		font-size: 1.2rem;
		font-weight: bold;
		text-decoration: none;
		color: unset;
	}

	p {
		width: 100%;
		align-items: center;
		margin: 8px 0;
	}

	@media only screen and (max-width: 672px) {
		.container {
			padding: 0 8px;
		}

		.titleBig {
			display: none;
		}

		.titleSmall {
			display: inline-block;
		}

		.scoreboardLarge {
			display: none;
		}

		.scoreboardSmall {
			display: inline-block;
		}

		.rightSide {
			width: 150px;
		}
	}
</style>
