import * as React from "react";
const SvgIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="none"
    {...props}
  >
    <rect width={32} height={32} fill="#00B5B4" rx={8} />
    <path stroke="#fff" d="m8 16.5 5 5 11-11M8 10.5h16M8 22.5h16" />
  </svg>
);
export default SvgIcon;
