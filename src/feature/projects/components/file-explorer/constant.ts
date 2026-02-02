export const BASE_PADDING = 10;
export const LEVEL_PADDING = 10;

export const getItemPadding = (level: number, isFile: boolean) => {
  const fileOffset = isFile ? 16 : 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};
