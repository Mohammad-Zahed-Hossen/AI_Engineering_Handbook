"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageVisit } from "@/lib/session-tracking";

function slugToTitle(slug: string): string {
  if (!slug) return "";
  const specialCases: Record<string, string> = {
    numpy: "NumPy",
    pandas: "Pandas",
    pytorch: "PyTorch",
    jax: "JAX",
    cupy: "CuPy",
    dask: "Dask",
    polars: "Polars",
    sklearn: "scikit-learn",
    rag: "RAG",
    llm: "LLM",
    ml: "ML",
    dl: "DL",
    ocr: "OCR",
    gan: "GAN",
    vae: "VAE",
    bert: "BERT",
    gpt: "GPT",
    t5: "T5",
    llama: "LLaMA",
    mistral: "Mistral",
    clip: "CLIP",
    vit: "ViT",
    resnet: "ResNet",
    vgg: "VGG",
    densenet: "DenseNet",
    mobilenet: "MobileNet",
    efficientnet: "EfficientNet",
    xgboost: "XGBoost",
    lightgbm: "LightGBM",
    catboost: "CatBoost",
    easyocr: "EasyOCR",
    pytesseract: "pytesseract",
    opencv: "OpenCV",
    pillow: "Pillow",
    transformers: "Transformers",
    tokenizers: "Tokenizers",
    accelerate: "Accelerate",
    datasets: "Datasets",
    evaluate: "Evaluate",
    peft: "PEFT",
    trl: "TRL",
    deepspeed: "DeepSpeed",
    vllm: "vLLM",
    tensorrt: "TensorRT",
    onnx: "ONNX",
    openvino: "OpenVINO",
    tensorflow: "TensorFlow",
    keras: "Keras",
    tensorflowjs: "TensorFlow.js",
    tensorflowlite: "TensorFlow Lite",
    mediapipe: "MediaPipe",
    tflite: "TFLite",
    coreml: "CoreML",
  };

  const lower = slug.toLowerCase();
  if (specialCases[lower]) return specialCases[lower];

  return slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getPageInfo(pathname: string): { name: string; type: string; category?: string } {
  if (pathname === "/") return { name: "Home", type: "home" };
  if (pathname === "/packages") return { name: "Packages", type: "package" };
  if (pathname === "/models") return { name: "Models", type: "model" };
  if (pathname === "/workflows") return { name: "Workflows", type: "workflow" };
  if (pathname === "/cheatsheets") return { name: "Cheatsheets", type: "cheatsheet" };
  if (pathname === "/registry") return { name: "Registry", type: "registry" };

  const parts = pathname.split("/").filter(Boolean);

  if (pathname.startsWith("/packages/")) {
    return { name: slugToTitle(parts[1]), type: "package" };
  }

  if (pathname.startsWith("/models/")) {
    if (parts.length === 2) {
      return {
        name: `${slugToTitle(parts[1])} Models`,
        type: "model",
        category: parts[1],
      };
    }
    return {
      name: slugToTitle(parts[2]),
      type: "model",
      category: parts[1],
    };
  }

  if (pathname.startsWith("/workflows/")) {
    return { name: slugToTitle(parts[1]), type: "workflow" };
  }

  if (pathname.startsWith("/cheatsheets/")) {
    return { name: slugToTitle(parts[1]), type: "cheatsheet" };
  }

  if (pathname.startsWith("/registry/")) {
    return { name: `${slugToTitle(parts[1])} Registry`, type: "registry" };
  }

  return { name: slugToTitle(parts[parts.length - 1] || "Page"), type: "page" };
}

export default function PageVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const timer = setTimeout(() => {
      const { name, type, category } = getPageInfo(pathname);
      recordPageVisit(pathname, name, type, category);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
