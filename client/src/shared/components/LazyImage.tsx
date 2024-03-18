import { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { StoreName } from 'core/stores/Store.model';

const { STORE } = StoreName;

const LazyImage = inject(STORE)(
  observer(props => {
    const { id, className, src, alt } = props;

    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      if (imgRef.current && imgRef?.current?.complete) {
        setLoaded(true);
      }
    }, []);

    return (
      <>
        {!loaded && <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="" aria-hidden="true" />}
        <img
          id={id}
          loading="lazy"
          src={src}
          alt={alt}
          ref={imgRef}
          onLoad={() => setLoaded(true)}
          className={`${className} ${loaded ? 'lazyloaded' : 'lazyloading'}`}
        />
      </>
    );
  })
);

export default LazyImage;
