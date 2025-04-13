import React from "react";

export const PlayersCounter = ({
  playersNumber,
  setPlayersNumber,
  mafiaNumber,
  setMafiaNumber,
}) => {
  const substractDisabled = playersNumber <= 4;
  const addDisabled = playersNumber > 11;
  const handleSubstractClick = () => {
    if (!substractDisabled) {
      setPlayersNumber(playersNumber - 1);
      if (
        (playersNumber <= 6 && mafiaNumber >= 2) ||
        (playersNumber <= 9 && mafiaNumber >= 3)
      ) {
        setMafiaNumber(mafiaNumber - 1);
      }
    }
  };

  const handleAddClick = () => {
    if (!addDisabled) {
      setPlayersNumber(playersNumber + 1);
    }
    if (playersNumber == 5 || playersNumber == 8)
      setMafiaNumber(mafiaNumber + 1);
  };

  return (
    <div className="fake_button_container">
      <div className="fake_button">
        <div
          className={`action ${addDisabled ? "disabled" : ""}`}
          onClick={handleAddClick}
        >
          +
        </div>
        <div className="number">{playersNumber}</div>
        <div
          className={`action ${substractDisabled ? "disabled" : ""}`}
          onClick={handleSubstractClick}
        >
          -
        </div>
      </div>
    </div>
  );
};
