export function Table({ playersNumber, mafiaNumber }) {
  const players = Array.from({ length: 12 });
  return (
    <div className="table">
      {players.map((_, index) => (
        <div
          key={index}
          style={{
            visibility: index < playersNumber ? "visible" : "hidden",
            border: index < mafiaNumber ? "solid 3px red" : "solid 3px white",
          }}
          className="player_place"
        ></div>
      ))}
    </div>
  );
}
