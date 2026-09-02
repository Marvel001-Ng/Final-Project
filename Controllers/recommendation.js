const Attraction = require("../models/attractions");
const Hotel = require("../models/hotel");


const getRecommendations = async (req, res) => {
  try {
    const { budget, days, interest } = req.body;

    if (!budget || !days || !interest) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    
    const nights = Math.max(days - 1, 1);
    const hotelBudget = budget * 0.5; 
    const activityBudget = budget * 0.5;

    const maxPricePerNight = hotelBudget / nights;

    
    const attractions = await Attraction.find({
      category: interest,
      price: { $lte: activityBudget },
    })
      .sort({ price: 1 })
      .limit(5);

    const hotels = await Hotel.find({
      price: { $lte: maxPricePerNight },
      availability: true,
    })
      .sort({ price: -1 }) 
      .limit(3);

    if (attractions.length === 0 && hotels.length === 0) {
      return res.status(200).json({
        msg: "No matches found for this budget and interest — try increasing your budget or choosing a different interest",
        suggestions: { attractions: [], hotels: [] },
        estimatedBudget: { budget, hotelBudget, activityBudget },
      });
    }

    
    const topHotel = hotels[0];
    const topAttractions = attractions.slice(0, Math.min(days, attractions.length));
    const estimatedHotelCost = topHotel ? topHotel.price * nights : 0;
    const estimatedAttractionsCost = topAttractions.reduce((sum, a) => sum + a.price, 0);
    const estimatedTotal = estimatedHotelCost + estimatedAttractionsCost;

    res.status(200).json({
      msg: "Recommendations generated successfully",
      suggestions: {
        attractions,
        hotels,
      },
      estimatedBudget: {
        budget,
        estimatedHotelCost,
        estimatedAttractionsCost,
        estimatedTotal,
        withinBudget: estimatedTotal <= budget,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = { getRecommendations };