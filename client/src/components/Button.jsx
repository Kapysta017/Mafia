import React from "react";
import PropTypes from "prop-types";

export const Button = ({ variant, size, children, ...props }) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  children: PropTypes.node.isRequired,
};
