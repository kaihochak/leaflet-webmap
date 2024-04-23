export const getGeojsonFeature = (feature) => {
    let geojsonFeature = feature.toGeoJSON();
    let type = geojsonFeature.geometry.type;
    let text = geojsonFeature.properties.text;
    let textElement = text?.split('<br>').map((line, index) =>
        <p key={index}>{line || <br />}</p>
    );
    let textNewLineString = text?.replace(/<br>/g, '\n');
    return { geojsonFeature, type, text, textElement, textNewLineString };
}