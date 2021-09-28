import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED } from '../constants/actionTypes';

const defaultState = {
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        rawData: action.payload[0],
        encryptedData: action.payload[1],
        sidebarTab: action.sidebarTab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
