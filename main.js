window.onload = onLoad;

//tracks the number of chips since the window has been loaded
let num_of_chips = 0;
let map


//get random color
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//function to build chips
function create_chip(chip_body){
  console.log(getRandomColor())
  const color = getRandomColor();

  //increase the number of chips

  //render the leaflet stuff


  let response = async function(){
    let res = await getGeoJSON(chip_body);

    if(res.ok){
      
    }
    
    addGeoJsons(res, color)
    console.log("here");

  }();

  //render a chip and add a index number for the particular chip
  return `<div style="background-color:${color}" class=" p-1 rounded-full text-sm flex my-auto max-auto h-8 w-20  mx-2">
  <span class="mx-auto my-auto">
       ${chip_body}
  </span>
  <span class="mx-auto my-auto closebtn" onclick="this.parentElement.style.display='none'">&times;</span>
</div> `;



}



function search_bar(){
  const search_input = document.getElementById('search-input');
  const new_value = search_input.value;



  //delete the 
  search_input.value = "";

  const chips = document.getElementById('chips');
  chips.innerHTML+=(create_chip(new_value))



}

function onLoad(){

    //create an onclicklistenser for the search form
    document.getElementById('search-form').addEventListener('submit', search_bar);

    //leafet
    map = L.map('map').setView([40.749908945558815,  14.50079038639771], 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    let response = async function(){
        let res = await getGeoJSON("snake");
        // let gj =res.features[1].geometry;
        // console.log(gj);

        // try{

        //   let myLayer = L.geoJSON().addTo(map);
        //   myLayer.addData(gj);
        // }



        try{
        let list_of_geo_jsons = res.features;
        let myStyle = {
          "color": "#ff7800",
          "weight": 5,
          "opacity": 0.85
      };
      //works
        // list_of_geo_jsons.forEach(element => {
        //   let myLayer = L.geoJSON().addTo(map);
        //   myLayer.addData(element.geometry);
        // });

        //works with colors
        list_of_geo_jsons.forEach(element => {
          let myLayer = L.geoJSON(element.geometry, {style:myStyle}).addTo(map);
          // myLayer.addData(element.geometry);
        });
        
        //didn't add color but no errors
        // list_of_geo_jsons.forEach(element => {
        //   let myLayer = L.geoJSON().addTo(map);
        //   myLayer.addData(element.geometry, {style:myStyle});
        // });
      }

        catch(err){
          console.log("didn't receive response from the palp server")
          throw err;
          
        }

        return res;
    }();


}

function addGeoJsons(api_response, color){
  let list_of_geo_jsons;
  if(api_response.features){
    list_of_geo_jsons = api_response.features;

  }

  else{
    list_of_geo_jsons = [api_response]
  }
        let geoJsonStyle = {
          "color": color,
          "weight": 5,
          "opacity": 0.85
      };


  list_of_geo_jsons.forEach(element => {
  L.geoJSON(element.geometry, {style:geoJsonStyle}).addTo(map);
    // myLayer.addData(element.geometry);
  });
}



async function getGeoJSON(item){
    let geo_json;

    //fetch the api response
    try {
        // const response = await fetch("http://palp.art/api/geojson/snake", { headers: {'Content-Type':'application/json','Access-Control-Request-Method':'GET', 'Access-Control-Request-Headers': 'Content-Type, Authorization'}});
        const response = await fetch(`http://palp.art/api/geojson/${item}`);

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