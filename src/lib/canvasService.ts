import {base64ToImgElement} from './utils';

class CanvasServiceSrc {
  readonly canvas = document.createElement('canvas');
  readonly canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  readonly helperCanvas = document.createElement('canvas');
  readonly helperCanvasCtx = this.helperCanvas.getContext('2d') as CanvasRenderingContext2D;

  constructor() {
  }

  drawBase64(base64: string): Promise<void> {
    window.open(base64);
    return new Promise<void>(resolve => {
      base64ToImgElement(base64).then(img => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.canvasCtx.drawImage(img.imgElement, 0, 0);
        resolve();
      });
    });
  }

  crop(width: number, height: number) {
    this.helperCanvas.width = width;
    this.helperCanvas.height = height;
    this.helperCanvasCtx.drawImage(this.canvas, 0, 0, width, height, 0, 0, width, height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasCtx.drawImage(this.helperCanvas, 0, 0);
  }

  resize(width: number, height: number) {
    this.helperCanvas.width = width;
    this.helperCanvas.height = height;
    this.helperCanvasCtx.drawImage(this.canvas, 0, 0, width, height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasCtx.drawImage(this.helperCanvas, 0, 0);
  }

  resizeImage(from: { width: number, height: number }, to: { width: number, height: number }) {
    this.helperCanvas.width = to.width;
    this.helperCanvas.height = to.height;
    this.helperCanvasCtx.drawImage(this.canvas, 0, 0, from.width, from.height, 0, 0, to.width, to.width);
    this.canvas.width = to.width;
    this.canvas.height = to.height;
    this.canvasCtx.drawImage(this.helperCanvas, 0, 0);
  }

  clearCanvas() {
    this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearHelperCanvas() {
    this.helperCanvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.helperCanvasCtx.fillRect(0, 0, this.helperCanvas.width, this.helperCanvas.height);
  }

  copy(source: HTMLCanvasElement, target: HTMLCanvasElement) {
    target.width = source.width;
    target.height = source.height;
    target.getContext('2d')!.drawImage(source, 0, 0);
  }
}

export const canvasService = new CanvasServiceSrc();
