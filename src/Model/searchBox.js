
const searchBarElement = document.querySelector('.js-searchBar');
let listShowcaseElement = document.querySelector("#js-resultShowCase");
let filteredListElement = document.querySelector("#list");

searchBarElement.disabled=true;
let fuse = undefined;
let arrayLength=0;
let dataRowHtml=``;


const options = {
  includeScore: true, 
  threshold: 0.4,
  keys: ['school_name'] 
};


veriGetir().then(result=>{
  //console.log(result)
  fuse = new Fuse(objArr, options);
  searchBarElement.disabled=false;
  searchBarElement.placeholder="Lise ismini giriniz";
}
);



function bringList(selectedSchool){

  

  fetch('http://localhost:5003/api/sendHighSchool', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedSchoolName: selectedSchool,
      
    }),
  })
    .then(response => response.json())
    .then(data => {
        //console.log('Sunucudan gelen yanıt:', data);
        arrayLength=data.length;
        let i=0;

        
    
        while(i<arrayLength){

        dataRowHtml+=`<tr>
        <td>${data[i].university_name}</td>
        <td>${data[i].name_of_field}</td>
        <td>${data[i].early_graduated}</td>
        <td>${data[i].new_graduated}</td>
        </tr>`
    
        i++;
        }

    
        listShowcaseElement.innerHTML=`<table style='width:100%'><tr><th style='width:40%'>Universite</th><th style='width:20%'>Bolum</th><th>Eski Mezun</th><th>Yeni Mezun</th></tr>${dataRowHtml}</table>`

        dataRowHtml=``;


      })
    .catch(error => {
      console.error('Hata oluştu:', error);
    });



}

let counter=0;

let previousindex;

function toggleStyle(index){


if(!(document.querySelector("#searchResult"+index).classList.contains("selected"))){


if(counter==1){
    document.querySelector("#searchResult"+previousindex).classList.remove("selected");

    document.querySelector("#searchResult"+index).classList.add("selected");
    counter--;
  }


document.querySelector("#searchResult"+index).classList.add("selected");

counter++;
previousindex=index;
}


}



searchBarElement.addEventListener("keyup",(eventObj)=>{
  if((eventObj.keyCode>=65 && eventObj.keyCode <=90) || eventObj.keyCode==13 || eventObj.keyCode==8){
  
    filteredListElement.innerHTML = '';

    
    listShowcaseElement.innerHTML=``;
    
    
    if(!searchBarElement.value==""){
      const anotherResult = fuse.search(searchBarElement.value); 
      //console.log(anotherResult);
      
      

      let i=0

      while(i<10){
        
        if(anotherResult[i]!=undefined){

        filteredListElement.innerHTML+=`<p style="font-size: 12px;"><span style="cursor: pointer;" id="searchResult${i}" onclick="bringList('${anotherResult[i].item.school_name}');toggleStyle(${i});">${anotherResult[i].item.school_name} </span></p>`;

        }  

        i++;
      
      
      }
      
    

    }


    }
});