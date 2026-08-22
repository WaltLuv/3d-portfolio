import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

import assetUrl from "../../utils/assetUrl";

const WALTER_TWIN_ASSET = assetUrl("/models/walter-ai-twin.glb");

const WalterTwinModel = ({ state = "Idle", ...props }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(WALTER_TWIN_ASSET);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[state] || actions.Idle || Object.values(actions)[0];
    action?.reset().fadeIn(0.25).play();
    return () => action?.fadeOut(0.2);
  }, [actions, state]);

  return <group ref={group} {...props}><primitive object={clonedScene} /></group>;
};

const WalterTwin = ({ enabled = false, ...props }) => (enabled ? <WalterTwinModel {...props} /> : null);

export default WalterTwin;
