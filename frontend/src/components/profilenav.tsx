import React from "react";
import { NavLink, useLocation } from 'react-router-dom';
import { BellIcon, CalendarIcon, CogIcon, CreditCardIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useUser } from '../context/UserContext';

const navigation = [
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Account', href: '/account', icon: CogIcon },
    { name: 'Password', href: '/password', icon: KeyIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'My Events', href: '/profile-events', icon: CalendarIcon },
]

function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ')
}

const Profilenav: React.FC = () => {
    const location = useLocation();
    const { isLoggedIn } = useUser();

    return (
        <aside className="lg:col-span-3 lg:pr-4">
            <nav className="space-y-2">
                {navigation.map((item) =>
                    isLoggedIn ? (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            aria-current={location.pathname === item.href ? 'page' : undefined}
                            className={classNames(
                                location.pathname === item.href
                                    ? 'bg-white rounded-lg'
                                    : 'rounded-lg hover:bg-neutral-300',
                                'group flex items-center p-2 w-full',
                            )}
                        >
                            <item.icon
                                aria-hidden="true"
                                className={classNames(
                                    location.pathname === item.href
                                        ? 'text-blue-500'
                                        : 'text-gray-400 group-hover:text-blue-500',
                                    'mr-4 size-6',
                                )}
                            />
                            <span className="truncate">{item.name}</span>
                        </NavLink>
                    ) : (
                        <button
                            key={item.name}
                            type="button"
                            disabled
                            className="group flex items-center rounded-lg p-2 opacity-50 cursor-not-allowed w-full"
                            title="Please log in to access this feature"
                            style={{ textAlign: "left" }}
                            tabIndex={-1}
                        >
                            <item.icon
                                aria-hidden="true"
                                className="text-gray-400 mr-3 size-6"
                            />
                            <span className="truncate">{item.name}</span>
                        </button>
                    )
                )}
            </nav>
        </aside>
    )
}
export default Profilenav;
