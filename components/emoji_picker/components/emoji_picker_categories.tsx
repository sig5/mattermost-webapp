// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {KeyboardEvent, memo, useMemo} from 'react';

import {EmojiCategory} from 'mattermost-redux/types/emojis';

import {
    Categories,
    CategoryOrEmojiRow,
    NavigateDirection,
} from 'components/emoji_picker/types';

import {
    NAVIGATE_TO_NEXT_EMOJI,
    NAVIGATE_TO_NEXT_EMOJI_ROW,
    NAVIGATE_TO_PREVIOUS_EMOJI,
    NAVIGATE_TO_PREVIOUS_EMOJI_ROW,
} from 'components/emoji_picker/constants';
import {calculateCategoryRowIndex} from 'components/emoji_picker/utils';

import EmojiPickerCategory from 'components/emoji_picker/components/emoji_picker_category';

interface Props {
    isFiltering: boolean;
    active: EmojiCategory;
    categories: Categories;
    onClick: (categoryRowIndex: CategoryOrEmojiRow['index'], categoryIndex: number, categoryName: EmojiCategory, firstEmojiId: string) => void;
    onKeyDown: (moveTo: NavigateDirection) => void;
    focusOnSearchInput: () => void;
}

function EmojiPickerCategories({
    categories,
    isFiltering,
    active,
    onClick,
    onKeyDown,
    focusOnSearchInput,
}: Props) {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            onKeyDown(NAVIGATE_TO_NEXT_EMOJI);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            onKeyDown(NAVIGATE_TO_PREVIOUS_EMOJI);
            break;
        case 'ArrowUp':
            event.preventDefault();
            onKeyDown(NAVIGATE_TO_PREVIOUS_EMOJI_ROW);
            break;
        case 'ArrowDown':
            event.preventDefault();
            onKeyDown(NAVIGATE_TO_NEXT_EMOJI_ROW);
            break;
        }

        focusOnSearchInput();
    };

    const categoryNames = Object.keys(categories) as EmojiCategory[];
    const activeCategory = isFiltering ? categoryNames[0] : active;

    const categoryNamesDependency = Object.values(categories).map((category) => `${category.id}-${category?.emojiIds?.length}`).join(',');

    const emojiPickerCategories = useMemo(() => categoryNames.map((categoryName, index) => {
        const category = categories[categoryName];
        const categoryRowIndex = calculateCategoryRowIndex(categories, categoryName);
        const categoryIndex = index;

        return (
            <EmojiPickerCategory
                key={categoryIndex + category.name}
                category={category}
                categoryIndex={categoryIndex}
                categoryRowIndex={categoryRowIndex}
                onClick={onClick}
                selected={activeCategory === category.name}
                enable={!isFiltering}
            />
        );
    }), [categoryNamesDependency, isFiltering, active]);

    return (
        <div
            id='emojiPickerCategories'
            className='emoji-picker__categories'
            onKeyDown={handleKeyDown}
            role='application'
        >
            {emojiPickerCategories}
        </div>
    );
}

export default memo(EmojiPickerCategories);
