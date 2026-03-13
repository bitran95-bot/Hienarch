import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch, sanityFetchMetadata, sanityFetchStaticParams} from '@/sanity/lib/live'
import {projectBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute, toPlainText} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data: project} = await sanityFetchMetadata({
    query: projectBySlugQuery,
    params: await params,
  })
  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    project?.coverImage,
  )

  return {
    title: project?.title,
    description: project?.overview ? toPlainText(project.overview) : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  }
}

export async function generateStaticParams() {
  const slugs = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'project'},
  })

  // ĐOẠN CODE ĐÃ ĐƯỢC THÊM VÀO ĐỂ SỬA LỖI
  if (!slugs || slugs.length === 0) {
    return [{slug: 'demo'}]
  }

  return slugs
}

export default function ProjectSlugRoute({params}: Props) {
  return (
    <div>
      <div className="mb-20 space-y-6">
        <Suspense
          fallback={
            <Header
              id={null}
              type={null}
              path={['overview']}
              title="Loading…"
              description={null}
              loading
            />
          }
        >
          <ProjectSlugRouteContent params={params} />
        </Suspense>
      </div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}

async function ProjectSlugRouteContent({params}: Props) {
  const {data} = await sanityFetch({query: projectBySlugQuery, params: await params})

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a project on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  // Default to an empty object to allow previews on non-existent documents
  const {client, coverImage, description, duration, overview, site, tags, title} = data ?? {}

  const startYear = duration?.start ? new Date(duration.start).getFullYear() : undefined
  const endYear = duration?.end ? new Date(duration?.end).getFullYear() : 'Now'

  return (
    <>
      {/* Header */}
      <Header
        id={data?._id || null}
        type={data?._type || null}
        path={['overview']}
        title={title || (data?._id ? 'Untitled' : '404 Project Not Found')}
        description={overview}
      />

      {/* Tags as category labels */}
      {tags && tags.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2">
          {tags.map((tag, key) => (
            <span
              key={key}
              className="font-mono text-xs uppercase tracking-widest text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Cover Image with grayscale effect and hover transition */}
      <div className="rounded-md border">
        <div className="overflow-hidden">
          <ImageBox
            data-sanity={dataAttribute?.('coverImage')}
            image={coverImage as any}
            alt={title ? `Cover image for ${title}` : ''}
            classesWrapper="relative aspect-[16/9]"
            classesImage="object-cover grayscale brightness-110 contrast-125 transition-[filter,transform] duration-1000 hover:grayscale-0 hover:scale-105"
          />
        </div>

        {/* Metadata Grid */}
        <div className="divide-inherit grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {/* Duration */}
          {!!(startYear && endYear) && (
            <div className="p-3 lg:p-4">
              <div className="font-mono text-xs uppercase tracking-wider text-gray-400">
                Duration
              </div>
              <div className="text-md md:text-lg">
                <span data-sanity={dataAttribute?.('duration.start')}>{startYear}</span>
                {' — '}
                <span data-sanity={dataAttribute?.('duration.end')}>{endYear}</span>
              </div>
            </div>
          )}

          {/* Client */}
          {client && (
            <div className="p-3 lg:p-4">
              <div className="font-mono text-xs uppercase tracking-wider text-gray-400">
                Client
              </div>
              <div className="text-md md:text-lg">{client}</div>
            </div>
          )}

          {/* Site */}
          {site && (
            <div className="p-3 lg:p-4">
              <div className="font-mono text-xs uppercase tracking-wider text-gray-400">Site</div>
              {site && (
                <Link
                  target="_blank"
                  className="text-md break-words underline transition hover:opacity-50 md:text-lg"
                  href={site}
                >
                  {site}
                </Link>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="p-3 lg:p-4">
            <div className="font-mono text-xs uppercase tracking-wider text-gray-400">Tags</div>
            <div className="text-md flex flex-row flex-wrap md:text-lg">
              {tags?.map((tag, key) => (
                <div key={key} className="mr-1 break-words">
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <CustomPortableText
          id={data?._id || null}
          type={data?._type || null}
          path={['description']}
          paragraphClasses="font-serif max-w-3xl text-xl text-gray-600"
          value={description as any}
        />
      )}
    </>
  )
}
