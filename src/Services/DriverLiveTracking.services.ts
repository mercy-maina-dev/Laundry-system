import * as DriverLiveTrackingRepository from "../repositories/DriverLiveTracking.repositories";

export const updateDriverLocation = async (data: any) => {
    return await DriverLiveTrackingRepository.updateDriverLocation(data);
}

export const getDriverCurrentLocation = async (driver_id: number) => {
    return await DriverLiveTrackingRepository.getDriverCurrentLocation(driver_id);
}

export const getDriverLocationHistory = async (driver_id: number, limit: number = 50) => {
    return await DriverLiveTrackingRepository.getDriverLocationHistory(driver_id, limit);
}

export const getAllActiveDrivers = async () => {
    return await DriverLiveTrackingRepository.getAllActiveDrivers();
}