// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {combineReducers} from 'redux';

import {UserTypes} from 'mattermost-redux/action_types';
import type {GenericAction} from 'mattermost-redux/types/actions';

import {ActionTypes} from 'utils/constants';

function menuActions(state: {[postId: string]: {[actionId: string]: {text: string; value: string}}} = {}, action: GenericAction) {
    switch (action.type) {
    case ActionTypes.SELECT_ATTACHMENT_MENU_ACTION: {
        const nextState = {...state};
        if (nextState[action.data.postId]) {
            nextState[action.data.postId] = {
                ...nextState[action.data.postId],
                ...action.data.actions,
            };
        } else {
            nextState[action.data.postId] = action.data.actions;
        }
        return nextState;
    }
    case UserTypes.LOGOUT_SUCCESS:
        return {};
    default:
        return state;
    }
}

export default combineReducers({
    menuActions,
});