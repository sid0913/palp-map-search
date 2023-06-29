window.onload = onLoad;



function onLoad(){
    var map = L.map('map').setView([40.749908945558815,  14.50079038639771], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    let response = async function(){
        let res = await getGeoJSON();
        // let gj =res.features[1].geometry;
        // console.log(gj);

        // try{

        //   let myLayer = L.geoJSON().addTo(map);
        //   myLayer.addData(gj);
        // }



        try{
        let list_of_geo_jsons = res.features;
        list_of_geo_jsons.forEach(element => {
          let myLayer = L.geoJSON().addTo(map);
          myLayer.addData(element.geometry);
        });
      }

        catch(err){
          throw err;
        }

        return res;
    }();


}



async function getGeoJSON(){
    let geo_json;

    //fetch the api response
    try {
        // const response = await fetch("http://palp.art/api/geojson/snake", { headers: {'Content-Type':'application/json','Access-Control-Request-Method':'GET', 'Access-Control-Request-Headers': 'Content-Type, Authorization'}});
        const response = await fetch("http://palp.art/api/geojson/snake");

        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        else{
          geo_json = response.json();

        }
      } catch (error) {
        console.error("Error:", error);
      }

    return geo_json;
}