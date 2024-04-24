'use client'
import { motion } from 'framer-motion'

import { useState } from 'react'

import { z } from 'zod'
import { FormDataSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import NavBar from './NavBar'
import Navigation from './Navigation'

type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['firstName', 'lastName', 'email', 'age']
  },
  { id: 'Step 2', name: 'Print' }
]

export default function MainLayout() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  const watchFields = watch(['firstName', 'lastName', 'email', 'age'])

  console.log(watchFields)
  console.log(watch('age'))
  const processForm: SubmitHandler<Inputs> = data => {
    // reset()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  return (
    <section className='absolute inset-0 flex flex-col justify-between  p-24'>
      <NavBar steps={steps} currentStep={currentStep} />
      <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Personal Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Provide your personal details.
            </p>
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  First name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='firstName'
                    {...register('firstName')}
                    autoComplete='given-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.firstName?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Last name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='lastName'
                    {...register('lastName')}
                    autoComplete='family-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.lastName?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    type='email'
                    {...register('email')}
                    autoComplete='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.email?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='sm:col-span-3'>
                <label
                  htmlFor='age'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Age
                </label>
                <div className='mt-2'>
                  <input
                    id='age'
                    type='number'
                    {...register('age', {
                      setValueAs: value => Number(value)
                    })}
                    autoComplete='age'
                    className='block w-[30%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.age?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {currentStep === 1 && (
          <>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Complete
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Name: {watchFields[0] + ' ' + watchFields[1]}
            </p>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Email: {watchFields[2]}
            </p>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Age: {watchFields[3]}
            </p>
            <p className='mt-5 text-sm leading-6 text-sky-600'>
              Thank you for your submission.
            </p>
          </>
        )}
      </form>

      <Navigation
        steps={steps}
        next={next}
        prev={prev}
        currentStep={currentStep}
      />
    </section>
  )
}
