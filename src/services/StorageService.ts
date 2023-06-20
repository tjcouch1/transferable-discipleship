/**
 * StorageService.ts - Handles persisting data in various locations and backup layers
 */

import * as FileSystem from 'expo-file-system';
import { APP_VERSION, isWeb } from '../util/Util';

/**
 * Locations for persisted data.
 * 
 * When looking at backup locations, this enumeration is traversed end-to-beginning
 */
enum Dirs {
  Bundle,
  Document,
  Cache,
}

// These are all null if on web
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
  return `${directory}/${name}.${getVersionFileFormat(version)}.${extension}`;
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
  try {
    const dataSerialized = await (isWeb()
      ? localStorage.getItem(key)
      : FileSystem.readAsStringAsync(key));
    if (dataSerialized !== null) return JSON.parse(dataSerialized);
  } catch (e) {
    // Ignore ENOENT - entry does not exist - because we want to return null if the entry does not exist
    if (!`${e}`.includes('ENOENT')) throw e;
  }

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
