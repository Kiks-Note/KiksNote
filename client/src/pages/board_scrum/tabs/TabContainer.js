import React from "react";
import PropTypes from "prop-types";

export const TabContainer = (props) => <div>{props.children}</div>;

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabContainer;
