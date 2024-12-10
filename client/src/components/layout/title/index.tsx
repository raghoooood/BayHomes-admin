import type React from "react";
import { useRouterContext, type TitleProps } from "@refinedev/core";
import Button from "@mui/material/Button";

import { logo, bayhomes } from "assets";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="bayhomes" width="28px" />
        ) : (
          <img src={bayhomes} alt="Refine" width="140px" />
        )}
      </Link>
    </Button>
  );
};
