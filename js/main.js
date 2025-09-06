import weatherType from "../json/weatherType.json" with {type: "json"};



const select=document.getElementById('select-cities');

let gettingForecast=document.getElementById("getting-forecast");
gettingForecast.style.display="none";

let weatherError=document.getElementById("weather-error");
weatherError.style.display="none";

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
			//mainDiv.innerText=weatherObject.description;

			var upperDiv=document.createElement('div');
			upperDiv.className="upper-tab";

			var dateDiv=document.createElement('div');
			dateDiv.className="my-3";
			let date=dat["date"].toString();
			dateDiv.innerText=getDate(date);

			var iconDiv=document.createElement('img');
			iconDiv.src=`../images/${weatherObject.icon}`;

			upperDiv.append(dateDiv);
			upperDiv.append(iconDiv);


			var lowerDiv=document.createElement('div');
			lowerDiv.className="my-4";

			var descriptionDiv=document.createElement('div');
			descriptionDiv.innerText=weatherObject.description;
			descriptionDiv.className="weather-description my-3";
			//lowerDiv.className="row";
			//lowerDiv.innerText=weatherObject.description;
			//lowerDiv.className="my-3";
			lowerDiv.appendChild(descriptionDiv);

			let temperatures=dat['temp2m'];

			if(temperatures!=null) {
				//var temperaturesDiv=document.createElement('div');
				var maxTemperature=document.createElement('div');
				var minTemperature=document.createElement('div');

				//temperaturesDiv.innerText="Temperatures"
				maxTemperature.innerText=`Max: ${temperatures['max']} °C`
				minTemperature.innerText=`Min: ${temperatures['min']} °C`

				//lowerDiv.appendChild(temperaturesDiv);
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

async function getWeatherData(lat,lon) {
	let weatherError=document.getElementById("weather-error");
	weatherError.style.display="none";
	weatherError.style.display="none";
	const url=`http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;
	try {
		const response=await fetch(url);
		if(!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const result=await response.json();
		console.log(result);
		buildWeatherInfo(result)
	} catch(error) {
		gettingForecast.style.display="none";
		weatherError.style.display="flex";

		//buildWeatherError();
		console.error(error.message);
	}
}

fetch('../json/weatherCities.json')
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

// Evento per sapere quale opzione è stata scelta
select.addEventListener('change',() => {
	$('div[id^="id-weather-"]').remove();
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

	//alert(`Hai selezionato: ${select.value}`);
});


