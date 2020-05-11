export interface SrcOptions {
  jpgQuality?: number;
  type?: string;
}

export interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
}

export interface SharpenOptions {
  sharpness?: number;
}

export interface Base64ImageData {
  width: number;
  height: number;
  imgElement: HTMLImageElement;
}

export interface OperatorFunction {
  (blob?: string): Promise<void>;
}

export interface RotateOptions {
  degree?: number;
  clockwise?: boolean;
}

export interface SkewOptions {
  targetCoordinates: {
    topLeft: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}
