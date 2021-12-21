// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import {getEmojiImageUrl} from 'mattermost-redux/utils/emoji_utils';
import {Emoji, EmojiCategory} from 'mattermost-redux/types/emojis';

import {EmojiCursor} from 'components/emoji_picker/types';

import imgTrans from 'images/img_trans.gif';
import {EMOJI_LAZY_LOAD_SCROLL_DEBOUNCE} from 'components/emoji_picker/constants';

interface Props {
    emoji: Emoji;
    rowIndex: number;
    categoryIndex: number;
    categoryName: EmojiCategory;
    emojiIndex: number;
    isSelected?: boolean;
    onClick: (emoji: Emoji) => void;
    onMouseOver: (cursor: EmojiCursor) => void;
}

function EmojiPickerItem({emoji, rowIndex, categoryIndex, categoryName, emojiIndex, isSelected, onClick, onMouseOver}: Props) {
    const {formatMessage} = useIntl();

    const handleMouseOver = () => {
        onMouseOver({rowIndex, categoryIndex, categoryName, emojiIndex, emoji});
    };

    const debouncedMouseOver = useCallback(
        debounce(handleMouseOver, EMOJI_LAZY_LOAD_SCROLL_DEBOUNCE, {
            leading: true,
            trailing: true,
        }), []);

    const handleClick = () => {
        onClick(emoji);
    };

    const emojiImage = useMemo(() => {
        if (emoji.category && emoji.category !== 'custom') {
            const emojiName = emoji.short_name ? emoji.short_name : emoji.name;

            let spriteClassName = 'emojisprite';
            spriteClassName += ' emoji-category-' + emoji.category;
            spriteClassName += ' emoji-' + emoji.image;

            return (
                <img
                    alt={'emoji image'}
                    data-testid={emoji.short_names}
                    onMouseOver={debouncedMouseOver}
                    src={imgTrans}
                    className={spriteClassName}
                    onClick={handleClick}
                    id={`emoji-${emoji.image}`}
                    aria-label={formatMessage(
                        {
                            id: 'emoji_picker_item.emoji_aria_label',
                            defaultMessage: '{emojiName} emoji',
                        },
                        {
                            emojiName: emojiName.replace(/_/g, ' '),
                        },
                    )}
                    role='button'
                />
            );
        }

        return (
            <img
                alt={'custom emoji image'}
                onMouseOver={debouncedMouseOver}
                src={getEmojiImageUrl(emoji)}
                className={'emoji-category--custom'}
                onClick={handleClick}
                loading='lazy'
            />
        );
    }, [emojiIndex, categoryIndex]);

    const itemClassName = classNames('emoji-picker__item', {
        selected: isSelected,
    });

    return (
        <div className={itemClassName}>
            <div data-testid='emojiItem'>{emojiImage}</div>
        </div>
    );
}

function arePropsEqual(prevProps: Props, nextProps: Props) {
    return (
        prevProps.isSelected === nextProps.isSelected
    );
}

export default memo(EmojiPickerItem, arePropsEqual);
