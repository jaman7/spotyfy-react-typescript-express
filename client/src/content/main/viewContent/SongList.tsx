import { IAlbum, IStoreProps, ITrack, StoreName } from 'core/stores/Store.model';
import { inject, observer } from 'mobx-react';
import { IconType } from 'react-icons';
import { FaCheck, FaClock, FaPlay, FaPlus } from 'react-icons/fa';
import { MdAlbum } from 'react-icons/md';
import { IoMdAlbums } from 'react-icons/io';
import { ViewType, ViewTypes } from 'shared/enums/viewTypeEnum';
import SimpleBar from 'simplebar-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Loader from 'shared/components/Loader';

const { STORE } = StoreName;
const { ALBUMS, ALBUM, TRACKS } = ViewType;

interface IBody {
  name?: string | IconType | JSX.Element | null | any;
  class?: string;
  action?: IconType | JSX.Element | null | any;
}

const SongList = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const {
      isLoading,
      tableMaxHeight,
      viewType,
      tracks,
      currentTrack,
      currentAlbum,
      audioRef,
      isPlaying,
      setCurrentTrack,
      playAudio,
      playSongHandler,
    } = Store || {};

    const msToMinutesAndSeconds = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = ((ms % 60000) / 1000).toFixed(0);
      return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
    };

    const buttonClass = (track: ITrack): string => (track.id === currentTrack?.id && isPlaying ? 'fa-pause-circle' : 'fa-play-circle');
    const albumname = (songalbum: ITrack | any, album: IAlbum): string => songalbum?.album?.name ?? album?.albumName ?? '';

    const setPlayTrack = (track: ITrack): void => {
      setCurrentTrack?.(track);
      playAudio?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
      playSongHandler?.(isPlaying as boolean, audioRef as React.RefObject<HTMLAudioElement>);
    };

    const getArtistAlbums = (id: string): void => {
      Store?.updateViewType?.(ALBUMS as ViewTypes);
      Store?.fetchArtistAlbums?.(id);
      Store?.setCurrentTracks?.([]);
    };

    const getArtistAlbum = (albumid: string): void => {
      Store?.updateViewType?.(ALBUM as ViewTypes);
      console.log(albumid);
    };

    const renderHedear = () => {
      const hedear: IBody[] = [
        { name: '', class: 'csn1' },
        { name: '', class: 'csn2' },
        { name: 'TITLE', class: 'cln' },
        { name: 'ARTIST', class: 'cln' },
        { name: 'ALBUM', class: 'cln' },
        { name: <FaClock />, class: 'cmn' },
      ];

      return hedear?.map((item, i) => (
        <div key={i} className={`table-view-cell column-heading ${item.class}`}>
          {item?.name && <p>{item.name}</p>}
        </div>
      ));
    };

    const renderBody = (track: ITrack) => {
      const { name } = track || {};
      const body: IBody[] = [
        { name: <FaPlay className={buttonClass(track)} onClick={() => setPlayTrack(track)} />, class: 'csn play-song' },
        {
          name:
            viewType === TRACKS ? (
              <FaCheck />
            ) : currentTrack?.id === track?.id ? (
              <FaCheck className="add-song" />
            ) : (
              <FaPlus className="add-song" />
            ),
          class: 'csn add-song',
        },
        { name, class: 'cln' },
        {
          name: track?.artists?.[0]?.name,
          class: 'cln',
          action: <IoMdAlbums className={buttonClass(track)} onClick={() => getArtistAlbums(track?.artists?.[0]?.id as string)} />,
        },
        {
          name: albumname(track, currentAlbum as IAlbum),
          class: 'cln',
          action: <MdAlbum className={buttonClass(track)} onClick={() => getArtistAlbum(track?.album?.[0]?.id as string)} />,
        },
        { name: msToMinutesAndSeconds(track?.duration_ms as number), class: 'cmn' },
      ];

      return body?.map((item, i) => (
        <div key={`${i}${name}`} className={`table-view-cell ${item.class}`}>
          {item?.name && (
            <p className={item?.action ? 'with-icons' : ''}>
              {item.name} {item?.action && <span>{item?.action}</span>}{' '}
            </p>
          )}
        </div>
      ));
    };

    const view = (): JSX.Element | JSX.Element[] | undefined => {
      switch (true) {
        case tracks && tracks?.length > 0 && !isLoading:
          return (
            <div className="table-view w-100 h-100">
              <div className="table-view-row table-row--head">{renderHedear()}</div>

              <SimpleBar className="scroll" style={{ maxHeight: tableMaxHeight ?? '30vh' }}>
                <div className="d-block">
                  <TransitionGroup component={null}>
                    {tracks &&
                      tracks?.map((track, index) => (
                        <CSSTransition key={index} timeout={500} classNames="fade">
                          <div
                            key={`${track?.name}track.${track?.id}`}
                            className={track?.id === currentTrack?.id ? 'active table-view-row item' : 'table-view-row item'}
                          >
                            {renderBody(track)}
                          </div>
                        </CSSTransition>
                      ))}
                  </TransitionGroup>
                </div>
              </SimpleBar>
            </div>
          );

        case isLoading:
          return <Loader />;
        default:
          return <></>;
      }
    };

    return view();
  })
);

export default SongList;
