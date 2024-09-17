export const useUploadTool = () => {
  return {
    normal: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
      },
    },
  };
};
