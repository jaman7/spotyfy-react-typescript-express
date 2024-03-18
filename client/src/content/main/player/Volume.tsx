import { Dispatch, SetStateAction } from 'react';
import { ITrackInfo } from './player.model';

interface IProps {
  audioRef?: React.RefObject<any | null>;
  setTrackInfo?: Dispatch<SetStateAction<ITrackInfo>>;
  trackInfo?: ITrackInfo;
}

const Volume = (props: IProps) => {
  const { audioRef, setTrackInfo, trackInfo } = props || {};

  const changeVolume = e => {
    const { value } = e.target;
    audioRef.current.volume = value;
    setTrackInfo?.({ ...trackInfo, volume: value });
  };

  return (
    <>
      <div className="volume-container">
        <i className="fa fa-volume-up" aria-hidden="true" />
        <input onChange={changeVolume} value={trackInfo?.volume} max="1" min="0" step="0.01" type="range" />
      </div>
    </>
  );
};

export default Volume;
