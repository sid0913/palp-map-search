window.onload = onLoad;

//tracks the number of chips since the window has been loaded
let num_of_chips = 0;
let map

//get a random color for the chips and markings on the map
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  //all hues are included
  const h = Math.floor(Math.random() * 360)

  //80 to 100 range to avoid grays
  const s = 80+ Math.floor(Math.random() * 20)

  //0-50 to keep the color dark
  const l = 0+ Math.floor(Math.random() * 50)

  return `hsl(${h}, ${s}%, ${l}%)`;
}

//function to build chips
function create_chip(chip_body, chips_div){

  //get a color for the chip
  const color = getRandomColor();

  //increase the number of chips

  //render the leaflet stuff

  let found = false;

  let response = async function(){
    let res
    arr = getGeoJSON(chip_body);

    arr.then((arr)=>{
    
    //get geojson retrieval details
    res = arr[0]
    found = arr[1]

    //if found get the geojsons
    if(found){
      addGeoJsons(res, color)

      //add chip
      chips_div.innerHTML+=`<div style="background-color:${color}" class=" p-1 rounded-full text-sm flex my-auto max-auto h-8 w-20  mx-2 text-white text-center">
          <span class="mx-auto my-auto text-white text-center">
              ${chip_body}
          </span>
          <span class="mx-auto my-auto closebtn" onclick="this.parentElement.style.display='none'">&times;</span>
        </div> `;
    }


  
  //if not found remove the chip that has been added- it must have already been added by now since this function is async
    if (!found){
      console.log("not found here")
    }

      //add an empty chip
      chips_div.innerHTML+= "";
    });
    
    

  }();





}



function search_bar(){
  
  //get the searched value
  const search_input = document.getElementById('search-input');
  const new_value = search_input.value;



  //delete the 
  search_input.value = "";

  //get the div with all the chips
  const chips_div = document.getElementById('chips-div');

  //create chips
  create_chip(new_value, chips_div)




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

    // let response = async function(){
    //     let res = await getGeoJSON("snake");




    //     try{
    //     let list_of_geo_jsons = res.features;
    //     let myStyle = {
    //       "color": "#ff7800",
    //       "weight": 5,
    //       "opacity": 0.85
    //   };


    //     //works with colors
    //     list_of_geo_jsons.forEach(element => {
    //       let myLayer = L.geoJSON(element.geometry, {style:myStyle}).addTo(map);
    //     });
        

    //   }

    //     catch(err){
    //       console.log("didn't receive response from the palp server")
    //       throw err;
          
    //     }

    //     return res;
    // }();


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
  });
}



async function getGeoJSON(item){
    let geo_json;
    //whether the endpoint was found
    let found = false;

    //fetch the api response
  
        // const response = await fetch("http://palp.art/api/geojson/snake", { headers: {'Content-Type':'application/json','Access-Control-Request-Method':'GET', 'Access-Control-Request-Headers': 'Content-Type, Authorization'}});
        const response = await fetch(`http://palp.art/api/geojson/${item}`);

        console.log(response)
        if (!response.ok) {
          console.log("url not found")
          throw new Error("Network response was not OK");
        }
        else{
          

          try{
            //get text from the response
            text = await response.text()

            //if text is empty aka the item doesn't exist in the palp api then show an alert saying that it doesn't exist
            if(text === ""){
              alert("searched item doesn't exist")
            }
            else{
              // geo_json = response.json();

              //get the geojson
              geo_json = JSON.parse(text)

              found = true;

            }

          }
          catch(err){
            console.log("Error while retrieving the geojson")
          }



        }


    return [geo_json, found];
}