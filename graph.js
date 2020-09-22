
let dailyData = null;
let threshhold = 10000;
let cleanData = [];
let requestCountries = "";
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
function getData() {
   
        fetch("https://api.covid19api.com/summary", requestOptions)
  .then(response => response.json())
  .then(result => storeData(result))
  .catch(error => console.log('error', error));
}

function storeData(out) {
    dailyData = out;
    dailyData.Countries.forEach(country => {
        //console.log(country.CountryCode + ' ' + country.TotalConfirmed);
        if(country.TotalConfirmed >= threshhold){
            let cleanCountry = {name: '', cc: '', gdp: 0, dr: 0, tc: 0};
            cleanCountry.name = country.Country;
            cleanCountry.cc  = country.CountryCode;
            cleanCountry.gdp = -1;
            cleanCountry.tc = country.TotalConfirmed;
            cleanCountry.dr = country.TotalDeaths / country.TotalConfirmed;
            cleanData.push(cleanCountry);
            requestCountries += cleanCountry.cc;
            requestCountries += ';';
        }
       
    });
    //console.log(cleanData);
    requestCountries = requestCountries.slice(0, -1); //removes semi colon at end
    //console.log(requestCountries);
    let worldbankLink = "http://api.worldbank.org/v2/countries/"; 
    worldbankLink += requestCountries;
    worldbankLink += "/indicator/NY.GDP.PCAP.CD?format=json&date=2019&per_page=2000";
    //console.log(worldbankLink);
    fetch(worldbankLink, requestOptions)
    .then(response => response.json())
    .then(result => AppendGDP(result))
    .catch(error => console.log('error', error));
}
function AppendGDP(gdpData){
    console.log(gdpData);
    for (let index = 0; index < gdpData[1].length; index++) {
        for (let j = 0; j < cleanData.length; j++) {
            if(cleanData[j].cc == gdpData[1][index].country.id){
                cleanData[j].gdp = gdpData[1][index].value;
                //console.log(gdpData[1][index].country.value + ' = ' + cleanData[j].name);  
            }
        }
       
        
    }
    //console.log(cleanData);
    DrawGraph(cleanData); 
}

function DrawGraph(data){
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");    
   
    console.log("read json");
    //add x axis
    var x = d3.scaleLog()
    .domain([100, 200000]) //lowest to highest gdp
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLog()
    .domain([5000, 10000000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
// add Z axis
    var z = d3.scaleLinear()
    .domain([0, 0.2])
    .range([ 1, 40]);
    console.log("axis is yoss");
 // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.gdp); } )
      .attr("cy", function (d) { return y(d.tc); } )
      .attr("r", function (d) { return z(d.dr); } )
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
      
}

function onLoad (){
    
    getData();
    
}