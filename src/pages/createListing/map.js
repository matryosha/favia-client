export function initMap(mapClickCallback) {
    const map = L.map('map').setView([50.0734, 14.4150], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let lastMarker = null

    map.on('click', async (e) => {
        console.log(e)
        await mapClickCallback(e, () => {
            const {lat, lng} = e.latlng;

            if (lastMarker) {
                map.removeLayer(lastMarker)
            }

            lastMarker = L.marker([lat, lng])
            map.addLayer(lastMarker)
        })
    })


    function setMapView(lat, lon, zoom) {
        if (lastMarker) {
            map.removeLayer(lastMarker)
        }

        map.setView([lat, lon], zoom)
        lastMarker = L.marker([lat, lon])
        map.addLayer(lastMarker)
    }

    console.log(map)

    return { setMapView, invalidateMapSize: () => map.invalidateSize() }
}