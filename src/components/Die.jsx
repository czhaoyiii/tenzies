export default function Die(props) {
  return (
    <div
      onClick={props.lockDice}
      style={{ backgroundColor: props.isHeld ? "#59E391" : "" }}
      className="dice"
    >
      <h2 className="diceDisplay">{props.value}</h2>
    </div>
  );
}
