import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from "react-chartjs-2";
import axios from "axios";

function MostParticipantsChart() {
    const [mostParticipantsData, setMostParticipantsData] = useState({});
    const [participantDetails, setParticipantDetails] = useState([]);

    ChartJS.register(
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5050/blog/stats/participant");
            const blogs = response.data;

            const sortedBlogs = blogs.sort((a, b) => b.count - a.count);
            const topBlogs = sortedBlogs.slice(0, 10);

            const labels = topBlogs.map((blog) => blog.participant);
            const data = topBlogs.map((blog) => blog.count);

            setMostParticipantsData({
                labels,
                datasets: [
                    {
                        label: "Nombre de participations",
                        data,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        pointBackgroundColor: "rgba(75, 192, 192, 1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,

                    },
                ],
            });

            const blogIds = topBlogs.map((blog) => blog.id);
            fetchParticipantDetails(blogIds);
        } catch (error) {
            console.error("Erreur lors de la récupération des données des événements avec le plus de participants :", error);
        }
    };

    const fetchParticipantDetails = async (blogIds) => {
        try {
            const response = await axios.post("http://localhost:5050/blog/participant", {
                blogIds: blogIds,
            });
            setParticipantDetails(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Top des élèves avec le plus de participation</h2>
            {mostParticipantsData.labels && mostParticipantsData.labels.length > 0 ? (
                <Radar
                    data={mostParticipantsData}
                    options={{

                        plugins: {
                            title: {
                                display: true,
                                text: "Top des élèves avec le plus de participations",
                            },
                            legend: {
                                display: true,
                                position: "bottom",
                            },
                        },

                        scales: {
                            r: {
                                suggestedMin: 0,
                                suggestedMax: 8,
                            },

                        },
                    }}


                />
            ) : (
                <p>Aucune donnée disponible</p>
            )}
        </div>
    );
}

export default MostParticipantsChart;
