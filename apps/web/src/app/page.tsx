import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import nivoIcon from '@/assets/nivo-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Homepage() {
  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex items-center gap-3">
          <Image
            src={nivoIcon}
            className="size-5"
            width={20}
            height={20}
            alt=""
          />
          <h1 className="text-sm font-medium">nivo.video</h1>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Redefining video content</h2>

          <p className="font-medium leading-relaxed text-zinc-100">
            Nivo offers a comprehensive video solution tailored for online
            content creators, emphasizing seamless developer integration,
            transparent pricing, and exceptional user experience.
          </p>

          <form action="" className="flex flex-col items-end gap-4">
            <Input placeholder="Full name" />
            <Input type="email" placeholder="Your e-mail" />
            <Input type="number" placeholder="Number of videos" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Where do you store your videos today?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm" type="submit">
              Request access
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
