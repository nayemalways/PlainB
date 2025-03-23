import { FeaturesListService, LegalDetailsService } from "../Services/FeaturesServices.js"


// Features list
export const FeaturesList = async (req, res) => {
    const result = await FeaturesListService();
    res.json(result);
}

// Legal Details
export const LegalDetails = async (req, res) => {
    const result = await LegalDetailsService(req);
    res.json(result);
}