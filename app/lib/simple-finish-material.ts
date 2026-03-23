import * as THREE from "three";

export function createSimpleFinishMaterial(color: string, matte: boolean) {
  if (matte) {
    return new THREE.MeshLambertMaterial({ color });
  }

  return new THREE.MeshPhongMaterial({
    color,
    shininess: 65,
    specular: new THREE.Color("#555555"),
  });
}
