import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import find_a_game_logo from '../assets/find_a_game_logo.png'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

interface TopNavBarProps {
    logoColor: string;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ logoColor }) => {
    const location = useLocation();
    const { isLoggedIn, logout, user, cartItems } = useUser();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 h-12" style={{ backgroundColor: logoColor }}>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 h-12 ">
                <div className="relative flex h-12 items-center justify-between">
                    <div className="flex items-center">
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
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/Cart"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                                            : "rounded-md px-3 py-2 text-base font-semibold hover:bg-gray-700 hover:text-white"
                                    }
                                >
                                    Cart
                                    {cartItems.length > 0 && (
                                        <span className="ml-1 h-2.5 w-2.5 rounded-full align-text-top bg-red-500 inline-block" />
                                    )}
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
                    <div className="flex lg:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-8 w-8 group-data-[open]:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-8 w-8 group-data-[open]:block" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500" />
                            )}
                        </DisclosureButton>
                    </div>
                    <div className="hidden lg:ml-4 lg:block">
                        <div className="flex items-center">
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
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </Link>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-4 flex-shrink-0">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full"
                                        />
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-3 w-50 origin-top-right rounded-md bg-gray-300 shadow-lg ring-1 ring-black ring-opacity-5 transition flex flex-col focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem>
                                        <NavLink
                                            to="/Profile" className={({ isActive }) =>
                                                isActive
                                                    ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                                                    : "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white"}>
                                            Profile
                                        </NavLink>
                                    </MenuItem>
                                    <MenuItem>
                                        <NavLink
                                            to="/Messages" className={({ isActive }) =>
                                                isActive
                                                    ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                                                    : "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white"}>
                                            Messages
                                        </NavLink>
                                    </MenuItem>
                                    <MenuItem>
                                        <NavLink
                                            to="/Login" className={({ isActive }) =>
                                                isActive
                                                    ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                                                    : "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white"} onClick={isLoggedIn ? logout : undefined}>
                                            {isLoggedIn ? "Logout" : "Login"}
                                        </NavLink>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
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
                        Dashboard
                    </DisclosureButton>
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
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="h-10 w-10 rounded-full"
                            />
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
                                <BellIcon aria-hidden="true" className="h-6 w-6" />
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