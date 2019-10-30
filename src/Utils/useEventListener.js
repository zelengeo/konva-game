import {useEffect, useRef} from 'react';

function useEventHandler(type, handler, target = document, options) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    function() {
      const eventListener = function(event) {
        savedHandler.current(event);
      };
      target.addEventListener(type, eventListener, options);

      return function() {
        target.removeEventListener(type, eventListener, options);
      };
    },
    [type, target, options]
  );
}

export default useEventHandler;
