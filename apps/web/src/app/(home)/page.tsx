import { ArrowRight } from 'lucide-react'
import { Merriweather } from 'next/font/google'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import nivoIcon from '@/assets/nivo-icon.svg'
import { Button } from '@/components/ui/button'

import { GradientBg } from './gradient-bg'

const merriWeather = Merriweather({
  weight: ['700'],
  subsets: ['latin'],
})

export default function Homepage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 selection:bg-teal-400/30 selection:text-white">
      <div className="z-20 mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col items-center gap-16">
          <Image
            src={nivoIcon}
            alt="nivo.video"
            className="size-10"
            width={40}
            height={40}
          />

          <div className="flex flex-col items-center gap-4">
            <h1
              className={twMerge(
                merriWeather.className,
                'bg-gradient-to-br from-teal-400 to-sky-400 bg-clip-text text-6xl font-bold leading-snug text-transparent',
              )}
            >
              Redefining video content
            </h1>
            <p className="max-w-2xl text-center text-xl leading-relaxed text-zinc-100">
              Nivo offers a{' '}
              <strong>
                comprehensive video solution tailored for online content
                creators
              </strong>
              , emphasizing seamless developer integration, transparent pricing,
              and exceptional user experience.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              asChild
              className="bg-teal-400 text-teal-950 hover:bg-teal-500 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-500"
              size="lg"
            >
              <a href="https://tally.so/r/wa6LdW" target="_blank">
                Request BETA access
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <GradientBg className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-30" />
    </div>
  )
}
