import axios from "axios";

export async function addImpactMapping(impactMapping) {
  console.log(impactMapping);
  try {
    const res = axios.put(
      `http://212.73.217.176:5050/agile/${impactMapping.dashboardId}/add_impact_mapping`,
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
}

export const getImpactMapping = async (dashboardId) => {
  try {
    const res = await axios.get(
      `http://212.73.217.176:5050/agile/${dashboardId}/get_impact_mapping`
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};
