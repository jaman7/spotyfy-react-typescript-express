import { inject, observer } from 'mobx-react';
import { ITrackInfo } from './player.model';
import { Dispatch, SetStateAction } from 'react';
import Button from 'shared/components/Button';
import Previcon from 'shared/components/Previcon';
import Pauseicon from 'shared/components/Pauseicon';
import Playicon from 'shared/components/Playicon';
import Nexticon from 'shared/components/Nexticon';
import { IStoreProps, StoreName } from 'core/stores/Store.model';

const { STORE } = StoreName;

const Player = inject(STORE)(
  observer((props: IStoreProps & { trackInfo?: ITrackInfo; setTrackInfo?: Dispatch<SetStateAction<ITrackInfo>> }) => {
    const { Store, trackInfo, setTrackInfo } = props || {};
    const { audioRef, isPlaying, tracks = [], currentTrack, setCurrentTrack, playAudio, playSongHandler } = Store || {};

    const color = ['#b3b3b3', '#2ab3bf'];

    const trackAnim = {
      transform: `translateX(${trackInfo?.animationPercentage}%)`,
    };

    const getTime = (time: number): string => `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

    const dragHandler = (e): void => {
      if (audioRef) {
        audioRef.current.currentTime = e?.target?.value ?? 0;
        setTrackInfo?.({ ...trackInfo, currentTime: e?.target?.value ?? 0 });
      }
    };

    const skipTrackHandler = async (direction: string): Promise<void> => {
      const currentIndex = tracks?.findIndex(song => song.id === currentTrack?.id) ?? -1;
      if (direction === 'skip-forward') {
        await setCurrentTrack?.(tracks?.[(currentIndex + 1) % tracks?.length]);
        playAudio?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
        return;
      }
      if (direction === 'skip-back') {
        if ((currentIndex - 1) % tracks.length === -1) {
          await setCurrentTrack?.(tracks?.[tracks?.length - 1]);
          playAudio?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
          return;
        }
        await setCurrentTrack?.(tracks?.[(currentIndex - 1) % tracks?.length]);
      }
      if (isPlaying) audioRef?.current?.play?.();
    };

    return (
      <div className="player">
        <div className="play-control">
          <Button type="button" className="reverse" aria-label="Reverse" onClick={() => skipTrackHandler('skip-back')}>
            <Previcon />
          </Button>

          <Button
            type="button"
            className="play"
            aria-label="Play"
            onClick={() => playSongHandler?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>)}
          >
            {isPlaying ? <Pauseicon /> : <Playicon />}
          </Button>

          <Button type="button" className="next" aria-label="Next" onClick={() => skipTrackHandler('skip-forward')}>
            <Nexticon />
          </Button>
        </div>
        <div className="playback-bar">
          <p className="playback-bar__progress-time">{getTime?.(trackInfo?.currentTime as number)}</p>
          <div
            style={{
              background: `linear-gradient(to right, ${color?.[0]},${color?.[1]})`,
            }}
            className="track"
          >
            <input value={trackInfo?.currentTime} type="range" max={trackInfo?.duration || 0} min={0} onChange={dragHandler} />
            <div style={trackAnim} className="animate-track" />
          </div>
          <p className="playback-bar__progress-time">{trackInfo?.duration ? getTime(trackInfo?.duration) : '0:00'}</p>
        </div>
      </div>
    );
  })
);

export default Player;
