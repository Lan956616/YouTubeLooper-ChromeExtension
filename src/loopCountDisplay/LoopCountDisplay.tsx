type DisplayProps = {
  loopCount: number;
};
const LoopCountDisplay: React.FC<DisplayProps> = ({ loopCount }) => {
  return (
    <div className="loop-count-display">
      已播放<span>{loopCount}</span>次
    </div>
  );
};

export default LoopCountDisplay;
