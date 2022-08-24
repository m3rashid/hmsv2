import React from "react";
import PropTypes from "prop-types";

/**
 * @description StatefullFormRenderer is a component that renders a form part
 * @param {*} render : Boolean - true if the form is to be rendered, false otherwise
 * @returns
 */
function StatefullFormRenderer(props) {
  if (!props.render) {
    return null;
  }

  return <div>{props.children}</div>;
}

StatefullFormRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  render: PropTypes.bool.isRequired,
};

export default StatefullFormRenderer;
