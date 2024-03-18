import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Song from './Song';
import Player from './Player';
import Volume from './Volume';
import { ITrackInfo } from './player.model';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import ArtWork from 'content/sidebar/ArtWork';

const { STORE } = StoreName;

const AudioPlayer = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { sidebarStatus, isLoading, isPlaying, audioRef, tracks = [], currentTrack, setCurrentTrack, playAudio } = Store || {};

    useEffect(() => {
      if (!isLoading && tracks?.length && tracks?.[0].preview_url?.length) {
        setCurrentTrack?.(tracks[0]);
      }
    }, [!isLoading]);

    const setSrc = currentTrack?.preview_url ? currentTrack?.preview_url : '';

    const [trackInfo, setTrackInfo] = useState<ITrackInfo>({
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
      volume: 0.75,
    });

    const timeUpdateHandler = (e: React.ReactEventHandler<HTMLAudioElement> | undefined | any): void => {
      const { duration, currentTime } = e?.target || {};
      const roundedCurrent = Math.round(currentTime);
      const roundedDuration = Math.round(duration);
      const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
      setTrackInfo({
        ...trackInfo,
        currentTime,
        duration,
        animationPercentage: percentage,
      });
    };

    const songEndHandler = async () => {
      const currentIndex = tracks?.findIndex(song => song?.id === currentTrack?.id) ?? -1;
      if (currentIndex > -1) {
        await setCurrentTrack?.(tracks?.[(currentIndex + 1) % tracks?.length]);
        playAudio?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
      }
    };

    return (
      <>
        {!sidebarStatus ? <ArtWork customClass={!sidebarStatus ? 'max-90' : ''} /> : <></>}
        <div className="now-playing">
          <Song currentTrack={currentTrack} />
          <Player trackInfo={trackInfo} setTrackInfo={setTrackInfo} />
          <Volume audioRef={audioRef} setTrackInfo={setTrackInfo} trackInfo={trackInfo} />

          <audio
            onLoadedMetadata={timeUpdateHandler}
            onTimeUpdate={timeUpdateHandler}
            ref={audioRef}
            src={setSrc}
            onEnded={songEndHandler}
          />
        </div>
      </>
    );
  })
);

export default AudioPlayer;
