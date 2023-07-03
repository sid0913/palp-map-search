window.onload = onLoad;

//function to build chips
function create_chip(chip_body){
  return `<div class="rounded-full bg-lime-200 text-sm flex my-auto max-auto h-8 w-20  mx-2">
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


  //add chips

//   let input = document.querySelector(".chip-input");
//   let chips = document.querySelector(".chips");
  
//   document.querySelector(".form-field")
//      .addEventListener('click',() => {
//         input.style.display = 'block';
//         input.focus();
//      });
     
//   input.addEventListener('blur',()=>{
//     input.style.display = 'none';
//   });
  
//   input.addEventListener('keypress', function(event){
//      if(event.which === 13)
//      {
       
        
  
//         chips.appendChild(function ()
//         {
//            let _chip = document.createElement('div');
  
//            _chip.classList.add('chip');
//            _chip.addEventListener('click', chipClickHandler);
  
//            _chip.append(
//               (function ()
//               {
//                  let _chip_text = document.createElement('span');
//                  _chip_text.classList.add('chip--text');
//                  _chip_text.innerHTML = input.value;
  
//                  return _chip_text;
//               })(),
//               (function ()
//               {
//                  let _chip_button = document.createElement('span');
//                  _chip_button.classList.add('chip--button');
//                  _chip_button.innerHTML = 'x';
  
//                  return _chip_button;
//               })()
//            );
  
//            return _chip;
//         }());
//         input.value = '';
//      }
//   });
    
//   function chipClickHandler(event){
//      chips.removeChild(event.currentTarget);
// }

}

function onLoad(){

    //create an onclicklistenser for the search form
    document.getElementById('search-form').addEventListener('submit', search_bar);

    //leafet
    let map = L.map('map').setView([40.749908945558815,  14.50079038639771], 15);
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