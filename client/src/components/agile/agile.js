import axios from "axios";

export const addImpactMapping = async (impactMapping) => {
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
};

export const deleteActors = async (dashboardId, actorId) => {
  try {
    const res = await axios.get(
      `http://212.73.217.176:5050/agile/${dashboardId}/get_impact_mapping`
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const addElevatorPitch = async (dashboardId, elevatorPitch) => {
  try {
    const res = await axios.put(
      `http://localhost:5050/agile/${dashboardId}/elevator/updateElevator`,
      {
        name: elevatorPitch.name,
        forWho: elevatorPitch.forWho,
        needed: elevatorPitch.needed,
        type: elevatorPitch.type,
        who: elevatorPitch.who,
        difference: elevatorPitch.difference,
        alternative: elevatorPitch.alternative,
      }
    );
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const deleteElevatorPitch = async (dashbardId) => {
  try {
    const res = await axios.put(
      `http://localhost:5050/agile/${dashbardId}/resetElevator`
    );
    return res;
  } catch (e) {
    console.error(e);
  }
};
