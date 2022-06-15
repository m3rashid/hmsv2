import React from "react";

export default function FixedUseContext(_context) {
  const context = React.useContext(_context);

  if (context === undefined) {
    return {};
  }

  return context;
}
