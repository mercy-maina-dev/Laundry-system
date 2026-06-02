import * as StoreSettingsRepository from "../repositories/StoreSettings.repositories";
import { StoreSettings } from "../repositories/StoreSettings.repositories";

export const getStoreSettings = async () => {
    return await StoreSettingsRepository.getStoreSettings();
}

export const updateStoreSettings = async (data: StoreSettings) => {
    return await StoreSettingsRepository.updateStoreSettings(data);
}