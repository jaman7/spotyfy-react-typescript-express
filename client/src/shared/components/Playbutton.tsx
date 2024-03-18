import { IStoreProps, ITrack, StoreName } from 'core/stores/Store.model';
import { inject, observer } from 'mobx-react';

const { STORE } = StoreName;

const PlayButton = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { tracks, setCurrentTrackPlay, isPlaying, audioRef } = Store || {};

    const setPlayTrack = (): void => {
      setCurrentTrackPlay?.(tracks?.[0] as ITrack, isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
    };

    return (
      <>
        {tracks?.length ? (
          <button type="button" onClick={() => setPlayTrack()} className="btn pause-play-btn">
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        ) : (
          <></>
        )}
      </>
    );
  })
);

export default PlayButton;
