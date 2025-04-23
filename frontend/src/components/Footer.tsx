import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-secondary text-brand-text/70 py-5 mt-16">
            <div className="container mx-auto px-4 text-center">
                <p className="text-xs md:text-sm">&copy; {currentYear} URL Shortener. All rights reserved.</p>
                {/* Additional links or info can go here */}
            </div>
        </footer>
    );
};

export default Footer; 