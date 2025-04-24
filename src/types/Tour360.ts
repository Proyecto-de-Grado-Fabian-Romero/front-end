export type POI = {
  position: string;
  text: string;
  sceneId: string;
};

export type Scene360 = {
  id: string;
  name: string;
  fileId: string;
  fileName: string;
  fileUrl: string;
  pois: POI[];
};

export type Tour360 = {
  id: string;
  scenes: Scene360[];
};
