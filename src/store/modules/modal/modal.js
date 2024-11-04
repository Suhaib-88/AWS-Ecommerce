import { sections } from '@/partials/AppModal/DemoGuide/config';
import { isMobileModalMediaQueryList, APP_MODAL_ID, Modals } from '@/partials/AppModal/config';

export const modal = {
  state: () => ({
    isMobile: isMobileModalMediaQueryList.matches,
    openModal: null,
  }),
  mutations: {
    setIsMobile: (state, isMobile) => (state.isMobile = isMobile),
    setOpenModal: (state, newOpenModal) => (state.openModal = newOpenModal),
  },
  actions: {
    toggleIsMobile: ({ commit, state }) => commit('setIsMobile', !state.isMobile),
    openModal: ({ commit }, name) => {
      if (name === Modals.DemoGuide) {
        commit('setOpenModal', { name, selectedArticle: sections[0].articles[0] });
      } else {
        commit('setOpenModal', { name });
      }
    },
    closeModal: ({ commit }) => commit('setOpenModal', null),
  },
};
