import React from 'react';

const StatCard = ({ icon: Icon, title, value, color, trend }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm mt-2" style={{ color }}>
                            {trend}
                        </p>
                    )}
                </div>
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                >
                    <Icon className="w-7 h-7" style={{ color }} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
