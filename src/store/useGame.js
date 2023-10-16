import { create } from "zustand";
import {subscribeWithSelector} from 'zustand/middleware'

export default create(
  subscribeWithSelector((set) => {
    return {
      blockSeed: 0,
      traps: 10,
      // PHASES: READY | PLAYING | ENDED
      startTime: 0,
      endTime: 0,
      phase: "ready",
      start: () => {
        set(({ phase }) => {
          if (phase === "ready") {
            return {
              phase: "playing",
              startTime: Date.now(),
            };
          }
          return {};
        });
      },
      restart: () => {
        set(({ phase }) => {
          if (phase === "playing" || phase === "ended") {
            return {
              phase: "ready",
              blockSeed: Math.random()
            };
          }
          return {};
        });
      },
      end: () => {
        set(({ phase }) => {
          if (phase === "playing") {
            return {
              phase: "ended",
              endTime: Date.now(),
              blockSeed: Math.random()
            };
          }
          return {};
        });
      },
    };
  })
);
