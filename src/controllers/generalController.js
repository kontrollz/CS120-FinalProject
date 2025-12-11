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


module.exports = {
    fetchAPI,
}