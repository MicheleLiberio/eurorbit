import weatherType from "https://micheleliberio.github.io/eurorbit/json/weatherType.json" with {type: "json"};



const select=document.getElementById('select-cities');

let gettingForecast=document.getElementById("getting-forecast");
gettingForecast.style.display="none";


function getDate(date) {
	let year=date.slice(0,4);
	let month=date.slice(4,6);
	let day=date.slice(6,8);

	const options={
		weekday: "short",
		month: "short",
		day: "numeric",
	};

	let newDate=new Date(`${year}-${month}-${day}`);

	return newDate.toLocaleDateString("en-UK",options);
}

function buildWeatherInfo(data) {
	let dataset=data.dataseries;
	dataset.forEach(dat => {
		var mainDiv=document.createElement('div');
		mainDiv.id="id-weather-".concat(dat["date"]);
		mainDiv.className="weather-tab";

		let weatherObject=weatherType.find(weatherTyp => weatherTyp.code===dat["weather"]);
		if(weatherObject!=null) {

			var upperDiv=document.createElement('div');
			upperDiv.className="upper-tab";

			var dateDiv=document.createElement('div');
			dateDiv.className="my-3";
			let date=dat["date"].toString();
			dateDiv.innerText=getDate(date);

			var iconDiv=document.createElement('img');
			iconDiv.src=`https://micheleliberio.github.io/eurorbit/images/${weatherObject.icon}`;

			upperDiv.append(dateDiv);
			upperDiv.append(iconDiv);


			var lowerDiv=document.createElement('div');
			lowerDiv.className="my-lg-4";

			var descriptionDiv=document.createElement('div');
			descriptionDiv.innerText=weatherObject.description;
			descriptionDiv.className="weather-description my-3";
			lowerDiv.appendChild(descriptionDiv);

			let temperatures=dat['temp2m'];

			if(temperatures!=null) {
				var maxTemperature=document.createElement('div');
				var minTemperature=document.createElement('div');

				maxTemperature.innerText=`Max: ${temperatures['max']} °C`
				minTemperature.innerText=`Min: ${temperatures['min']} °C`

				lowerDiv.appendChild(maxTemperature);
				lowerDiv.appendChild(minTemperature);

			}
			mainDiv.append(upperDiv);
			mainDiv.append(lowerDiv);

		}
		document.getElementById("weather-tabs").appendChild(mainDiv);
	})
	gettingForecast.style.display="none";

}

function buildWeatherError(){
	let mainDiv = document.createElement('div');
	mainDiv.className = "weather-tab-error align-content-center my-2"
	document.getElementById("weather-results").appendChild(mainDiv);

	let middleDive = document.createElement('div');
	middleDive.className = "weather-tab-error align-content-center my-2"
	mainDiv.appendChild(middleDive);

	let firstDiv = document.createElement('div');
	firstDiv.className = "row"
	firstDiv.outerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">' +
                            '<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>' +
                            '<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>' +
                          '</svg>'
	middleDive.appendChild(firstDiv);

	let secondDiv = document.createElement('div');
	secondDiv.className = "row justify-content-center";
	secondDiv.innerText = "Something went wrong...";
	middleDive.appendChild(secondDiv);
}

async function getWeatherData(lat,lon) {
	const url=`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
	try {
		const response=await fetch(url);
		if(!response.ok) {
			buildWeatherError();
			throw new Error(`Response status: ${response.status}`);
		}

		const result=await response.json();
		console.log(result);
		buildWeatherInfo(result)
	} catch(error) {
		gettingForecast.style.display="none";

		buildWeatherError();
		console.error(error.message);
	}
}

fetch('https://micheleliberio.github.io/eurorbit/json/weatherCities.json')
	.then(res => {
		if(!res.ok) throw new Error("Errore nel caricamento del JSON");
		return res.json();
	})
	.then(weatherCities => {

		weatherCities.forEach(weatherCity => {
			const option=document.createElement('option');
			option.value=JSON.stringify(weatherCity);
			option.textContent=weatherCity.city;
			select.appendChild(option);
		});
	})
	.catch(err => console.error("Errore:",err));

select.addEventListener('change',() => {
	$('div[id^="id-weather-"]').remove();
	$('div[id^="weather-error"]').remove();
	document.getElementById("weather-start").style.display = "none";
	gettingForecast.style.display="block";

	let object=JSON.parse(select.value);
	if(object!=null) {
		let lat=object.latitude;
		let lon=object.longitude;
		if(lat!=""&&lat!=null&&lon!=""&&lon!=null) {
			getWeatherData(lat,lon);
		}
	}
});


