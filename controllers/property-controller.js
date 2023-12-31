const { blockEstate } = require("../utilities/config");

exports.status = (req, res) => {
  const result = blockEstate.findStatus(req.params.id);
  if (!result || !result.status) {
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
      message: `Not a property by ${req.params.id} or no active bids. Please check status`,
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
  if (!result.sold || !result.hasBeenSold) {
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
  if (!result.listings || !result.listed) {
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
  if (!result.listings || !result.listed > 0) {
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
  if (!result || !result.bids) {
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
