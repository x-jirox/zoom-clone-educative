/* eslint-disable react-hooks/static-components */
import { cn } from '@/lib/utils'
import {CallControls, CallParticipantsList, PaginatedGridLayout, SpeakerLayout} from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useRouter } from "next/navigation" 

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipats, setShowParticipants] = useState(false)
    const router = useRouter() // 🔥 Usado para redirección al home

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition='left' />
      default:
        return <SpeakerLayout participantsBarPosition='right' />
    }
  }

  return (
    <section className="relative h-screen w-full bg-black text-white overflow-hidden">

      {/* MAIN CALL AREA */}
      <div className="relative flex size-full items-center justify-center px-2 pt-4 sm:px-4">
        <div className="flex size-full max-w-[1200px] rounded-xl overflow-hidden shadow-xl">
          <CallLayout />
        </div>
      </div>

      {/* PARTICIPANTS FLOATING SIDEBAR */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-gray-900/95 backdrop-blur-xl",
          "border-l border-gray-700 shadow-2xl",
          "transition-all duration-300 ease-out",
          showParticipats ? "w-96 opacity-100" : "w-0 opacity-0"
        )}
      >
        {showParticipats && (
          <div className="h-full overflow-y-auto p-4">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* FLOATING FOOTER */}
      <div className="fixed bottom-4 left-0 right-0 flex w-full items-center justify-center px-2">
        <div
          className="flex items-center gap-4 px-4 bg-gray-900/70 backdrop-blur-xl border border-gray-700 shadow-lg  rounded-full transition-all max-w-full sm:gap-4 sm:px-6 sm:py-0.5">
          <CallControls  onLeave={() => router.push("/")}  />

          {/* LAYOUT BUTTON */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer bg-gray-800 hover:bg-gray-700 size-9 sm:size-10 rounded-full flex items-center justify-center transition-all">
              <LayoutList size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border-gray-700 bg-gray-900 text-white rounded-lg shadow-xl">
              {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item) => (
                <DropdownMenuItem
                  key={item}
                  className="cursor-pointer hover:bg-gray-800"
                  onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* PARTICIPANTS BUTTON */}
          <button
            onClick={() => setShowParticipants(prev => !prev)}
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 size-9 sm:size-10 rounded-full flex items-center justify-center transition-all"
          >
            <Users size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default MeetingRoom
