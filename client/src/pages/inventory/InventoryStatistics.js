import React, { useEffect, useRef, useState } from 'react';
import { Chart, CategoryScale, LinearScale, Title, TimeScale, Tooltip, LineElement, Legend, PointElement, Filler } from 'chart.js';
import { BarController } from 'chart.js';
import { BarElement } from 'chart.js';
import { DoughnutController, ArcElement } from 'chart.js';
import moment from 'moment';
import 'chartjs-adapter-moment';
import 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { set } from 'date-fns';

function InventoryStatistics() {
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        Chart.register(CategoryScale, LinearScale, Title, BarController, BarElement, TimeScale);

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5050/inventory/statistics');
                console.log('Réponse du serveur:', response);
                const data = await response.json();
                const formattedData = data.map((document) => ({
                    ...document,
                    createdAt: moment(document.createdAt).toDate(),
                }));
                setData(formattedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            const sortedData = data.sort((a, b) => a.createdAt - b.createdAt);
            const labels = [];
            const values = [];

            // Sélectionner les 5 plus anciens matériels
            const top5 = sortedData.slice(0, 5);

            // Créer les étiquettes et valeurs pour les barres
            top5.forEach((document) => {
                labels.push(`${document.label} (${moment(document.createdAt).format('MMM D')})`);
                values.push(moment(document.createdAt).toDate());
            });

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Matériels les plus anciens',
                        data: [100, 75, 50, 25, 10],
                        backgroundColor: [
                            'rgba(255, 99, 132)',
                            'rgba(255, 159, 64)',
                            'rgba(255, 205, 86)',
                            'rgba(75, 192, 192)',
                            'rgba(54, 162, 235)',
                            'rgba(153, 102, 255)',
                            'rgba(201, 203, 207)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            const options = {
                type: 'bar',
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM D',
                            },
                        },
                    },
                    y: {},
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Matériels les plus anciens',
                        position: 'top',
                        align: 'center',
                        font: {
                            size: 18,
                            weight: 'bold',
                        },
                    },
                    legend: {
                        display: false,
                    },
                },
            };

            if (chartInstance) {
                chartInstance.destroy();
            }

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                const newChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: options,
                });
                setChartInstance(newChartInstance);
            }
        }
    }, [data]);

    return (
        <div style={{ width: '600px', height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Statistiques</h1>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

function MostUsedMaterials() {
    const chartRef = useRef(null);
    const [data, setData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);


    useEffect(() => {
        Chart.register(
            ArcElement,
            Title,
            LineElement,
            CategoryScale,
            LinearScale,
            PointElement,
            Filler,
            Tooltip,
            Legend
        );

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5050/inventory/statistics2');
                console.log('Réponse du serveur:', response);
                const data = await response.json();
                const formattedData = data.map((document) => ({ ...document, count: moment(document.deviceId) }));
                setData(formattedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            const labels = [];
            const values = [];
            // Filtrer les données pour n'inclure que les matériels "accepted"
            const acceptedMaterials = data.filter(document => document.status === 'accepted');

            // Traiter les données pour obtenir le top 5 des matériels les plus utilisés
            const topMaterials = acceptedMaterials.reduce((acc, curr) => {
                const materialId = curr.deviceId;
                acc[materialId] = (acc[materialId] || 0) + 1;
                return acc;
            }, {});

            // Convertir le topMaterials en tableau pour le tri
            const topMaterialsArray = Object.entries(topMaterials).map(([deviceId, count]) => ({ deviceId, count }));

            // Trier le tableau en fonction du nombre d'utilisations (count) de manière décroissante
            topMaterialsArray.sort((a, b) => b.count - a.count);

            // Obtenir uniquement les 5 premiers matériels
            const top5Materials = topMaterialsArray.slice(0, 5);

            // Extraire les labels et les valeurs pour le graphique
            top5Materials.forEach((document) => {
                labels.push(document.deviceId);
                values.push(document.count);
            });
            console.log('labels:', labels);

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Les matériels les plus utilisés',
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132)',
                            'rgba(255, 159, 64)',
                            'rgba(255, 205, 86)',
                            'rgba(75, 192, 192)',
                            'rgba(54, 162, 235)',
                        ],
                        hoverOffset: 4,
                    },
                ],
            };

            console.log('chartData:', chartData);

            const options = {
                type: 'doughnut',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Matériels les plus utilisés',
                        position: 'top',
                        align: 'center',
                        font: {
                            size: 18,
                            weight: 'bold',
                        },
                    },
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            display: true,
                            color: 'white',
                        },
                    },
                },
            };

            if (chartInstance) {
                chartInstance.destroy();
            }

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                const newChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: chartData,
                    options: options,
                });
                setChartInstance(newChartInstance);
            }
        }
    }, [data]);

    return (
        <div style={{ width: '600px', height: '330px' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}



function TotalMacCount() {
    const [macCount, setMacCount] = useState(0);

    useEffect(() => {
        const fetchMacData = async () => {
            try {
                const response = await fetch('http://localhost:5050/inventory'); // Endpoint pour récupérer toutes les données de la collection "inventory"
                const data = await response.json();

                // Filtrer les données pour n'inclure que celles avec la variable "category" de type "Mac"
                const macData = data.filter(item => item.category === 'Mac');

                // Compter le nombre de résultats
                const count = macData.length;

                // Mettre à jour l'état avec le nombre total de résultats
                setMacCount(count);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMacData();
    }, []);

    return <div>Nombre total de Mac : <span >{macCount}</span></div>;
}


function DashboardStats() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'grid', gridGap: '80px' }}> {/* Increase the gridGap value as desired */}
                <InventoryStatistics />
                <MostUsedMaterials />
                <TotalMacCount />
            </div>
        </div>
    );
}

export default DashboardStats;