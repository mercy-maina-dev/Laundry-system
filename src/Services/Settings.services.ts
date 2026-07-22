import * as SettingsRepository from "../repositories/Settings.repositories";
import { Settings } from "../repositories/Settings.repositories";
export const getSettings = async (): Promise<Settings | null> => {
    return await SettingsRepository.getSettings();
}

export const updateSettings = async (settings: Settings): Promise<Settings> => {
    return await SettingsRepository.updateSettings(settings);
}