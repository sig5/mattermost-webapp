// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
} from 'react';

import {CSSTransition} from 'react-transition-group';

import {useClickOutsideRef} from 'components/global_header/hooks';

import MenuItem from './MenuItem';
import MenuData from './MenuData';
import styled, { css } from 'styled-components';

const Overlay = styled.div(() => {
    return css`
        background-color: rgba(0, 0, 0, 0);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 100%;
        min-height: 100%;
        left: 0;
        right: 0;
        top: 0;
        position: fixed;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        pointer-events: auto;
        -ms-scroll-chaining: none;
        transition: 1s;
        transition-property: background-color;
        transition-timing-function: ease-in-out;

        &.fade-enter {
            background-color: rgba(0, 0, 0, 0);
        }

        &.fade-enter-active {
            background-color: rgba(0, 0, 0, 0.5);
        }

        &.fade-enter-done {
            background-color: rgba(0, 0, 0, 0.5);
        }

        &.fade-exit {
            background-color: rgba(0, 0, 0, 0.5);
        }

        &.fade-exit-active {
            background-color: rgba(0, 0, 0, 0);
        }

        &.fade-exit-done {
            background-color: rgba(0, 0, 0, 0);
        }
    `;
});

const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const mobileMediaQuery = window.matchMedia('(max-width: 699px)');

    const handleChange = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches);
    };

    useEffect(() => {
        mobileMediaQuery.addEventListener('change', handleChange);
        return () => {
            mobileMediaQuery.removeEventListener('change', handleChange);
        };
    }, [handleChange]);

    useEffect(() => {
        setIsMobile(mobileMediaQuery.matches);
    }, []);

    return isMobile;
};

function usePrevious<T extends unknown>(value: T): T | undefined {
    // The ref object is a generic container whose current property is mutable
    // and can hold any value, similar to an instance property on a class
    const ref = useRef<T>();

    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)

    return ref.current;
}

interface MenuProps {}


const Menu = (props: MenuProps): JSX.Element => {   
    const [open, setOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const buttonReference = useRef<HTMLButtonElement>(null);
    const menuRef = useRef(null);
    const submenuRef = useRef(null);
    const menuItemReference = useRef(null);
    const prevOpen = usePrevious(open);
    const prevSubmenuOpen = usePrevious(submenuOpen);
    const isMobile = useIsMobile();
    const isOverlayVisible = isMobile && open;

    const closeMenu = useCallback(() => {
        setOpen(false);
        setSubmenuOpen(false);
    }, []);

    useClickOutsideRef([buttonReference, menuRef, submenuRef], () => {
        if (!open || isMobile) {
            return;
        }
        closeMenu();
    });

    const closeSubmenuDown = Boolean(prevOpen && prevSubmenuOpen && !submenuOpen && !open);

    const menuTitle = 'Parent Menu';
    const submenuTitle = 'sub Menu title';
    const menuGroup = [
        {
            menuItems: [
                <MenuItem
                    ref={menuItemReference}
                    description={'Opens submenu'}
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                    label='Open Submenu'
                    leadingElement={<i className='icon-plus' />}
                    trailingElementLabel='selected'
                    trailingElement={<i className='icon-chevron-right'/>}
                />,
                <MenuItem
                    destructive={true}
                    label='Join Mattermost'
                    leadingElement={
                        <i className='icon-sort-alphabetical-ascending'/>
                    }
                />,
                    <MenuItem
                    label='Join Mattermost'
                    leadingElement={
                        <i className='icon-sort-alphabetical-ascending'/>
                    }
                />,
                <MenuItem
                label='Join Mattermost'
                leadingElement={
                    <i className='icon-sort-alphabetical-ascending'/>
                }
            />,
            <MenuItem
            label='Join Mattermost'
            leadingElement={
                <i className='icon-sort-alphabetical-ascending'/>
            }
        />,
        <MenuItem
        label='Join Mattermost'
        leadingElement={
            <i className='icon-sort-alphabetical-ascending'/>
        }
        />,
                <MenuItem
                    disabled
                    label='Category Mattermost'
                    leadingElement={
                        <i className='icon-account-multiple-outline'/>
                    }
                />,
                <MenuItem
                disabled
                label='Category Mattermost'
                leadingElement={
                    <i className='icon-account-multiple-outline'/>
                }
            />,
            <MenuItem
            disabled
            label='Category Mattermost'
            leadingElement={
                <i className='icon-account-multiple-outline'/>
            }
        />,
        <MenuItem
        disabled
        label='Category Mattermost'
        leadingElement={
            <i className='icon-account-multiple-outline'/>
        }
    />,
            ],
        },
    ];

    const submenuGroup = [
        {
            menuItems: [
                <MenuItem
                    label='Leave Mattermost'
                    leadingElement={
                        <i className='icon-sort-alphabetical-ascending'/>
                    }
                />,
                <MenuItem
                    label='Open Mattermost'
                    leadingElement={
                        <i className='icon-account-multiple-outline'/>
                    }
                />,
            ],
        },
    ];

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                ref={buttonReference}
            >
                {'trigger'}
            </button>
            <CSSTransition
                timeout={300}
                classNames='fade'
                in={isOverlayVisible}
                unmountOnExit={true}
            >
                <Overlay onClick={closeMenu}/>
            </CSSTransition>
            <MenuData
                menuTitle={menuTitle}
                ref={menuRef}
                groups={menuGroup}
                trigger={buttonReference}
                open={open}
                active={open && !submenuOpen}
                placement={'right-start'}
                isMobile={isMobile}
            />
            <MenuData
                menuTitle={submenuTitle}
                ref={submenuRef}
                trigger={menuItemReference}
                open={submenuOpen}
                isSubmenu={true}
                closeSubmenu={() => setSubmenuOpen(false)}
                closeSubmenuDown={closeSubmenuDown}
                active={submenuOpen}
                groups={submenuGroup}
                placement={'right-start'}
                isMobile={isMobile}
            />
        </>
    );
};

export default Menu;
