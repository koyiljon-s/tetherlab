"use client";

import { useEffect, useRef } from "react";

type GradientWaveProps = {
  colors?: string[];
  isPlaying?: boolean;
  className?: string;
  shadowPower?: number;
  darkenTop?: boolean;
  noiseSpeed?: number;
  noiseFrequency?: [number, number];
  deform?: {
    incline?: number;
    offsetTop?: number;
    offsetBottom?: number;
    noiseFreq?: [number, number];
    noiseAmp?: number;
    noiseSpeed?: number;
    noiseFlow?: number;
    noiseSeed?: number;
  };
};

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 v_uv;

  void main() {
    v_uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_colors[6];
  uniform float u_shadow_power;
  uniform float u_darken_top;
  uniform float u_noise_frequency_x;
  uniform float u_noise_frequency_y;
  uniform float u_deform_amplitude;
  uniform float u_deform_flow;

  float wave(float offset, float frequency, float speed) {
    return sin(v_uv.x * frequency + u_time * speed + offset) * 0.5 + 0.5;
  }

  void main() {
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    float y = v_uv.y;
    float flow = u_time * u_deform_flow;
    float distortion =
      sin((v_uv.x * aspect + flow) * u_noise_frequency_x) * 0.10 +
      cos((v_uv.y - flow) * u_noise_frequency_y) * 0.08;
    y += distortion * (u_deform_amplitude / 250.0);

    vec3 color = u_colors[0];
    color = mix(color, u_colors[1], smoothstep(0.02, 0.42, y + wave(0.0, 5.0, 0.25) * 0.18));
    color = mix(color, u_colors[2], smoothstep(0.18, 0.58, y + wave(1.7, 7.0, 0.19) * 0.16));
    color = mix(color, u_colors[3], smoothstep(0.34, 0.74, y + wave(3.1, 6.0, 0.22) * 0.14));
    color = mix(color, u_colors[4], smoothstep(0.50, 0.90, y + wave(4.5, 8.0, 0.16) * 0.12));
    color = mix(color, u_colors[5], smoothstep(0.66, 1.0, y));

    if (u_darken_top > 0.5) {
      color *= 1.0 - pow(v_uv.y, u_shadow_power) * 0.4;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program");

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown program error";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

export function GradientWave({
  colors = ["#569ad6", "#7cc1ea", "#d9f2ff", "#78b9df", "#4b86c5", "#569ad6"],
  isPlaying = true,
  className = "",
  shadowPower = 8,
  darkenTop = false,
  noiseSpeed = 0.00001,
  noiseFrequency = [5, 7],
  deform = { noiseAmp: 250, noiseFlow: 5 },
}: GradientWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      program = createProgram(gl);
    } catch (error) {
      console.error("Failed to initialize gradient wave:", error);
      return;
    }

    const position = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    if (!buffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      colors: gl.getUniformLocation(program, "u_colors[0]"),
      shadowPower: gl.getUniformLocation(program, "u_shadow_power"),
      darkenTop: gl.getUniformLocation(program, "u_darken_top"),
      noiseFrequencyX: gl.getUniformLocation(program, "u_noise_frequency_x"),
      noiseFrequencyY: gl.getUniformLocation(program, "u_noise_frequency_y"),
      deformAmplitude: gl.getUniformLocation(program, "u_deform_amplitude"),
      deformFlow: gl.getUniformLocation(program, "u_deform_flow"),
    };

    const colorValues = Array.from({ length: 6 }, (_, index) =>
      hexToRgb(colors[index % colors.length] ?? "#569ad6")
    ).flat();
    let animationFrame = 0;
    let startedAt = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(bounds.height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const elapsed = (timestamp - startedAt) * noiseSpeed;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform3fv(
        uniforms.colors,
        new Float32Array(colorValues.map((value) => value / 255))
      );
      gl.uniform1f(uniforms.shadowPower, shadowPower);
      gl.uniform1f(uniforms.darkenTop, darkenTop ? 1 : 0);
      gl.uniform1f(uniforms.noiseFrequencyX, noiseFrequency[0]);
      gl.uniform1f(uniforms.noiseFrequencyY, noiseFrequency[1]);
      gl.uniform1f(uniforms.deformAmplitude, deform.noiseAmp ?? 250);
      gl.uniform1f(uniforms.deformFlow, deform.noiseFlow ?? 5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (isPlaying) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw(performance.now());

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [colors, darkenTop, deform, isPlaying, noiseFrequency, noiseSpeed, shadowPower]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 z-0 h-full w-full overflow-hidden ${className}`}
    />
  );
}
