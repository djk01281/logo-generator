export const useSelectTool = () => {
  return {
    normal: {
      mousedown: (e: MouseEvent) => {
        console.log("normal mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("normal mouseUp");
      },
    },
    edit: {
      mousedown: (e: MouseEvent) => {
        console.log("edit mouseDown");
      },
      mouseup: (e: MouseEvent) => {
        console.log("edit mouseUp");
      },
    },
  };
};
