const { blockEstate } = require("../utilities/config");

exports.status = (req, res) => {
  const result = blockEstate.findStatus(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Did not find property with id ${req.params.id}`,
    });
  }
  console.log(result);
  res
    .status(200)
    .json({ success: true, property: req.params.id, data: result });
};
//working
exports.ongoingBids = (req, res) => {
  const result = blockEstate.findActiveBidsOnProperty(req.params.id);
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  } else if (!result.underOffer) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Property with id-${req.params.id} has been sold or not any bids yet`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};

//working
exports.historyProperty = (req, res) => {
  const result = blockEstate.findProperty(req.params.id);

  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
  if (!result.propertyId) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
  if (!result.transactions) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `Not a property by ${req.params.id}`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};

// working
//NOTE: shows all property if it has been sold can show same property id on SOLD and then on LIVE LISTING
exports.sold = (req, res) => {
  const result = blockEstate.GetAllSoldProperty();
  if (!result.sold) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No property has been sold`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};
// working
exports.recordListings = (req, res) => {
  const result = blockEstate.GetAllListings();
  if (!result.listings) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No property has been listed`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};
// working
exports.activeListings = (req, res) => {
  const result = blockEstate.GetActiveListings();
  if (!result.listings) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No property has been listed`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};
// nworking
exports.biddings = (req, res) => {
  const result = blockEstate.GetAllBids();
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: `No bids found`,
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};
