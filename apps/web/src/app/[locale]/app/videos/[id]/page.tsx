import { Locale, getDictionaryByLocale } from '@nivo/i18n'
import { VideoIcon } from '@radix-ui/react-icons'
import { Music2 } from 'lucide-react'
import { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Overview } from './tabs/overview'
import { Webhooks } from './tabs/webhooks'
import { setDictionary } from '@/utils/dictionary-server-side'

interface VideoPageProps {
  params: { id: string; locale: Locale }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Video',
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const dictionary = await getDictionaryByLocale(params.locale)
  setDictionary(dictionary)

  const videoId = params.id

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="truncate text-3xl font-bold tracking-tight">
          {dictionary.video_page_edit_video_title}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${videoId}/download/video`}
              target="_blank"
              rel="noreferrer"
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              <span>{dictionary.video_page_download_mp4}</span>
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${videoId}/download/audio`}
              target="_blank"
              rel="noreferrer"
            >
              <Music2 className="mr-2 h-4 w-4" />
              <span>{dictionary.video_page_download_mp3}</span>
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {dictionary.video_page_overview_tab}
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            {dictionary.video_page_webhooks_tab}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview videoId={videoId} />
        </TabsContent>
        <TabsContent value="webhooks">
          <Webhooks videoId={videoId} />
        </TabsContent>
      </Tabs>
    </>
  )
}
