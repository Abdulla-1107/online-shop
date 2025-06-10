import React from "react";

export const useToggle = () => {
  const [isOpen, setIsopen] = React.useState(false);
  const open = () => setIsopen(true);
  const close = () => setIsopen(false);
  const toggle = () => setIsopen(!isOpen);
  return { open, isOpen, close, toggle };
};
