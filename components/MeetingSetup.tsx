'use client'

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
  const call = useCall()

  if (!call) {
    throw new Error('useCall must be used within StreamCall component')
  }

  const stopAllTracks = () => {
    const cam = call.camera.state.mediaStream
    const mic = call.microphone.state.mediaStream

    cam?.getTracks().forEach(t => t.stop())
    mic?.getTracks().forEach(t => t.stop())
  }

  useEffect(() => {
    const applyToggle = async () => {
      if (isMicCamToggledOn) {
        await call.camera.disable()
        await call.microphone.disable()
        stopAllTracks() // 🔥 Apaga el LED de la cámara
      } else {
        await call.camera.enable()
        await call.microphone.enable()
      }
    }

    applyToggle().catch(() => { })
  }, [isMicCamToggledOn])

  const handleJoin = async () => {
    stopAllTracks() // 🔥 asegura apagar antes de entrar
    await call.join()
    setIsSetupComplete(true)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white px-4">

      <div
        className="w-full max-w-xl p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.04)] flex flex-col gap-6">

        <h1 className="text-2xl font-medium text-center tracking-wide text-gray-100">
          Preparar reunión
        </h1>

        {/* VIDEO PREVIEW */}
        <div
          className="w-full aspect-video max-h-[360px] rounded-lg overflow-hidden bg-[rgba(0,0,0,0.45)] border border-[rgba(255,255,255,0.03)] flex items-center justify-center">
          <VideoPreview />
        </div>

        {/* TOGGLE */}
        <label
          className="flex items-center justify-center gap-3 cursor-pointer text-gray-300 hover:text-white transition select-none">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
            className="h-4 w-4 accent-emerald-500 cursor-pointer"
          />
          <span className="text-sm">Desactivar micrófono y cámara</span>
        </label>

        {/* CONFIG + DEVICE SETTINGS AL LADO */}
        <div
          className="w-full flex items-center justify-center gap-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-200 whitespace-nowrap">
            Configuraciones
          </h2>

          <div className="flex items-center justify-center">
            <DeviceSettings />
          </div>
        </div>


        {/* JOIN BUTTON */}
        <button
          onClick={handleJoin}
          className=" w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 py-3 font-semibold transition-all shadow-sm cursor-pointer active:scale-[0.995]">
          Entrar a la reunión
        </button>

        <p className="text-xs text-center text-gray-400">
          Asegúrate de permitir acceso a la cámara y micrófono
        </p>
      </div>
    </div>
  )
}

export default MeetingSetup
