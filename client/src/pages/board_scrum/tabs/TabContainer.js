import React from "react";
import PropTypes from "prop-types";

export const TabContainer = (props) => props.children;


TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabContainer;
