import { ComponentProps } from 'react'

export function GradientBg(props: ComponentProps<'svg'>) {
  return (
    <svg
      width={1220}
      height={1182}
      viewBox="0 0 1220 1182"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity={0.3}>
        <g filter="url(#filter0_f_8_1018)">
          <circle cx={610} cy={572} r={410} fill="url(#paint0_linear_8_1018)" />
        </g>
        <g filter="url(#filter1_f_8_1018)">
          <circle cx={751} cy={413} r={300} fill="url(#paint1_linear_8_1018)" />
        </g>
        <rect
          width="1220"
          height="1182"
          fill="#fff"
          filter="url(#nnnoise-filter)"
        ></rect>
      </g>
      <defs>
        <filter
          id="nnnoise-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.102"
            numOctaves="4"
            seed="15"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feSpecularLighting
            surfaceScale="15"
            specularConstant="0.75"
            specularExponent="20"
            lightingColor="#989898"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            result="specularLighting"
          >
            <feDistantLight azimuth="3" elevation="100"></feDistantLight>
          </feSpecularLighting>
        </filter>
        <filter
          id="filter0_f_8_1018"
          x={0}
          y={-38}
          width={1220}
          height={1220}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={100}
            result="effect1_foregroundBlur_8_1018"
          />
        </filter>
        <filter
          id="filter1_f_8_1018"
          x={351}
          y={13}
          width={800}
          height={800}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={50}
            result="effect1_foregroundBlur_8_1018"
          />
        </filter>
        <linearGradient
          id="paint0_linear_8_1018"
          x1={610}
          y1={162}
          x2={610}
          y2={982}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BFF3" />
          <stop offset={1} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_8_1018"
          x1={751}
          y1={113}
          x2={751}
          y2={713}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2ED3C3" />
          <stop offset={1} />
        </linearGradient>
      </defs>
    </svg>
  )
}
