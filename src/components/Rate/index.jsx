import { useMemo } from 'react';
import './index.less';

export default (props) => {
  const { total = 5, defaultValue = 0, value = 0, onChange, children } = props;
  const handleScoreChange = cIdx => () => {
    onChange(cIdx + 1);
  };
  const jsxEle = useMemo(() => {
    return (
      <div className="com-rate__wrapper">
        <div className="com-rate__star">
          {Array.from({ length: total }).map((_, idx) => {
            return (
              <span
                key={idx}
                className={`${value >= idx + 1 ? 'com-rate__score' : ''}`}
                onClick={handleScoreChange(idx)}
              />
            );
          })}
        </div>
        <div className="com-rate__tip">{children}</div>
      </div>
    );
  }, [value]);
  return jsxEle;
};
