// GET /api/user/
export async function getUserData(req, res) {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;

    res.status(200).json({
      success: true,
      role,
      recentSearchedCities,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}

// store user's recent searched cities
// POST /api/user/store-recent-search
export async function storeRecentSearchedCities(req, res) {
  try {
    const { recentSearchedCity } = req.body;

    const user = req.user;

    // Avoid duplicate consecutive entries
    // const lastCity =
    //   user.recentSearchedCities[user.recentSearchedCities.length - 1];

    // if (lastCity !== recentSearchedCity) {
    //   if (user.recentSearchedCities.length >= 3) {
    //     user.recentSearchedCities.shift(); // remove oldest
    //   }

    //   user.recentSearchedCities.push(recentSearchedCity);

    //   await user.save();
    // }

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "City added",
      recentSearchedCities: user.recentSearchedCities,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ success: false, message: error.message });
  }
}
