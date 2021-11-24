import cn from "classnames";
import React, { useContext, memo } from "react";
import { WinCountContext } from "../../data/context";
import styles from "./statisticMenu.module.scss";

interface statisticMenuProps {
  className: string;
}

const StatisticMenu: React.FC<statisticMenuProps> = ({ className }) => {
  const contextWinCount = useContext(WinCountContext);
  return (
    <div className={cn(className, styles.statisticMenu)}>
      <p>Игрок: {contextWinCount.player}</p>
      <p>Бот: {contextWinCount.bot}</p>
    </div>
  );
};

export default memo(StatisticMenu);
