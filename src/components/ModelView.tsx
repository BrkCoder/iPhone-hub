import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import * as THREE from 'three'
import Lights from './Lights';
import Loader from './Loader';
import IPhone from './IPhone';
import { Suspense } from "react";

interface ModelViewProps {
  index: number;
  groupRef: React.RefObject<THREE.Group>;
  gsapType: string;
  controlRef: React.RefObject<any>;
  setRotation: (rotation: number) => void;
  size: string;
  item: {
    title: string;
    img: string;
    color: string[];
  };
}

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotation, size, item }: ModelViewProps) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotation(controlRef.current?.getAzimuthalAngle() || 0)}
      /> 

      <group ref={groupRef} name={index === 1 ? 'small' : 'large'} position={[0, 0, 0]}>
        <Suspense fallback={<Loader />}>
          <IPhone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView