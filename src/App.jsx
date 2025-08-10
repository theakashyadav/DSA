// // import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

// import { useCallback, useRef, useState } from "react";

// // /* ============================
// //    AudioPlayer Component
// //    ============================ */
// // function formatTime(seconds) {
// //   if (!isFinite(seconds)) return "0:00";
// //   const m = Math.floor(seconds / 60);
// //   const s = Math.floor(seconds % 60).toString().padStart(2, "0");
// //   return `${m}:${s}`;
// // }

// // export function AudioPlayer({ src, onPlay, onPause }) {
// //   const audioRef = useRef(null);
// //   // only store UI-updating value at a coarse granularity to avoid frequent re-renders
// //   const [timeTick, setTimeTick] = useState(0); // updates every 200ms
// //   const rafRef = useRef(null);
// //   const lastTickRef = useRef(0);
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [duration, setDuration] = useState(NaN);

// //   // derive currentTime from audio ref when rendering
// //   const getCurrentTime = () => (audioRef.current ? audioRef.current.currentTime : 0);

// //   // start animation loop - we update React state only every 200ms (reduce re-renders)
// //   useEffect(() => {
// //     let mounted = true;
// //     const tick = (ts) => {
// //       if (!mounted) return;
// //       const audio = audioRef.current;
// //       if (!audio) {
// //         rafRef.current = requestAnimationFrame(tick);
// //         return;
// //       }
// //       // update only if playing
// //       if (!audio.paused) {
// //         // throttle to ~200ms
// //         if (ts - lastTickRef.current > 180) {
// //           lastTickRef.current = ts;
// //           setTimeTick((t) => t + 1);
// //         }
// //       }
// //       rafRef.current = requestAnimationFrame(tick);
// //     };
// //     rafRef.current = requestAnimationFrame(tick);
// //     return () => {
// //       mounted = false;
// //       if (rafRef.current) cancelAnimationFrame(rafRef.current);
// //     };
// //   }, []);

// //   // set duration once metadata loaded
// //   useEffect(() => {
// //     const audio = audioRef.current;
// //     if (!audio) return;
// //     const onLoaded = () => setDuration(audio.duration);
// //     audio.addEventListener("loadedmetadata", onLoaded);
// //     return () => audio.removeEventListener("loadedmetadata", onLoaded);
// //   }, []);

// //   const handlePlayPause = useCallback(() => {
// //     const audio = audioRef.current;
// //     if (!audio) return;
// //     if (audio.paused) {
// //       audio.play();
// //       setIsPlaying(true);
// //       if (onPlay) onPlay();
// //     } else {
// //       audio.pause();
// //       setIsPlaying(false);
// //       if (onPause) onPause();
// //     }
// //   }, [onPlay, onPause]);

// //   // sync isPlaying when user uses native controls or audio ended
// //   useEffect(() => {
// //     const audio = audioRef.current;
// //     if (!audio) return;
// //     const onPlayEvent = () => setIsPlaying(true);
// //     const onPauseEvent = () => setIsPlaying(false);
// //     const onEnded = () => setIsPlaying(false);
// //     audio.addEventListener("play", onPlayEvent);
// //     audio.addEventListener("pause", onPauseEvent);
// //     audio.addEventListener("ended", onEnded);
// //     return () => {
// //       audio.removeEventListener("play", onPlayEvent);
// //       audio.removeEventListener("pause", onPauseEvent);
// //       audio.removeEventListener("ended", onEnded);
// //     };
// //   }, []);

// //   // seek handler
// //   const handleSeek = useCallback((e) => {
// //     const audio = audioRef.current;
// //     if (!audio) return;
// //     const rect = e.target.getBoundingClientRect();
// //     const clickX = e.clientX - rect.left;
// //     const ratio = Math.max(0, Math.min(1, clickX / rect.width));
// //     const newTime = (isFinite(duration) ? duration : audio.duration || 0) * ratio;
// //     audio.currentTime = newTime;
// //     // force a UI tick immediately
// //     setTimeTick((t) => t + 1);
// //   }, [duration]);

// //   // derived values for UI
// //   const currentTime = getCurrentTime();
// //   const progressPercent = (isFinite(duration) && duration > 0) ? (currentTime / duration) * 100 : 0;

// //   return (
// //     <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, maxWidth: 520 }}>
// //       <audio ref={audioRef} src={src} preload="metadata" />
// //       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
// //         <button onClick={handlePlayPause} style={{ padding: "6px 10px" }}>
// //           {isPlaying ? "Pause" : "Play"}
// //         </button>

// //         {/* progress bar */}
// //         <div style={{ flex: 1 }}>
// //           <div
// //             onClick={handleSeek}
// //             role="progressbar"
// //             aria-valuemin={0}
// //             aria-valuemax={100}
// //             aria-valuenow={Math.round(progressPercent)}
// //             style={{
// //               height: 10,
// //               background: "#f0f0f0",
// //               borderRadius: 6,
// //               position: "relative",
// //               cursor: "pointer",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 position: "absolute",
// //                 left: 0,
// //                 top: 0,
// //                 bottom: 0,
// //                 width: `${progressPercent}%`,
// //                 background: "#5b8cff",
// //                 borderRadius: 6,
// //                 transition: "width 0.08s linear"
// //               }}
// //             />
// //           </div>
// //           <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
// //             <span>{formatTime(currentTime)}</span>
// //             <span>{formatTime(duration)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================
// //    VirtualizedList Component
// //    ============================ */

// // export function VirtualizedList({ items, itemHeight = 30, height = 300, buffer = 5 }) {
// //   const containerRef = useRef(null);
// //   const [scrollTop, setScrollTop] = useState(0);

// //   const totalHeight = items.length * itemHeight;

// //   const visibleCount = Math.ceil(height / itemHeight);
// //   const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
// //   const endIndex = Math.min(items.length - 1, Math.ceil((scrollTop + height) / itemHeight) + buffer);

// //   const visibleItems = items.slice(startIndex, endIndex + 1);

// //   const topPadding = startIndex * itemHeight;
// //   const onScroll = useCallback((e) => {
// //     setScrollTop(e.currentTarget.scrollTop);
// //   }, []);

// //   return (
// //     <div
// //       ref={containerRef}
// //       onScroll={onScroll}
// //       style={{
// //         width: "100%",
// //         height,
// //         overflowY: "auto",
// //         border: "1px solid #ddd",
// //         borderRadius: 6,
// //       }}
// //     >
// //       <div style={{ height: totalHeight, position: "relative" }}>
// //         <div style={{ transform: `translateY(${topPadding}px)` }}>
// //           {visibleItems.map((it, i) => {
// //             const index = startIndex + i;
// //             return (
// //               <div
// //                 key={index}
// //                 style={{
// //                   height: itemHeight,
// //                   lineHeight: `${itemHeight}px`,
// //                   padding: "0 12px",
// //                   boxSizing: "border-box",
// //                   borderBottom: "1px solid #f5f5f5",
// //                 }}
// //               >
// //                 {index + 1}. {it}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================
// //    LRU Cache Class
// //    ============================ */

// // class LRUNode {
// //   constructor(key, value) {
// //     this.key = key;
// //     this.value = value;
// //     this.prev = null;
// //     this.next = null;
// //   }
// // }

// // export class LRU {
// //   constructor(capacity = 5) {
// //     if (capacity <= 0) throw new Error("Capacity must be > 0");
// //     this.capacity = capacity;
// //     this.map = new Map(); // key -> node
// //     this.head = null; // most recent
// //     this.tail = null; // least recent
// //     this.size = 0;
// //   }

// //   // move node to head (most-recent)
// //   _moveToHead(node) {
// //     if (this.head === node) return;
// //     // remove node from its spot
// //     if (node.prev) node.prev.next = node.next;
// //     if (node.next) node.next.prev = node.prev;
// //     if (this.tail === node) this.tail = node.prev;

// //     // put node at head
// //     node.prev = null;
// //     node.next = this.head;
// //     if (this.head) this.head.prev = node;
// //     this.head = node;
// //     if (!this.tail) this.tail = node;
// //   }

// //   _addToHead(node) {
// //     node.prev = null;
// //     node.next = this.head;
// //     if (this.head) this.head.prev = node;
// //     this.head = node;
// //     if (!this.tail) this.tail = node;
// //     this.map.set(node.key, node);
// //     this.size++;
// //   }

// //   _removeTail() {
// //     if (!this.tail) return;
// //     const key = this.tail.key;
// //     const prev = this.tail.prev;
// //     if (prev) prev.next = null;
// //     this.tail = prev;
// //     if (!this.tail) this.head = null;
// //     this.map.delete(key);
// //     this.size--;
// //   }

// //   get(key) {
// //     const node = this.map.get(key);
// //     if (!node) return -1;
// //     this._moveToHead(node);
// //     return node.value;
// //   }

// //   put(key, value) {
// //     const node = this.map.get(key);
// //     if (node) {
// //       node.value = value;
// //       this._moveToHead(node);
// //       return;
// //     }
// //     const newNode = new LRUNode(key, value);
// //     this._addToHead(newNode);
// //     if (this.size > this.capacity) {
// //       this._removeTail();
// //     }
// //   }

// //   // helper to inspect cache keys in MRU->LRU order
// //   keys() {
// //     const res = [];
// //     let node = this.head;
// //     while (node) {
// //       res.push(node.key);
// //       node = node.next;
// //     }
// //     return res;
// //   }

// //   // size for debugging
// //   getSize() {
// //     return this.size;
// //   }
// // }

// // /* ============================
// //    LRUDemo Component
// //    ============================ */

// function slowFib(n) {
//   // intentionally slow O(2^n) for large n so caching matters
//   if (n <= 1) return n;
//   return slowFib(n - 1) + slowFib(n - 2);
// }

// // export function LRUDemo({ capacity = 5 }) {
// //   // persist cache instance across renders
// //   const cacheRef = useRef(null);
// //   if (cacheRef.current === null) {
// //     cacheRef.current = new LRU(capacity);
// //   }
// //   const cache = cacheRef.current;

// //   const [n, setN] = useState(10);
// //   const [result, setResult] = useState(null);
// //   const [running, setRunning] = useState(false);

// //   const compute = useCallback(async (val) => {
// //     const key = String(val);
// //     const cached = cache.get(key);
// //     if (cached !== -1) {
// //       setResult({ value: cached, fromCache: true });
// //       return;
// //     }
// //     setRunning(true);
// //     // compute (synchronous heavy). For UI responsiveness we wrap in setTimeout to yield.
// //     await new Promise((res) => setTimeout(res, 0));
// //     // compute (may block for large n) - in real app you'd offload to webworker
// //     const v = slowFib(val);
// //     cache.put(key, v);
// //     setResult({ value: v, fromCache: false });
// //     setRunning(false);
// //   }, [cache]);

// //   const handleCompute = useCallback(() => {
// //     const val = Number(n);
// //     if (!Number.isFinite(val) || val < 0 || val > 40) {
// //       alert("Enter integer 0 <= n <= 40 (40 might be slow)");
// //       return;
// //     }
// //     setResult(null);
// //     compute(val);
// //   }, [n, compute]);

// //   return (
// //     <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, maxWidth: 520 }}>
// //       <h3>LRU Demo (capacity {capacity})</h3>
// //       <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
// //         <input
// //           type="number"
// //           value={n}
// //           onChange={(e) => setN(e.target.value)}
// //           style={{ width: 100, padding: 6 }}
// //         />
// //         <button onClick={handleCompute} style={{ padding: "6px 10px" }} disabled={running}>
// //           Compute fib(n)
// //         </button>
// //         {running && <span>computing...</span>}
// //       </div>

// //       <div style={{ marginBottom: 8 }}>
// //         <strong>Result:</strong>{" "}
// //         {result ? (
// //           <span>
// //             {String(result.value)} {result.fromCache ? "(from cache)" : ""}
// //           </span>
// //         ) : (
// //           <span>—</span>
// //         )}
// //       </div>

// //       <div>
// //         <strong>Cache (MRU → LRU):</strong>
// //         <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
// //           {cache.keys().length === 0 ? (
// //             <em style={{ opacity: 0.6 }}>empty</em>
// //           ) : (
// //             cache.keys().map((k) => (
// //               <div
// //                 key={k}
// //                 style={{
// //                   padding: "6px 8px",
// //                   background: "#f5f7ff",
// //                   border: "1px solid #e2e8ff",
// //                   borderRadius: 6,
// //                   fontSize: 13,
// //                 }}
// //               >
// //                 {k}
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// class LRUNode {
//   constructor(key, value) {
//     this.key = key;
//     this.value = value;
//     this.next = null;
//     this.prev = null;
//   }
// }

// class LRU {
//   constructor(capacity) {
//     if (capacity < 0) throw new Error("Capacity is < 0");
//     this.capacity = capacity;
//     this.map = new Map();
//     this.head = null;
//     this.tail = null;
//     this.size = 0;
//   }

//   _moveToHead(node) {
//     if (this.head === node) return;
//     if (node.next) node.next.prev = node.prev;
//     if (node.prev) node.prev.next = node.next;

//     node.prev = null;
//     node.next = this.head;
//     if (this.head) this.head.prev = node;
//     this.head = node;

//     if (!this.tail) this.tail = node;
//   }

//   _addToHead(node) {
//     node.prev = null;
//     node.next = this.head;
//     if (this.head) this.head.prev = node;
//     this.head = node;
//     if (!this.tail) this.tail = node;
//     this.map.set(node.key, node);
//     this.size++;
//   }

//   _removeTail() {
//     if (!this.tail) return;
//     const key = this.tail.key;
//     const prev = this.tail.prev;
//     if (prev) prev.next = null;
//     this.tail = prev;
//     if (!this.tail) this.head = null;
//     this.map.delete(key);
//     this.size--;
//   }

//   get(key) {
//     const node = this.map.get(key);
//     if (!node) return -1;
//     this._moveToHead(node);
//     return node.value;
//   }

//   put(key, value) {
//     const node = this.map.get(key);
//     if (node) {
//       node.value = value;
//       this._moveToHead(node);
//       return;
//     }

//     const newNode = new LRUNode(key, value);
//     this._addToHead(newNode);
//     if (this.size > this.capacity) {
//       this._removeTail();
//     }
//   }

//   keys() {
//     const res = [];
//     let node = this.head;
//     while (node) {
//       res.push(node.key);
//       node = node.next;
//     }

//     return res;
//   }

//   getSize() {
//     return this.size;
//   }
// }

// export function LRUDemo({ capacity = 5 }) {
//   const cacheRef = useRef(null);
//   if (cacheRef.current === null) {
//     cacheRef.current = new LRU(capacity);
//   }

//   const cache = cacheRef.current;

//   const [n, setN] = useState(10);
//   const [result, setResult] = useState(null);
//   const [running, setRunning] = useState(false);

//   const compute = useCallback(
//     async (val) => {
//       const key = String(val);
//       const cached = cache.get(key);
//       if (cached !== -1) {
//         setResult({ value: cached, fromCache: true });
//         return;
//       }
//       setRunning(true);

//       await new Promise((res) => setTimeout(res, 0));
//       const v = slowFib(val);
//       cache.put(key, v);
//       setResult({ value: v, fromCache: false });
//       setRunning(false);
//     },
//     [cache]
//   );

//   const handleCompute = useCallback(() => {
//     const val = Number(n);
//     if (!Number.isFinite(val) || val < 0 || val > 40) {
//       alert("Enter integer 0 <= n <= 40 (40 might be slow)");
//       return;
//     }
//     setResult(null);
//     compute(val);
//   }, [n, compute]);

//   return (
//     <div>
//       <h1>LRU</h1>
//       <div>
//         <input type="text" value={n} onChange={(e) => setN(e.target.value)} />
//         <button onClick={handleCompute} disabled={running}>
//           Compute Value
//         </button>
//       </div>

//       <div>
//         {result ? (
//           <span>
//             {String(result.value)} {result.fromCache ? "(from cache)" : ""}
//           </span>
//         ) : (
//           <span>--</span>
//         )}
//       </div>

//       <div>
//         <strong>Cache (MRU - LRU)</strong>
//         {cache.keys().length === 0 ? (
//           <em>empty</em>
//         ) : (
//           cache.keys().map((k) => (
//             <div
//               key={k}
//               style={{
//                 padding: "6px 8px",
//                 background: "red",
//                 border: "1px solid #e2e8ff",
//                 borderRadius: 6,
//                 fontSize: 13,
//               }}
//             >
//               {k}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // /* ============================
// //    App (demo page)
// //    ============================ */

// export default function App() {
//   // const bigList = useMemo(() => Array.from({ length: 50000 }, (_, i) => `Item ${i + 1}`), []);

//   return (
//     <div
//       style={{
//         padding: 20,
//         fontFamily: "Arial, sans-serif",
//         display: "grid",
//         gap: 20,
//       }}
//     >
//       <h1>Live Coding Mock — React Components</h1>

//       {/* <section>
//         <h2>1. Audio Player</h2>
//         <AudioPlayer
//           src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
//           onPlay={() => console.log("play")}
//           onPause={() => console.log("pause")}
//         />
//       </section>

//       <section>
//         <h2>2. Virtualized List</h2>
//         <div style={{ width: 520 }}>
//           <VirtualizedList items={bigList} itemHeight={28} height={320} />
//         </div>
//       </section> */}

//       <section>
//         <h2>3. LRU Cache Demo</h2>
//         <LRUDemo capacity={5} />
//       </section>
//     </div>
//   );
// }

import React from "react";
import { Player } from "./components/Player";
import Reader from "./components/Reader";

function App() {
  return (
    <div>
      <h1>Speechify-Like TTS Demo</h1>
      <p>
        Select any part of this text and click "Read Selection" to hear it
        aloud.
      </p>
      {/* <Player /> */}
       <Reader />;
    </div>
  );
}

export default App;
