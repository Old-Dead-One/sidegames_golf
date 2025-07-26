import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon, ShoppingCartIcon, FaceSmileIcon, ArrowRightStartOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import find_a_game_logo from '../assets/find_a_game_logo.png'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

interface TopNavBarProps {
    logoColor: string;
    onCartClick?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ logoColor, onCartClick }) => {
    const location = useLocation();
    const { isLoggedIn, logout, user, cartItems } = useUser();

    const isActive = (path: string) => location.pathname === path;

    const profilePic = user?.profilePictureUrl || '/default-avatar.png';

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 h-12" style={{ backgroundColor: logoColor }}>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 h-12 ">
                <div className="relative flex h-12 items-center justify-between">
                    <div className="flex items-center flex-1">
                        <NavLink to="/" className="flex-shrink-0"
                            onClick={() => {
                                const disclosureButton = document.querySelector('[aria-expanded="true"]') as HTMLElement;
                                if (disclosureButton) {
                                    disclosureButton.click();
                                }
                            }}
                        >
                            <img
                                alt="sidegames.golf"
                                src={find_a_game_logo}
                                className="h-10"
                            />
                        </NavLink>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">

                                {/* NavLinks for Desktop */}
                                <NavLink
                                    to="/Dashboard"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                            : "rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 hover:text-white"
                                    }
                                >
                                    Find a Game
                                </NavLink>
                                <NavLink
                                    to="/CreateGame"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                            : "rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 hover:text-white"
                                    }
                                >
                                    Create a Game
                                </NavLink>
                                <NavLink
                                    to="/Info"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                            : "rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 hover:text-white"
                                    }
                                >
                                    Faq
                                </NavLink>
                                <NavLink
                                    to="/Calendar"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                            : "rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 hover:text-white"
                                    }
                                >
                                    Calendar
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        {/* All right-side icons in a single flex row */}
                        {/* Bell icon removed from top navbar. */}
                        {/* Profile dropdown (desktop only) */}
                        <div className="hidden lg:flex order-2 lg:order-2 ml-4">
                            <Menu as="div" className="relative flex-shrink-0">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 group">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        {user?.profilePictureUrl ? (
                                            <span className="relative inline-block h-8 w-8">
                                                <img
                                                    alt=""
                                                    src={user.profilePictureUrl}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    onError={e => {
                                                        if (!e.currentTarget.src.endsWith('/default-avatar.png')) {
                                                            e.currentTarget.src = '/default-avatar.png';
                                                        }
                                                    }}
                                                />
                                                <FaceSmileIcon
                                                    className="h-8 w-8 text-gray-400 group-hover:text-white group-focus:text-white absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-all duration-150"
                                                />
                                            </span>
                                        ) : (
                                            <span className="relative inline-block h-8 w-8">
                                                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800">
                                                    <UserIcon className="h-8 w-8 text-gray-400" />
                                                </span>
                                            </span>
                                        )}
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-3 origin-top-right rounded-md bg-gray-300 shadow-lg ring-1 ring-black ring-opacity-5 flex flex-col focus:outline-none min-w-fit max-w-xs"
                                >
                                    <MenuItem>
                                        <NavLink
                                            to="/Profile"
                                            className={({ isActive }) =>
                                            (isActive
                                                ? "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md bg-gray-900 text-white"
                                                : "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md hover:bg-gray-700 hover:text-white")
                                            }
                                        >
                                            <UserIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                                            Profile
                                        </NavLink>
                                    </MenuItem>
                                    {isLoggedIn && (
                                        <MenuItem>
                                            <NavLink
                                                to="/Messages"
                                                className={({ isActive }) =>
                                                (isActive
                                                    ? "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md bg-gray-900 text-white"
                                                    : "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md hover:bg-gray-700 hover:text-white")
                                                }
                                            >
                                                <BellIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                                                Notifications
                                                {/* TODO: Add red dot badge here for unread notifications/messages */}
                                            </NavLink>
                                        </MenuItem>
                                    )}
                                    <MenuItem>
                                        <NavLink
                                            to="/Login"
                                            className={({ isActive }) =>
                                            (isActive
                                                ? "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md bg-gray-900 text-white"
                                                : "flex items-center min-h-[44px] px-4 py-2 text-base font-medium leading-none rounded-md hover:bg-gray-700 hover:text-white")
                                            }
                                            onClick={isLoggedIn ? logout : undefined}
                                        >
                                            {isLoggedIn ? (
                                                <>
                                                    <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                                                    Logout
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowRightEndOnRectangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
                                                    Login
                                                </>
                                            )}
                                        </NavLink>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                        {/* Cart icon (always visible if present) */}
                        {onCartClick && (
                            <button
                                type="button"
                                className="order-2 lg:order-3 ml-2 self-start relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                onClick={onCartClick}
                            >
                                <span className="sr-only">Open cart</span>
                                <ShoppingCartIcon className="h-6 w-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                                )}
                            </button>
                        )}
                        {/* Hamburger menu (mobile only, always last) */}
                        <div className="order-3 lg:order-4 lg:hidden">
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-8 w-8 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-8 w-8 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="lg:hidden" style={{ backgroundColor: logoColor, opacity: 0.95 }}>
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <DisclosureButton
                        as={NavLink}
                        to="/Dashboard"
                        className={() =>
                            isActive("/Dashboard")
                                ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                        }
                    >
                        Find a Game
                    </DisclosureButton>
                    <DisclosureButton
                        as={NavLink}
                        to="/CreateGame"
                        className={() =>
                            isActive("/CreateGame")
                                ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                        }
                    >
                        Create a Game
                    </DisclosureButton>
                    {onCartClick ? (
                        <DisclosureButton
                            as="button"
                            type="button"
                            className={() =>
                                isActive("/Cart")
                                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                    : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                            }
                            onClick={onCartClick}
                        >
                            Cart
                            {cartItems.length > 0 && (
                                <span className="ml-1 h-2.5 w-2.5 align-text-top rounded-full bg-red-500 inline-block" />
                            )}
                        </DisclosureButton>
                    ) : (
                        <DisclosureButton
                            as={NavLink}
                            to="/Cart"
                            className={() =>
                                isActive("/Cart")
                                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                    : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                            }
                        >
                            Cart
                            {cartItems.length > 0 && (
                                <span className="ml-1 h-2.5 w-2.5 align-text-top rounded-full bg-red-500 inline-block" />
                            )}
                        </DisclosureButton>
                    )}
                    <DisclosureButton
                        as={NavLink}
                        to="/Info"
                        className={() =>
                            isActive("/Info")
                                ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                        }
                    >
                        Faq
                    </DisclosureButton>
                    <DisclosureButton
                        as={NavLink}
                        to="/Calendar"
                        className={() =>
                            isActive("/Calendar")
                                ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                        }
                    >
                        Calendar
                    </DisclosureButton>
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                            {user?.profilePictureUrl ? (
                                <img
                                    alt=""
                                    src={user.profilePictureUrl}
                                    className="h-10 w-10 rounded-full"
                                    onError={e => {
                                        if (!e.currentTarget.src.endsWith('/default-avatar.png')) {
                                            e.currentTarget.src = '/default-avatar.png';
                                        }
                                    }}
                                />
                            ) : (
                                <UserIcon className="h-10 w-10 text-gray-400" />
                            )}
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-white">{user?.displayName || "User Name"}</div>
                            <div className="text-sm font-medium text-gray-600">{user?.email || "user@example.com"}</div>
                        </div>
                        <Link to="/Messages" onClick={() => {
                            const disclosureButton = document.querySelector('[aria-expanded="true"]') as HTMLElement;
                            if (disclosureButton) {
                                disclosureButton.click();
                            }
                        }}>
                            <button
                                type="button"
                                className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View messages</span>
                                <BellIcon aria-hidden="true" className="h-3 w-3" />
                            </button>
                        </Link>
                    </div>

                    <div className="mt-3 space-y-1 px-2">
                        <DisclosureButton
                            as={NavLink}
                            to="/Profile"
                            className={() =>
                                isActive("/Profile")
                                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                    : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                            }
                        >
                            Profile
                        </DisclosureButton>
                        <DisclosureButton
                            as={NavLink}
                            to="/Messages"
                            className={() =>
                                isActive("/Messages")
                                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                    : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"
                            }
                        >
                            Messages
                        </DisclosureButton>
                        <DisclosureButton
                            as={NavLink}
                            to="/Login"
                            className={() =>
                                isActive("/Login")
                                    ? "block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                    : "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white"} onClick={isLoggedIn ? logout : undefined}>
                            {isLoggedIn ? "Logout" : "Login"}
                        </DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
            <div className='h-0.5 bg-black' />
        </Disclosure>
    )
}

export default TopNavBar