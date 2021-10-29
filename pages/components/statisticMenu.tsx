import React, { useContext, memo } from "react";
import { WinCountContext } from "../data/context";

const StatisticMenu: React.FC = () => {
    const contextWinCount = useContext(WinCountContext);
  return (
    <div className="statistic-menu">
      <p>Игрок: {contextWinCount.player}</p>
      <p>Бот: {contextWinCount.bot}</p>
    </div>
  );
};

export default memo(StatisticMenu);
