const app= {
    item: {
    map:undefined
    },

    init: function(){
            app.item.map= new google.maps.Map(document.getElementById("map"),{
                zoom: 10,
                center: {
                lat: -10.0000000, 
                lng: -76.0000000
            },
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl:false
        });
        
        var inputOrigin = document.getElementById('origin');
        var autocompleteOrigin = new google.maps.places.Autocomplete(inputOrigin);
        autocompleteOrigin.bindTo('bounds', app.item.map);
        app.detailLocationOrigin = new google.maps.InfoWindow();
        app.markerOrigin = app.createMarker(app.item.map);

        app.createListener(autocompleteOrigin, app.detailLocationOrigin, app.markerOrigin);
        
        var inputDestiny = document.getElementById('destiny');
        var autocompleteDestiny = new google.maps.places.Autocomplete(inputDestiny);
        autocompleteDestiny.bindTo('bounds', app.item.map);
        var detailLocationDestiny = new google.maps.InfoWindow();
        var markerDestiny = app.createMarker(app.item.map); 
        
        app.createListener(autocompleteDestiny, detailLocationDestiny, markerDestiny);
        /*My actual Location*/
        document.getElementById("findMe").addEventListener("click", app.searchMyLocation);
        /*Route*/
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        
        document.getElementById("route").addEventListener("click", function(){
            app.drawRoute(directionsService, directionsDisplay);
        });
        directionsDisplay.setMap(app.item.map);
    },

    createListener: function(autocomplete, detailLocation, marker) {
        autocomplete.addListener('place_changed', function() {
            detailLocation.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            app.markLocation(place, detailLocation, marker);
        });
    },
    
    searchMyLocation: function() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(app.markAutomaticLocation,app.functionError);
        }
    },
    
    functionError: function(error) {
            alert("Tenemos un problema para encontrar tu ubicación");
    },
    
    markAutomaticLocation: function(position) {
        var latitud, longitud;
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;

        app.markerOrigin.setPosition(new google.maps.LatLng(latitud, longitud));
        app.item.map.setCenter({
            lat: latitud,
            lng: longitud
        });

        app.item.map.setZoom(17);
        app.markerOrigin.setVisible(true);
        app.detailLocationOrigin.setContent('<div><strong>Mi ubicación actual</strong><br>');
        app.detailLocationOrigin.open(app.item.map, app.markerOrigin);
    },
    
    markLocation: function(place, detailLocation, marker) {
        if (!place.geometry) {
            // Error if it doesn't find the place 
            window.alert("No encontramos el lugar que indicaste: '" + place.name + "'");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            app.item.map.fitBounds(place.geometry.viewport);
        } else {
            app.item.map.setCenter(place.geometry.location);
            app.item.map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        detailLocation.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        detailLocation.open(app.item.map, app.createMarker.marker);
    },
    
    createMarker: function(map) {
        var icon = {
            url: 'http://www.freepngimg.com/download/taxi_cab/4-2-taxi-cab-high-quality-png.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        };
    
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            icon: icon,
            anchorPoint: new google.maps.Point(0, -1)
        });
    
            return marker;
    },
    
    drawRoute: function(directionsService, directionsDisplay) {
        var origin = document.getElementById("origin").value;
        var destination = document.getElementById('destiny').value;

        if(destination != "" && destination != "") {
            directionsService.route({
                origin: origin,
                destination: destination,
                travelMode: "DRIVING"
            },
            function(response, status) {
                if (status === "OK") {
                    directionsDisplay.setDirections(response);
                } else {
                    app.functionErrorRoute();
                }
            });
        }
    },
    
    functionErrorRoute: function() {
        alert("No ingresaste un origen y un destino validos");
    }    
}

function initMap(){
	app.init();
}