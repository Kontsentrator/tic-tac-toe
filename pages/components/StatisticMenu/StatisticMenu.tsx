import cn from "classnames";
import React, { useContext, memo } from "react";
import { WinCountContext } from "../../data/context";
import styles from "./statisticMenu.module.scss";

interface statisticMenuProps {
  className?: string;
}

const StatisticMenu: React.FC<statisticMenuProps> = ({ className }) => {
  const {statistic} = useContext(WinCountContext);
  return (
    <div className={cn(className, styles.statisticMenu)}>
      <p>Игрок: {statistic.player}</p>
      <p>Бот: {statistic.bot}</p>
    </div>
  );
};

export default memo(StatisticMenu);
