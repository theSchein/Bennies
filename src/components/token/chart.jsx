import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const TokenChart = ({ contractAddress }) => {
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}/market_chart/?vs_currency=usd&days=365`
                );
                const data = await response.json();

                const prices = data.prices.map((price) => ({
                    x: new Date(price[0]),
                    y: price[1],
                }));

                setChartData({
                    datasets: [
                        {
                            data: prices,
                            borderColor: 'rgba(0, 0, 0, 1)',
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            fill: false,
                        },
                    ],
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching token data:', error);
                setIsLoading(false);
            }
        };

        fetchTokenData();
    }, [contractAddress]);

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'P',
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: '#294B29', // Change to the desired color
                },
                ticks: {
                    color: '#294B29', // Change to the desired color
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price (USD)',
                    color: '#294B29', // Change to the desired color
                },
                ticks: {
                    color: '#294B29', // Change to the desired color
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="bg-light-secondary dark:bg-dark-primary p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold mb-4 italic dark:text-dark-quaternary">Token Price Chart</h2>
            {isLoading ? (
                <p>Loading chart...</p>
            ) : (
                <Line data={chartData} options={options} />
            )}
        </div>
    );
};

export default TokenChart;
