import {canvasService} from '../canvasService';
import {OperatorFunction, SkewOptions} from '../models';

/**
 * @see https://stackoverflow.com/a/37236664
 */
export function skew(options: SkewOptions): OperatorFunction {
  return () => {
    return new Promise(resolve => {
      // This operation needs four canvases. The result is drawn to the default canvas, which is therefore copied to the helper canvas.
      canvasService.copy(canvasService.canvas, canvasService.helperCanvas);

      const targetMarginX = Math.min(
        options.targetCoordinates.topLeft.x,
        options.targetCoordinates.bottomLeft.x,
        options.targetCoordinates.topRight.x,
        options.targetCoordinates.bottomRight.x,
      );
      const targetMarginY = Math.min(
        options.targetCoordinates.topLeft.y,
        options.targetCoordinates.bottomLeft.y,
        options.targetCoordinates.topRight.y,
        options.targetCoordinates.bottomRight.y,
      );

      const targetTopWidth = options.targetCoordinates.topRight.x - options.targetCoordinates.topLeft.x;
      const targetTopOffset = options.targetCoordinates.topLeft.x - targetMarginX;
      const targetBottomWidth = options.targetCoordinates.topRight.x - options.targetCoordinates.bottomLeft.x;
      const targetBottomOffset = options.targetCoordinates.bottomLeft.x - targetMarginX;
      const targetLeftHeight = options.targetCoordinates.bottomLeft.y - options.targetCoordinates.topLeft.y;
      const targetLeftOffset = options.targetCoordinates.topLeft.y - targetMarginY;
      const targetRightHeight = options.targetCoordinates.bottomRight.y - options.targetCoordinates.topRight.y;
      const targetRightOffset = options.targetCoordinates.topRight.y - targetMarginY;

      const tmpWidth = Math.max(
        targetTopWidth + targetTopOffset,
        targetBottomWidth + targetBottomOffset,
      );
      const tmpHeight = Math.max(
        targetLeftHeight + targetLeftOffset,
        targetRightHeight + targetRightOffset,
      );

      const tmpCanvas = document.createElement('canvas');
      const tmpCtx = tmpCanvas.getContext('2d')!;

      tmpCanvas.width = tmpWidth;
      tmpCanvas.height = tmpHeight;
      tmpCtx.scale(tmpWidth / canvasService.helperCanvas.width, tmpHeight / canvasService.helperCanvas.height);

      const tmpMap = canvasService.helperCanvasCtx.getImageData(0, 0, tmpWidth, tmpHeight);
      const tmpImgData = tmpMap.data;

      const targetCanvas = document.createElement('canvas');
      const targetCtx = targetCanvas.getContext('2d')!;
      const targetMap = targetCtx.getImageData(
        targetMarginX,
        targetMarginY,
        tmpWidth,
        tmpHeight,
      );
      const targetImgData = targetMap.data;

      targetCanvas.width = canvasService.helperCanvas.width;
      targetCanvas.height = canvasService.helperCanvas.height;

      let targetX: number;
      let targetY: number;
      let tmpPoint: number;
      let targetPoint: number;

      for (let tmpY = 0; tmpY < tmpHeight; tmpY++) {
        for (let tmpX = 0; tmpX < tmpWidth; tmpX++) {
          tmpPoint = (tmpY * tmpWidth + tmpX) * 4;
          targetX = (targetTopOffset + (targetTopWidth * tmpX) / tmpWidth) * (1 - tmpY / tmpHeight) + (targetBottomOffset + (targetBottomWidth * tmpX) / tmpWidth) * (tmpY / tmpHeight);
          targetX = Math.round(targetX);

          targetY = (targetLeftOffset + (targetLeftHeight * tmpY) / tmpHeight) * (1 - tmpX / tmpWidth) + (targetRightOffset + (targetRightHeight * tmpY) / tmpHeight) * (tmpX / tmpWidth);
          targetY = Math.round(targetY);

          targetPoint = (targetY * tmpWidth + targetX) * 4;

          targetImgData[targetPoint] = tmpImgData[tmpPoint]; // red
          targetImgData[targetPoint + 1] = tmpImgData[tmpPoint + 1]; // green
          targetImgData[targetPoint + 2] = tmpImgData[tmpPoint + 2]; // blue
          targetImgData[targetPoint + 3] = tmpImgData[tmpPoint + 3]; // alpha
        }
      }

      canvasService.clearCanvas();
      canvasService.canvasCtx.putImageData(targetMap, targetMarginX, targetMarginY);

      resolve();
    });
  };
}
