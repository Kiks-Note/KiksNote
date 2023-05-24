import React from "react";
import CardBoard from "./CardBoard";

export default function CardSprint({ addTab, release, dashboardId }) {
  return release.map((item, index) => (
    <CardBoard
      addTab={addTab}
      title={item.name}
      startingDate={Math.floor(
        new Date(item.starting_date._seconds * 1000 + item.starting_date._nanoseconds / 100000).getTime() / 1000
      )}
      endingDate={Math.floor(
        new Date(item.ending_date._seconds * 1000 + item.ending_date._nanoseconds / 100000).getTime() / 1000
      )}
      id={item.boardId}
      dashboardId={dashboardId}
    />
  ));
}
