var map;
var infowindow = null;

function initMap() {
    
    map = new google.maps.Map(document.getElementById('storemap'), {
        center: {lat: parseFloat(defaultLat), lng: parseFloat(defaultLong)},
        disableDefaultUI:true,
        fullscreenControl:true,
        streetViewControl:true,
        zoom: defaultZoom
    });
    
    $.ajax({
        method: 'POST',
        url: storeGGmapCall,
        data: { 
            allStores: 1,
            id_lang: id_lang,
        },
        dataType: 'json',
        success: function(json) {
            for (store of json.storeList) {
                createMarker(map, store);
            }
        }
    })
}

function createMarker(theMap, theStore) {
    
    if (urlIcon) {
        var marker = new google.maps.Marker({
            position: {lat: theStore.latitude, lng: theStore.longitude},
            icon : urlIcon,
            title: theStore.name,
        });
    } else {
        var marker = new google.maps.Marker({
            position: {lat: theStore.latitude, lng: theStore.longitude},
            title: theStore.name,
        });
    }
    
    marker.addListener('click', function() {
        if (infowindow) {
            infowindow.close();
        }
        infowindow = new google.maps.InfoWindow({
            content: infosHtml(theStore),
            maxWidth : 350,
        });
        infowindow.open(theMap, marker);
    });
    
    marker.setMap(theMap);
}

function infosHtml(store){
    var storeHtml = '<div id="store_infos">';
    storeHtml += '<p><b>' + store.name + '</b></p>';
    storeHtml += '<p>' + store.address1 + (store.address2 ? '<br />' + store.address2 : '') + '<br/>' + store.city + ', ' + (store.postcode ? store.postcode : '');
    storeHtml += '<br/>' + store.country + (store.state ? ', ' + store.state : '') + '</p>';
    if ( store.phone || store.fax) {
        storeHtml += '<p> ' + transPhone + ' : ' + (store.phone ? store.phone : ' -') + '<br />' + transFax + ' : ' + (store.fax ? store.fax : ' -') + '</p><hr/>';
    }
    if (store.note) {
        storeHtml += '<p> Note : ' + store.note + '</p><hr/>';
    }
    if (store.hours) {
        storeHtml += '<ul>';
        storeHtml += '<li>' + transOpenhours + ' :</li>';
        for (hours of store.hours) {
            storeHtml += '<li>' + hours + '</li>';
        }
        storeHtml += '</ul>';
    }
    storeHtml += '</div>';
    return storeHtml;
}

$(document).ready(function(){
    initMap();
});
