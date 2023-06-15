import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useFirebase from '../../hooks/useFirebase';

function Groups() {
    const { user } = useFirebase();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const getGroups = async () => {
            if (user?.status === "po") {
                try {
                    const response = await axios.get(`http://212.73.217.176:5050/groupes/getGroupsPo/${user?.id}`);
                    setGroups(response.data);
                } catch (error) {
                    console.error(error);
                }
            } else if (user?.status === "etudiant") {
                try {
                    const response = await axios.get(`http://212.73.217.176:5050/groupes/getGroups/${user?.id}`);
                    setGroups(response.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        getGroups();
    }, [user?.id, user?.status]);

    return (
        <div>
            <h1>Groups</h1>
            {groups ? groups.map((group, index) => (
                <div key={group.id}>
                    <h2>Group {index + 1}</h2>
                    <h3>Etudiants:</h3>
                    <ul>
                        {group.students.map(student => (
                            <li key={student.id}>
                                {student.firstname} {student.lastname}
                            </li>
                        ))}
                    </ul>
                </div>
            )) : null}
        </div>
    );




}

export default Groups;