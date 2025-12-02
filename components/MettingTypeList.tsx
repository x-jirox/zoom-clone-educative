'use client'
import React, { useState } from 'react'
import HomeCards from './HomeCards'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from "sonner"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'

const MettingTypeList = () => {

  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isSchundleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [callDetails, setCallDetails] = useState<Call>()

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast("Seleccione la fecha")
        return
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Error al crear la sala')

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Reunion Instantanea';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast("Reunion Creada exitosamente.")

    } catch (error) {
      console.log(error);
      toast("Error al crear la reunion.")
    }
  }

  const meetingLink = `${process.env.NEXT_PIBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCards
        img='/icons/add-meeting.svg'
        title='Nueva reunión'
        description='Inicia una reunión instantánea ahora mismo.'
        handleClick={() => setMeetingState('isInstantMeeting')}
        className='bg-orange-1'
      />
      <HomeCards
        img='/icons/schedule.svg'
        title='Programar reunión'
        description='Programa una nueva reunión ahora mismo.'
        handleClick={() => setMeetingState('isSchundleMeeting')}
        className='bg-blue-1'
      />
      <HomeCards
        img='/icons/recordings.svg'
        title='Ver grabaciones'
        description='Revisa las grabaciones de tus reuniones pasadas.'
        handleClick={() => router.push('/recordings')}
        className='bg-purple-1'
      />
      <HomeCards
        img='/icons/join-meeting.svg'
        title='Unirse a reunión'
        description='Únete a una reunión existente con un código.'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className='bg-yellow-1'
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isSchundleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Crear una reunion'
          handleClick={createMeeting}
          buttonText='Crear reunión'
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-50'>
              Añade un descripcion
            </label>
            <Textarea className='bg-gray-700 focus-visible:ring-0'
              onChange={(e) => {
                setValues({ ...values, description: e.target.value })
              }}
            />
          </div>
          <div className='flex w-full flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-50'>
              Seleccione fecha y hora
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
              className='w-full rounded bg-gray-700 p-2 focus:outline-none'
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isSchundleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Reunion Creada'
          className='text-center'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast("Link Copiado")
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          buttonText='Enlace de la Reunion'
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Inicia una reunión instantánea'
        className='text-center'
        buttonText='Iniciar Reunión'
        handleClick={createMeeting}
      />

    </section>
  )
}

export default MettingTypeList
