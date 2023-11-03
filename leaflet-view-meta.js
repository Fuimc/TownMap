L.Control.ViewMeta = L.Control.extend({
    options: {
        position: `topright`,
        placeholderHTML: `-----`
    },

    onRemove: function () {
        L.DomUtil.remove(this.container);
    },

    onAdd: function (map) {
        this.map = map;

        this.container = L.DomUtil.create(`div`, `leaflet-view-meta`);

        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.on(this.container, `control_container`, function (e) {
            L.DomEvent.stopPropagation(e);
        });
        L.DomEvent.disableScrollPropagation(this.container);

        let table = L.DomUtil.create(
            `table`,
            `leaflet-view-meta-table`,
            this.container
        );

        // map center
        this.addDividerRow(table, `Center`);
        this.lat_e = this.addDataRow(table, `Latitude`);
        this.lng_e = this.addDataRow(table, `Longitude`);


        this.nb_e = (table, `Northern Bound`);
        this.sb_e = (table, `Southern Bound`);
        this.eb_e = (table, `Eastern Bound`);
        this.wb_e = (table, `Western Bound`);

        this.map.on(`resize`, () => this.update());
        this.map.on(`zoomend`, () => this.update());
        this.map.on(`dragend`, () => this.update());

        this.urlParams = new URLSearchParams(window.location.search);
        this.parseParams();

        return this.container;
    },

    addDividerRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdDivider = tr.insertCell();
        tdDivider.colSpan = 2;
        tdDivider.innerText = labelString;
    },

    addDataRow: function (tableElement, labelString) {
        let tr = tableElement.insertRow();
        let tdLabel = tr.insertCell();
        tdLabel.innerText = labelString;
        let tdData = tr.insertCell();
        tdData.innerHTML = this.options.placeholderHTML;
        return tdData;
    },

    parseParams: function () {
        let lat, lng, nb, wb, sb, eb, nw_bound, se_bound, bounds;
        try {
            lat = +this.urlParams.get("lat")/32;
            lng = +this.urlParams.get("lng")/32;

            if (lat && lng) {
                this.map.panTo(new L.LatLng(lat, lng));
            }

            nb = +this.urlParams.get("nb")/32;
            wb = +this.urlParams.get("wb")/32;
            sb = +this.urlParams.get("sb")/32;
            eb = +this.urlParams.get("eb")/32;

            if (nb && sb && eb && wb) {
                nw_bound = L.latLng(nb, wb);
                se_bound = L.latLng(sb, eb);

                bounds = L.latLngBounds(nw_bound, se_bound);

                this.map.fitBounds(bounds);
            }
        } catch (e) {
            console.log(e);
        }
    },

    update: function () {
        let center = this.map.getCenter();
        let bounds = this.map.getBounds();
        
        let latNum = Math.round(center.lat*-32);
        let lngNum = Math.round(center.lng*32);

        let nbNum = (bounds.getNorth()*32);
        let sbNum = (bounds.getSouth()*32);
        let ebNum = (bounds.getEast()*32);
        let wbNum = (bounds.getWest()*32);

        this.lat_e.innerText = this.formatNumber(latNum);
        this.lng_e.innerText = this.formatNumber(lngNum);

        this.nb_e.innerText = nbNum;
        this.sb_e.innerText = sbNum;
        this.eb_e.innerText = ebNum;
        this.wb_e.innerText = wbNum;
        

        this.urlParams.set("lat", latNum);
        this.urlParams.set("lng", lngNum);

        this.urlParams.set("nb", nbNum);
        this.urlParams.set("sb", sbNum);
        this.urlParams.set("eb", ebNum);
        this.urlParams.set("wb", wbNum);

        window.history.replaceState(
            {},
            "",
            `?${this.urlParams.toString()}`
        );
    },

    formatNumber: function (num) {
        return num.toLocaleString({
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });
    }
});

L.control.viewMeta = function (options) {
    return new L.Control.ViewMeta(options);
};

