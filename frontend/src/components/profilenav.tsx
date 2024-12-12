import React from "react";
import { NavLink, useLocation } from 'react-router-dom';
import { BellIcon, CogIcon, CreditCardIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Profile', href: '/Profile', icon: UserCircleIcon },
    { name: 'Account', href: '/Account', icon: CogIcon },
    { name: 'Password', href: '/Password', icon: KeyIcon },
    { name: 'Notifications', href: '/Notifications', icon: BellIcon },
    { name: 'Transactions', href: '/Transactions', icon: CreditCardIcon },
]

function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ')
}

const Profilenav: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="lg:col-span-3 w-full">
            <nav className="p-2 space-y-2">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        aria-current={location.pathname === item.href ? 'page' : undefined}
                        className={classNames(
                            location.pathname === item.href
                                ? 'bg-white rounded-lg'
                                : 'rounded-lg hover:bg-neutral-300',
                            'group flex items-center p-1',
                        )}
                    >
                        <item.icon
                            aria-hidden="true"
                            className={classNames(
                                location.pathname === item.href
                                    ? 'text-blue-500'
                                    : 'text-gray-400 group-hover:text-blue-500',
                                'mr-3 size-6 ',
                            )}
                        />
                        <span className="truncate">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}
export default Profilenav;
