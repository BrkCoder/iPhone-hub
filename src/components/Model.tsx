import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import ModelView from "./ModelView";
import { useEffect, useRef, useState } from "react";
import { yellowImg } from "../utils";

import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "../constants";
import { animateWithGsapTimeline } from "../utils/animations";

// Define types for the model structure
interface ModelType {
  id: number;
  title: string;
  color: string[];
  img: string;
}

interface SizeType {
  label: string;
  value: string;
}

const Model = () => {
  const [size, setSize] = useState<string>('small');
  const [model, setModel] = useState<ModelType>({
    id: 1,
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  })

  // camera control for the model view - properly typed refs
  const cameraControlSmall = useRef<any>(null);
  const cameraControlLarge = useRef<any>(null);

  // model
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // rotation
  const [smallRotation, setSmallRotation] = useState<number>(0);
  const [largeRotation, setLargeRotation] = useState<number>(0);

  const tl = gsap.timeline();

  useEffect(() => {
    if(size === 'large') {
      animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2
      })
    }

    if(size === 'small') {
      animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2
      })
    }
  }, [size, tl, small, large, smallRotation, largeRotation])

  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1 })
  }, []);

  const handleModelChange = (selectedModel: ModelType) => {
    setModel(selectedModel);
  };

  const handleSizeChange = (selectedSize: string) => {
    setSize(selectedSize);
  };

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            <ModelView 
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotation={setSmallRotation}
              item={model}
              size={size}
            />  

            <ModelView 
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotation={setLargeRotation}
              item={model}
              size={size}
            />

            <Canvas
              className="w-full h-full"
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}
              eventSource={document.getElementById('root') as HTMLElement}
            >
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container">
                {models.map((item: ModelType) => (
                  <li 
                    key={item.id} 
                    className="w-6 h-6 rounded-full mx-2 cursor-pointer" 
                    style={{ backgroundColor: item.color[0] }} 
                    onClick={() => handleModelChange(item)} 
                  />
                ))}
              </ul>

              <button className="size-btn-container">
                {sizes.map((sizeOption: SizeType) => (
                  <span 
                    key={sizeOption.label} 
                    className="size-btn" 
                    style={{ 
                      backgroundColor: size === sizeOption.value ? 'white' : 'transparent', 
                      color: size === sizeOption.value ? 'black' : 'white'
                    }} 
                    onClick={() => handleSizeChange(sizeOption.value)}
                  >
                    {sizeOption.label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Model;