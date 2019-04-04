import * as parser from 'exif-parser';
import { OperatorFunction } from '../models';
import { base64ToArrayBuffer } from '../utils';
import { mirror } from './mirror';
import { rotate } from './rotate';

/**
 * @see https://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/
 */
export function applyExifOrientation(): OperatorFunction {
  return (originalBase64: string) => {
    return new Promise(resolve => {
      const data   = base64ToArrayBuffer(originalBase64);
      const result = parser.create(data).parse();

      switch (result.tags.Orientation) {
        // -90°
        case 6:
          rotate()().then(() => {
            resolve();
          });
          break;
        // -180°
        case 3:
          rotate({degrees: 180})().then(() => {
            resolve();
          });
          break;
        // -270°
        case 8:
          rotate({degrees: 270})().then(() => {
            resolve();
          });
          break;
        // mirrored
        case 2:
          mirror()().then(() => {
            resolve();
          });
          break;
        // -90° + mirrored
        case 5:
          rotate()().then(() => {
            mirror()().then(() => {
              resolve();
            });
          });
          break;
        // -180° + mirrored
        case 4:
          rotate({degrees: 180})().then(() => {
            mirror()().then(() => {
              resolve();
            });
          });
          break;
        // -270° + mirrored
        case 7:
          rotate({degrees: 270})().then(() => {
            mirror()().then(() => {
              resolve();
            });
          });
          break;
        default:
          resolve();
      }
    });
  };
}
