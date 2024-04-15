import { Icon } from 'leaflet';
import marker1 from '@/assets/marker-icons/marker1.png';
import marker2 from '@/assets/marker-icons/marker2.png';

export const MARKER_ICONS = [
    { id: 1, icon: marker1 },
    { id: 2, icon: marker2 },
]

export const DEFAULT_POSITION = [52.26927690226104, -113.81143282313303];

export const MARKERS = [
    { id: 1, position: [51.05584392400242, -114.0700604464782], text: "Prince's Island Park" },
    { id: 2, position: [51.475052218188836, -112.71714892175292], text: "Drumheller" },
    { id: 3, position: [53.30757927911323, -113.58225071091397], text: "Edmonton International Airport" },
    { id: 4, position: [53.544389, -113.490927], text: "West Edmonton Mall" },
    { id: 5, position: [51.178363, -115.570769], text: "Banff National Park" },
    { id: 6, position: [51.496846, -115.928056], text: "Jasper National Park" },
];

export const CUSTOM_ICON = new Icon({
    iconUrl: marker1,
    iconSize: [40, 40],
    iconAnchor: [22, 40],
    popupAnchor: [-3, -76],
});
