import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-brand-primary text-brand-bg py-3 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-600">URL Shortener</p>
                </div>

                {/* Placeholder for potential future nav/buttons */}
                <div>
                    <button className="bg-brand-secondary text-brand-primary px-3 py-1 rounded hover:opacity-90 text-sm">Sign Up</button>
                </div>
            </div>
        </header>
    );
};

export default Header; 