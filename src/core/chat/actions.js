import * as types from "./action-types"
/* User Actions */
export function setUser(user){
    return {
        type: types.SET_USER,
        payload: user
    }
}
export function clearUser()  {
    return {
        type: types.CLEAR_USER
    }
}
/* Channel Actions */
export function setCurrentChannel(channel) {
    return {
        type: types.SET_CURRENT_CHANNEL,
        payload: channel
    }
}
export function setPrivateChannel (isPrivateChannel ) {
    return {
        type: types.SET_PRIVATE_CHANNEL,
        payload: isPrivateChannel
    }
}
export function setUserPosts (userPosts) {
    return {
        type: types.SET_USER_POSTS,
        payload: userPosts

    };
};


/* Colors Actions */
export function setColors (primaryColor, secondaryColor) {
    return {
        type: types.SET_COLORS,
        payload: {
            primaryColor,
            secondaryColor
        }
    };
};
