export const useShapeTool = () => {
  return {
    rectangle: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
      },
    },
    ellipse: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
      },
    },
    polygon: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
      },
    },
  };
};
