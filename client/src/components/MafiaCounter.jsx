export function MafiaCounter({ playersNumber, mafiaNumber, setMafiaNumber }) {
  const substractDisabled = mafiaNumber <= 1;
  const addDisabled =
    playersNumber < 6 ||
    (playersNumber <= 7 && mafiaNumber >= 2) ||
    (playersNumber < 9 && mafiaNumber >= 2) ||
    mafiaNumber >= 3;

  const handleSubstractClick = () => {
    if (!substractDisabled) {
      setMafiaNumber(mafiaNumber - 1);
    }
  };

  const handleAddClick = () => {
    if (!addDisabled) {
      setMafiaNumber(mafiaNumber + 1);
    }
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
        <div className="number">{mafiaNumber}</div>
        <div
          className={`action ${substractDisabled ? "disabled" : ""}`}
          onClick={handleSubstractClick}
        >
          -
        </div>
      </div>
    </div>
  );
}
