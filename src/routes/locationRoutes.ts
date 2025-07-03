import { Router } from 'express';
import { LocationController } from "../controllers/LocationController";

const router = Router();
let locationController: LocationController;

const getLocationController = () => {
    if (!locationController) {
        locationController = new LocationController();
    }
    return locationController;
};

// Get /api/locations?page=1&limit=5
router.get('/locations', (req, res) => {
    const controller = getLocationController();
    controller.getLocations(req, res);
});

// GET /api/locations/search?q=london
router.get('/locations/search', (req, res) => {
    const controller = getLocationController();
    controller.searchLocations(req, res);
});

router.get('/reverse', (req, res) => {
    const controller = getLocationController();
    controller.reverseGeocode(req, res);
});

export default router;