type RepeatButtonProps = {
  isLoop: boolean;
  onClick: () => void;
};
const RepeatButton: React.FC<RepeatButtonProps> = ({ isLoop, onClick }) => {
  return (
    <div className={`repeat-button ${isLoop && "active"}`} onClick={onClick}>
      {!isLoop && (
        <img src={chrome.runtime.getURL("pictures/loop.png")} alt="loop Icon" />
      )}
      {isLoop && (
        <img
          src={chrome.runtime.getURL("pictures/yellow-loop.png")}
          alt="yellow Loop Icon"
        />
      )}
    </div>
  );
};

export default RepeatButton;
