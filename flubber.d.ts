declare module "flubber" {
  interface Options {
    maxSegmentLength?: number
    string?: boolean
  }
  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: Options,
  ): (t: number) => string
  export function toCircle(fromShape: string, x: number, y: number, r: number, options?: Options): (t: number) => string
  export function separate(fromShape: string, toShapes: string[], options?: Options): (t: number) => string
  export function combine(fromShapes: string[], toShape: string, options?: Options): (t: number) => string
}
