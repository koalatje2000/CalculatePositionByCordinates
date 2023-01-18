function radians(degrees) {
    return degrees * (Math.PI / 180);
}


function midpoint(points) {
    // Convert longitude and latitude to radians
    var points_radians = points.map(function(point) {
        return [            radians(point[0]),
            radians(point[1]),
            point[2],
            point[3]
        ];
    });

    // Calculate the weighted midpoint between each pair of points
    var midpoints = [];
    for (var i = 0; i < points_radians.length - 1; i++) {
        var p1_lat = points_radians[i][0];
        var p1_lon = points_radians[i][1];
        var p1_rssi = points_radians[i][2];
        var p1_snr = points_radians[i][3];

        var p2_lat = points_radians[i + 1][0];
        var p2_lon = points_radians[i + 1][1];
        var p2_rssi = points_radians[i + 1][2];
        var p2_snr = points_radians[i + 1][3];

        // Calculate the weight of each point based on its RSSI and SNR values
        var p1_weight = Math.pow(10, p1_rssi / 10) * p1_snr;
        var p2_weight = Math.pow(10, p2_rssi / 10) * p2_snr;
        var total_weight = p1_weight + p2_weight;

        // Calculate the weighted midpoint between the two points
        var x = (p1_weight * Math.cos(p1_lat) * Math.cos(p1_lon) + p2_weight * Math.cos(p2_lat) * Math.cos(p2_lon)) / total_weight;
        var y = (p1_weight * Math.cos(p1_lat) * Math.sin(p1_lon) + p2_weight * Math.cos(p2_lat) * Math.sin(p2_lon)) / total_weight;
        var z = p1_weight * Math.sin(p1_lat) / total_weight + p2_weight * Math.sin(p2_lat) / total_weight;
        var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
        var lon = Math.atan2(y, x);
        midpoints.push([lat, lon]);
    }

    // Calculate the final weighted midpoint between all the midpoints
    var total_weight = points_radians.reduce(function(sum, point) {
        return sum + Math.pow(10, point[2] / 10) * point[3];
    }, 0);
    var x = points_radians.reduce(function(sum, point) {
        return sum + Math.pow(10, point[2] / 10) * point[3] * Math.cos(point[0]) * Math.cos(point[1]);
    }, 0) / total_weight;
    var y = points_radians.reduce(function(sum, point) {
    return sum + Math.pow(10, point[2] / 10) * point[3] * Math.cos(point[0]) * Math.sin(point[1]);
    }, 0) / total_weight;
    var z = points_radians.reduce(function(sum, point) {
    return sum + Math.pow(10, point[2] / 10) * point[3] * Math.sin(point[0]);
    }, 0) / total_weight;
    var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var lon = Math.atan2(y, x);
    // Convert back to degrees
    var lat = (lat * 180) / Math.PI;
    var lon = (lon * 180) / Math.PI;
    return [lat, lon];
}



// Py wierden (MessageId: 43859)
var PyWierden_Point = [[ 52.36891310514845, 6.602898538112641, -73, 10.5]];

// Py saxion (MessageId: 43861)
var PySaxion_Point = [
    [52.2212025684184, 6.88635438680649, -86, 7.5],
    [52.22121, 6.8857374, -106, 3.5] 
];

// Lopy-sensor (MessageId: 43864)
var LoPy_Point = [
    [52.23997, 6.85014, -109, 1.8], //kerk
    [52.22127532, 6.90716252, -106, 3.5], //eui-000080029c09ded1
    [52.22121, 6.8857374, -109, 4.8] //pocket broker
]


var midpointCoordinates = midpoint(PySaxion_Point);
console.log(midpointCoordinates);
