import React, { FC } from "react";
import { MenuItem } from "react-pro-sidebar";
import { Typography } from "@mui/material";
import Link from "next/link";

type Props = {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (selected: string) => void;
};

const Item: FC<Props> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
    >
      <Link href={to}>
        <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
      </Link>
    </MenuItem>
  );
};

export default Item;
