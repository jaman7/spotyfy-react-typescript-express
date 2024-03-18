import { Dispatch, SetStateAction } from 'react';
import { ITrackInfo } from './player.model';
import { ITrack } from 'core/stores/Store.model';

interface IProps {
  currentTrack?: ITrack;
  setTrackInfo?: Dispatch<SetStateAction<ITrackInfo>>;
}

const Song = (props: IProps) => {
  const { currentTrack } = props || {};

  return (
    <div className="song-info">
      <p>{currentTrack?.name ? currentTrack?.name : ''}</p>
      <p>{currentTrack?.artists ? currentTrack?.artists[0].name : ''}</p>
    </div>
  );
};

export default Song;
