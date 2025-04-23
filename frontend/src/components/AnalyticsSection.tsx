import { BarChart } from 'lucide-react';
import React from 'react';

const AnalyticsSection: React.FC = () => {
    return (
        <div className="w-full max-w-2xl mx-auto mt-10 p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-brand-primary mb-4 flex items-center gap-2">
                <BarChart size={24} className="text-brand-primary/80" />
                Analytics
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
                Detailed analytics for your shortened URLs will be available here soon. Track clicks, referrers, and more!
            </p>
            {/* Styled placeholder area */}
            <div className="mt-6 p-8 bg-brand-secondary/40 rounded-lg flex items-center justify-center text-brand-text/60 border border-brand-secondary">
                <span className="italic">(Analytics data visualization coming soon)</span>
            </div>
        </div>
    );
};

export default AnalyticsSection; 