import * as DriverRoutesRepository from "../repositories/driverRoutes.repositories";

export const saveDriverRoute = async (data: any) => {
    return await DriverRoutesRepository.saveDriverRoute(data);
}

export const completeDriverRoute = async (route_id: number, total_distance_km: number, total_duration_minutes: number) => {
    return await DriverRoutesRepository.completeDriverRoute(route_id, total_distance_km, total_duration_minutes);
}

export const getDriverRoutesByOrder = async (order_id: number) => {
    return await DriverRoutesRepository.getDriverRoutesByOrder(order_id);
}