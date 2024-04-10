import { ArrowRight } from 'lucide-react'
import { Merriweather } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950">
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
                'text-balance bg-gradient-to-br from-teal-400 to-sky-400 bg-clip-text text-center text-5xl font-bold leading-snug text-transparent lg:text-6xl lg:leading-snug',
              )}
            >
              Redefining video content
            </h1>
            <p className="max-w-2xl text-center text-lg leading-relaxed text-zinc-100 lg:text-xl lg:leading-relaxed">
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
            <Button asChild size="lg" variant="link" className="text-zinc-400">
              <Link href="/about">What is Nivo?</Link>
            </Button>
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
