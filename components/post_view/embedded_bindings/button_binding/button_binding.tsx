// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {AppBinding, AppCall} from 'mattermost-redux/types/apps';
import {ActionResult} from 'mattermost-redux/types/actions';
import {AppBindingLocations, AppExpandLevels} from 'mattermost-redux/constants/apps';
import {Post} from 'mattermost-redux/types/posts';

import Markdown from 'components/markdown';
import LoadingWrapper from 'components/widgets/loading/loading_wrapper';
import {createCallRequest} from 'utils/apps';

type Props = {
    binding: AppBinding;
    userId: string;
    post: Post;
    actions: {
        doAppCall: (call: AppCall) => Promise<ActionResult>;
    };
}

type State = {
    executing: boolean;
}

export default class ButtonBinding extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            executing: false,
        };
    }

    handleClick = async () => {
        const {binding, post, userId} = this.props;
        if (!binding.call) {
            return;
        }

        const call = createCallRequest(
            binding.call,
            userId,
            binding.app_id,
            AppBindingLocations.IN_POST + '/' + binding.location,
            {post: AppExpandLevels.EXPAND_ALL},
            post.channel_id,
            post.id,
        );
        this.setState({executing: true});
        await this.props.actions.doAppCall(call);
        this.setState({executing: false});
    }

    render() {
        const {binding} = this.props;
        let customButtonStyle;

        if (!binding.call) {
            return null;
        }

        return (
            <button
                key={binding.location}
                onClick={this.handleClick}
                style={customButtonStyle}
            >
                <LoadingWrapper
                    loading={this.state.executing}
                >
                    <Markdown
                        message={binding.label}
                        options={{
                            mentionHighlight: false,
                            markdown: false,
                            autolinkedUrlSchemes: [],
                        }}
                    />
                </LoadingWrapper>
            </button>
        );
    }
}