import React from "react";
import CardBoardOverview from "./CardBoardOverview";

export default function CardSprint({release, dashboardId }) {
  return release.map((item, index) => (
    <CardBoardOverview
      title={item.name}
      startingDate={Math.floor(
        new Date(
          item.starting_date._seconds * 1000 +
            item.starting_date._nanoseconds / 100000
        ).getTime() / 1000
      )}
      endingDate={Math.floor(
        new Date(
          item.ending_date._seconds * 1000 +
            item.ending_date._nanoseconds / 100000
        ).getTime() / 1000
      )}
      id={item.boardId}
      dashboardId={dashboardId}
    />
  ));
}
