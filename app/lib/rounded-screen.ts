import * as THREE from "three";

function getRoundedRectangleShape(
  width: number,
  height: number,
  radius: number,
) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, radius - height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    -height / 2,
    radius - width / 2,
    -height / 2,
  );
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(
    width / 2,
    -height / 2,
    width / 2,
    radius - height / 2,
  );
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(radius - width / 2, height / 2);
  shape.quadraticCurveTo(
    -width / 2,
    height / 2,
    -width / 2,
    height / 2 - radius,
  );
  return shape;
}

type AxisIndex = 0 | 1 | 2;

function getAxisVector(axis: AxisIndex) {
  if (axis === 0) {
    return new THREE.Vector3(1, 0, 0);
  }

  if (axis === 1) {
    return new THREE.Vector3(0, 1, 0);
  }

  return new THREE.Vector3(0, 0, 1);
}

function inferScreenAxes(
  geometry: THREE.BufferGeometry,
): {
  axisU: AxisIndex;
  axisV: AxisIndex;
  flipU: boolean;
  flipV: boolean;
} {
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");

  if (!position || !uv || position.count !== uv.count) {
    return { axisU: 0, axisV: 1, flipU: false, flipV: false };
  }

  const means = [0, 0, 0];
  let meanU = 0;
  let meanV = 0;

  for (let i = 0; i < position.count; i += 1) {
    means[0] += position.getX(i);
    means[1] += position.getY(i);
    means[2] += position.getZ(i);
    meanU += uv.getX(i);
    meanV += uv.getY(i);
  }

  means[0] /= position.count;
  means[1] /= position.count;
  means[2] /= position.count;
  meanU /= uv.count;
  meanV /= uv.count;

  const covarianceToU = [0, 0, 0];
  const covarianceToV = [0, 0, 0];

  for (let i = 0; i < position.count; i += 1) {
    const coords = [position.getX(i), position.getY(i), position.getZ(i)];

    for (let axis = 0; axis < 3; axis += 1) {
      covarianceToU[axis] += (coords[axis] - means[axis]) * (uv.getX(i) - meanU);
      covarianceToV[axis] += (coords[axis] - means[axis]) * (uv.getY(i) - meanV);
    }
  }

  const axisU = covarianceToU
    .map((value, axis) => ({ axis: axis as AxisIndex, value: Math.abs(value) }))
    .sort((a, b) => b.value - a.value)[0]?.axis ?? 0;
  const axisV = covarianceToV
    .map((value, axis) => ({ axis: axis as AxisIndex, value: Math.abs(value) }))
    .sort((a, b) => {
      if (a.axis === axisU) return 1;
      if (b.axis === axisU) return -1;
      return b.value - a.value;
    })[0]?.axis ?? (axisU === 0 ? 1 : 0);

  return {
    axisU,
    axisV,
    flipU: covarianceToU[axisU] < 0,
    flipV: covarianceToV[axisV] < 0,
  };
}

export function createRoundedScreenGeometryFromMesh(
  mesh: THREE.Mesh,
  radiusRatio: number,
) {
  mesh.geometry.computeBoundingBox();

  const boundingBox = mesh.geometry.boundingBox?.clone();
  if (!boundingBox) {
    return null;
  }

  const width = boundingBox.max.x - boundingBox.min.x;
  const height = boundingBox.max.y - boundingBox.min.y;
  const center = boundingBox.getCenter(new THREE.Vector3());
  const { axisU, axisV, flipU, flipV } = inferScreenAxes(mesh.geometry);
  const size = [width, height, boundingBox.max.z - boundingBox.min.z] as const;
  const normalAxis = ([0, 1, 2] as AxisIndex[]).find(
    (axis) => axis !== axisU && axis !== axisV,
  );

  if (!normalAxis) {
    return null;
  }

  const planeWidth = size[axisU];
  const planeHeight = size[axisV];

  if (planeWidth <= 0 || planeHeight <= 0) {
    return null;
  }

  const radius = Math.min(planeWidth, planeHeight) * radiusRatio;
  const shape = getRoundedRectangleShape(planeWidth, planeHeight, radius);
  const geometry = new THREE.ShapeGeometry(shape);
  const position = geometry.getAttribute("position");
  const uvArray = new Float32Array(position.count * 2);
  const halfW = planeWidth / 2;
  const halfH = planeHeight / 2;

  for (let i = 0; i < position.count; i += 1) {
    let u = (position.getX(i) + halfW) / planeWidth;
    let v = (position.getY(i) + halfH) / planeHeight;

    if (flipU) {
      u = 1 - u;
    }

    if (flipV) {
      v = 1 - v;
    }

    uvArray[i * 2] = u;
    uvArray[i * 2 + 1] = v;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));

  const basisU = getAxisVector(axisU);
  const basisV = getAxisVector(axisV);
  const basisNormal = getAxisVector(normalAxis);
  const transform = new THREE.Matrix4().makeBasis(basisU, basisV, basisNormal);
  transform.setPosition(center);
  geometry.applyMatrix4(transform);

  return geometry;
}
