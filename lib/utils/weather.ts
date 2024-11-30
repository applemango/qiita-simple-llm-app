export const getForecast = async (locationId: string) => {
    const res = await fetch(`https://weather.tsukumijima.net/api/forecast/city/${locationId}`)
    const json = await res.json()
    return json
}

export const getForecastSimple = async (locationId: string, date: "today" | "tomorrow") => {
    const json = await getForecast(locationId)
    const index = date == "today" ? 0 : 1
    return {
        text: json.description.text,
        forecast: {
            detail: json.forecasts[index].detail,
            temperature: json.forecasts[index].temperature,
            telop: json.forecasts[index].telop,
        },
    }
}