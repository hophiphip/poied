import { StoreApi, UseBoundStore, create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Point = {
  x: number;
  y: number;
  z: number;
};

export type PointsStoreState = {
  points: Point[];
  addPoint: (point: Point) => void;
  removePoint: (pointIndex: number) => void;
  updatePoint: (pointIndex: number, update: Partial<Point>) => void;
};

const usePointsStore: UseBoundStore<StoreApi<PointsStoreState>> = create(
  persist(
    (set) => ({
      points: [],
      addPoint: (point) => {
        set(({ points }) => ({ points: [...points, point] }));
      },
      removePoint: (pointIndex) => {
        set(({ points }) => {
          const newPoints = [...points];
          newPoints.splice(pointIndex, 1);
          return { points: newPoints };
        });
      },
      updatePoint: (pointIndex, update) => {
        set(({ points }) => {
          if (pointIndex >= points.length || pointIndex < 0) return {};

          const oldPoint = points[pointIndex];
          const newPoint = { ...oldPoint, ...update };

          const newPoints = [...points];
          newPoints[pointIndex] = newPoint;

          return { points: newPoints };
        });
      },
    }),
    {
      name: "points",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default usePointsStore;
