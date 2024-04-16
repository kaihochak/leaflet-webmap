import { PropTypes } from 'prop-types';
import Draw from 'leaflet-draw'; // eslint-disable-line
import isEqual from 'fast-deep-equal';
import React, { useRef, forwardRef } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import leaflet, { Map, Control } from 'leaflet';

const eventHandlers = {
  onEdited: 'draw:edited',
  onDrawStart: 'draw:drawstart',
  onDrawStop: 'draw:drawstop',
  onDrawVertex: 'draw:drawvertex',
  onEditStart: 'draw:editstart',
  onEditMove: 'draw:editmove',
  onEditResize: 'draw:editresize',
  onEditVertex: 'draw:editvertex',
  onEditStop: 'draw:editstop',
  onDeleted: 'draw:deleted',
  onDeleteStart: 'draw:deletestart',
  onDeleteStop: 'draw:deletestop',
};


const EditControl = forwardRef((props, ref) => {
  const context = useLeafletContext();
  const drawRef = useRef();       // for the draw control
  const propsRef = useRef(props); // for the props passed to the component

  // When a new feature is created, add it to the map
  const onDrawCreate = (e) => {
    const { onCreated } = props;
    const container = context.layerContainer || context.map;
    container.addLayer(e.layer);
    onCreated && onCreated(e);
  };

  /********************************************************************************************************
   * The useEffect hook is used to add event listeners to the map and to add the draw control to the map.
   ********************************************************************************************************/

  React.useEffect(() => {
    const { map } = context;      // get the map from the context
    const { onMounted } = props;  // get the onMounted prop

    // Add event listeners to the map
    for (const key in eventHandlers) {
      map.on(eventHandlers[key], (evt) => {                 // for each event handler
        let handlers = Object.keys(eventHandlers).filter(   // get the handlers
          (handler) => eventHandlers[handler] === evt.type  // that match the event type
        );
        if (handlers.length === 1) {              // if there is only one handler
          let handler = handlers[0];              // get the handler
          props[handler] && props[handler](evt);  // call the handler
        }
      });
    }

    map.on(leaflet.Draw.Event.CREATED, onDrawCreate);      // add the draw create event listener
    drawRef.current = createDrawElement(props, context);   // create the draw control
    map.addControl(drawRef.current);                       // add the draw control to the map
    onMounted && onMounted(drawRef.current);               // call the onMounted prop

    return () => {
      map.off(leaflet.Draw.Event.CREATED, onDrawCreate);    // remove the draw create event listener
      for (const key in eventHandlers) {                    // remove the event listeners
        if (props[key]) {                                   // for each event handler
          map.off(eventHandlers[key], props[key]);          // remove the event listener
        }
      }

      drawRef.current.remove(map);                           // remove the draw control from the map
    };
  }, []);

  React.useEffect(() => {
    if (
      isEqual(props.draw, propsRef.current.draw) &&
      isEqual(props.edit, propsRef.current.edit) &&
      props.position === propsRef.current.position
    ) {
      return;
    }
    const { map } = context;

    drawRef.current.remove(map);
    drawRef.current = createDrawElement(props, context);
    drawRef.current.addTo(map);

    const { onMounted } = props;
    onMounted && onMounted(drawRef.current);

    return () => {
      drawRef.current.remove(map);
    };
  }, [props.draw, props.edit, props.position]);

  return null;
});


function createDrawElement(props, context) {
  const { layerContainer } = context;
  const { draw, edit, position } = props;
  const options = {
    edit: {
      ...edit,
      featureGroup: layerContainer,
    },
  };

  if (draw) {
    options.draw = { ...draw };
  }

  if (position) {
    options.position = position;
  }

  return new Control.Draw(options);
}

EditControl.propTypes = {
  ...Object.keys(eventHandlers).reduce((acc, val) => {
    acc[val] = PropTypes.func;
    return acc;
  }, {}),
  onCreated: PropTypes.func,
  onMounted: PropTypes.func,
  draw: PropTypes.shape({
    polyline: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    polygon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    rectangle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    circle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    marker: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  }),
  edit: PropTypes.shape({
    edit: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    remove: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    poly: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    allowIntersection: PropTypes.bool,
  }),
  position: PropTypes.oneOf([
    'topright',
    'topleft',
    'bottomright',
    'bottomleft',
  ]),
  leaflet: PropTypes.shape({
    map: PropTypes.instanceOf(Map),
    layerContainer: PropTypes.shape({
      addLayer: PropTypes.func.isRequired,
      removeLayer: PropTypes.func.isRequired,
    }),
  }),


};

export default EditControl;
