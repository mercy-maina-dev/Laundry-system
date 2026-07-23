import express from "express";
import * as ServicesControllers from '../controllers/Services.controllers';

const ServicesRoutes = (router: express.Router) => {
    router.get('/services', ServicesControllers.getAllServices);
    router.post('/services', ServicesControllers.createService);
    router.get('/services/:id', ServicesControllers.getServiceById);
    router.put('/services/:id', ServicesControllers.updateServices);    // ✅ Changed from updateServiceById
    router.delete('/services/:id', ServicesControllers.deleteService);  // ✅ Changed from deleteServiceById
}

export default ServicesRoutes;