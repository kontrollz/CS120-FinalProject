const fetchAPI = async (req, res) => {
    try {
        const {lat, lon} = req.query;
        const response = await fetch("http://www.7timer.info/bin/api.pl?lon=" + lon + "&lat=" + lat + "&product=astro&output=json");
        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "API response not ok"
            });
        }

        let forecastData = await response.json();

        return res.status(200).json({
            success: true,
            forecastData
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message
        });
    }
    
};

const fetchNom = async (req, res) => {
    try {
        const strt = req.query.str;
        const str = strt.replace(/ /g, '+');
        console.log("str:", strt);
        url = "https://nominatim.openstreetmap.org/search?q=" + str + "&format=jsonv2";
        console.log(url);
        const response = await fetch(url, {    
            headers: {
                "User-Agent": "Stargazer/1.0 (Tufts University student project)"
            }
        });
        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "API response not ok!"
            });
        }

        let jsonData = await response.json();

        return res.status(200).json({
            success: true,
            jsonData
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: e.message
        });
    }
    
};


module.exports = {
    fetchAPI,
    fetchNom,
}
