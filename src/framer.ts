// Mock framer implementation for Vite locally

export const addPropertyControls = (component: any, controls: any) => {};

export const ControlType = {
    String: "String",
    Array: "Array",
    Object: "Object",
    ResponsiveImage: "ResponsiveImage",
    Color: "Color",
    Number: "Number",
    Font: "Font",
    Enum: "Enum",
    Boolean: "Boolean",
    ComponentInstance: "ComponentInstance",
    EventHandler: "EventHandler",
    File: "File",
    Image: "Image",
    Link: "Link",
    Transition: "Transition"
};

export const RenderTarget = {
    current: () => "canvas"
};

export const useIsStaticRenderer = () => false;

export const createStore = (initialState: any) => initialState;

export { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring, useAnimation } from "framer-motion";
