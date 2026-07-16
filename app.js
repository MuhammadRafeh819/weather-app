const input = document.getElementById("searchBar");
const searchBtn = document.getElementById("button");
const humidity = document.querySelector(".humidity")
const windSpeed = document.querySelector(".wind")
const icon = document.querySelector(".weather_icon")

const temprature = document.querySelector(".temp")



const apiKey = "3fa6568efa78130e4a771cdf6d6cf598";

const url = "https://api.openweathermap.org/data/2.5/weather?units=metric";


async function checkWeather(city){
try{
    const response = await fetch(url + `&q=${city}` + `&appid=${apiKey}`)

    if(response.status === 404 ){
        document.querySelector(".err").style.display = "block";
        document.querySelector(".weather").style.display= "none";
    }
    const result = await response.json();

    if(!response.ok){
        throw new Error ("SomeThing went wrong ")
    }
    else{
        document.querySelector(".city").innerHTML = result.name
    temprature.textContent = Math.round(result.main.temp) + "°C"
    humidity.textContent = result.main.humidity + "%"
    windSpeed.textContent = result.wind.speed + "m/s" 

    
    if(result.weather[0].main === "Clear"){
        icon.src = "images/icon-sunny.webp"
    }
    else if (result.weather[0].main === "Clouds"){
        icon.src = "images/icon-overcast.webp"
    }
    else if (result.weather[0].main === "Rain"){
        icon.src = "images/icon-rain.webp"
    }
    else if (result.weather[0].main === "Snow"){
        icon.src = "images/icon-snow.webp"
    }else if (result.weather[0].main === "Fog"){
        icon.src = "images/icon-fog.webp" 
    }else if(result.weather[0].main === "Storm"){
        icon.src= "images/icon-storm.webp"

    }else if(result.weather[0].main=== "Drizzle"){
        icon.src= "images/icon-drizzle.webp"
    }

    document.querySelector(".weather").style.display= "block"
    document.querySelector(".err").style.display = "none"
    }


    
    
}
catch(error){
    console.log("Error", error.message)
}


}

searchBtn.addEventListener("click", ()=>{
    checkWeather(input.value)
})