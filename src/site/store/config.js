export const state = () => ({
	development: process.env.development,
	version: '',
	URL: process.env.development ? 'http://localhost:5000' : '/',
	baseURL: `${process.env.development ? 'http://localhost:5000' : ''}/api`,
	serviceName: '',
	maxUploadSize: 0,
	chunkSize: 0,
	publicMode: false,
	userAccounts: false
});

export const actions = {
	async fetchSettings({ commit }) {
		// ! This is causing problems
		// const response = await this.$axios.$get('service/config');
		// commit('setSettings', response);
		// return response;

		// Return a default for now until this is fixed
		commit('setSettings', {
			version: '4.0.2',
			serviceName: 'EternalRage',
			maxUploadSize: 5000,
			filenameLength: 12,
			albumLinkLength: 6,
			chunkSize: 90,
			publicMode: false,
			userAccounts: false,
			metaThemeColor: '#3498db',
			metaDescription: 'Image hosting for Internal EternalRage Stuff',
			metaKeywords: 'EternalRage,Roleplay',
			domain: 'https://images.eternalrage.net',
			deleteExpiredFilesEnabled: true,
			deleteExpiredFilesAfter: 10080
		});
	}
};

export const mutations = {
	setSettings(state, { config }) {
		state.version = `v${config.version}`;
		state.serviceName = config.serviceName;
		state.maxUploadSize = config.maxUploadSize;
		state.filenameLength = config.filenameLength;
		state.albumLinkLength = config.albumLinkLength;
		state.chunkSize = config.chunkSize;
		state.publicMode = config.publicMode;
		state.userAccounts = config.userAccounts;
		state.URL = config.domain;
		const lastChar = config.domain.substr(-1);
		if (lastChar === '/') {
			state.baseURL = `${config.domain}api`;
		} else {
			state.baseURL = `${config.domain}/api`;
		}
	}
};
