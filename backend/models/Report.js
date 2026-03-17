const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref:"Client"},
    campaign:String,
    platform:String,
    spend:Number,
    clicks:Number,
    impressions:Number,
    ctr:Number,
    cpc:Number,
    conversions:Number,
    date:Date,
    file:String
});

module.exports = mongoose.model("Report", ReportSchema);