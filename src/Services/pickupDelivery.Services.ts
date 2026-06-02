import * as PickupDeliveryRepository from "../repositories/pickupDelivery.repositories";
import { PickupDelivery, DriverLocation, GeofenceZone, DriverRoute } from "../Types/PickupDelivery.type";

export const assignPickup = async (data: PickupDelivery) => {
    return await PickupDeliveryRepository.assignPickup(data);
}

export const assignDelivery = async (data: PickupDelivery) => {
    return await PickupDeliveryRepository.assignDelivery(data);
}

export const startPickup = async (record_id: number, latitude: number, longitude: number) => {
    return await PickupDeliveryRepository.startPickup(record_id, latitude, longitude);
}

export const completePickup = async (record_id: number, customer_photo_url?: string, cloths_photo_url?: string, signature_url?: string) => {
    return await PickupDeliveryRepository.completePickup(record_id, customer_photo_url, cloths_photo_url, signature_url);
}

export const startDelivery = async (record_id: number, latitude: number, longitude: number) => {
    return await PickupDeliveryRepository.startDelivery(record_id, latitude, longitude);
}

export const completeDelivery = async (record_id: number, customer_confirmed: boolean = true) => {
    return await PickupDeliveryRepository.completeDelivery(record_id, customer_confirmed);
}

export const updateDriverLiveLocation = async (data: DriverLocation) => {
    return await PickupDeliveryRepository.updateDriverLiveLocation(data);
}

export const getDriverLiveLocation = async (driver_id: number) => {
    return await PickupDeliveryRepository.getDriverLiveLocation(driver_id);
}

export const getDriverActiveTasks = async (driver_id: number) => {
    return await PickupDeliveryRepository.getDriverActiveTasks(driver_id);
}

export const getOrderPickupDelivery = async (order_id: number) => {
    return await PickupDeliveryRepository.getOrderPickupDelivery(order_id);
}

export const createGeofenceZone = async (data: GeofenceZone) => {
    return await PickupDeliveryRepository.createGeofenceZone(data);
}

export const saveDriverRoute = async (data: DriverRoute) => {
    return await PickupDeliveryRepository.saveDriverRoute(data);
}

export const getNearestDrivers = async (latitude: number, longitude: number, radiusKm: number = 5) => {
    return await PickupDeliveryRepository.getNearestDrivers(latitude, longitude, radiusKm);
}