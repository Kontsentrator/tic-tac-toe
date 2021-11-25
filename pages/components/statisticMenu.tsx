import React, { useContext, memo } from "react";
import { WinCountContext } from "../data/context";

const StatisticMenu: React.FC = () => {
  // Получаем статистику из контекста
    const {statistic} = useContext(WinCountContext);
  return (
    <div className="statistic-menu">
      <p>Игрок: {statistic.player}</p>
      <p>Бот: {statistic.bot}</p>
    </div>
  );
};

export default memo(StatisticMenu);
