import { Express } from "express";
import * as ServicesControllers from '../controllers/Services.controllers';

const ServicesRoutes=(app:Express)=>{
    app.get('/services', ServicesControllers.getAllServices);
    app.post('/addservices', ServicesControllers.createService);
    app.get('/services/:id', ServicesControllers.getServiceById);
    app.put('/services/:id', ServicesControllers.updateServices);
    app.delete('/services/:id', ServicesControllers.deleteService);
}


export default ServicesRoutes;