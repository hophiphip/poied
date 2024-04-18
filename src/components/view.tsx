import { useRef, useState, memo, useMemo, useLayoutEffect } from "react";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import {
  GizmoHelper,
  GizmoViewport,
  Environment,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  Grid,
} from "@react-three/drei";
import { useControls, Leva } from "leva";
import * as THREE from "three";

import usePointsStore, { Point } from "../store/points";

function Box(props: MeshProps & { center?: boolean }) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh>(null);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((_, delta) => {
    const meshState = meshRef.current;
    if (meshState) {
      meshState.rotation.x += delta;
    }
  });

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => {
        setActive(!active);
      }}
      onPointerOver={() => {
        setHover(true);
      }}
      onPointerOut={() => {
        setHover(false);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={props.center ? "green" : hovered ? "hotpink" : "orange"}
      />
    </mesh>
  );
}

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
));

Shadows.displayName = "@/poied/shadows";

function Line({ start, end }: { start: number[]; end: number[] }) {
  const ref = useRef<SVGLineElement>(null);

  useLayoutEffect(() => {
    const lineRef = ref.current;
    if (lineRef) {
      // eslint-disable-next-line
      ref.current.geometry.setFromPoints(
        [start, end].map((point) => new THREE.Vector3(...point)),
      );
    }
  }, [start, end]);

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  );
}

const View = () => {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 80, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  const points = usePointsStore((state) => state.points);

  const centerPoint: Point | null = useMemo(() => {
    const count = points.length;

    if (count < 2) return null;

    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;
    points.forEach(({ x, y, z }) => {
      sumX += x;
      sumY += y;
      sumZ += z;
    });

    return {
      x: sumX / count,
      y: sumY / count,
      z: sumZ / count,
    };
  }, [points]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%" }}>
        <Leva flat fill titleBar={{ drag: false }} collapsed />
      </div>

      <div style={{ flex: 1, width: "100%" }}>
        <Canvas
          shadows
          camera={{ position: [10, 12, 12], fov: 25 }}
          style={{ background: "#303035" }}
        >
          <ambientLight intensity={Math.PI / 2} />

          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />

          <group>
            {points.map(({ x, y, z }, index) => (
              <Box key={`${x}-${y}-${z}-${index}`} position={[x, y, z]} />
            ))}

            {centerPoint && (
              <Box
                position={[centerPoint.x, centerPoint.y, centerPoint.z]}
                center
              />
            )}

            {centerPoint &&
              points.map(({ x, y, z }, index) => (
                <Line
                  key={`line-${x}-${y}-${z}-${index}`}
                  start={[centerPoint.x, centerPoint.y, centerPoint.z]}
                  end={[x, y, z]}
                />
              ))}

            <Shadows />
            <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
          </group>

          <OrbitControls makeDefault />
          <Environment preset="city" />

          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport
              axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </div>
    </div>
  );
};

export default View;
