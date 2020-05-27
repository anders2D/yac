
import { Record } from 'immutable';

import * as types from "./action-types";

export const chatState = new Record({
    currentUser: null,
    isLoading: true,
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
})
export function chatReducer(state = new chatState(), action) {
    switch (action.type) {
        case types.SET_USER:
            return {
                ...state, currentUser: action.payload,
                isLoading: false
            }
        case types.CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}
