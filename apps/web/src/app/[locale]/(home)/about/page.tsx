import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import nivoIcon from '@/assets/nivo-icon.svg'
import developersScreenshot from '@/assets/screenshots/nivo-developers-screenshot.png'
import newUploadScreenshot from '@/assets/screenshots/nivo-new-upload-screenshot.png'
import videoScreenshot from '@/assets/screenshots/nivo-video-screenshot.png'
import webhooksScreenshot from '@/assets/screenshots/nivo-webhooks-screenshot.png'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-zinc-950">
      <div className="mx-auto w-full max-w-[800px] px-6 py-20">
        <div className="flex flex-col gap-8">
          <div className="mx-auto w-full max-w-[600px]">
            <div className="-mx-8 flex items-center gap-4">
              <Button
                asChild
                size="lg"
                variant="link"
                className="text-zinc-400"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 size-4" />
                  back to homepage
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[600px]">
            <Image
              src={nivoIcon}
              alt="nivo.video"
              className="size-8"
              width={32}
              height={32}
            />
          </div>

          <div className="flex flex-col gap-6">
            <h1
              className={twMerge(
                'mx-auto w-full max-w-[600px] text-3xl font-bold text-white lg:text-4xl',
              )}
            >
              What is nivo.video?
            </h1>
            <div className="text-base leading-relaxed text-zinc-200 lg:text-lg">
              <p className="mx-auto w-full max-w-[600px]">
                Nivo offers secure video hosting, fast video distribution,
                transparent and fair pricing, seamless developer experience, and
                AI content automation.
              </p>

              <h2 className="mx-auto mt-8 w-full max-w-[600px] text-xl font-bold text-white lg:text-2xl">
                How does it works?
              </h2>

              <h2 className="mx-auto mt-8 w-full max-w-[600px] text-lg font-bold text-white lg:text-xl">
                Upload a video
              </h2>
              <p className="mx-auto mt-6 w-full max-w-[600px]">
                Start by uploading your video files with automatic AI title
                generation, audio conversion and video transcription.
              </p>
              <Image
                src={newUploadScreenshot}
                alt="Screenshot of new upload page on nivo.video"
                className="mt-6 rounded-lg"
              />

              <p className="mx-auto mt-6 w-full max-w-[600px]">
                Inspect your new uploads and generate AI description with a
                click of a button.
              </p>
              <Image
                src={videoScreenshot}
                alt="Screenshot of new upload page on nivo.video"
                className="mt-6 rounded-lg"
              />

              <p className="mx-auto mt-6 w-full max-w-[600px]">
                Integrate Nivo with your platform by using our API or listening
                to webhook events.
              </p>
              <Image
                src={developersScreenshot}
                alt="Screenshot of new upload page on nivo.video"
                className="mt-6 rounded-lg"
              />

              <p className="mx-auto mt-6 w-full max-w-[600px]">
                Check webhook logs to keep track of any communication between
                nivo and your platform.
              </p>
              <Image
                src={webhooksScreenshot}
                alt="Screenshot of new upload page on nivo.video"
                className="mt-6 rounded-lg"
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[600px]">
            <div className="-mx-8 flex items-center gap-4">
              <Button
                asChild
                size="lg"
                variant="link"
                className="text-zinc-400"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 size-4" />
                  back to homepage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
