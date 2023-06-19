/**
 * StorageService.ts - Handles persisting data in various locations and backup layers
 */

import * as FileSystem from 'expo-file-system';
import { APP_VERSION, isWeb } from '../util/Util';

const bundleDir = FileSystem.bundleDirectory;
const documentDir = FileSystem.documentDirectory;
const cacheDir = FileSystem.cacheDirectory;

function getVersionFileFormat(version: string) {
  return version.replace(/\./g, '_');
}

function getFileName(
  directory: string,
  name: string,
  version: string,
  extension = 'json',
) {
  return `${directory}/${name}`;
}

export async function saveData(
  category: string,
  name: string,
  data: unknown,
  version = APP_VERSION,
  isCached = false,
): Promise<boolean> {
  const baseDir = isCached ? cacheDir : documentDir;
  const directory = `${baseDir !== null ? baseDir : ''}${category}`;
  const key = getFileName(directory, name, version);
  const dataSerialized = JSON.stringify(data);
  try {
    if (isWeb()) {
      localStorage.setItem(key, dataSerialized);
    } else {
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists)
        await FileSystem.makeDirectoryAsync(key, { intermediates: true });
      await FileSystem.writeAsStringAsync(key, dataSerialized);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

enum Dirs {
  Bundle,
  Document,
  Cache,
}

export async function loadData<T>(
  category: string,
  name: string,
  version = APP_VERSION,
  checkBackupLocations = true,
  location = Dirs.Cache,
): Promise<T | null> {
  let baseDir: string | null = null;
  switch (location) {
    case Dirs.Bundle:
      baseDir = bundleDir;
      break;
    case Dirs.Document:
      baseDir = documentDir;
      break;
    case Dirs.Cache:
      baseDir = cacheDir;
      break;
    default:
      /** no backup locations left */ break;
  }

  if (!isWeb() && baseDir === null) return null;

  const key = getFileName(
    `${baseDir !== null ? baseDir : ''}${category}`,
    name,
    version,
  );
  let errorMessage = '';
  try {
    const dataSerialized = await (isWeb()
      ? localStorage.getItem(key)
      : FileSystem.readAsStringAsync(key));
    if (dataSerialized !== null) return JSON.parse(dataSerialized);
  } catch (e) {
    errorMessage = `${e}`;
  }

  if (errorMessage && (!checkBackupLocations || location <= 0))
    console.error(errorMessage);

  if (!isWeb() && checkBackupLocations)
    return loadData(
      category,
      name,
      version,
      checkBackupLocations,
      // Try again with the next location down
      location - 1,
    );
  return null;
}
