import axios from 'axios';

export const addImpactMapping = (dashboardId, impactMapping) => {
    console.log(dashboardId);
    try {
        const res = axios.put(
          `http://localhost:5050/agile/Cd9Xb4VTzBULqWgbOdjE/add_impact_mapping`,
          {
            actors: impactMapping.actors,
            deliverables: impactMapping.deliverables,
            goals: impactMapping.goals,
            impacts: impactMapping.impacts,
          }
        );
        return res;
    } catch (e) {
        console.error(e);
    }

};

export const getImpactMapping = (dashboardId) => {
    try {
        const res = axios.get(`http://localhost:5050/agile/${dashboardId}/get_impact_mapping`);
        return res;
    } catch (e) {
        console.error(e);
    }
}