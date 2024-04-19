import Draw from 'leaflet-draw'; // eslint-disable-line
import { PropTypes } from 'prop-types';
import isEqual from 'fast-deep-equal';
import React, { useRef } from 'react';
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

const EditControl = (props) => {
  const context = useLeafletContext();
  const drawRef = useRef();
  const propsRef = useRef(props);

  /********************************************************************************************************
   * Listen to the events triggered by the Draw control
   ********************************************************************************************************/

  React.useEffect(() => {
    const { map } = context;
    const { onMounted } = props;

    // register event handlers
    for (const key in eventHandlers) {

      map.on(eventHandlers[key], (evt) => {
        
        // console.log('EditControl eventHandlers', evt);

        let handlers = Object.keys(eventHandlers).filter(   // get the handlers
          (handler) => eventHandlers[handler] === evt.type  // that match the event type
        );

        if (handlers.length === 1) {              
          let handler = handlers[0];              
          props[handler] && props[handler](evt);  
        }
      });
    }

    // Create the Draw control, onDrawCreate is called when a new feature is created
    map.on(leaflet.Draw.Event.CREATED, onDrawCreate);
    drawRef.current = createDrawElement(props, context);
    map.addControl(drawRef.current);
    onMounted && onMounted(drawRef.current);

    return () => {
      map.off(leaflet.Draw.Event.CREATED, onDrawCreate);
      for (const key in eventHandlers) {
        if (props[key]) {
          map.off(eventHandlers[key], props[key]);
        }
      }
      drawRef.current.remove(map);
    };
  }, []);

  // When a new feature is created, add it to the map
  const onDrawCreate = (e) => {
    const { onCreated } = props;
    const container = context.layerContainer || context.map;
    container.addLayer(e.layer);
    onCreated && onCreated(e);
  };

  /********************************************************************************************************
   * Remount the EditControl component when the props change
   ********************************************************************************************************/

  React.useEffect(() => {

    // If the props haven't changed, return
    if (
      isEqual(props.draw, propsRef.current.draw) &&
      isEqual(props.edit, propsRef.current.edit) &&
      props.position === propsRef.current.position
    ) {
      return;
    }
    const { map } = context;

    // if not, Update the propsRef
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
};


/********************************************************************************************************
 * creates a new instance of the Draw control.
 ********************************************************************************************************/

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

/********************************************************************************************************
 * the type of the props passed to the EditControl component 
 ********************************************************************************************************/

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
