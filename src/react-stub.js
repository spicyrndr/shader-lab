// Sustituto mínimo de React: cada envoltorio de Paper devuelve las props que pasaría a ShaderMount.
// Los hooks no guardan estado: los shaders de logo usan suspendWhenProcessingImage, que procesa la imagen con suspend().
export const memo = (f) => f;
export const jsx = (_componente, props) => props;
export const useState = (inicial) => [typeof inicial === "function" ? inicial() : inicial, () => {}];
export const useLayoutEffect = () => {};
export const useEffect = () => {};
export const useMemo = (fn) => fn();
export const useRef = (valor) => ({ current: valor });
export const useCallback = (fn) => fn;
export default { memo, useState, useLayoutEffect, useEffect, useMemo, useRef, useCallback };
