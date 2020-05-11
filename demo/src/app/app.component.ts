import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  fileToBase64,
  resize,
  sharpen,
  rotate,
  mirror,
  imageProcessor,
  applyExifOrientation,
  noop,
} from '../../../build/module';
import {skew} from "../../../src/lib/operators/skew";

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  srcBase64: string;
  srcFile: File;

  applyExifOrientation = true;
  resizeImgResult: string;
  resizeIsProcessing: boolean;
  resizeProcessingTime: number;
  rotateImgResult: string;
  rotateIsProcessing: boolean;
  rotateProcessingTime: number;
  skewImgResult: string;
  skewIsProcessing: boolean;
  skewProcessingTime: number;

  constructor() {
  }

  onFileInputChange(file: File) {
    this.fileInput.nativeElement.value = '';
    this.clear();
    this.srcFile = file;
    this.showSource();
  }

  showSource() {
    fileToBase64(this.srcFile).then(base64 => {
      imageProcessor
        .src(base64)
        .pipe(
          this.applyExifOrientation ? applyExifOrientation() : noop(),
        )
        .then(result => {
          this.srcBase64 = result;
        });
    });
  }

  applyExifOrientationChanged(checked: boolean) {
    this.applyExifOrientation = checked;
    if (this.srcBase64) {
      this.clear();
      this.showSource();
    }
  }

  clear() {
    this.srcBase64       = null;
    this.resizeImgResult = null;
    this.rotateImgResult = null;
  }

  onResize(maxWidth: string, maxHeight: string, sharpness: string) {
    if (!maxWidth || !maxHeight || !sharpness) {
      return;
    }

    this.resizeIsProcessing = true;
    const t0                = performance.now();

    imageProcessor
      .src(this.srcBase64)
      .pipe(
        resize({
          maxWidth:  +maxWidth,
          maxHeight: +maxHeight,
        }),
        sharpen({
          sharpness: +sharpness / 100,
        }),
      ).then(resultBase64 => {
        const t1                  = performance.now();
        this.resizeProcessingTime = Math.round((t1 - t0) * 100) / 100;
        this.resizeIsProcessing   = false;
        this.resizeImgResult      = resultBase64;
      },
    )
    ;
  }

  onRotate() {
    const t0 = performance.now();

    imageProcessor
      .src(this.rotateImgResult)
      .pipe(
        rotate(),
      )
      .then(base64 => {
        const t1                  = performance.now();
        this.rotateProcessingTime = Math.round((t1 - t0) * 100) / 100;
        this.rotateImgResult      = base64;
      })
    ;
  }

  onMirror() {
    const t0 = performance.now();

    imageProcessor
      .src(this.rotateImgResult)
      .pipe(
        mirror(),
      )
      .then(base64 => {
        const t1                  = performance.now();
        this.rotateProcessingTime = Math.round((t1 - t0) * 100) / 100;
        this.rotateImgResult      = base64;
      })
    ;
  }

  onSkew(topLeftX, topLeftY, bottomLeftX, bottomLeftY, topRightX, topRightY, bottomRightX, bottomRightY) {
    if (!topLeftX || !topLeftY || !bottomLeftX || !bottomLeftY || !topRightX || !topRightY || !bottomRightX || !bottomRightY) {
      return;
    }

    this.skewIsProcessing = true;
    const t0 = performance.now();

    const targetCoordinates= {
      topLeft: { x: topLeftX, y: topLeftY },
      bottomLeft: { x: bottomLeftX, y: bottomLeftY },
      topRight: { x: topRightX, y: topRightY },
      bottomRight: { x: bottomRightY, y: bottomRightY },
    }

    imageProcessor
      .src(this.srcBase64)
      .pipe(
        skew({targetCoordinates: targetCoordinates}),
      ).then(resultBase64 => {
        console.log('TEST');
        const t1                  = performance.now();
        this.skewProcessingTime = Math.round((t1 - t0) * 100) / 100;
        this.skewIsProcessing   = false;
        this.skewImgResult      = resultBase64;
      },
    )
    ;
  }

  ngOnInit() {
  }
}
