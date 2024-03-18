import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';

const { STORE } = StoreName;

const TrackSearch = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};

    const [searchTerm, setSearchTerm] = useState('');

    const handleUpdateSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    return (
      <>
        <div className="track-search-container">
          <form
            onSubmit={() => {
              Store?.searchTracks?.(searchTerm);
            }}
          >
            <input onChange={e => handleUpdateSearchTerm(e)} type="text" placeholder="Search..." aria-label="Search..." />
            <button
              type="submit"
              onClick={e => {
                e.preventDefault();
                Store?.searchTracks?.(searchTerm);
              }}
            >
              <i className="fa fa-search search" aria-hidden="true" />
            </button>
          </form>
        </div>
      </>
    );
  })
);

export default TrackSearch;
