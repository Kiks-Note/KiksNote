import axios from "axios";

export const addImpactMapping = async (impactMapping) => {
  console.log(impactMapping);
  try {
    const res = axios.put(
      `${process.env.REACT_APP_SERVER_API}/agile/${impactMapping.dashboardId}/add_impact_mapping`,
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
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER_API}/agile/${dashboardId}/actor/${actorId}`
    );
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const addElevatorPitch = async (dashboardId, elevatorPitch) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_SERVER_API}/agile/${dashboardId}/elevator/updateElevator`,
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
      `${process.env.REACT_APP_SERVER_API}/agile/${dashbardId}/resetElevator`
    );
    return res;
  } catch (e) {
    console.error(e);
  }
};
