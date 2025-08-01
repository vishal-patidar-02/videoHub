"use client";
import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import { 
    Search, 
    User, 
    Menu, 
    X, 
    Film,
    LogOut,
    ChevronDown,
    Upload,
    UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Type definitions
interface ProfileMenuItem {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    danger?: boolean;
}

interface NavigationProps {
    className?: string;
    isLoggedIn?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
    className = "", 
    isLoggedIn = false,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [scrolled, setScrolled] = useState<boolean>(false);
    const router = useRouter();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = (): void => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const profileMenuItems: ProfileMenuItem[] = [
        { label: 'Profile', icon: User }
    ];

    const handleProfileMenuClick = (item: ProfileMenuItem): void => {
        router.push(`/${item.label.toLowerCase()}`);
        setIsProfileDropdownOpen(false);
    };

    const handleSearchSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const handleGetStarted = (): void => {
         router.push('/register');
    };

    const handleUpload = (): void => {
        router.push('/upload');
    };

    const handleLogout = (): void => {
        signOut({
            callbackUrl: "/"
        });
    };

    return (
        <>
            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-start justify-center pt-20">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 mx-4 w-full max-w-2xl">
                        <form onSubmit={handleSearchSubmit} className="relative p-6">
                            <Search className="absolute left-9 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search videos, creators..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 backdrop-blur-sm placeholder-gray-500 text-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="absolute right-9 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Navigation Card */}
            <div className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${className}`}>
                <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border transition-all duration-300 ${
                    scrolled 
                        ? 'border-gray-200/60 shadow-xl' 
                        : 'border-white/40 shadow-lg'
                }`}>
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo Section */}
                            <div className="flex items-center">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
                                        scrolled ? 'shadow-xl' : ''
                                    }`}>
                                        <Film className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <h1 className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        VideoHub
                                    </h1>
                                </div>
                            </div>

                            {/* Search Bar - Desktop and Mobile */}
                            <div className="flex flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-8">
                                <form onSubmit={handleSearchSubmit} className="relative w-full group">
                                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-7 pr-8 py-1.5 sm:pl-10 sm:pr-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 backdrop-blur-sm placeholder-gray-400 sm:placeholder-gray-500 transition-all duration-200 hover:bg-white/80"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center space-x-1 sm:space-x-3">

                                {/* Conditional rendering based on login status */}
                                {isLoggedIn ? (
                                    <>
                                        {/* Upload Button */}
                                        <button
                                            type="button"
                                            onClick={handleUpload}
                                            className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Upload</span>
                                        </button>

                                        {/* Upload Icon (Mobile) */}
                                        <button
                                            type="button"
                                            onClick={handleUpload}
                                            className="sm:hidden p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                                        >
                                            <Upload className="w-4 h-4" />
                                        </button>

                                        {/* Logout Button */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="hidden sm:flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 text-sm"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>

                                        {/* Profile Dropdown */}
                                        <div className="relative profile-dropdown">
                                            <button
                                                type="button"
                                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-xl transition-colors group"
                                            >
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                </div>
                                                <ChevronDown className={`hidden lg:block w-4 h-4 text-gray-500 transition-transform ${
                                                    isProfileDropdownOpen ? 'rotate-180' : ''
                                                }`} />
                                            </button>

                                            {/* Profile Dropdown Menu */}
                                            {isProfileDropdownOpen && (
                                                <div className="absolute right-0 top-12 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 py-2 animate-fade-in">
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="font-semibold text-gray-900 text-sm">John Doe</p>
                                                        <p className="text-xs text-gray-600">john.doe@example.com</p>
                                                    </div>
                                                    {profileMenuItems.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => handleProfileMenuClick(item)}
                                                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                                                        >
                                                            <item.icon className="w-5 h-5" />
                                                            <span className="font-medium text-sm">{item.label}</span>
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-gray-100 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
                                                        >
                                                            <LogOut className="w-5 h-5" />
                                                            <span className="font-medium text-sm">Sign Out</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Get Started Button */}
                                        <button
                                            type="button"
                                            onClick={handleGetStarted}
                                            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            <span className="hidden xs:inline">Get Started</span>
                                            <span className="xs:hidden">Join</span>
                                        </button>
                                    </>
                                )}

                                {/* Mobile Menu Button - Only show for non-logged-in users */}
                                {!isLoggedIn && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsMobileMenuOpen(!isMobileMenuOpen);
                                        }}
                                        className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors mobile-menu-btn"
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                        ) : (
                                            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Menu - Only show for non-logged-in users */}
                    {isMobileMenuOpen && !isLoggedIn && (
                        <div className="lg:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200/40 rounded-b-2xl mobile-menu">
                            <div className="px-4 sm:px-6 py-4 space-y-2">
                                {/* Mobile Get Started Button */}
                                <button
                                    type="button"
                                    onClick={handleGetStarted}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Get Started</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to prevent content from hiding behind fixed nav */}
            <div className="h-24"></div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                @media (min-width: 375px) {
                    .xs\:inline {
                        display: inline;
                    }
                    .xs\:hidden {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};

export default Navigation;