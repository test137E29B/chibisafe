<template>
	<b-field label="Add some albums">
		<b-taginput
			:value="selectedAlbums"
			:data="filteredAlbums"
			class="chibisafe albuminp"
			ellipsis
			icon="label"
			placeholder="Add to an album"
			autocomplete
			allow-new
			@typing="getFilteredAlbums"
			@add="albumAdded"
			@remove="albumRemoved" />
	</b-field>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Albuminfo',
	props: {
		imageId: {
			'type': Number,
			'default': 0
		},
		imageAlbums: {
			'type': Array,
			'default': () => []
		}
	},
	data() {
		return {
			filteredAlbums: []
		};
	},
	computed: {
		...mapState({
			albums: state => state.albums.list
		}),
		selectedAlbums() { return this.imageAlbums.map(e => e.name); },
		lowercaseAlbums() { return this.imageAlbums.map(e => e.name.toLowerCase()); }
	},
	created() {
		this.orderedAlbums = this.getOrderedAlbums();
		// we're sorting here instead of computed because we want sort on creation
		// then the array's values should be frozen
		this.selectedOptions = this.imageAlbums.map(e => e.id);
	},
	methods: {
		getFilteredAlbums(str) {
			this.filteredAlbums = this.albums.map(e => e.name).filter(e => {
				// check if the search string matches any of the albums
				const sanitezedAlbumName = e.toString().toLowerCase();
				const matches = sanitezedAlbumName.indexOf(str.toLowerCase()) >= 0;

				// check if this album is already added to our image, to avoid duplicates
				if (matches) {
					const foundIndex = this.lowercaseAlbums.indexOf(sanitezedAlbumName);
					if (foundIndex === -1) {
						return true;
					}
				}

				return false;
			});
		},
		async albumAdded(album) {
			if (!album) return;

			// normalize into NFC form (diactirics and moonrunes)
			// replace all whitespace with _
			// replace multiple __ with a single one
			album = album.normalize('NFC').replace(/\s/g, '_').replace(/_+/g, '_');

			const foundIndex = this.albums.findIndex(({ name }) => name === album);

			if (foundIndex === -1) {
				await this.$handler.executeAction('albums/createAlbum', album);
			}
			const albumId = this.albums.find(({ name }) => name === album).id;

			this.$handler.executeAction('images/addToAlbum', {
				albumId,
				fileId: this.imageId
			});
		},
		albumRemoved(album) {
			const albumId = this.albums.find(({ name }) => name === album).id;
			this.$handler.executeAction('images/removeFromAlbum', {
				albumId,
				fileId: this.imageId
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '~/assets/styles/_colors.scss';

.albuminp {
	::v-deep .dropdown-content {
		background-color: #323846;
		box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	}
}
</style>
